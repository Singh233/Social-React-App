import React, { useEffect, useRef, useState } from 'react';
import dummyImg from '../styles/img/dummy.jpeg';
import { AnimatePresence, motion } from 'framer-motion';
import styles from '../styles/css/videoCall.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleUp,
  faCancel,
  faCircleInfo,
  faMicrophone,
  faMicrophoneSlash,
  faPhone,
  faPhoneSlash,
  faRightFromBracket,
  faVideo,
  faVideoSlash,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../hooks/useAuth.jsx';
import Peer from 'peerjs';
import { useVideo } from '../hooks/useVideo';
import env from '../utils/env.js';
import videoPng from '../styles/icon/video.png';
import _ from 'lodash';
import { Tooltip } from 'react-tooltip';
import { toast } from 'sonner';

export default function VideoCall() {
  const auth = useAuth();
  const socket = auth.socket;
  const {
    isCallMinimised,
    setIsCallMinimised,
    videoIconClicked,
    setVideoIconClicked,
    exitVideoCall,
    callReceiver,
    setCallReceiver,
    incomingCall,
    setIncomingCall,
    camLoading,
    setCamLoading,
    initiateVideoCall,
    boundX,
    setBoundX,
  } = useVideo();
  const CALL_TYPE = {
    OUTGOING: 'Outgoing',
    INCOMING: 'Incoming',
    REJECTED: 'Rejected',
    CANCELLED: 'Canceled',
    BUSY: 'Busy',
  };
  const CALL_STATE = {
    IDLE: 'idle',
    ANSWERED: 'answered',
    RINGING: 'ringing',
  };

  const [x, setX] = useState([-(boundX + 21), -(boundX + 21)]);
  const [y, setY] = useState([44, 44]);
  const [scale, setScale] = useState(1);
  const [callContainerOpacity, setCallContainerOpacity] = useState([0, 1]);
  const [animate, setAnimate] = useState(true);
  const [callType, setCallType] = useState(CALL_TYPE.OUTGOING);
  const [callState, setCallState] = useState(CALL_STATE.IDLE);
  const [micToggle, setMicToggle] = useState(false);
  const [cameraToggle, setCameraToggle] = useState(false);
  const [otherUserMicToggle, setOtherUserMicToggle] = useState(false);
  const [otherUserCameraToggle, setOtherUserCameraToggle] = useState(false);

  // current video stream state
  const [currentAudioVideoStream, setCurrentAudioVideoStream] = useState(null);
  // peer connection state
  const [myPeer, setMyPeer] = useState(null);
  const [myPeerId, setMyPeerId] = useState(null);
  const [connectedPeer, setConnectedPeer] = useState(null);
  const [otherUserPeerId, setOtherUserPeerId] = useState(null);
  const [callee, setCallee] = useState(null);

  let mediaStream = null;
  let peerId = null;

  const videoRef = useRef();
  const receiverVideoRef = useRef();
  const callWrapperRef = useRef();

  const startAudioAndVideo = async () => {
    await navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        setCurrentAudioVideoStream(stream);
        mediaStream = stream;
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener('loadedmetadata', () => {
            videoRef.current.play();
          });
        }
      });
  };

  const stopAudioAndVideo = async () => {
    await mediaStream?.getTracks().forEach(async (track) => {
      await track.stop();
    });

    await currentAudioVideoStream?.getTracks().forEach(async (track) => {
      await track.stop();
    });

    setCurrentAudioVideoStream(null);
    mediaStream = null;
  };

  // Stop audio only
  const toggleAudioOnly = async (isDisabled) => {
    await mediaStream?.getTracks().forEach(async (track) => {
      if (
        (track.readyState === 'live' || track.readyState === 'ended') &&
        track.kind === 'audio'
      ) {
        track.enabled = !isDisabled;
      }
    });

    await currentAudioVideoStream?.getTracks().forEach(async (track) => {
      if (
        (track.readyState === 'live' || track.readyState === 'ended') &&
        track.kind === 'audio'
      ) {
        track.enabled = !isDisabled;
      }
    });
  };

  // Stop camera only
  const toggleVideoOnly = async (isDisabled) => {
    await mediaStream?.getTracks().forEach(async (track) => {
      if (
        (track.readyState === 'live' || track.readyState === 'ended') &&
        track.kind === 'video'
      ) {
        track.enabled = !isDisabled;
      }
    });

    await currentAudioVideoStream?.getTracks().forEach(async (track) => {
      if (
        (track.readyState === 'live' || track.readyState === 'ended') &&
        track.kind === 'video'
      ) {
        track.enabled = !isDisabled;
      }
    });
  };

  // Adds a video stream to the video grid
  const addVideoStream = (video, stream) => {
    video.current.srcObject = stream;

    video.current.addEventListener('loadedmetadata', () => {
      video.current.play();
    });
  };

  // Reset camera, mic toggle state
  const resetCallActions = () => {
    setCameraToggle(false);
    setMicToggle(false);
    setOtherUserCameraToggle(false);
    setOtherUserMicToggle(false);
    toggleAudioOnly();
    toggleVideoOnly();
  };

  const displayCamLoadingToast = async () => {
    toast.promise(initiateCall(), {
      error: 'Failed to get camera access!',
      success: 'Camera and mic accessed!',
      loading: 'Getting camera and mic access...',
      closeButton: false,
    });
  };

  const displayCamStoppingToast = async () => {
    toast.promise(stopAudioAndVideo(), {
      error: 'Something went wrong!',
      success: 'Camera and mic stopped!',
      loading: 'Closing camera and mic...',
      closeButton: false,
    });
  };

  const handleResize = _.debounce(() => {
    // setWindowWidth(window.innerWidth);
    if (callWrapperRef.current) {
      setBoundX(callWrapperRef.current.getBoundingClientRect().x);
    }
  }, 500);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (callWrapperRef.current) {
      setBoundX(callWrapperRef.current.getBoundingClientRect().x);
    }
  }, [isCallMinimised, videoIconClicked, currentAudioVideoStream]);

  useEffect(() => {
    if (camLoading) {
      setCallState(CALL_STATE.RINGING);
      displayCamLoadingToast();
    }
  }, [camLoading]);

  useEffect(() => {
    if (callState === CALL_STATE.IDLE && currentAudioVideoStream) {
      displayCamStoppingToast();
    }
  }, [currentAudioVideoStream]);

  useEffect(() => {
    // subscribeSocketEvents();
    if (videoRef.current && currentAudioVideoStream) {
      videoRef.current.muted = true;
      videoRef.current.srcObject = currentAudioVideoStream;
      videoRef.current.addEventListener('loadedmetadata', () => {
        videoRef.current.play();
      });
    }
  }, [isCallMinimised, currentAudioVideoStream]);

  useEffect(() => {
    if (videoIconClicked) {
      if (isCallMinimised) {
        setX([-(boundX + 21), 80]);
        setY([44, 24]);
        setScale(0.77);
        setCallContainerOpacity([1, 0]);
      } else {
        setX([-(boundX + 21), -(boundX + 21)]);
        setY([44, 44]);
      }
    } else {
      setX([-(boundX + 21), -(boundX + 21)]);
    }
  }, [videoIconClicked, boundX]);

  useEffect(() => {
    const startCall = async () => {
      await initiateCall();
      emitNotification();
    };
    if (videoIconClicked) {
      setCallState(CALL_STATE.RINGING);
      setCallType(CALL_TYPE.OUTGOING);
      startCall();
    }
  }, [videoIconClicked]);

  useEffect(() => {
    // Emit event in case of call is not yet started but users mic is disabled
    // and the event will fire once connectedPeer is set
    if (connectedPeer) {
      if (micToggle) {
        emitMicToggleSocket(true);
      }
    }
  }, [connectedPeer, micToggle]);

  useEffect(() => {
    // Emit event in case of call is not yet started but users camera is disabled
    // and the event will fire once connectedPeer is set
    if (connectedPeer) {
      if (cameraToggle) {
        emitCameraToggleSocket(true);
      }
    }
  }, [connectedPeer, cameraToggle]);

  const initiateCall = async () => {
    if (!myPeer) await initiatePeerConnection();
    if (!currentAudioVideoStream) await startAudioAndVideo();
  };

  const handleCallMinimiseMaximise = () => {
    // call is minimised
    if (isCallMinimised) {
      setIsCallMinimised(false);
      setX([80, -(boundX + 21)]);
      setY([24, 44]);
      setScale(1);
      setCallContainerOpacity([0, 1]);
    } else {
      setIsCallMinimised(true);
      setX([-(boundX + 21), 80]);
      setY([44, 24]);
      setScale(0.77);
      setCallContainerOpacity([1, 0]);
    }
  };

  const resetVideoCall = () => {
    displayCamStoppingToast();
    exitVideoCall();
    // close connected peer call
    if (connectedPeer) {
      connectedPeer.close();
      setConnectedPeer(null);
    }
    myPeer.destroy();
    myPeer._cleanup();
    setMyPeer(null);
    setMyPeerId(null);
    setCamLoading(false);
    setCallState(CALL_STATE.IDLE);
    setCallType(CALL_TYPE.OUTGOING);
    setOtherUserPeerId(null);
    setX([0, 500]);
    setY([44, 44]);
    setScale(1);
    setCallContainerOpacity([0, 1]);
    resetCallActions();
  };

  const handleCallExitClick = () => {
    const { _id: toUserId } = callReceiver;
    const { _id: fromUserId, name: selfName, avatar: selfProfile } = auth.user;
    if (callState === CALL_STATE.RINGING || callState === CALL_STATE.ANSWERED)
      // emit event to the connected user
      socket.emit('user_leaving_call', {
        from_user: fromUserId,
        to_user: toUserId,
        user_name: selfName,
        user_profile: selfProfile,
        fromUserPeerId: myPeerId,
      });
    resetVideoCall();
  };

  const handleCallAgainClick = async () => {
    setCallType(CALL_TYPE.OUTGOING);
    setCallState(CALL_STATE.RINGING);
    await initiateCall();
    emitNotification();
  };

  const handleCloseCallClick = () => {
    const { _id: toUserId } = callReceiver;
    const { _id: fromUserId, name: selfName, avatar: selfProfile } = auth.user;
    if (callState === CALL_STATE.RINGING || callState === CALL_STATE.ANSWERED)
      // emit event to the connected user
      socket.emit('user_leaving_call', {
        from_user: fromUserId,
        to_user: toUserId,
        user_name: selfName,
        user_profile: selfProfile,
        fromUserPeerId: myPeerId,
      });
    resetVideoCall();
    setCallState(CALL_STATE.IDLE);
    setCallType(CALL_TYPE.OUTGOING);
  };

  const handleRejectCallClick = () => {
    // Emit event to other user
    socket.emit('user_declined_call', {
      from_user: auth.user._id,
      to_user: callee._id,
      fromUserPeerId: myPeerId,
    });
    resetVideoCall();
    setCallState(CALL_STATE.IDLE);
    setCallType(CALL_TYPE.OUTGOING);
  };

  const handleAnswerCallClick = async () => {
    setCallState(CALL_STATE.ANSWERED);
    await initiateCall();

    socket.emit('join_video_call', {
      to_user: callee._id,
      from_user: auth.user._id,
      peerId: myPeerId ? myPeerId : myPeer ? myPeer._id : null,
    });

    // fire an event that the user answered call
    await socket.emit('user_answered_call', {
      from_user: auth.user._id,
      to_user: callee._id,
      fromUserPeerId: myPeerId,
    });
  };

  const handleMicToggleClick = () => {
    if (callState === CALL_STATE.ANSWERED) {
      // emit event to self and connected user
      if (micToggle) emitMicToggleSocket(!micToggle);
    }

    toggleAudioOnly(!micToggle);
    toast.info(`Mic ${micToggle ? 'enabled!' : 'disabled!'}`);
    setMicToggle(!micToggle);
  };

  const handleCameraToggleClick = () => {
    // Emit event to the connected user
    if (callState === CALL_STATE.ANSWERED) {
      // Only emit if camera was off because on case is handled in useEffect
      if (cameraToggle) emitCameraToggleSocket(!cameraToggle);
    }
    toggleVideoOnly(!cameraToggle);
    toast.info(`Camera ${cameraToggle ? 'enabled!' : 'disabled!'}`);
    setCameraToggle(!cameraToggle);
  };

  const emitMicToggleSocket = (isDisabled) => {
    socket.emit('call_mic_toggle', {
      from_user: auth.user._id,
      to_user: callReceiver ? callReceiver._id : callee ? callee._id : '',
      user_name: auth.user.name,
      user_profile: auth.user.avatar,
      isDisabled: isDisabled,
    });
  };

  const emitCameraToggleSocket = (isDisabled) => {
    socket.emit('call_camera_toggle', {
      from_user: auth.user._id,
      to_user: callReceiver ? callReceiver._id : callee ? callee._id : '',
      user_name: auth.user.name,
      user_profile: auth.user.avatar,
      isDisabled: isDisabled,
    });
  };

  const emitNotification = () => {
    const { _id: toUserId, chatRoomId: callRoomId } = callReceiver;
    const {
      _id: fromUserId,
      name: selfName,
      avatar: selfProfile,
      email: selfEmail,
    } = auth.user;
    // emit notification to user
    socket.emit('user_is_calling', {
      to_user: toUserId,
      from_user: fromUserId,
      user_name: selfName,
      user_profile: selfProfile,
      user_email: selfEmail,
      callRoomId: callRoomId,
      peerId: myPeerId ? myPeerId : myPeer ? myPeer._id : peerId,
    });

    socket.emit('join_video_call', {
      to_user: toUserId,
      from_user: fromUserId,
      user_name: selfName,
      user_profile: selfProfile,
      user_email: selfEmail,
      callRoomId: callRoomId,
      peerId: myPeerId ? myPeerId : myPeer ? myPeer._id : peerId,
    });
  };

  const initiatePeerConnection = async () => {
    const myPeer = new Peer({
      config: env.peer.config,
    });
    myPeer.on('open', (id) => {
      setMyPeerId(id);
      peerId = id;
    });
    myPeer.on('call', (call) => {
      call.answer(mediaStream);
      setConnectedPeer(call);
      call.on('stream', (userVideoStream) => {
        addVideoStream(receiverVideoRef, userVideoStream);
        toast.success('Connected!');
      });

      call.on('close', () => {
        // this.receiverVideo.remove();
      });
    });
    setMyPeer(myPeer);
  };

  const subscribeSocketEvents = () => {
    socket.off('user_declined_call_notification');
    socket.on('user_declined_call_notification', (data) => {
      setCallState(CALL_STATE.IDLE);
      setCallType(CALL_TYPE.REJECTED);
    });

    socket.off('user_busy');
    socket.on('user_busy', (data) => {
      setCallState(CALL_STATE.IDLE);
      setCallType(CALL_TYPE.BUSY);
    });

    socket.off('user_is_calling_notification');
    socket.on('user_is_calling_notification', (data) => {
      // if cal state is not idle this means user is on another call or waiting to respond
      if (callState !== CALL_STATE.IDLE) {
        socket.emit('user_on_another_call', {
          from_user: data.to_user,
          to_user: data.from_user,
        });
        return;
      }

      // update call state
      setCallState(CALL_STATE.RINGING);

      // update call type
      setCallType(CALL_TYPE.INCOMING);

      if (!videoIconClicked && !incomingCall) {
        setX([500, 80]);
        setY([-200, 24]);
        setScale(0.77);
        setVideoIconClicked(false);
        setIncomingCall(true);
        setIsCallMinimised(true);
      }

      const user = {
        _id: data.from_user,
        chatRoomId: data.callRoomId,
        name: data.user_name,
        avatar: data.user_profile,
        email: data.user_email,
        peerId: data.peerId,
      };

      // set call receiver in case if current user wish to call back and for that we need callReceiver state
      setCallReceiver(user);

      // update callee
      setCallee(user);

      // set caller peer id
      setOtherUserPeerId(data.peerId);
      // if user tries to call again
      if (!currentAudioVideoStream) {
        initiateCall();
      }
    });

    // Event listener for when user leaves call
    socket.off('user_left_call');
    socket.on('user_left_call', (data) => {
      // check if it is the same call or not
      if (
        (otherUserPeerId && otherUserPeerId !== data.fromUserPeerId) ||
        callState === CALL_STATE.IDLE
      ) {
        return;
      }
      // close connected peer call
      if (connectedPeer) {
        connectedPeer.close();
        setConnectedPeer(null);
      }
      // update call state
      setCallState(CALL_STATE.IDLE);

      if (data.from_user === auth.user._id) {
        toast.info('Call ended!', {
          duration: 2000,
        });
      } else {
        toast.info(
          `${data.user_name && data.user_name.split(' ')[0]} ended call!`,
          {
            duration: 2000,
          }
        );
      }

      setCallType(CALL_TYPE.CANCELLED);
      setOtherUserCameraToggle(false);
      setOtherUserMicToggle(false);
    });

    // Event listener for other user call connected
    socket.off('call_user_connected');
    socket.on('call_user_connected', (data) => {
      setOtherUserPeerId(data.fromUserPeerId);
      callUser(data);
      // update is in call variable
      setCallState(CALL_STATE.ANSWERED);
    });

    // Event listeners when user toggle mic or camera
    socket.off('mic_toggled');
    socket.on('mic_toggled', (data) => {
      if (data.from_user === auth.user._id) {
        return;
      }
      // Return if call is not connected
      if (callState === CALL_STATE.IDLE || callState === CALL_STATE.RINGING) {
        return;
      }
      if (data.isDisabled) {
        // update mic icon of connected user

        toast(`${data.user_name && data.user_name.split(' ')[0]} is muted!`, {
          icon: '🎤',
        });
      } else {
        // update mic icon of connected user

        toast(
          `${data.user_name && data.user_name.split(' ')[0]} is now unmuted!`,
          {
            icon: '🎤',
          }
        );
      }
      setOtherUserMicToggle(data.isDisabled);
    });
    socket.off('camera_toggled');
    socket.on('camera_toggled', (data) => {
      if (data.from_user === auth.user._id) {
        return;
      }
      if (callState === CALL_STATE.IDLE || callState === CALL_STATE.RINGING) {
        return;
      }
      if (data.isDisabled) {
        // update video icon of connected user

        toast(
          `${
            data.user_name && data.user_name.split(' ')[0]
          } turned off their video!`,
          {
            icon: '🎥',
          }
        );
      } else {
        // update video icon of connected user

        toast(
          `${
            data.user_name && data.user_name.split(' ')[0]
          } turned on their video!`,
          {
            icon: '🎥',
          }
        );
      }
      setOtherUserCameraToggle(data.isDisabled);
    });

    // if the user is disconnected(tab closed, internet issues, or log out)
    socket.off('call_user_disconnected');
    socket.on('call_user_disconnected', (data) => {
      // check if it is the same call or not
      if (
        !otherUserPeerId ||
        otherUserPeerId !== data.fromUserPeerId ||
        callState === CALL_STATE.IDLE
      ) {
        return;
      }
      // update is in call variable
      setCallState(CALL_STATE.IDLE);
      setCallType(CALL_TYPE.BUSY);
    });
  };

  subscribeSocketEvents();

  const callUser = (data) => {
    const call = myPeer.call(data.fromUserPeerId, currentAudioVideoStream);
    // peers[userId] = call;
    setConnectedPeer(call);

    call.on('stream', (userVideoStream) => {
      addVideoStream(receiverVideoRef, userVideoStream);
    });

    call.on('close', () => {
      // this.receiverVideo.remove();
    });
  };

  return (
    <>
      <AnimatePresence>
        {(videoIconClicked || incomingCall) && (
          <motion.div
            key={'incoming-outgoing-call-modal'}
            // layout
            drag={isCallMinimised ? 'x' : ''}
            dragConstraints={{
              left: x[1],
              right: x[1],
              top: y[1],
              bottom: y[1],
            }}
            animate={{ x, y, scale, opacity: 1 }}
            transition={{ type: 'spring' }}
            // initial={'show'}
            initial={{ opacity: 0 }}
            // initial={false}
            exit={{ opacity: 0 }}
            // style={{ x: '0%', y: '-21%' }}
            src=""
            className={`${styles.incomingOutgoingCallWindow} ${styles.callMaximised}`}
          >
            {isCallMinimised && (
              <FontAwesomeIcon
                icon={faAngleUp}
                className={`${styles.callExpandButton}`}
                onClick={handleCallMinimiseMaximise}
              />
            )}

            <div
              className={`${styles.header} ${styles.userCallHeader}`}
              style={{
                display: callState === CALL_STATE.ANSWERED ? 'flex' : 'none',
              }}
            >
              <img
                src={
                  callReceiver && callReceiver.avatar ? callReceiver.avatar : ''
                }
                alt=""
              />
              <p className={`${styles.username}`}>
                {callReceiver && callReceiver.name}
              </p>

              <div className={`${styles.userStatus}`}>
                <FontAwesomeIcon
                  icon={otherUserMicToggle ? faMicrophoneSlash : faMicrophone}
                  className={`${styles.micIcon} ${
                    otherUserMicToggle ? styles.cameraSlash : ''
                  }`}
                />
                <FontAwesomeIcon
                  icon={otherUserCameraToggle ? faVideoSlash : faVideo}
                  className={`${styles.videoIcon} ${
                    otherUserCameraToggle ? styles.cameraSlash : ''
                  }`}
                />
              </div>
            </div>

            <motion.div
              className={`${styles.call} `}
              style={{
                display: callState === CALL_STATE.ANSWERED ? 'none' : 'flex',
              }}
            >
              <img
                src={
                  callReceiver
                    ? callReceiver.avatar
                    : callee
                    ? callee.user_profile
                    : dummyImg
                }
                alt="user-avatar"
                className={`${styles.userAvatar}`}
              />
              <motion.p
                key={callType}
                animate={'show'}
                className={`${styles.callStatus}`}
              >
                {callType === CALL_TYPE.INCOMING
                  ? 'Incoming video call'
                  : callType === CALL_TYPE.OUTGOING
                  ? `${
                      currentAudioVideoStream ? 'Calling...' : 'Connecting...'
                    }`
                  : callType === CALL_TYPE.REJECTED
                  ? 'Video call declined!'
                  : callType === CALL_TYPE.CANCELLED
                  ? 'Video call cancelled!'
                  : 'User busy!'}
              </motion.p>

              <motion.p
                key={callState}
                animate={'show'}
                className={`${styles.username}`}
              >
                {callReceiver && callReceiver.name}
              </motion.p>

              {callType === CALL_TYPE.INCOMING ? (
                <div
                  className={`${styles.incomingCallActions} animate__animated animate__fadeIn`}
                >
                  <div
                    className={`${styles.answer} ${styles.answerCall}`}
                    onClick={handleAnswerCallClick}
                  >
                    <FontAwesomeIcon icon={faPhone} />
                    <p>Answer</p>
                  </div>
                  <div
                    className={`${styles.reject} ${styles.rejectCall}`}
                    onClick={handleRejectCallClick}
                  >
                    <FontAwesomeIcon icon={faPhoneSlash} />
                    <p>Reject</p>
                  </div>
                </div>
              ) : callType === CALL_TYPE.REJECTED ||
                callType === CALL_TYPE.CANCELLED ||
                callType === CALL_TYPE.BUSY ? (
                <div
                  className={`${styles.rejectedCallOptions} animate__animated animate__fadeIn`}
                >
                  <div
                    className={`${styles.callAgainButton}`}
                    onClick={handleCallAgainClick}
                  >
                    <FontAwesomeIcon
                      icon={faVideo}
                      className={`${styles.videoIcon}`}
                    />
                    <p>
                      {callType === CALL_TYPE.CANCELLED
                        ? 'Call back'
                        : 'Call again'}
                    </p>
                  </div>
                  <div
                    className={`${styles.closeCallButton}`}
                    onClick={handleCloseCallClick}
                  >
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    <p>Close</p>
                  </div>
                </div>
              ) : callType === CALL_TYPE.OUTGOING ? (
                <div
                  className={`${styles.outgoingCallOptions} animate__animated animate__fadeIn`}
                >
                  <div
                    className={`${styles.closeCallButton}`}
                    onClick={handleCloseCallClick}
                  >
                    <FontAwesomeIcon icon={faPhoneSlash} />
                    <p>Cancel</p>
                  </div>
                </div>
              ) : (
                ''
              )}
            </motion.div>

            <video
              ref={receiverVideoRef}
              className={`${styles.receiverVideo}`}
              style={{
                display: callState === CALL_STATE.ANSWERED ? 'flex' : 'none',
              }}
              src=""
              loop="loop"
            ></video>

            <div
              className={`${styles.receiverCardCover}`}
              style={{
                display: callState === CALL_STATE.ANSWERED ? 'none' : 'flex',
              }}
            ></div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(videoIconClicked || incomingCall) && !isCallMinimised && (
          <motion.div
            key={styles.callContainer}
            animate={{ opacity: callContainerOpacity }}
            // initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`${styles.callContainer}`}
          >
            <div ref={callWrapperRef} className={`${styles.callWrapper}`}>
              {!isCallMinimised && (
                <FontAwesomeIcon
                  icon={faAngleUp}
                  className={`${styles.callMinimiseButton}`}
                  onClick={handleCallMinimiseMaximise}
                />
              )}

              <div className={`${styles.info}`} style={{ left: boundX + 40 }}>
                <img src={videoPng} className={styles.videoPng} />
                Video Call
                <span>1.0</span>
                <FontAwesomeIcon
                  data-tooltip-id="info-tooltip"
                  icon={faCircleInfo}
                />
                <Tooltip
                  id="info-tooltip"
                  style={{
                    fontSize: 12,
                    fontWeight: 100,
                    textAlign: 'center',
                    borderRadius: 10,
                    fontFamily: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>Hello world! More</span>
                    <span> features coming soon! </span>
                  </div>
                </Tooltip>
              </div>

              <div src="" className={`${styles.receiverCard}`}>
                <div className={`${styles.dummyCard}`}></div>
              </div>
              <div src="" className={`${styles.callerCard}`}>
                <div className={`${styles.header}`}>
                  <img src={dummyImg} alt="" />
                  <p className={`${styles.username}`}>You</p>
                </div>

                {/* <div className={`${styles.dummyVideoSpace}`} src=""></div> */}
                <motion.video
                  animate={{
                    scale: 1,
                    // borderRadius: '50%',
                  }}
                  ref={videoRef}
                  className={`${styles.callerVideo}`}
                  src=""
                ></motion.video>
                <div className={`${styles.callActions} `}>
                  <FontAwesomeIcon
                    icon={micToggle ? faMicrophoneSlash : faMicrophone}
                    className={`${styles.micIcon} ${
                      micToggle ? styles.micSlash : ''
                    }`}
                    onClick={handleMicToggleClick}
                  />

                  <FontAwesomeIcon
                    icon={cameraToggle ? faVideoSlash : faVideo}
                    className={`${styles.videoIcon} ${
                      cameraToggle ? styles.cameraSlash : ''
                    }`}
                    onClick={handleCameraToggleClick}
                  />

                  <FontAwesomeIcon
                    icon={faRightFromBracket}
                    className={`${styles.callExitIcon}`}
                    onClick={handleCallExitClick}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
