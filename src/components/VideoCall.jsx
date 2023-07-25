import React, { useEffect, useRef, useState } from 'react';
import dummyImg from '../styles/img/dummy.jpeg';
import { motion } from 'framer-motion';
import styles from '../styles/css/videoCall.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleUp,
  faMicrophone,
  faPhone,
  faPhoneSlash,
  faRightFromBracket,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../hooks';

export default function VideoCall() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(-200);
  const [scale, setScale] = useState(1);
  const [animate, setAnimate] = useState(true);
  const [isOutgoingCall, setIsOutgoingCall] = useState(true);
  const [isCancelledCall, setIsCancelledCall] = useState(false);
  // current video stream state
  const [currentAudioVideoStream, setCurrentAudioVideoStream] = useState(null);

  const videoRef = useRef();
  const auth = useAuth();
  const {
    isCallMinimised,
    setIsCallMinimised,
    videoIconClicked,
    setVideoIconClicked,
    exitVideoCall,
  } = auth.video;

  const startAudioAndVideo = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        setCurrentAudioVideoStream(stream);
        videoRef.current.muted = true;
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener('loadedmetadata', () => {
          videoRef.current.play();
        });
      });
  };

  const stopAudioAndVideo = () => {
    currentAudioVideoStream?.getTracks().forEach((track) => {
      if (track.readyState === 'live' || track.readyState === 'ended') {
        track.stop();
      }
    });
  };

  useEffect(() => {
    if (videoIconClicked) startAudioAndVideo();
    else stopAudioAndVideo();
  }, [videoIconClicked]);

  useEffect(() => {
    if (!isCallMinimised) {
      setAnimate(isCallMinimised);
    } else {
      setTimeout(() => {
        setAnimate(isCallMinimised);
      }, 700);
    }
  }, [isCallMinimised]);

  const handleCallMinimiseMaximise = () => {
    // call is minimised
    if (isCallMinimised) {
      setX(0);
      setY(-200);
      setIsCallMinimised(false);
      setScale(1);
    } else {
      setIsCallMinimised(true);
      setX(100);
      setY(-224);
      setScale(0.77);
    }
  };

  const handleCallExit = () => {
    exitVideoCall();
  };

  return (
    <>
      <motion.div
        layout
        drag={isCallMinimised ? 'x' : ''}
        dragConstraints={{ left: x, right: x, top: y, bottom: y }}
        animate={{ x, y, scale }}
        transition={{ type: 'spring' }}
        // style={{ x: '0%', y: '-50%' }}
        src=""
        className={`${styles.incomingOutgoingCallWindow} ${
          !videoIconClicked ? ` ${styles.removeCallContainer}` : ''
        } ${styles.callMaximised} animate__animated animate__fadeIn`}
      >
        {isCallMinimised && (
          <FontAwesomeIcon
            icon={faAngleUp}
            className={`${styles.callExpandButton} animate__animated`}
            onClick={handleCallMinimiseMaximise}
          />
        )}

        <div className={`${styles.header} ${styles.userCallHeader}`}>
          <img src="" alt="" />
          <p className={`${styles.username}`}>Utkarsh Singh</p>

          <div className={`${styles.userStatus}`}>
            <FontAwesomeIcon
              icon={faMicrophone}
              className={`${styles.micIcon}`}
            />
            <FontAwesomeIcon icon={faVideo} className={`${styles.videoIcon}`} />
          </div>
        </div>

        <motion.div
          className={`${styles.incomingCall}`}
          style={{ display: isOutgoingCall ? 'none' : 'flex' }}
        >
          <img
            src={dummyImg}
            alt="user-avatar"
            className={`${styles.userAvatar}`}
          />
          <p className={`${styles.username}`}>Utkarsh Singh</p>

          <div className={`${styles.incomingCallActions}`}>
            <div className={`${styles.answer} ${styles.answerCall}`}>
              <FontAwesomeIcon icon={faPhone} />
              <p>Answer</p>
            </div>
            <div className={`${styles.reject} ${styles.rejectCall}`}>
              <FontAwesomeIcon icon={faPhoneSlash} />
              <p>Reject</p>
            </div>
          </div>
        </motion.div>

        <div
          className={`${styles.outgoingCall}`}
          style={{ display: isOutgoingCall ? 'flex' : 'none' }}
        >
          <img src={dummyImg} alt="" className={`${styles.userAvatar}`} />
          <p className={`${styles.callStatus} animate__animated`}>Calling...</p>
          <p className={`${styles.username}`}>Utkarsh Singh</p>
        </div>

        <div
          className={`${styles.cancelledCall} animate__animated`}
          style={{ display: isCancelledCall ? 'flex' : 'none' }}
        >
          <img src={dummyImg} alt="" className={`${styles.userAvatar}`} />
          <p className={`${styles.callStatus} animate__animated`}>Calling...</p>
          <div className={`${styles.rejectedCallOptions} animate__animated`}>
            <div className={`${styles.callAgainButton} animate__animated`}>
              <FontAwesomeIcon
                icon={faVideo}
                className={`${styles.videoIcon}`}
              />
              <p>Call again</p>
            </div>
            <div className={`${styles.closeCallButton} animate__animated`}>
              <FontAwesomeIcon icon={faRightFromBracket} />
              <p>Close</p>
            </div>
          </div>
        </div>

        <video className={`${styles.receiverVideo}`} src="" loop="loop"></video>

        <div className={`${styles.receiverCardCover}`}></div>
      </motion.div>

      <div
        className={`${styles.callContainer}  animate__animated 
        ${isCallMinimised ? ` animate__fadeOut` : 'animate__fadeIn'} 
        ${!videoIconClicked ? ` ${styles.removeCallContainer}` : ''} 
        ${animate ? `${styles.removeCallContainer}` : ''}`}
      >
        <div className={`${styles.callWrapper}`}>
          {!isCallMinimised && (
            <FontAwesomeIcon
              icon={faAngleUp}
              className={`${styles.callMinimiseButton}`}
              onClick={handleCallMinimiseMaximise}
            />
          )}

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

            <div className={`${styles.callActions}`}>
              <FontAwesomeIcon
                icon={faMicrophone}
                className={`${styles.micIcon}`}
              />

              <FontAwesomeIcon
                icon={faVideo}
                className={`${styles.videoIcon}`}
              />

              <FontAwesomeIcon
                icon={faRightFromBracket}
                className={`${styles.callExitIcon}`}
                onClick={handleCallExit}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
