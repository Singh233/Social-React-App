

// Styles
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks';
import styles from '../styles/css/settings.module.css';


import { toast } from 'react-hot-toast';
import { faL } from '@fortawesome/free-solid-svg-icons';


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
        <div>
            Settings
            <div className={styles.profileImg}>

            </div>

            <div className={styles.field}>

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
            </div>
        </div>
    )
}


export default Settings;