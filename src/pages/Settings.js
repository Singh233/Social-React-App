
import LoadingBar from 'react-top-loading-bar';
// Styles
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks';
import styles from '../styles/css/settings.module.css';


import { toast } from 'react-hot-toast';
import { faL } from '@fortawesome/free-solid-svg-icons';
import LeftNav from './home/LeftNav';

import coverImg from '../styles/img/cover.jpeg';
import avatar from '../styles/memojis/memo3.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartSimple } from '@fortawesome/free-solid-svg-icons';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';


const Settings = () => {
    const auth = useAuth();

    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState(auth.user ? auth.user.name : '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [saveForm, setSaveForm] = useState(false);



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
    



    return (
        <div className={styles.settingsContainer}>
            <LoadingBar color="#f11946" progress='100'  />

            <LeftNav />

            <div className={styles.profileContainer}>

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
                        <p className={styles.stat} >21</p>
                        <FontAwesomeIcon className={styles.icon}  icon={faChartLine} />

                    </div>

                    <div className={styles.following}>
                        <p className={styles.header}>Following</p>
                        <p className={styles.stat} >25</p>
                        <FontAwesomeIcon className={styles.icon}  icon={faChartSimple} />
                    </div>

                    <div className={styles.joined}>
                        <p className={styles.header}>Joined</p>
                        <p className={styles.stat} >1+</p>
                        <p className={styles.footer} >Years Ago</p>
                    </div>

                    <div className={styles.dob}>
                        <p className={styles.header}>Birthday</p>
                        <p className={styles.stat} >3 June</p>
                        <p className={styles.footer} >2000</p>

                    </div>
                </div>

                <div className={styles.postsContainer}>
                    <p>🛠️ Under progress...</p>
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