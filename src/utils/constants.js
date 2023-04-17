import env from './env';
// const API_ROOT = 'https://codeial.codingninjas.com:8000/api/v2/';
const API_ROOT = env.API_URL;
// const API_ROOT = 'https://sanam.social/api/v1/';

// doc url - https://www.notion.so/aakashcn/Codeial-API-docs-3a4d0b5a42c54f0a94d951a42aabc13f
export const API_URLS = {
    login: () => `${API_ROOT}/users/login`, //   
    signup: () => `${API_ROOT}/users/create`, //
    googleLogin: () => `${API_ROOT}/users/auth/google`, //

    posts: (page, limit) => `${API_ROOT}/posts`,  //
    createPost: () => `${API_ROOT}/posts/create`, // 
    deletePost: (postId) => `${API_ROOT}/posts/delete/${postId}`, // 
    createFriendship: (fromUserId, toUserId) =>
        `${API_ROOT}/friends/add?from_user=${fromUserId}&to_user=${toUserId}`, //
    friends: () => `${API_ROOT}/friendship/fetch_user_friends`,
    removeFriend: (userId) =>
        `${API_ROOT}/friends/remove?from=${userId}`, //
    toggleLike: (itemId, itemType) =>
        `${API_ROOT}/likes/toggle?likeable_id=${itemId}&likeable_type=${itemType}`, // itemType is 'Post'/'Comment'
    getLikes: (itemId, itemType) =>
        `${API_ROOT}/likes?likeable_id=${itemId}&likeable_type=${itemType}`,
    comment: () => `${API_ROOT}/comments/create`, //
    deleteComment: (commentId) => `${API_ROOT}/comments/destroy/${commentId}`, //
    editUser: () => `${API_ROOT}/users/edit`,
    userInfo: (userId) => `${API_ROOT}/users/profile/${userId}`, //
    searchUsers: (searchText) => `${API_ROOT}/users/search?text=${searchText}`,
};

export const LOCALSTORAGE_TOKEN_KEY = '__social_token__';
