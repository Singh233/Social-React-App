import { json } from 'react-router-dom';
import { API_URLS, getFormBody, LOCALSTORAGE_TOKEN_KEY } from '../utils';

const customFetch = async (url, { body, ...customConfig }) => {
  const token = window.localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);

  const headers = {
    'content-type': 'application/x-www-form-urlencoded',
    // 'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    // 'Cache-Control': 'no-cache no-store must-revalidate',
    // 'Pragma': 'no-cache',
    // 'Expires': 0,
  };

  // let headers = {};

  // if (customConfig && customConfig.headers && customConfig.headers.content) {
  //     headers = {};
  // } else {
  //     headers = {
  //         'content-type': 'application/x-www-form-urlencoded',
  //     }
  // }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const config = {
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body && body.formData) {
    // config.body = getFormBody(body);
    config.body = body;
  } else if (body) {
    config.body = getFormBody(body);
  }

  try {
    // console.log('config', config)
    const response = await fetch(url, config);
    const data = await response.json();

    if (data.success) {
      // console.log(data.data);
      return {
        data: data.data,
        success: true,
      };
    }
    throw new Error(data.message);
  } catch (error) {
    return {
      message: error.message,
      success: false,
    };
  }
};

export const getPosts = (page = 1, limit = 5) => {
  return customFetch(API_URLS.posts(page, limit), {
    method: 'GET',
  });
};

export const getSinglePost = (postId) => {
  return customFetch(API_URLS.getSinglePost(postId), {
    method: 'GET',
  });
};

export const lazyLoadGetPosts = (offset, limit) => {
  return customFetch(API_URLS.getPosts(offset, limit), {
    method: 'GET',
  });
};

export const login = (email, password) => {
  return customFetch(API_URLS.login(), {
    method: 'POST',
    body: { email, password },
  });
};

export const googleLoginAPI = (tokenId) => {
  return customFetch(API_URLS.googleLogin(), {
    method: 'POST',
    headers: {
      Authorization: `Basic ${tokenId}`,
    },
  });
};

export const signUp = (name, email, password, confirmPassword) => {
  return customFetch(API_URLS.signup(), {
    method: 'POST',
    body: { name, email, password, confirm_password: confirmPassword },
  });
};

export const signout = () => {
  return customFetch(API_URLS.signout(), {
    method: 'GET',
  });
};

export const editProfile = (userId, name, password, confirmPassword) => {
  return customFetch(API_URLS.editUser(), {
    method: 'POST',
    body: { id: userId, name, password, confirm_password: confirmPassword },
  });
};

export const fetchUserProfile = (userId) => {
  return customFetch(API_URLS.userInfo(userId), {
    method: 'GET',
  });
};

export const fetchUserFriends = () => {
  return customFetch(API_URLS.friends(), {
    method: 'GET',
  });
};

export const addFriend = (fromUserId, toUserId) => {
  return customFetch(API_URLS.createFriendship(fromUserId, toUserId), {
    method: 'POST',
  });
};

export const removeFriend = (fromUserId, toUserId) => {
  return customFetch(API_URLS.removeFriend(fromUserId, toUserId), {
    method: 'POST',
  });
};

export const addPost = (caption, file) => {
  // const fileInput = document.querySelector('input[type="file"]');
  // const formData = new FormData();
  // // formData.append('caption', caption);
  // formData.append('file', fileInput.files[0]);

  // console.log('formData', formData, fileInput.files[0])
  const formData = new FormData();
  formData.append('filepond', file[0]);
  formData.append('caption', caption);

  // console.log('content', content)
  // return customFetch(API_URLS.createPost(), {
  //     method: 'POST',
  //     body: formData,
  //     headers: {
  //         'Content-Type': 'multipart/form-data',
  //     },

  // });

  return new Promise(function (resolve, reject) {
    // make an xmlhttprequest to the server
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        const data = JSON.parse(xhr.responseText);
        // console.log('data', data);
        resolve(data);
        return {
          data: data.data,
          success: true,
        };
      }
    };
    xhr.open('POST', API_URLS.createPost());
    xhr.setRequestHeader(
      'Authorization',
      `Bearer ${window.localStorage.getItem(LOCALSTORAGE_TOKEN_KEY)}`
    );
    xhr.send(formData);
  });
};

export const deletePost = (postId) => {
  return customFetch(API_URLS.deletePost(postId), {
    method: 'POST',
  });
};

export const savePost = (postId) => {
  return customFetch(API_URLS.savePost(postId), {
    method: 'POST',
  });
};

export const unsavePost = (postId) => {
  return customFetch(API_URLS.unsavePost(postId), {
    method: 'POST',
  });
};

export const addComment = (content, post_id) => {
  return customFetch(API_URLS.comment(), {
    method: 'POST',
    body: {
      content,
      postId: post_id,
    },
  });
};

export const deleteComment = (commentId) => {
  return customFetch(API_URLS.deleteComment(commentId), {
    method: 'POST',
  });
};

export const toggleLike = (itemId, itemType) => {
  return customFetch(API_URLS.toggleLike(itemId, itemType), {
    method: 'POST',
  });
};

export const searchUsers = (searchText) => {
  return customFetch(API_URLS.searchUsers(searchText), {
    method: 'GET',
  });
};

// fetch messages
export const fetchMessages = (roomType, from_user, to_user, chatRoomId) => {
  return customFetch(
    API_URLS.getMessages(roomType, from_user, to_user, chatRoomId),
    {
      method: 'GET',
    }
  );
};

// create message
export const createMessage = (
  roomType,
  content,
  messageType,
  from_user,
  to_user,
  chatRoomId
) => {
  return customFetch(API_URLS.createMessage(), {
    method: 'POST',
    body: {
      message: content,
      type: roomType,
      sender: from_user,
      receiver: to_user,
      chatRoomId: chatRoomId,
      messageType: messageType,
    },
  });
};

// update user profile
export const updateUserProfile = (name, file) => {
  const formData = new FormData();
  formData.append('filepond', file[0]);
  formData.append('name', name);

  return new Promise(function (resolve, reject) {
    // make an xmlhttprequest to the server
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        const data = JSON.parse(xhr.responseText);
        // console.log('data', data);
        resolve(data);
        return {
          data: data.data,
          success: true,
        };
      }
    };
    xhr.open('POST', API_URLS.updateUserProfile());
    xhr.setRequestHeader(
      'Authorization',
      `Bearer ${window.localStorage.getItem(LOCALSTORAGE_TOKEN_KEY)}`
    );
    xhr.send(formData);
  });
};
