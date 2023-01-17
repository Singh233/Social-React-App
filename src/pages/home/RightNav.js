import FriendList from '../../components/FriendList';
import { useAuth } from '../../hooks';

import styles from '../../styles/css/home/rightnav.module.css';


const RightNav = () => {
    const auth = useAuth();
    console.log('user', auth.user.friends);

    return (
        <div className={styles.container}>
            <div className={styles.profileCard}>
                
            </div>

            <FriendList friends={auth.user.friends}/>
            
        </div>
    );
};


export default RightNav;