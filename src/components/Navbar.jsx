import styles from '../styles/css/navbar.module.css';
import { ReactDOM, useEffect, useState } from 'react';

import Chat from './Chat';
import env from '../utils/env';
// Icons
import homeIcon from '../styles/icon/home.png';
import notification from '../styles/icon/notification2.png';
import chat from '../styles/icon/chat.png';
import send from '../styles/icon/message.png';
import explore from '../styles/icon/explore2.png';

// FAS Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faAt } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faCloud } from '@fortawesome/free-solid-svg-icons';

import profile from '../styles/memojis/memo3.png';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks';
import { searchUsers } from '../api';
import toast from 'react-hot-toast';

const Navbar = () => {
    const [results, setResults] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [cancelIcon, setCancelIcon] = useState(false);

    const auth = useAuth();

    const [timeout, setTimeoutState] = useState(null);



    useEffect(() => {
        const fetchUsers = async () => {
            const response = await searchUsers(searchText);

            if (response.success) {
                // filter out the current user
                const filteredUsers = response.data.users.filter(user => user._id !== auth.user._id);
                setResults(filteredUsers);

                if (response.data.users.length === 0) {
                    toast.error('No users found');
                }

            } else {
                toast.error('Something went wrong');
            }
        }

        if (searchText.length > 0) {
            // add debouncing here
            if (timeout) {
                clearTimeout(timeout);
            }
            setTimeoutState(setTimeout(() => {
                fetchUsers();
                setCancelIcon(true);
            }, 500));
            

        } else {
            setResults([]);
            setCancelIcon(false);
        }
        
    }, [searchText])
    

    const profileHover = () => {
        // console.log('mouse over')
        const div = document.getElementsByClassName(`${styles.navOptionsExpanded}`)[0];
        div.style.opacity = '1'
        div.style.height = '300px';
        div.style.visibility = "visible";

        const navOptions = document.getElementsByClassName(`${styles.navOptions}`)[0];
        
        




    }

    const profileLeave = () => {
        // console.log('mouse leave')
        const div = document.getElementsByClassName(`${styles.navOptionsExpanded}`)[0];
        div.style.height = '0px';
        div.style.opacity = '0';
        div.style.visibility = "hidden";

        const navOptions = document.getElementsByClassName(`${styles.navOptions}`)[0];
        navOptions.style.marginTop = "0px";


        

    }




    return (
        <>
        
        <div className={styles.navContainer}>

            <div className={styles.branding}>
                <Link className={styles.name} to='/'>
                    <FontAwesomeIcon className={styles.hashIcon}  icon={faCloud} />
                    <span className={styles.s}>S</span>anam.<span>Social</span>
                </Link>
            </div>

            {/* <div className={styles.currentMenu}>
                <img style={{height: 30, width: 30}}  src={homeIcon} />
                <p>Home</p>
            </div> */}

            <div className={styles.searchBarNav}>
                <FontAwesomeIcon className={styles.searchIcon}  icon={faMagnifyingGlass} />
                <input   
                    placeholder='Explore'
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                {
                    cancelIcon && <FontAwesomeIcon onClick={() => setSearchText('')} className={styles.cancelIcon}  icon={faXmark} />
                }
                

                {results.length > 0 && 
                    <div className={`${styles.resultsContainer} animate__animated animate__fadeIn`}>
                        
                        {results.map((user, index) => 
                            <div key={index} className={`${styles.result} animate__animated animate__fadeIn`}>
                                
                                {/* <Link to={`/user/${user._id}`}> */}
                                <Link to={"/users/profile/" + user._id}>
                                    {
                                        user.avatar ? 
                                        <img className={styles.resultsAvatar}  src={`${env.file_url}${user.avatar}`} />
                                        :
                                        <img style={{height: 50}}  src={profile} />
                                    }
                                    <p>{user.name}</p>
                                </Link>
                            </div>
                        )}
                        
                    </div>
                }
            </div>

            <div className={styles.navOptions}>
                <img className={styles.messageIcon} onClick={
                    () => {
                        auth.toggleMessageHide();
                    }
                } style={{height: 50}}  src={send} />
                <img onClick={() => toast.success('In progress')} style={{height: 40}}  src={notification} />
                {/* <img style={{height: 45}}  src={explore} /> */}
                <img style={{height: 28, width: 28}}  src={notification} />
                <Link onMouseOver={profileHover} onMouseLeave={profileLeave} className={styles.avatar} > <img className={styles.avatar}  src={profile} /> </Link> 

            </div>

            <div className={styles.smNavOptions}>
                <Link to='/messages'>
                    <img style={{height: 50, marginRight: -10}}  src={send} />
                </Link>

                
            </div>

            <div onMouseOver={profileHover} onMouseLeave={profileLeave} className={styles.navOptionsExpanded}>
                
                <div>
                    <p>{ auth.user ? auth.user.name : 'Sign In/Up to continue'}</p>
                </div>


                {auth.user ? (
                    <>
                    <Link className={styles.signInButton} to='/settings'> 
                            <FontAwesomeIcon className={styles.optionsIcon}  icon={faGear} />
                            <span> Settings &nbsp;</span>
                        </Link> 
                    <button onClick={auth.logout} className={styles.signOutButton}>
                        <FontAwesomeIcon className={styles.optionsIcon}  icon={faRightFromBracket} />
                        <span>Log Out &nbsp;</span>
                    </button>
                </>
                    
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
        
        </>
    )
}

export default Navbar;