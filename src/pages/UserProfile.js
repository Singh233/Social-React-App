import { useLocation, useParams, useNavigate } from 'react-router-dom';
// Styles
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks';
import styles from '../styles/css/settings.module.css';
import avatar from '../styles/memojis/memo3.png';
import LoadingBar from 'react-top-loading-bar';
import coverImg from '../styles/img/dummy.jpeg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartSimple } from '@fortawesome/free-solid-svg-icons';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { faClone } from '@fortawesome/free-solid-svg-icons';
import { faClapperboard } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import settingsIcon from '../styles/icon/setting.png';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

import { toast } from 'react-hot-toast';
import { faL, faUnderline } from '@fortawesome/free-solid-svg-icons';
import { addFriend, fetchUserFriends, fetchUserProfile, removeFriend } from '../api';
import { Loader } from '../components';
import LeftNav from './home/LeftNav';
import env from '../utils/env'

const UserProfile = () => {
    const [user, setUser] = useState({});
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [requestInProgress, setRequestInProgress] = useState(false);
    const {userId} = useParams();
    const navigate = useNavigate();
    const auth = useAuth();

    const checkIfUserIsAFriend = () => {
        
        const friends = auth.user.following;
        console.log('friends', friends)

        if (friends === undefined) {
            return false;
        }

        const friendsId = friends.map(friend => friend.to_user);
        const index = friendsId.indexOf(userId);


        if (index !== -1) {
            return true;
        }

        return false;

    }
    const [isFriend, setIsFriend] = useState(checkIfUserIsAFriend());

    useEffect(() => {
        const handleScroll = event => {
            if (window.scrollY <= 50) {
                const div = document.getElementsByClassName(`${styles.smHeader}`)[0];
                div.style.backgroundColor = 'rgba(0, 0, 0, 0.100)';
            } else {
                const div = document.getElementsByClassName(`${styles.smHeader}`)[0];
                div.style.backgroundColor = '#0F1216';
            }
            
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    

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
        setIsFriend(checkIfUserIsAFriend());

        

        getuser();
    }, [userId]);


    if (loading) {
        return <Loader />
    }

    

    const handleAddFriendClick = async () => {
        setRequestInProgress(true);

        const fromUserId = auth.user._id;
        const toUserId = userId;

        const response = await addFriend(fromUserId, toUserId); // (from, to)

        if (response.success) {
            const {friendship} = response.data;

            auth.updateUserFriends(true, friendship);
            toast.success("Friend added successfully!");

        } else {
            toast.error(response.message);
        }
        setIsFriend(checkIfUserIsAFriend());
        console.log(isFriend)
        setRequestInProgress(false);

    }


    const handleRemoveFriendClick = async () => {
        setRequestInProgress(true);

        const response = await removeFriend(auth.user._id);

        if (response.success) {
            const friendship = response.data;

            auth.updateUserFriends(false, friendship);
            toast.success("Friend removed successfully!");

        } else {
            toast.error(response.message);
        }

        setIsFriend(checkIfUserIsAFriend());
        console.log(isFriend)
        setRequestInProgress(false);

    }


    



    



    return (
        <div className={styles.settingsContainer}>
            <LoadingBar color="#f11946" progress='100'  />
            <LeftNav />

            <div className={styles.profileContainer}>

                <div className={styles.smHeader}>
                    <img className={styles.avatar} src={avatar} />
                    <div className={styles.otherAccounts} >
                        <FontAwesomeIcon className={styles.arrowDown}  icon={faChevronDown} />
                        <p className={styles.userName}>{auth.user.name}</p>
                    </div>

                    
                    <img className={styles.settingsIcon} src={settingsIcon} />
                </div>

                <div className={styles.coverImg}>
                </div>

                <div className={styles.profileDetail}>
                    <img className={styles.avatar} src={avatar} />
                    <p className={styles.userName}>{user.name}</p>
                    <p className={styles.bio}>Hi this is sample about🔥 Professional Cake Cutter</p>
                    <div className={styles.buttons}>
                        
                        {isFriend ? (<button onClick={handleRemoveFriendClick} disabled={requestInProgress}>{requestInProgress ?
                        'Removing a friend' : 'Unfollow' }</button>)
                        : (<button onClick={handleAddFriendClick} disabled={requestInProgress}>{requestInProgress ?
                            'Adding a friend' : 'Follow' }</button>)
                        }
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

                <div className={styles.stats}>
                    <div className={styles.followers}>
                        <p className={styles.header}>Followers</p>
                        <p className={styles.stat} >{user.followers.length}</p>
                        <FontAwesomeIcon className={styles.icon}  icon={faChartLine} />
                    </div>

                    <div className={styles.border}></div>

                    <div className={styles.following}>
                        <p className={styles.header}>Following</p>
                        <p className={styles.stat} >{user.following.length}</p>
                        <FontAwesomeIcon className={styles.icon}  icon={faChartSimple} />
                    </div>

                    <div className={styles.border}></div>

                    <div className={styles.joined}>
                        <p className={styles.header}>Joined</p>
                        <p className={styles.stat} >1+</p>
                        <p className={styles.footer} >Years Ago</p>
                    </div>

                    <div className={styles.border}></div>

                    <div className={styles.dob}>
                        <p className={styles.header}>Birthday</p>
                        <p className={styles.stat} >3 June</p>
                        <p className={styles.footer} >2000</p>

                    </div>
                </div>

                <div className={styles.postsContainer}>
                    <div className={styles.header} >
                        <div className={styles.heading1}>
                            <FontAwesomeIcon className={styles.imgIcon}  icon={faClone} />
                            <p >Posts</p>
                        </div>

                        <div className={styles.heading2}>
                            <FontAwesomeIcon className={styles.videoIcon}  icon={faClapperboard} />
                            <p >Videos</p>
                        </div>

                        <div className={styles.heading3}>
                            <FontAwesomeIcon className={styles.bookmarkIcon}  icon={faBookmark}  />
                            <p >Saved</p>
                        </div>
                    </div>

                    <div className={styles.posts}>
                    {
                            user.posts.map(post => {
                                return (
                                    <div className={styles.post} key={post._id}>
                                        <img src={env.file_url + post.myfile} />
                                    </div>
                                )
                            })
                        }
                    </div>
            

                </div>
            </div>

        </div>
    )
}


export default UserProfile;