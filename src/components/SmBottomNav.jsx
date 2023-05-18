import styles from '../styles/css/bottomnav.module.css';
import { ReactDOM, useEffect, useState } from 'react';


// Icons
import homeIcon from '../styles/icon/home.png';
import notification from '../styles/icon/notification2.png';
import home from '../styles/icon/play.png';
import upload from '../styles/icon/upload.png';
import explore from '../styles/icon/explore2.png';

// FAS Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { faAt } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import profile from '../styles/memojis/memo3.png';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks';
import { searchUsers } from '../api';
import toast from 'react-hot-toast';

const SmBottomnNav = () => {



    return (
        <div className={styles.bottomContainer}>
            <div className={styles.homeIcon}>
                <Link to='/' > <img style={{height: 40}}  src={home} /> </Link>
            </div>

            <div className={styles.searchIcon}>
                <Link to='/search' > <img style={{height: 35}}  src={explore} /> </Link>
            </div>

            <div className={styles.uploadIcon}>
            <Link to='/upload' > <img style={{height: 35}}  src={upload} /> </Link>
            </div>

            <div onClick={
                () => {
                    toast.success('Coming Soon!')
                }
            } className={styles.notificationIcon}>
                <img style={{height: 35}}  src={notification} />
            </div>

            <div className={styles.profileIcon}>
                
                <Link to='/settings' > <img style={{height: 50}}  src={profile} /> </Link>

            </div>
        </div>
    )
}

export default SmBottomnNav;