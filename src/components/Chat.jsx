import React, { useEffect, useState } from 'react';

import styles from '../styles/css/chat.module.scss';
import env from '../utils/env';

// images
import dummyImg from '../styles/img/dummy.jpeg';

import send from '../styles/icon/message.png';

// icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useAuth, usePosts } from '../hooks';
import { Link } from 'react-router-dom';
import DirectMessage from './DirectMessage';
import socketIo from 'socket.io-client';
import toast from 'react-hot-toast';
import moment from 'moment';

const Chat = () => {
  const auth = useAuth();
  const socket = auth.socket;

  let count = 0;

  const posts = usePosts();
  const [users, setUsers] = useState([]);
  // state for chat friends
  const [chatFriends, setChatFriends] = useState(auth.user.friends);
  // state for direct message
  const [isDirectMessageOpen, setIsDirectMessageOpen] = useState(false);
  // state for clicked user
  const [clickedUser, setClickedUser] = useState(null);
  // state for chat room
  const [chatRoom, setChatRoom] = useState(null);

  useEffect(() => {
    socket.emit('user_online', {
      user_id: auth.user._id,
    });

    // socket.on('receive_notification', function (data) {
    //   // check if the chatroom is the same as the current chatroom
    //   console.log('chat', data);
    //   if (!isDirectMessageOpen) {
    //     toast.success('New message from ' + data.user_name.split(' ')[0], {
    //       position: 'top-left',
    //       duration: 5000,
    //       icon: '👋',
    //       style: {
    //         borderRadius: '10px',
    //         background: '#333',
    //         color: '#fff',
    //       },
    //     });
    //   } else if (
    //     clickedUser &&
    //     clickedUser._id !== data.to_user &&
    //     clickedUser._id !== data.from_user &&
    //     data.user_email !== auth.user_email
    //   ) {
    //     toast.success(
    //       `${data.user_name.split(' ')[0]} ${data.message.substring(0, 10)}`,
    //       {
    //         position: 'top-left',
    //         duration: 5000,
    //         icon: '💬',
    //         style: {
    //           borderRadius: '10px',
    //           background: '#333',
    //           color: '#fff',
    //         },
    //       }
    //     );
    //   }
    //   auth.updateFriendsMessage(null, null, data);
    // });

    openRoomConnections();
  }, [socket]);

  useEffect(() => {
    const isUserChatBoxOpened = isDirectMessageOpen;
    if (socket && socket.connected) {
      socket.off('receive_private_message');
      socket.on('receive_private_message', function (data) {
        // check if the chatroom is the same as the current chatroom

        auth.updateFriendsMessage(null, null, data);
        if (!isUserChatBoxOpened) {
          toast.success('New message from ' + data.user_name.split(' ')[0], {
            position: 'top-left',
            duration: 5000,
            icon: '👋',
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
          });
        } else if (
          clickedUser &&
          clickedUser._id !== data.to_user &&
          clickedUser._id !== data.from_user &&
          data.user_email !== auth.user.email
        ) {
          toast.success(
            `${data.user_name.split(' ')[0]} says ${data.message.substring(
              0,
              10
            )}`,
            {
              position: 'top-left',
              duration: 5000,
              icon: `💬`,
              style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
              },
            }
          );
        }
      });
    }

    return () => {
      socket.off('get_users');
      socket.off('update_status');
    };
  }, [socket.connected, isDirectMessageOpen]);

  useEffect(() => {
    setChatFriends(auth.user.friends);

    if (auth.userMessageClick) {
      if (isDirectMessageOpen) {
        setIsDirectMessageOpen(false);
        setTimeout(() => {
          handleFriendClick(auth.userMessageClick);
          auth.handleUserMessageClick(null);
        }, 0);
      } else {
        handleFriendClick(auth.userMessageClick);
        auth.handleUserMessageClick(null);
      }
    }
  }, [auth.user, auth.userMessageClick, auth.user.friends]);

  // listen to get_users event
  socket.on('get_users', (data) => {
    let updatedChatFriends = [];
    // iterate over all users
    data.users.forEach((user) => {
      // check if user is in chat friends and update status
      updatedChatFriends = chatFriends.map((friend) => {
        if (friend._id === user.userId) {
          friend.activityStatus = user.status;
          friend.moment = user.moment;
          // update auth user following status
          auth.user.friends.map((friend) => {
            if (friend._id === user.userId) {
              friend.activityStatus = user.status;
              friend.moment = user.moment;
            }
            return friend;
          });
        }
        return friend;
      });
    });

    if (updatedChatFriends && updatedChatFriends.length > 0) {
      setChatFriends(updatedChatFriends);
    }
  });

  // socket to update user online status
  socket.on('update_status', (data) => {
    // update user status with key as user id
    let updatedChatFriends = [];
    data.map.forEach((element) => {
      // update chat friends status
      updatedChatFriends = chatFriends.map((friend) => {
        // console.log(friend.to_user._id, element.userId)
        if (friend._id === element.userId) {
          friend.activityStatus = element.status;
          friend.moment = element.moment;
          // console.log('status updated', friend.status)

          auth.user.friends.map((friend) => {
            if (friend._id === element.userId) {
              friend.activityStatus = element.status;
              friend.moment = element.moment;
            }
            return friend;
          });
        }
        return friend;
      });
    });
    if (updatedChatFriends && updatedChatFriends.length > 0) {
      setChatFriends(updatedChatFriends);
    }
  });

  const openRoomConnections = () => {
    if (!socket && !socket.connected) {
      return;
    }
    chatFriends.map((friend) => {
      let to_user = friend._id;
      let from_user = auth.user._id;
      let chatRoom = friend.chatRoom;

      socket.emit('join_private_room', {
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
    });
  };

  const handleFriendClick = (friend) => {
    // console.log(friend)

    setChatRoom(friend.chatRoom); // set chat room to state
    setClickedUser(friend);
    setIsDirectMessageOpen(true);
  };

  const handleGlobalChatClick = () => {
    let to_user = 'global';
    let from_user = auth.user._id;
    // show toast notification of work in progress
    toast((t) => (
      <span>
        Coming <b>soon!</b>
      </span>
    ));
  };

  return (
    <>
      {isDirectMessageOpen ? (
        <DirectMessage
          isDirectMessageOpen={isDirectMessageOpen}
          setIsDirectMessageOpen={setIsDirectMessageOpen}
          user={clickedUser}
          chatRoom={chatRoom}
        />
      ) : (
        <div className={styles.chatContainer}>
          {
            // show overlay if chat is hidden
            auth.hideMessage && (
              <div
                className={`${styles.overlayForHide} animate__animated animate__fadeIn`}
              >
                <FontAwesomeIcon
                  icon={faEyeSlash}
                  className={styles.hideIcon}
                />
                <p>Chat Hidden</p>
              </div>
            )
          }

          <div className={styles.header}>
            <div className={styles.info}>
              <p className={styles.text}>
                <img src={send} className={styles.sendIcon} />
                <Link to="/">
                  <FontAwesomeIcon icon={faChevronLeft} />
                </Link>
                Messages
              </p>
              <Link to={`/settings`}>
                <img src={auth.user.avatar ? auth.user.avatar : dummyImg} />
              </Link>
            </div>

            <div className={styles.searchBar}>
              <input
                className={styles.searchInput}
                placeholder="Coming soon!"
                type="text"
                disabled
              />
              <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
            </div>
          </div>

          <div className={styles.friendsList}>
            {chatFriends &&
              chatFriends.map((friend, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => handleFriendClick(friend)}
                    className={`animate__animated animate__fadeIn ${styles.friend}`}
                  >
                    <img src={friend.avatar ? friend.avatar : dummyImg} />
                    <div className={styles.friendInfo}>
                      <p className={styles.friendName}>{friend.name}</p>
                      <div className={styles.activity}>
                        <FontAwesomeIcon
                          icon={faCircle}
                          className={
                            friend.activityStatus === 'Active now'
                              ? styles.circleGreen
                              : styles.circleGray
                          }
                        />
                        <div
                          className={`${styles.status} animate__animated animate__fadeIn`}
                        >
                          {friend.chatRoom &&
                          friend.chatRoom.lastMessage &&
                          friend.chatRoom.lastMessage.from_user
                            ? friend.chatRoom.lastMessage.from_user._id ===
                              auth.user._id
                              ? `You ${friend.chatRoom.lastMessage.message.substring(
                                  0,
                                  15
                                )}`
                              : friend.chatRoom.lastMessage.message.substring(
                                  0,
                                  10
                                )
                            : friend.activityStatus === 'Active now'
                            ? 'Active now'
                            : friend.moment
                            ? 'Active ' + friend.moment
                            : 'Offline'}
                        </div>
                        {/* <p className={styles.friendMessage}>Lorem ipsum </p> */}
                      </div>
                    </div>
                    <div className={styles.friendTime}>
                      <p className={styles.time}>
                        {friend.chatRoom &&
                          friend.chatRoom.lastMessage &&
                          moment(
                            friend.chatRoom.lastMessage.timestamp
                          ).calendar(null, {
                            sameDay: 'LT',
                            nextDay: '[Tomorrow]',
                            nextWeek: 'dddd',
                            lastDay: '[Yesterday]',
                            lastWeek: 'dddd',
                            sameElse: 'DD/MM/YYYY',
                          })}
                      </p>
                    </div>
                  </div>
                );
              })}

            {auth.user.following.length !== 0 && (
              <div className={styles.noFriend}>
                <p className={styles.noFriendText}>Follow Suggested Friends</p>

                <div className={styles.recommendations}>
                  {
                    // iterate through only 3 users from unique users
                    users.map((user) => {
                      return (
                        user.avatar &&
                        user.id &&
                        user.id !== auth.user._id && (
                          <Link
                            to={`/users/profile/${user.id}`}
                            key={user.id}
                            className={styles.recommendation}
                          >
                            <img src={user.avatar ? user.avatar : dummyImg} />
                            <p className={styles.recommendationName}>
                              {user.name.split(' ')[0]}
                            </p>
                          </Link>
                        )
                      );
                    })
                  }
                </div>
              </div>
            )}

            {auth.user.following.length === 0 && (
              <div className={styles.noFriend}>
                <p className={styles.noFriendText}>
                  Follow someone to start Chat
                </p>
                <p className={styles.noFriendText}>
                  Here are few recommendations
                </p>

                <div className={styles.recommendations}>
                  {
                    // iterate through only 3 users from unique users
                    users.map((user) => {
                      return (
                        user.avatar &&
                        user.id &&
                        user.id !== auth.user._id && (
                          <Link
                            to={`/users/profile/${user.id}`}
                            key={user.id}
                            className={styles.recommendation}
                          >
                            <img src={user.avatar ? user.avatar : dummyImg} />
                            <p className={styles.recommendationName}>
                              {user.name.split(' ')[0]}
                            </p>
                          </Link>
                        )
                      );
                    })
                  }
                </div>
                <p> or </p>
                <button className={styles.noFriendButton}>Find Friends</button>
              </div>
            )}
          </div>

          <div onClick={handleGlobalChatClick} className={styles.footer}>
            <p> Join Global Chat</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
