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
import profile from '../../styles/icon/profile.png';
import settings from '../../styles/icon/settingnormal.png';
import explore from '../../styles/icon/explore2.png';
import { useAuth } from '../../hooks';
import { FriendList } from '../../components';
import { Link } from 'react-router-dom';
import Chat from '../../components/Chat';

const LeftNav = () => {
    const auth = useAuth();



    return (
        <>
        <div className={styles.container}>
            <div className={styles.header}>
                
            </div>

            <div className={styles.content}>
                <Link to='/' className={`${styles.menu} ${styles.currentMenu}`}>
                    <img style={{height: 30, width: 30}}  src={homeIcon} />
                    <p></p>
                </Link>

                <Link to='/settings' className={`${styles.menu} `}>
                    <img style={{height: 30, width: 30}}  src={profile} />
                    <p></p>
                </Link>

                <Link to='/settings' className={`${styles.menu} `}>
                    <img style={{height: 30, width: 30}}  src={settings} />
                </Link>
            </div>
            
            <Chat/>

            <button onClick={auth.logout} className={styles.signOutButton}>
                <FontAwesomeIcon className={styles.optionsIcon}  icon={faRightFromBracket} />
                <span>Log Out &nbsp;</span>
            </button>
        </div>


        
        </>
        
    );
};


export default LeftNav;