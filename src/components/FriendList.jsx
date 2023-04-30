

import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/css/home/rightnav.module.css';

import message from '../styles/icon/message2.png';
import avatar from '../styles/memojis/memo2.png';

import env from '../utils/env';

const FriendList = ({friends}) => {


    return (
        <div className={styles.friendsListCard}>
                <div className={styles.heading} >
                    Friends you follow
                </div>

                <div className={styles.list}>
                    {
                        friends && friends.map((friend) => (
                            <div key={`friend-${friend._id}`} className={styles.friend}>
                                {/* <div className={styles.status}>

                                </div> */}
                                <Link to={`/users/profile/${friend.to_user._id}`} > 
                                    <img  className={friend.to_user.avatar ? styles.profile : styles.avatar} src={ friend.to_user.avatar ? env.file_url + friend.to_user.avatar : avatar} />
                                </Link>
                                <Link className={styles.userName} to={`/users/profile/${friend.to_user._id}`} > 
                                    <p >{friend.to_user.name}</p>
                                </Link>
                                
                                <img className={styles.messageIcon} src={message} />
                            </div>
                        ))
                    }
                    
                </div>
                {
                    friends.length === 0 && (
                        <div className={styles.noFriends}>
                            <p>You are not following anyone</p>
                            <button className={styles.exploreButton}>Explore now</button>
                        </div>
                    )
                }
                {
                    friends.length > 3  && (
                        <div className={styles.footer}>
                            <p>Show more</p>
                        </div>
                    )
                }
                

        </div>
    )
}

export default FriendList;