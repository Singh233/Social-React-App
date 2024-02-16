import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

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
import { useAuth } from '../hooks/useAuth.jsx';
import { createMessage, fetchMessages } from '../api';
import _ from 'lodash';
import { useQuery } from 'react-query';
import { toast } from 'sonner';

export const GlobalChat = (props) => {
  const { isGlobalChatOpen, setIsGlobalChatOpen, x, y, scale } = props;
  const auth = useAuth();
  const socket = auth.socket;
  const lastMessageRef = useRef(null);
  const messageInputRef = useRef();
  const fetchGlobalChatMessages = async () => {
    const response = await fetch(
      `https://chillsanam.social/api/v1/chat/global/${auth.user._id}/all/global`
    );
    return await response.json();
  };

  const { data, status, refetch } = useQuery(
    'messages',
    fetchGlobalChatMessages
  );
  // state for messages
  const [messages, setMessages] = useState([]);

  // state for input message
  const [message, setMessage] = useState('');

  let typing = false;
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

  useEffect(() => {
    refetch();
  }, [isGlobalChatOpen]);

  useEffect(() => {
    if (status === 'success') {
      setMessages(data.data.chatRoom.messages);
    }
  }, [status]);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({});
    }, 100);
  }, [messages]);

  useEffect(() => {
    socket.off('receive_global_message');
    socket.on('receive_global_message', function (resData) {
      // console.log('message received', resData);
      const {
        user_email,
        user_name,
        user_profile,
        from_user: from_user_id,
        time,
      } = resData;
      const message = {
        message: resData.message,
        messageType: 'text',
        receiver: {
          avatar: auth.user.avatar,
          name: auth.user.name,
          email: auth.user.email,
          _id: auth.user._id,
        },
        sender: {
          avatar: user_profile,
          name: user_name,
          email: user_email,
          _id: from_user_id,
        },
        createdAt: null,
        time,
      };

      setMessages((msgs) => {
        const newArr = [...msgs];
        newArr.push(message);
        return newArr;
      });
    });

    if (socket.connected) {
      socket.emit('join_global_room', {
        user_email: auth.user.email,
        user_name: auth.user.name,
        user_profile: auth.user.avatar,
        time: new Date().toLocaleTimeString('en-US', {
          hour12: true,
          hour: 'numeric',
          minute: 'numeric',
        }),
        from_user: auth.user._id,
        chatroom: 'Global',
      });
    }
  }, [socket && socket.connected]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView();
  }, [auth.user]);

  const handleSendMessageClick = async () => {
    if (message.trim().length === 0) {
      toast.warning('Message cannot be empty');
      if (messageInputRef.current) messageInputRef.current.focus();
      return;
    }

    let from_user = auth.user._id;

    socket.emit('send_global_message', {
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
      chatroom: 'Global',
    });
    setMessage('');
    const response = await createMessage(
      'global',
      message,
      'text',
      from_user,
      'all',
      'global'
    );
    // if (response.success) {
    //   // console.log('added to db', response.data);
    // }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (message.trim().length > 0) {
        handleSendMessageClick();
        return;
      }
      toast.warning('Message cannot be empty');
    }
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
            onClick={() => setIsGlobalChatOpen(false)}
            icon={faChevronLeft}
          />

          <p className={styles.info}>
            <img src={dummyImg} alt="" />
            <span className={styles.status}>
              <span className={styles.userName}> Global Chat </span>
              <FontAwesomeIcon icon={faCircle} className={styles.circleGreen} />
            </span>
          </p>
          <p></p>
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
                              {message.createdAt
                                ? new Date(
                                    message.createdAt
                                  ).toLocaleTimeString('en-US', {
                                    hour12: true,
                                    hour: 'numeric',
                                    minute: 'numeric',
                                  })
                                : message.time}
                            </sup>
                          </span>

                          <img
                            src={
                              messages &&
                              messages[index + 1].sender.name !==
                                message.sender.name
                                ? auth.user.avatar
                                  ? auth.user.avatar
                                  : `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png`
                                : 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
                            }
                          />
                          {/* <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" /> */}
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
                              {message.createdAt
                                ? new Date(
                                    message.createdAt
                                  ).toLocaleTimeString('en-US', {
                                    hour12: true,
                                    hour: 'numeric',
                                    minute: 'numeric',
                                  })
                                : message.time}
                            </sup>
                          </span>
                          <img
                            src={
                              auth.user.avatar
                                ? auth.user.avatar
                                : `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png`
                            }
                          />
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
                          <img
                            src={
                              messages &&
                              messages[index + 1].sender.name !==
                                message.sender.name
                                ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png'
                                : 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
                            }
                          />
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
                              {message.createdAt
                                ? new Date(
                                    message.createdAt
                                  ).toLocaleTimeString('en-US', {
                                    hour12: true,
                                    hour: 'numeric',
                                    minute: 'numeric',
                                  })
                                : message.time}
                            </sup>
                          </span>
                        </>
                      ) : (
                        <>
                          <img
                            src={
                              messages &&
                              messages[index + 1]?.sender?.name !==
                                message.sender.name
                                ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png'
                                : ''
                            }
                          />
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
                              {message.createdAt
                                ? new Date(
                                    message.createdAt
                                  ).toLocaleTimeString('en-US', {
                                    hour12: true,
                                    hour: 'numeric',
                                    minute: 'numeric',
                                  })
                                : message.time}
                            </sup>
                          </span>
                        </>
                      )
                    }
                  </div>
                  {messages &&
                  messages[index + 1]?.sender?.name !== message.sender.name ? (
                    <sub>{message.sender.name}</sub>
                  ) : (
                    ''
                  )}
                </div>
              );
            })}
            <div ref={lastMessageRef}></div>
          </div>
        </div>
      </div>

      <div className={`${styles.bottomContainer}`}>
        <input
          ref={messageInputRef}
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
};
