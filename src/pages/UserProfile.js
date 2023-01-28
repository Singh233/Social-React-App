import { useLocation, useParams, useNavigate } from 'react-router-dom';
// Styles
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks';
import styles from '../styles/css/settings.module.css';
import avatar from '../styles/memojis/memo3.png';
import LoadingBar from 'react-top-loading-bar';

import { toast } from 'react-hot-toast';
import { faL, faUnderline } from '@fortawesome/free-solid-svg-icons';
import { addFriend, fetchUserProfile, removeFriend } from '../api';
import { Loader } from '../components';
import LeftNav from './home/LeftNav';


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
        <div className={styles.settingsContainer}>
            <LoadingBar color="#f11946" progress='100'  />
            <LeftNav />

            <div className={styles.profileContainer}>

                <div className={styles.coverImg}>
                </div>

                <div className={styles.profileDetail}>
                    <img className={styles.avatar} src={avatar} />
                    <p className={styles.userName}>{user.name}</p>
                    <p className={styles.bio}>Hi this is sample about🔥</p>
                    <div className={styles.buttons}>
                    <button>Follow</button>
                    <button>Message</button>
                    </div>
                    
                    {/* <div className={styles.stats}>
                        <div className={styles.followers}>
                            <p>21</p>
                            <p>Followers</p>
                        </div>

                        <div className={styles.following}>
                            <p>25</p>
                            <p>Following</p>
                            
                        </div>
                    </div> */}
                </div>

                <div className={styles.postsContainer}>
                    <p>🛠️ Under progress...</p>
                </div>
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