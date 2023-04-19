
import LoadingBar from 'react-top-loading-bar';
// Styles
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks';
import styles from '../styles/css/settings.module.css';

import env from '../utils/env';

import { toast } from 'react-hot-toast';
import { faL } from '@fortawesome/free-solid-svg-icons';
import LeftNav from './home/LeftNav';

import coverImg from '../styles/img/dummy.jpeg';
import settingsIcon from '../styles/icon/setting.png';
import avatar from '../styles/memojis/memo3.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartSimple } from '@fortawesome/free-solid-svg-icons';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { faClone } from '@fortawesome/free-solid-svg-icons';
import { faClapperboard } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';


const Settings = () => {
    const auth = useAuth();
    // console.log('auth.user', auth)

    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState(auth.user ? auth.user.name : '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [saveForm, setSaveForm] = useState(false);
    // console.log(auth.user);

    useEffect(() => {
        const handleScroll = event => {
            if (window.scrollY <= 50) {
                const div = document.getElementsByClassName(`${styles.smHeader}`)[0];
                div.style.backgroundColor = 'rgba(0, 0, 0, 0.100)';
            } else {
                const div = document.getElementsByClassName(`${styles.smHeader}`)[0];
                div.style.backgroundColor = '#0F1216';
            }
            
        };
    
        window.addEventListener('scroll', handleScroll);
        
    
        return () => {
            window.removeEventListener('scroll', handleScroll);
            // toast.success('More Updates Coming Soon');
        };
    }, []);

    


    const clearForm = () => {
        setPassword('');
        setConfirmPassword('');
    }

    const updateProfile = async () => {
        setSaveForm(true);

        let error = false;
        if (!name || !password || !confirmPassword) {
            error = true;
            toast.error("Please fill in all the details!");
        }

        if (password !== confirmPassword) {
            error = true;
            toast.error('Password does not match');
        }

        if (error) {
            setSaveForm(false);
            return;
        }

        const response = await auth.updateUser(auth.user._id, name, password, confirmPassword);

        if (response.success) {
            setEditMode(false);
            setSaveForm(false);
            clearForm();
            return toast.success('Profile updated successfully');
        } else {
            setEditMode(false);
            setSaveForm(false);
            return toast.error(response.message);
        }


    }

    const extendHeader = () => {
        // const div = document.getElementsByClassName(`${styles.smHeader}`)[0];
        // div.style.height = '100px';
    }
    



    return (
        <div className={styles.settingsContainer}>
            <LoadingBar color="#f11946" progress='100'  />

            <LeftNav />

            <div className={styles.profileContainer}>


                <div className={styles.smHeader}>
                    <img className={styles.avatar} src={avatar} />
                    <div className={styles.otherAccounts} >
                        <FontAwesomeIcon onClick={extendHeader} className={styles.arrowDown}  icon={faChevronDown} />
                        <p className={styles.userName}>{auth.user.name}</p>
                    </div>

                    
                    {/* <img className={styles.settingsIcon} src={settingsIcon} /> */}
                    
                    <FontAwesomeIcon onClick={auth.logout} className={styles.icon}  icon={faRightFromBracket} />

                </div>


                <div className={styles.coverImg}>
                </div>

                <div className={styles.profileDetail}>
                    <img className={styles.avatar} src={avatar} />
                    <p className={styles.userName}>{auth.user.name}</p>
                    <p className={styles.bio}>Hi this is sample about🔥 Professional Cake Cutter</p>
                    <div className={styles.buttons}>
                        <button>Edit Profile</button>
                    </div>
                    
                    
                </div>

                <div className={styles.stats}>
                    <div className={styles.followers}>
                        <p className={styles.header}>Followers</p>
                        <p className={styles.stat} >{auth.user.followers.length}</p>
                        <FontAwesomeIcon className={styles.icon}  icon={faChartLine} />
                    </div>

                    <div className={styles.border}></div>

                    <div className={styles.following}>
                        <p className={styles.header}>Following</p>
                        <p className={styles.stat} >{auth.user.following.length}</p>
                        <FontAwesomeIcon className={styles.icon}  icon={faChartSimple} />
                    </div>

                    <div className={styles.border}></div>

                    <div className={styles.joined}>
                        <p className={styles.header}>Joined</p>
                        <p className={styles.stat} >1+</p>
                        <p className={styles.footer} >Years Ago</p>
                    </div>

                    <div className={styles.border}></div>

                    <div className={styles.dob}>
                        <p className={styles.header}>Birthday</p>
                        <p className={styles.stat} >3 June</p>
                        <p className={styles.footer} >2000</p>

                    </div>
                </div>

                <div className={styles.postsContainer}>
                    <div className={styles.header} >
                        <div className={styles.heading1}>
                            <FontAwesomeIcon className={styles.imgIcon}  icon={faClone} />
                            <p >Posts</p>
                        </div>

                        <div className={styles.heading2}>
                            <FontAwesomeIcon className={styles.videoIcon}  icon={faClapperboard} />
                            <p >Videos</p>
                        </div>

                        <div className={styles.heading3}>
                            <FontAwesomeIcon className={styles.bookmarkIcon}  icon={faBookmark}  />
                            <p >Saved</p>
                        </div>
                    </div>

                    <div className={styles.posts}>

                        {
                            auth.user.posts.map(post => {
                                return (
                                    <div className={styles.post} key={post._id}>
                                        <img src={env.file_url + post.myfile} />
                                    </div>
                                )
                            })
                        }
                    </div>
            

                </div>

            
                

                {/* <div className={styles.field}>

                    <div className={styles.fieldName}>Email</div>
                    <div className={styles.fieldValue}>{auth.user?.email}</div>

                </div>

                { editMode ? 
                    <>
                        <div className={styles.field}>

                            <div className={styles.fieldName}>Name</div>
                            <input type='text' 
                                value={name} 
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                            />

                        </div>
                        <div className={styles.field}>

                            <div className={styles.fieldName}>Password</div>
                            <input type='password' 
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                            />    

                        </div>

                        <div className={styles.field}>

                            <div className={styles.fieldName}>Confirm Password</div>
                            <input type='password' 
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                }}
                            />

                        </div>
                    </>
                    :
                    <div className={styles.field}>

                        <div className={styles.fieldName}>Name</div>
                        <div className={styles.fieldValue}>{auth.user?.name}</div>

                    </div>
                }

                

                

                <div className={styles.btnGroup}>
                    { editMode ? 
                    <>
                        <button onClick={updateProfile} className={styles.editButton} disabled={saveForm}> 
                            {saveForm ? 'Updating profile' : 'Update Profile'}
                        </button>
                        <p onClick={() => setEditMode(false)}>Go back</p>
                    </>
                    :
                    <button onClick={() => setEditMode(true)} className={styles.editButton}> Edit Profile</button>
                    }
                </div> */}
            </div>
        </div>
        
    )
}


export default Settings;