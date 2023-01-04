import styles from '../styles/css/navbar.module.css';


import homeIcon from '../styles/icon/home.png';
import notification from '../styles/icon/noti3.png';
import chat from '../styles/icon/chat.png';
import send from '../styles/icon/send.png';
import explore from '../styles/icon/explore.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { faAt } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import profile from '../styles/memojis/memo3.png';

const Navbar = () => {

    return (
        <div className={styles.navContainer}>

            <div className={styles.branding}>
                Logo and name
            </div>

            <div className={styles.currentMenu}>
                <img style={{height: 24, width: 24}}  src={homeIcon} />
                <p>Home</p>
            </div>

            <div className={styles.searchBar}>
                <FontAwesomeIcon className={styles.hashIcon}  icon={faHashtag} />
                <FontAwesomeIcon className={styles.searchIcon}  icon={faMagnifyingGlass} />
                <input   placeholder='Explore' />
            </div>

            <div className={styles.navOptions}>
                <img style={{height: 24, width: 24}}  src={send} />
                <img style={{height: 28, width: 28}}  src={notification} />
                <img style={{height: 28, width: 28}}  src={notification} />
                <img className={styles.avatar}  src={profile} />
                <img style={{height: 28, width: 28}}  src={explore} />
                
            </div>

        </div>
    )
}

export default Navbar;