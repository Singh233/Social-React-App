import { useContext, useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { AuthContext, PostsContext } from '../providers';
import { editProfile, fetchUserFriends, login as userLogin, getPosts } from '../api';
import { signUp as userSignUp } from '../api';
import { setItemInLocalStorage, LOCALSTORAGE_TOKEN_KEY, removeItemInLocalStorage, getItemInLocalStorage} from '../utils';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
    return useContext(AuthContext);
};

export const useProvideAuth = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect( () => {
        console.log('Inside use hooks use effect ********')
        const getUser = async () => {
            const userToken = getItemInLocalStorage(LOCALSTORAGE_TOKEN_KEY);
            if (userToken) {
                const user = jwtDecode(userToken);
                const response = await fetchUserFriends();
                // console.log('friends',response)
                let friends =[];
                if (response.success) {
                    friends = response.data.friends;
                }

                setUser({
                    ...user,
                    friends
                });
            }
            setLoading(false);
        }
        getUser();
    }, [getItemInLocalStorage(LOCALSTORAGE_TOKEN_KEY)]);


    const signUp = async (name, email, password, confirmPassword) => {
        const response = await userSignUp(name, email, password, confirmPassword);

        if (response.success) {
            setUser(response.data.user);
            setItemInLocalStorage(LOCALSTORAGE_TOKEN_KEY, response.data.token ? response.data.token : null);
            return {
                success: true,
            };
        } else {
            return {
                success: false,
                message: response.message,
            };
        }
    }

    const updateUser = async (userId, name, password, confirmPassword) => {
        const response = await editProfile(userId, name, password, confirmPassword);
        // console.log('response', response)
        if (response.success) {
            setUser(response.data.user);
            setItemInLocalStorage(LOCALSTORAGE_TOKEN_KEY, response.data.token ? response.data.token : null);

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
            setItemInLocalStorage(LOCALSTORAGE_TOKEN_KEY, response.data.token ? response.data.token : null);
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

    const logout = () => {
        setUser(null);
        removeItemInLocalStorage(LOCALSTORAGE_TOKEN_KEY);
        toast.success("Successfully logged out!");
        navigate('/');

    };

    const updateUserFriends = (addFriend, friend) => {
        if (addFriend) {
            setUser({
                ...user,
                friends: [...user.friends, friend],
            });
            return;
        } else {
            
            setUser({
                ...user,
                friends: friend,
            });
            console.log('friend', friend);
            return;
        }
    }




    return {
        user,
        login,
        signUp,
        logout,
        loading,
        updateUser,
        updateUserFriends,

    };
};


export const usePosts = () => {
    return useContext(PostsContext);
};


export const useProvidePosts = () => {
    const [posts, setPosts] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await getPosts();
            // console.log('response', response);

            if (response.success) {
                setPosts(response.data.posts);
            }
            setLoading(false);
        };

        fetchPosts();
    }, []);

    const addPostToState = (post) => {
        const newPosts = [post, ...posts];
        setPosts(newPosts);
    }

    const addComment = (comment, id) => {
        const newPosts = posts.map((post) => {
            if (post._id === id) {
                return { ...post, comments: [...post.comments, comment]};
            }
            return post;
        });
        setPosts(newPosts);
    }

    return {
        data: posts,
        loading,
        addPostToState,
        addComment
    }

}
