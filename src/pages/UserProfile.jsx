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
import { faCloud } from '@fortawesome/free-solid-svg-icons';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { faClone } from '@fortawesome/free-solid-svg-icons';
import { faClapperboard } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import settingsIcon from '../styles/icon/setting.png';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import dummyImg from '../styles/img/dummy.jpeg';

import { toast } from 'react-hot-toast';
import { faL, faUnderline } from '@fortawesome/free-solid-svg-icons';
import {
  addFriend,
  fetchUserFriends,
  fetchUserProfile,
  removeFriend,
} from '../api';
import { Loader } from '../components';
import LeftNav from './home/LeftNav';
import env from '../utils/env';

import moment from 'moment';

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [friends, setFriends] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [requestInProgress, setRequestInProgress] = useState(false);
  const { userId } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const [currentHeader, setCurrentHeader] = useState('userPosts');

  const [messageUser, setMessageUser] = useState(null);

  const checkIfUserIsAFriend = () => {
    const friends = auth.user.following;
    // console.log('friends', friends)

    if (friends === undefined) {
      return false;
    }

    const friendsId = friends.map((friend) => friend.to_user._id);
    const index = friendsId.indexOf(userId);

    // console.log(index, friends)
    if (index !== -1 && friends[index].status === 'accepted') {
      return true;
    }

    return false;
  };
  const [isFriend, setIsFriend] = useState(checkIfUserIsAFriend());

  useEffect(() => {
    const getuser = async () => {
      const response = await fetchUserProfile(userId);
      if (response.success) {
        setLoading(false);
        let followersCount = 0;
        let followingCount = 0;

        response.data.user.followers.forEach((follower) => {
          if (follower.status === 'accepted') {
            followersCount++;
          }
        });

        response.data.user.following.forEach((following) => {
          if (following.status === 'accepted') {
            followingCount++;
          }
        });

        setFollowersCount(followersCount);
        setFollowingCount(followingCount);

        setUser({
          ...response.data.user,
        });
      } else {
        setLoading(false);
        toast.error(response.message);
        return navigate('/');
      }
    };

    getuser();
    setIsFriend(checkIfUserIsAFriend());

    return () => {};
  }, [userId]);

  if (loading) {
    return <Loader />;
  }

  const handleAddFriendClick = async () => {
    setRequestInProgress(true);

    const fromUserId = auth.user._id;
    const toUserId = userId;

    // const response = await addFriend(fromUserId, toUserId); // (from, to)
    const response = await toast.promise(addFriend(fromUserId, toUserId), {
      loading: 'Adding friend...',
      success: 'Friend added successfully!',
      error: 'Something went wrong!',
    });

    if (response.success) {
      const { friendship } = response.data;
      auth.updateUserFriends(true, friendship);
      setFollowersCount(followersCount + 1);
      setIsFriend(true);
    } else {
      toast.error(response.message);
      setIsFriend(false);
    }
    // console.log(isFriend)
    setRequestInProgress(false);
  };

  const handleRemoveFriendClick = async () => {
    setRequestInProgress(true);

    const fromUserId = auth.user._id;
    const toUserId = userId;

    // const response = await removeFriend(auth.user._id);
    const response = await toast.promise(removeFriend(fromUserId, toUserId), {
      loading: 'Removing friend...',
      success: 'Friend removed successfully!',
      error: 'Something went wrong!',
    });

    if (response.success) {
      const friendship = response.data;

      auth.updateUserFriends(false, friendship);
      setFollowersCount(followersCount - 1);
      setIsFriend(false);
    } else {
      setIsFriend(true);
    }
    setRequestInProgress(false);
  };

  const handleMessageClick = () => {
    // check if the screen is mobile

    const friends = auth.user.following;
    // console.log('friends', friends)

    if (friends === undefined) {
      return false;
    }

    const friendsId = friends.map((friend) => friend.to_user._id);
    const index = friendsId.indexOf(userId);

    if (index !== -1 && friends[index]) {
      if (window.innerWidth <= 450) {
        navigate(`/messages`);
      }
      auth.handleUserMessageClick(friends[index]);
    } else {
      toast.success(`Follow ${user.name} to send message`);
    }
  };

  return (
    <div className={styles.settingsContainer}>
      <LoadingBar color="#f11946" progress="100" />
      <LeftNav />

      <div className={styles.profileContainer}>
        <div className={styles.smHeader}>
          <img className={styles.avatar} src={avatar} />
          <div className={styles.otherAccounts}>
            <FontAwesomeIcon
              className={styles.arrowDown}
              icon={faChevronDown}
            />
            <p className={styles.userName}>{auth.user.name}</p>
          </div>

          <img className={styles.settingsIcon} src={settingsIcon} />
        </div>

        <div className={styles.coverImg}></div>

        <div className={styles.profileDetail}>
          <img className={styles.avatar} src={avatar} />
          <p className={styles.userName}>{user.name}</p>
          <p className={styles.bio}>
            Hi this is sample about🔥 Professional Cake Cutter
          </p>
          <div className={styles.buttons}>
            {isFriend ? (
              <button
                className="animate__animated animate__fadeIn"
                onClick={handleRemoveFriendClick}
                disabled={requestInProgress}
              >
                Unfollow
              </button>
            ) : (
              <button
                className="animate__animated animate__fadeIn"
                onClick={handleAddFriendClick}
                disabled={requestInProgress}
              >
                Follow
              </button>
            )}
            <button onClick={handleMessageClick}>Message</button>
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
            <p className={styles.header}>Posts</p>
            <p className={styles.stat}> {user.posts.length} </p>
            <FontAwesomeIcon className={styles.icon} icon={faCloud} />
          </div>

          <div className={styles.border}></div>

          <div className={styles.followers}>
            <p className={styles.header}>Followers</p>
            <p className={styles.stat}>{followersCount}</p>
            <FontAwesomeIcon className={styles.icon} icon={faChartLine} />
          </div>

          <div className={styles.border}></div>

          <div className={styles.following}>
            <p className={styles.header}>Following</p>
            <p className={styles.stat}>{followingCount}</p>
            <FontAwesomeIcon className={styles.icon} icon={faChartSimple} />
          </div>

          <div className={styles.border}></div>

          <div className={styles.joined}>
            <p className={styles.header}>Joined</p>
            <p className={styles.stat}>
              {moment(user.createdAt).format('MMMM YYYY').split(' ')[0]}{' '}
            </p>
            <p className={styles.footer}>
              {' '}
              {moment(user.createdAt).format('MMMM YYYY').split(' ')[1]}{' '}
            </p>
          </div>

          {/* <div className={styles.border}></div>

                    <div className={styles.dob}>
                        <p className={styles.header}>Birthday</p>
                        <p className={styles.stat} >3 June</p>
                        <p className={styles.footer} >2000</p>

                    </div> */}
        </div>

        <div className={styles.postsContainer}>
          <div className={styles.header}>
            <div
              onClick={() => setCurrentHeader('userPosts')}
              className={`${styles.heading1} ${
                currentHeader === 'userPosts' && styles.activeHeading
              }`}
            >
              <FontAwesomeIcon className={styles.imgIcon} icon={faClone} />
              <p>Posts</p>
            </div>

            <div
              onClick={() => toast.success('Coming soon!')}
              className={`${styles.heading1} ${
                currentHeader === 'userVideos' && styles.activeHeading
              }`}
            >
              <FontAwesomeIcon
                className={styles.videoIcon}
                icon={faClapperboard}
              />
              <p>Videos</p>
            </div>
          </div>

          <div className={styles.userPosts}>
            {user.posts.map((post) => {
              return (
                <div className={styles.post} key={post._id}>
                  <img src={post.myfile ? post.myfile : dummyImg} />
                </div>
              );
            })}

            {user.posts.length === 0 && (
              <div className={styles.noPosts}>
                {/* <img src={dummyImg} /> */}
                <p>No posts from {user.name}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
