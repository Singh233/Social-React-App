import { useLocation, useParams, useNavigate } from 'react-router-dom';
// Styles
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks';
import styles from '../styles/css/settings.module.css';


import { toast } from 'react-hot-toast';
import { faL, faUnderline } from '@fortawesome/free-solid-svg-icons';
import { addFriend, fetchUserProfile, removeFriend } from '../api';
import { Loader } from '../components';


const UserProfile = () => {
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(true);
    const [requestInProgress, setRequestInProgress] = useState(false);
    const {userId} = useParams();
    const navigate = useNavigate();
    const auth = useAuth();

    console.log('User Id', userId);

    useEffect(() => {
        const getuser = async () => {
            const response = await fetchUserProfile(userId);
            if (response.success) {
                setLoading(false);
                setUser(response.data.user);
            } else {
                setLoading(false);
                toast.error(response.message);
                return navigate('/');
            }

            
        }

        getuser();
    }, [userId]);


    if (loading) {
        return <Loader />
    }

    const checkIfUserIsAFriend = () => {
        
        const friends = auth.user.friends;

        if (friends === undefined) {
            return false;
        }
        const friendsId = friends.map(friend => friend.to_user._id);
        const index = friendsId.indexOf(userId);


        if (index !== -1) {
            return true;
        }

        return false;

    }

    const handleAddFriendClick = async () => {
        setRequestInProgress(true);

        const response = await addFriend(userId);

        if (response.success) {
            const {friendship} = response.data;

            auth.updateUserFriends(true, friendship);
            toast.success("Friend added successfully!");

        } else {
            toast.error(response.message);
        }

        setRequestInProgress(false);

    }


    const handleRemoveFriendClick = async () => {
        setRequestInProgress(true);

        const response = await removeFriend(userId);

        if (response.success) {
            const friendship = auth.user.friends.filter(friend => friend.to_user._id !== userId);

            auth.updateUserFriends(false, friendship);
            toast.success("Friend removed successfully!");

        } else {
            toast.error(response.message);
        }

        setRequestInProgress(false);

    }


    



    



    return (
        <div>
            Settings
            <div className={styles.profileImg}>

            </div>

            <div className={styles.field}>

                <div className={styles.fieldName}>Email</div>
                <div className={styles.fieldValue}>{user.email}</div>

            </div>

            <div className={styles.field}>

                <div className={styles.fieldName}>Name</div>
                <div className={styles.fieldValue}>{user.name}</div>


            </div>

            <div className={styles.btnGroup}>
                {checkIfUserIsAFriend() ? (<button onClick={handleRemoveFriendClick} disabled={requestInProgress}>{requestInProgress ?
                    'Removing a friend' : 'Remove Friend' }</button>)
                : (<button onClick={handleAddFriendClick} disabled={requestInProgress}>{requestInProgress ?
                    'Adding a friend' : 'Add Friend' }</button>)
                }
                
                
            </div>
        </div>
    )
}


export default UserProfile;