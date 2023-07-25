import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import env from '../utils/env';

import styles from '../styles/css/directmessage.module.scss';
import dummyImg from '../styles/img/dummy.jpeg';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faVideo,
  faVideoSlash,
} from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks';
import { createMessage, fetchMessages } from '../api';
import toast from 'react-hot-toast';
import moment from 'moment';
import _ from 'lodash';

export default function DirectMessage(props) {
  const {
    isDirectMessageOpen,
    setIsDirectMessageOpen,
    user,
    chatRoom,
    x,
    y,
    setX,
    setY,
    scale,
    setScale,
  } = props;
  const auth = useAuth();
  const {
    isCallMinimised,
    setIsCallMinimised,
    videoIconClicked,
    setVideoIconClicked,
    initiateVideoCall,
  } = auth.video;
  const socket = auth.socket;
  const lastMessageRef = useRef(null);
  const videoIcon = useRef();

  //state for last message
  const [lastMessage, setLastMessage] = useState(null);

  // state for messages
  const [messages, setMessages] = useState(user.chatRoom.messages);

  // state for input message
  const [message, setMessage] = useState('');

  let typing = false;
  let timeout = undefined;
  let animationTimeout = undefined;
  const [typingStatus, setTypingStatus] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);

  function timeoutFunction() {
    typing = false;
    setFadeOut(true);
    animationTimeout = setTimeout(function () {
      setTypingStatus(false);
    }, 400);
  }
  // find the user from the auth users friends list
  let friend = auth.user.friends.find((friend) => friend._id == user._id);
  // update the user with the friend object
  friend = friend;

  useEffect(() => {
    if (videoIconClicked) {
      if (isCallMinimised) {
        setX(0);
        setY(0);
        setScale(1);
      } else {
        setX(115);
        setY(-66);
        setScale(1.3);
      }
    }
  }, [videoIconClicked, isCallMinimised]);

  useEffect(() => {
    // listen to typing event and show the typing status
    socket.off('typingResponsePrivate');
    socket.on('typingResponsePrivate', function (data) {
      const to_user = friend._id;
      const from_user = auth.user._id;

      if (data.chatroom === chatRoom._id) {
        if (data.from_user !== from_user) {
          if (typing === false) {
            clearTimeout(animationTimeout);
            // $('#typing-status-private').removeClass('animate__fadeOut');
            setFadeOut(false);

            typing = true;
            setTypingStatus(true);
            setUserAvatar(data.user_profile);
            timeout = setTimeout(timeoutFunction, 500);
          } else {
            clearTimeout(timeout);
            timeout = setTimeout(timeoutFunction, 500);
          }
        }
      }
    });

    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({});
    }, 100);
  }, [socket && socket.connected]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView();
  }, [auth.user]);

  useEffect(() => {
    auth.user.friends?.map((friend) => {
      if (friend._id === user._id) {
        setMessages(friend.chatRoom.messages);
      }
    });
  }, [user.chatRoom.messages]);

  const handleSendMessageClick = async () => {
    if (message.trim().length === 0) {
      toast.error('Message cannot be empty');
      return;
    }

    let from_user = auth.user._id;
    let to_user = friend._id;

    socket.emit('send_private_message', {
      message,
      user_email: auth.user.email,
      user_name: auth.user.name,
      user_profile: auth.user.avatar,
      time: new Date().toLocaleTimeString('en-US', {
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
      }),
      from_user,
      to_user,
      chatroom: chatRoom._id,
    });
    setMessage('');
    const response = await createMessage(
      'private',
      message,
      'text',
      from_user,
      to_user,
      chatRoom._id
    );
    if (response.success) {
      // console.log('added to db', response.data);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (message.trim().length > 0) {
        handleSendMessageClick();
        return;
      }
      toast.error('Message cannot be empty');
    } else {
      let from_user = auth.user._id;
      let to_user = friend._id;

      // fire typingPrivate event
      socket.emit('typingPrivate', {
        user_email: auth.user.email,
        user_name: auth.user.name,
        user_profile: auth.user.avatar,
        from_user,
        to_user,
        chatroom: chatRoom._id,
      });
    }
  };

  const handleVideoButtonClick = () => {
    initiateVideoCall();
  };

  return (
    <motion.div
      initial={false}
      layout
      animate={{ x, y, scale }}
      transition={{ type: 'spring' }}
      className={`${styles.container}`}
    >
      {
        // show overlay if chat is hidden
        auth.hideMessage && (
          <div
            className={`${styles.overlayForHide} animate__animated animate__fadeIn`}
          >
            <FontAwesomeIcon icon={faEyeSlash} className={styles.hideIcon} />
            <p>Chat Hidden</p>
          </div>
        )
      }
      <div className={styles.topContainer}>
        <div className={styles.header}>
          <FontAwesomeIcon
            className={styles.backIcon}
            onClick={() => setIsDirectMessageOpen(false)}
            icon={faChevronLeft}
          />

          <p className={styles.info}>
            <img src={friend.avatar ? friend.avatar : dummyImg} alt="" />
            <span className={styles.status}>
              <span className={styles.userName}> {friend.name} </span>
              <FontAwesomeIcon
                icon={faCircle}
                className={
                  user.activityStatus === 'Active now'
                    ? styles.circleGreen
                    : styles.circleGray
                }
              />
              <span className={styles.time}>
                {user.activityStatus === 'Active now'
                  ? 'Active now'
                  : user.moment
                  ? 'Active ' + user.moment
                  : 'Offline'}
              </span>
            </span>
          </p>
          <FontAwesomeIcon
            ref={videoIcon}
            className={`${videoIconClicked ? styles.videoIconSlash : styles.videoIcon}`}
            onClick={!videoIconClicked ? handleVideoButtonClick : () => {}}
            icon={videoIconClicked ? faVideoSlash : faVideo}
          />
        </div>

        <div className={styles.content}>
          {typingStatus && (
            <div
              className={`${styles.typingStatus} animate__animated ${
                fadeOut ? 'animate__fadeOut' : ''
              }`}
            >
              <img
                className="animate__animated animate__fadeIn"
                src={userAvatar ? userAvatar : dummyImg}
              />
              <div
                className={`${styles.animation} animate__animated animate__fadeIn`}
              >
                <div className={styles.animation__dot1}></div>
                <div className={styles.animation__dot2}></div>
                <div className={styles.animation__dot3}></div>
              </div>
            </div>
          )}
          <div className={styles.messagesList}>
            <div className={styles.userProfile}>
              <img
                className={styles.userImage}
                src={friend.avatar ? friend.avatar : dummyImg}
                alt=""
              />
              <p className={styles.userName}> {friend.name} </p>
              <div className={styles.stats}>
                {friend.posts.length} posts <span className={styles.dot}></span>{' '}
                {friend.followers.length} followers{' '}
                <span className={styles.dot}></span> {friend.following.length}{' '}
                following
              </div>
              <p className={styles.joinInfo}>
                Joined {moment(friend.createdAt).format('MMMM YYYY')}
              </p>

              <Link
                to={`/users/profile/${friend._id}`}
                className={styles.viewProfile}
              >
                View Profile
              </Link>
            </div>

            {messages.map((message, index) => {
              return message.sender._id === auth.user._id ? (
                <div
                  key={index}
                  className={`animate__animated animate__fadeIn ${styles.selfMessage}`}
                  style={
                    messages[index + 1]?.sender._id === message.sender._id
                      ? { padding: 2 }
                      : messages[index - 1]?.sender._id === message.sender._id
                      ? { padding: 2, marginBottom: 5 }
                      : { padding: 5 }
                  }
                >
                  <div className={styles.messageContent}>
                    {
                      // if previous message is same as current message
                      messages[index + 1]?.sender._id === message.sender._id ? (
                        <>
                          <span
                            className={`${styles.withoutChatBubble} ${
                              message.messageType &&
                              message.messageType === 'call'
                                ? styles.callBubble
                                : ''
                            }`}
                          >
                            {message.message}{' '}
                            <sup>
                              {new Date(message.createdAt).toLocaleTimeString(
                                'en-US',
                                {
                                  hour12: true,
                                  hour: 'numeric',
                                  minute: 'numeric',
                                }
                              )}
                            </sup>
                          </span>
                          {message.messageType &&
                          message.messageType === 'call' ? (
                            <FontAwesomeIcon
                              icon={faVideo}
                              style={{
                                backgroundColor:
                                  message.message === 'Video call started'
                                    ? '#37dc52'
                                    : '#d20a0a',
                              }}
                            />
                          ) : (
                            ''
                          )}

                          {/* <img style={{visibility: 'hidden'}} src='' /> */}
                        </>
                      ) : (
                        <>
                          <span
                            className={`${styles.chatBubble} ${
                              message.messageType &&
                              message.messageType === 'call'
                                ? styles.callBubble
                                : ''
                            }`}
                          >
                            {message.message}{' '}
                            <sup>
                              {new Date(message.createdAt).toLocaleTimeString(
                                'en-US',
                                {
                                  hour12: true,
                                  hour: 'numeric',
                                  minute: 'numeric',
                                }
                              )}
                            </sup>
                          </span>
                          {message.messageType &&
                          message.messageType === 'call' ? (
                            <FontAwesomeIcon
                              icon={faVideo}
                              style={{
                                backgroundColor:
                                  message.message === 'Video call started'
                                    ? '#37dc52'
                                    : '#d20a0a',
                              }}
                            />
                          ) : (
                            ''
                          )}
                          {/* <img src={ message.sender.avatar ?  message.sender.avatar : dummyImg } /> */}
                        </>
                      )
                    }
                  </div>
                </div>
              ) : (
                <div
                  key={index}
                  className={`animate__animated animate__fadeIn ${styles.otherMessage}`}
                  style={
                    messages[index + 1]?.sender._id === message.sender._id
                      ? { padding: 2 }
                      : messages[index - 1]?.sender._id === message.sender._id
                      ? { padding: 2, marginBottom: 5 }
                      : { padding: 5 }
                  }
                >
                  <div className={styles.messageContent}>
                    {
                      // if previous message is same as current message
                      messages[index + 1]?.sender._id === message.sender._id ? (
                        <>
                          {/* <img style={{visibility: 'hidden'}} src='' /> */}
                          {message.messageType &&
                          message.messageType === 'call' ? (
                            <FontAwesomeIcon
                              icon={faVideo}
                              style={{
                                backgroundColor:
                                  message.message === 'Video call started'
                                    ? '#37dc52'
                                    : '#d20a0a',
                              }}
                            />
                          ) : (
                            ''
                          )}
                          <span
                            className={`${styles.withoutChatBubble} ${
                              message.messageType &&
                              message.messageType === 'call'
                                ? styles.callBubble
                                : ''
                            }`}
                          >
                            {message.message}{' '}
                            <sup>
                              {new Date(message.createdAt).toLocaleTimeString(
                                'en-US',
                                {
                                  hour12: true,
                                  hour: 'numeric',
                                  minute: 'numeric',
                                }
                              )}
                            </sup>
                          </span>
                        </>
                      ) : (
                        <>
                          {/* <img src={ message.sender.avatar ?  message.sender.avatar : dummyImg } /> */}
                          {message.messageType &&
                          message.messageType === 'call' ? (
                            <FontAwesomeIcon
                              icon={faVideo}
                              style={{
                                backgroundColor:
                                  message.message === 'Video call started'
                                    ? '#37dc52'
                                    : '#d20a0a',
                              }}
                            />
                          ) : (
                            ''
                          )}
                          <span
                            className={`${styles.chatBubble} ${
                              message.messageType &&
                              message.messageType === 'call'
                                ? styles.callBubble
                                : ''
                            }`}
                          >
                            {message.message}{' '}
                            <sup>
                              {new Date(message.createdAt).toLocaleTimeString(
                                'en-US',
                                {
                                  hour12: true,
                                  hour: 'numeric',
                                  minute: 'numeric',
                                }
                              )}
                            </sup>
                          </span>
                        </>
                      )
                    }
                  </div>
                </div>
              );
            })}

            <div ref={lastMessageRef}></div>

            {/* <div className={`animate__animated animate__fadeIn ${styles.otherMessage}`}>
                            <div className={styles.messageContent}>
                                <img src={dummyImg} />
                                <span>
                                    Other Message <sup>2:04 AM</sup> 
                                </span>
                                
                            </div>
                        </div>

                        <div className={`animate__animated animate__fadeIn ${styles.selfMessage}`}>
                            <div className={styles.messageContent}>
                                
                                <span>
                                    Self Message <sup>2:04 AM</sup> 
                                </span>
                                <img src={dummyImg} />
                            </div>
                        </div> */}
          </div>
        </div>
      </div>

      <div className={styles.bottomContainer}>
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button onClick={handleSendMessageClick} className={styles.sendButton}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </motion.div>
  );
}
