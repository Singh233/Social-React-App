import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import styles from '../styles/css/home/rightnav.module.css';

import message from '../styles/icon/message2.png';
import avatar from '../styles/memojis/memo2.png';

import env from '../utils/env';
import { Avatar } from '@mui/joy';

const FriendList = ({ friends }) => {
  const auth = useAuth();

  return (
    <div className={styles.friendsListCard}>
      <div className={styles.heading}>Friends you follow</div>

      <div className={styles.list}>
        {friends &&
          friends.map(
            (friend) =>
              friend.status === 'accepted' && (
                <div key={`friend-${friend._id}`} className={styles.friend}>
                  {/* <div className={styles.status}>

                                </div> */}
                  <Link to={`/users/profile/${friend.to_user._id}`}>
                    {/* <img
                      className={
                        friend.to_user.avatar ? styles.profile : styles.avatar
                      }
                      src={
                        friend.to_user.avatar ? friend.to_user.avatar : avatar
                      }
                    /> */}
                    <Avatar
                      src={
                        friend.to_user.avatar ? friend.to_user.avatar : avatar
                      }
                      alt={friend.to_user.name}
                      size="lg"
                      variant="solid"
                      style={{ margin: 10 }}
                    />
                  </Link>
                  <Link
                    className={styles.userName}
                    to={`/users/profile/${friend.to_user._id}`}
                  >
                    <p>{friend.to_user.name}</p>
                  </Link>

                  <img
                    onClick={() => {
                      auth.handleUserMessageClick(friend);
                    }}
                    className={styles.messageIcon}
                    src={message}
                  />
                </div>
              )
          )}
      </div>
      {friends.length === 0 && (
        <div className={styles.noFriends}>
          <p>You are not following anyone</p>
          <button className={styles.exploreButton}>Explore now</button>
        </div>
      )}
      {
        // friends.length > 3  && (
        //     <div className={styles.footer}>
        //         <p>Show more</p>
        //     </div>
        // )
      }
    </div>
  );
};

export default FriendList;
