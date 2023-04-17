import PropTypes from 'prop-types';

import styles from '../../styles/css/home/leftnav.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faChartSimple } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
import { getTrendingTopics } from '../../api';
import toast from 'react-hot-toast';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import homeIcon from '../../styles/icon/home.png';
import notification from '../../styles/icon/notification2.png';
import chat from '../../styles/icon/chat.png';
import settings from '../../styles/icon/settingnormal.png';
import explore from '../../styles/icon/explore2.png';
import { useAuth } from '../../hooks';
import { FriendList } from '../../components';
import { Link } from 'react-router-dom';

const LeftNav = () => {
    const auth = useAuth();

    useEffect( () => {

        const getData = async () => {
            const response = await getTrendingTopics();
            console.log("Twitter api --", response.data);
            if (response.success) {
                toast.success("Successfully loaded topics");
            } else {
                toast.error(response.error);
            }
        }

        // getData();
        
    }, [])


    return (
        <>
        <div className={styles.container}>
            <div className={styles.header}>
                
            </div>

            <div className={styles.content}>
                <div className={`${styles.menu} ${styles.currentMenu}`}>
                    <img style={{height: 30, width: 30}}  src={homeIcon} />
                    <p>Home</p>
                </div>

                <div className={`${styles.menu} `}>
                    <img style={{height: 30, width: 30}}  src={chat} />
                    <p>Messages</p>
                </div>

                <div className={`${styles.menu} `}>
                    <img style={{height: 30, width: 30}}  src={settings} />
                    
                    <Link to='/settings'>
                        <p>Settings</p>
                    </Link>
                </div>
            </div>
            
            <FriendList friends={auth.user.following}/>

            <button onClick={auth.logout} className={styles.signOutButton}>
                <FontAwesomeIcon className={styles.optionsIcon}  icon={faRightFromBracket} />
                <span>Log Out &nbsp;</span>
            </button>
        </div>


        
        </>
        
    );
};


export default LeftNav;