import env from './env';
// const API_ROOT = 'https://codeial.codingninjas.com:8000/api/v2/';
const API_ROOT = env.API_URL;
// const API_ROOT = 'https://sanam.social/api/v1/';

// doc url - https://www.notion.so/aakashcn/Codeial-API-docs-3a4d0b5a42c54f0a94d951a42aabc13f
export const API_URLS = {
    login: () => `${API_ROOT}/users/login`, //   
    signup: () => `${API_ROOT}/users/create`, //
    signout: () => `${API_ROOT}/users/sign-out`, //
    googleLogin: () => `${API_ROOT}/users/login/google`, //

    posts: (page, limit) => `${API_ROOT}/posts`,  //
    getPosts: (offset, limit) => `${API_ROOT}/posts/index?offset=${offset}&limit=${limit}`,
    createPost: () => `${API_ROOT}/posts/create`, // 
    deletePost: (postId) => `${API_ROOT}/posts/delete/${postId}`, // 
    savePost: (postId) => `${API_ROOT}/posts/save/${postId}`, //
    unsavePost: (postId) => `${API_ROOT}/posts/unsave/${postId}`, //

    createFriendship: (fromUserId, toUserId) =>
        `${API_ROOT}/friends/add?from_user=${fromUserId}&to_user=${toUserId}`, //
    friends: () => `${API_ROOT}/users/fetch_user_friends`, //
    removeFriend: (fromUserId, toUserId) =>
        `${API_ROOT}/friends/remove?from_user=${fromUserId}&to_user=${toUserId}`, //

    toggleLike: (itemId, itemType) =>
        `${API_ROOT}/likes/toggle?likeable_id=${itemId}&likeable_type=${itemType}`, // itemType is 'Post'/'Comment'
    getLikes: (itemId, itemType) =>
        `${API_ROOT}/likes?likeable_id=${itemId}&likeable_type=${itemType}`,


    comment: () => `${API_ROOT}/comments/create`, //
    deleteComment: (commentId) => `${API_ROOT}/comments/destroy/${commentId}`, //

    editUser: () => `${API_ROOT}/users/edit`,
    userInfo: (userId) => `${API_ROOT}/users/profile/${userId}`, //

    getMessages: (roomType, from_user, to_user, chatRoomId) => `${API_ROOT}/chat/${roomType}/${from_user}/${to_user}/${chatRoomId}`,
    createMessage: (message, roomType, from_user, to_user, chatRoomId) => `${API_ROOT}/chat/createmessage/${message}/${roomType}/${from_user}/${to_user}/${chatRoomId}`,

    searchUsers: (searchText) => `${API_ROOT}/users/search?search=${searchText}`,
};

export const LOCALSTORAGE_TOKEN_KEY = '__social_token__';
