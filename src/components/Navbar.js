import styles from '../styles/css/navbar.module.css';
import { ReactDOM } from 'react';

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
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks';

const Navbar = () => {
    const auth = useAuth();

    const profileHover = () => {
        console.log('mouse over')
        const div = document.getElementsByClassName(`${styles.navOptionsExpanded}`)[0];
        div.style.opacity = '1'
        div.style.height = '300px';
        div.style.visibility = "visible";

    }

    const profileLeave = () => {
        console.log('mouse leave')
        const div = document.getElementsByClassName(`${styles.navOptionsExpanded}`)[0];
        div.style.height = '0px';
        div.style.opacity = '0';
        div.style.visibility = "hidden";


        

    }


    return (
        <div className={styles.navContainer}>

            <div className={styles.branding}>
                <Link to='/'> Logo and name </Link>
                
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
                <img style={{height: 28, width: 28}}  src={explore} />
                <img style={{height: 28, width: 28}}  src={notification} />
                <Link onMouseOver={profileHover} onMouseLeave={profileLeave} className={styles.avatar} to='/login'> <img className={styles.avatar}  src={profile} /> </Link> 

            </div>

            <div onMouseOver={profileHover} onMouseLeave={profileLeave} className={styles.navOptionsExpanded}>
                
                <div>
                    <p>{ auth.user ? auth.user.name : 'Sign In/Up to continue'}</p>
                </div>


                {auth.user ? (
                    <button onClick={auth.logout} className={styles.signOutButton}>
                        <span>Log Out &nbsp;</span>
                    </button>
                ) :  ( 
                    <>
                        <Link className={styles.signInButton} to='/register'> 
                            <span>Register &nbsp;</span>
                        </Link> 
                        <Link className={styles.signInButton} to='/login'> 
                            <span>Sign In &nbsp;</span>
                        </Link> 
                    </>
                    
                )
                }
                
                
            </div>

        </div>
    )
}

export default Navbar;