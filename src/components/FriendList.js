

import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/css/home/rightnav.module.css';

import message from '../styles/icon/message2.png';
import avatar from '../styles/memojis/memo2.png';

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
                                <div className={styles.status}>

                                </div>
                                <Link to={`/user/${friend.to_user._id}`} > 
                                    <img  className={styles.avatar} src={avatar} />
                                </Link>
                                <Link className={styles.userName} to={`/user/${friend.to_user._id}`} > 
                                    <p >{friend.to_user.name}</p>
                                </Link>
                                
                                <img className={styles.messageIcon} src={message} />
                            </div>
                        ))
                    }
                    
                </div>
                <div className={styles.footer}>
                    <p>Show more</p>
                </div>

        </div>
    )
}

export default FriendList;