import { Link } from 'react-router-dom';
import FriendList from '../../components/FriendList';
import { useAuth } from '../../hooks';

import styles from '../../styles/css/home/rightnav.module.css';
import avatar from '../../styles/memojis/memo3.png';


const RightNav = () => {
    const auth = useAuth();
    console.log('user', auth.user.friends);

    return (
        <div className={styles.container}>
            <div className={styles.profileCard}>
                <div className={styles.header}>

                </div>

                <div className={styles.main}>
                    <img className={styles.avatar} src={avatar} />
                    <p className={styles.userName}>{auth.user.name}</p>
                    <p className={styles.bio}>Hi this is sample about🔥</p>
                </div>

                <div className={styles.stats}>
                    <div className={styles.followers}>
                        <p className={styles.sHeader}>Followers</p>
                        <p className={styles.stat} >0</p>
                    </div>

                    <div className={styles.border}></div>

                    <div className={styles.following}>
                        <p className={styles.sHeader}>Following</p>
                        <p className={styles.stat} >{auth.user.friends.length}</p>
                    </div>
                </div>

                <div className={styles.footer}>
                    <Link to={'/settings'}>My Profile</Link>
                </div>

            </div>

            <FriendList friends={auth.user.friends}/>
            
        </div>
    );
};


export default RightNav;