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

export default function VideoCall({ isCallMinimised, setIsCallMinimised }) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(-200);
  const [scale, setScale] = useState(1);
  const [animate, setAnimate] = useState(false);
  const videoRef = useRef();

  const startAudioAndVideo = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        videoRef.current.muted = true;
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener('loadedmetadata', () => {
          videoRef.current.play();
        });
      });
  };

  useEffect(() => {
    startAudioAndVideo();
  }, []);

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
        className={`${styles.incomingOutgoingCallWindow} ${styles.callMaximised} animate__animated animate__fadeIn`}
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

        <motion.div className={`${styles.incomingCall}`}>
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

        <div className={`${styles.outgoingCall}`}>
          <img src={dummyImg} alt="" className={`${styles.userAvatar}`} />
          <p className={`${styles.callStatus} animate__animated`}>Calling...</p>
          <p className={`${styles.username}`}>Utkarsh Singh</p>
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
        className={`${styles.callContainer}  animate__animated ${
          isCallMinimised ? ` animate__fadeOut` : 'animate__fadeIn'
        } ${animate ? `${styles.removeCallContainer}` : ''}`}
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
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
