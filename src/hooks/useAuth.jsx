import { useContext, useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { AuthContext } from '../providers';
import {
  editProfile,
  fetchUserFriends,
  login as userLogin,
  fetchUserProfile,
  googleLoginAPI,
  unsavePost,
  savePost,
} from '../api';
import { signUp as userSignUp } from '../api';
import {
  setItemInLocalStorage,
  LOCALSTORAGE_TOKEN_KEY,
  removeItemInLocalStorage,
  getItemInLocalStorage,
} from '../utils';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import socketIo from 'socket.io-client';
import env from '../utils/env';

export const useAuth = () => {
  return useContext(AuthContext);
};

export const useProvideAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [clicked, setClicked] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  // state for hide message component
  const [hideMessage, setHideMessage] = useState(false);
  // state for user message icon click
  const [userMessageClick, setUserMessageClick] = useState(null);
  // make socket connection
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // console.log('Inside use hooks use effect ********')
    document.addEventListener('click', () => setClicked(true));

    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const getUser = async () => {
      const userToken = getItemInLocalStorage(LOCALSTORAGE_TOKEN_KEY);
      if (userToken) {
        const user = jwtDecode(userToken);
        const userFriendsResponse = await fetchUserFriends();

        let friends = [];
        if (userFriendsResponse.success) {
          friends = userFriendsResponse.data.friends;
        }

        const response = await fetchUserProfile(user._id);
        if (!response.success) {
          toast.error(response.message);
          removeItemInLocalStorage(LOCALSTORAGE_TOKEN_KEY);
          setUser(null);
          setLoading(false);
          return;
        }

        // calculate followers count
        let followersCount = 0;
        response.data.user.followers.forEach((friend) => {
          if (friend.status === 'accepted') {
            followersCount++;
          }
        });

        // calculate following count
        let followingCount = 0;
        response.data.user.following.forEach((friend) => {
          if (friend.status === 'accepted') {
            followingCount++;
          }
        });

        setUser({
          ...user,
          ...response.data.user,
          friends,
          followersCount,
          followingCount,
        });

        if (!socket) {
          const socket = await socketIo.connect(env.socket_url, {
            query: {
              userId: user._id,
            },
          });

          // console.log('socket', socket)

          await socket.on('connect', () => {
            socket.emit('user_online', {
              user_id: user._id,
            });
          });

          setSocket(socket);
        }
      }
      setLoading(false);
    };
    getUser();
    // return () => {
    //   document.removeEventListener('visibilitychange', handleVisibilityChange);
    // };
  }, [getItemInLocalStorage(LOCALSTORAGE_TOKEN_KEY)]);

  const signUp = async (name, email, password, confirmPassword) => {
    const response = await userSignUp(name, email, password, confirmPassword);

    if (response.success) {
      setUser(response.data.user);
      setItemInLocalStorage(
        LOCALSTORAGE_TOKEN_KEY,
        response.data.token ? response.data.token : null
      );
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: response.message,
      };
    }
  };

  const updateUser = async (userId, name, password, confirmPassword) => {
    const response = await editProfile(userId, name, password, confirmPassword);
    // console.log('response', response)
    if (response.success) {
      setUser(response.data.user);
      setItemInLocalStorage(
        LOCALSTORAGE_TOKEN_KEY,
        response.data.token ? response.data.token : null
      );

      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: response.message,
      };
    }
  };

  const login = async (email, password) => {
    const response = await userLogin(email, password);
    if (response.success) {
      setUser(response.data.user);
      setItemInLocalStorage(
        LOCALSTORAGE_TOKEN_KEY,
        response.data.token ? response.data.token : null
      );

      // socket connection
      const socket = socketIo.connect(env.socket_url, {
        query: {
          userId: response.data.user._id,
        },
      });

      socket.on('connect', () => {
        socket.emit('user_online', {
          user_id: response.data.user._id,
        });
      });

      setSocket(socket);

      // const profileReponse = await fetchUserProfile(response.data.user._id);

      // setUser({
      //     ...user,
      //     ...profileReponse.data.user,
      // });

      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: response.message,
      };
    }
  };

  const googleLogin = async (tokenId) => {
    // const response = await userLogin(tokenId);
    const response = await googleLoginAPI(tokenId);
    // console.log('response from login', response)
    if (response.success) {
      setUser(response.data.user);
      setItemInLocalStorage(
        LOCALSTORAGE_TOKEN_KEY,
        response.data.token ? response.data.token : null
      );

      // socket connection
      const socket = socketIo.connect(env.socket_url, {
        query: {
          userId: response.data.user._id,
        },
      });

      socket.on('connect', () => {
        socket.emit('user_online', {
          user_id: response.data.user._id,
        });
      });

      setSocket(socket);

      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: response.message,
      };
    }
  };

  const logout = async () => {
    // disconnect socket connection
    socket.disconnect();
    setUser(null);
    removeItemInLocalStorage(LOCALSTORAGE_TOKEN_KEY);
    toast.success('Successfully logged out!');
    navigate('/login');
  };

  const updateUserFriends = async (addFriend, friend) => {
    if (addFriend) {
      // console.log('user followring', user.following);
      let isAlreadyFollowing = false;
      let newfollowing = user.following.map((f) => {
        if (f.to_user._id === friend.to_user) {
          isAlreadyFollowing = true;
          return {
            ...f,
            status: 'accepted',
          };
        } else {
          return f;
        }
      });

      if (!isAlreadyFollowing) {
        newfollowing = [...newfollowing, friend];
      }

      const userFriendsResponse = await fetchUserFriends();

      let friends = [];
      if (userFriendsResponse.success) {
        friends = userFriendsResponse.data.friends;
      }

      setUser({
        ...user,
        following: newfollowing,
        followingCount: user.followingCount + 1,
        friends,
      });
      return;
    } else {
      // console.log(user.following, friend);
      setUser({
        ...user,
        following: user.following.map((f) => {
          if (f.to_user._id === friend.friendship.to_user) {
            return {
              ...f,
              status: 'deleted',
            };
          } else {
            return f;
          }
        }),
        followingCount: user.followingCount - 1,
      });
      // console.log('friend', friend);
      return;
    }
  };

  const updateUserPosts = (addPost, post) => {
    if (addPost) {
      setUser({
        ...user,
        posts: [post, ...user.posts],
      });
      return;
    } else {
      setUser({
        ...user,
        posts: user.posts.filter((p) => p._id !== post._id),
        savedPosts: user.savedPosts.filter((p) => post._id !== p._id),
      });

      return;
    }
  };

  // function to hide message
  const toggleMessageHide = () => {
    setHideMessage(!hideMessage);
  };

  // function to update friends messages
  const updateFriendsMessage = (friend, messages, liveData) => {
    const timestamp = new Date().toISOString();
    let friends = [...user.friends];

    let toUser = null;
    let flag = true;
    if (user.email === liveData.user_email) {
      toUser = liveData.to_user;
      flag = false;
    } else {
      toUser = liveData.user_email;
    }
    friends.map((userFriend) => {
      let checkFriend = userFriend._id;
      if (flag) {
        checkFriend = userFriend.email;
      }

      if (checkFriend === toUser) {
        userFriend.chatRoom.messages.push({
          sender: {
            _id: liveData.from_user,
            avatar: liveData.user_profile,
            name: liveData.user_name,
            email: liveData.user_email,
          },
          receiver: {
            _id: liveData.to_user,
          },
          message: `${liveData.message}`,
          messageType: liveData.messageType ? liveData.messageType : 'text',
          createdAt: timestamp,
        });

        userFriend.chatRoom.lastMessage = {
          from_user: {
            _id: liveData.from_user,
            avatar: liveData.user_profile,
            name: liveData.user_name,
            email: liveData.user_email,
          },
          message: liveData.message,
          messageType: liveData.messageType ? liveData.messageType : 'text',
          timestamp: timestamp,
        };
      }
    });

    const compareByCreatedAt = (a, b) => {
      // Convert createdAt strings to Date objects
      const timeA =
        a.chatRoom.lastMessage && a.chatRoom.lastMessage.timestamp
          ? a.chatRoom.lastMessage.timestamp
          : `2000-05-11T18:05:57.632Z`;
      const timeB =
        b.chatRoom.lastMessage && b.chatRoom.lastMessage.timestamp
          ? b.chatRoom.lastMessage.timestamp
          : `2000-05-11T18:05:57.632Z`;

      const dateA = new Date(timeA);
      const dateB = new Date(timeB);

      // Compare the dates
      if (dateA > dateB) {
        return -1;
      }
      if (dateA < dateB) {
        return 1;
      }
      return 0;
    };
    friends.sort(compareByCreatedAt);

    setUser({
      ...user,
      friends: friends,
    });
  };

  // handle user message click
  const handleUserMessageClick = (clickedUser) => {
    if (!clickedUser) {
      setUserMessageClick(null);
      return;
    }
    user.friends.map((friend) => {
      if (friend._id === clickedUser.to_user._id) {
        setUserMessageClick(friend);
        return;
      }
    });
  };

  // handle save post
  const handleSavePost = async (postId) => {
    const response = await savePost(postId);
    if (response.success) {
      user.savedPosts.unshift(response.data.post);
    }
    return response;
  };

  const handleUnsavePost = async (postId) => {
    const response = await unsavePost(postId);
    if (response.success) {
      setUser({
        ...user,
        savedPosts: user.savedPosts.filter((post) => post._id !== postId),
      });
    }
    return response;
  };

  return {
    clicked,
    isTabVisible,
    user,
    login,
    googleLogin,
    signUp,
    logout,
    loading,
    hideMessage,
    userMessageClick,
    handleUserMessageClick,
    toggleMessageHide,
    updateFriendsMessage,
    updateUser,
    updateUserFriends,
    updateUserPosts,
    socket,
    handleSavePost,
    handleUnsavePost,
  };
};
