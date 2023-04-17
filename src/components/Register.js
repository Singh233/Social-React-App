import { login } from '../api';
import { useState } from 'react';
import { useAuth } from '../hooks';
import { useNavigate } from 'react-router-dom';

import styles from '../styles/css/login.module.css';
// icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faUser } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';

import { toast } from 'react-hot-toast';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [signingUp, setSigningUp] = useState(false);
    const auth = useAuth();
    const navigate = useNavigate();


    const handleSubmit = async(e) => {
        e.preventDefault();

        setSigningUp(true);
        
        if (!email || !password || !name || !confirmPassword) {
            setSigningUp(false);
            return toast.error("Please fill all the fields!");
        }

        if (password !== confirmPassword) {
            setSigningUp(false);
            return toast.error("Passwords doesn't match!");
        }

        toast.loading('Signing Up...' , {
            duration: 700,
        });

        setTimeout( async () => {

            const response = await auth.signUp(name, email, password, confirmPassword);
            // const response = await toast.promise(auth.signUp(name, email, password, confirmPassword), {
            //     loading: 'Signing Up...',
            //     success: 'Sign Up Successfull!',
            //     error: 'Account already exists!'
            // });
            setSigningUp(false);

            if (response.success) {
                navigate('/');
                return toast.success("Sign Up Successfull!");
            } else {
                setSigningUp(false);

                return toast.error(response.message);
            }
        }, 700);

    }

    if (auth.user) {
        navigate('/');
    }
    return (
        <form className={`${styles.loginForm} animate__animated animate__fadeIn`} onSubmit={handleSubmit}>
            <div className={styles.field}>
                <FontAwesomeIcon className={styles.inputIcon} icon={faUser} /> 
                <input type='text' 
                placeholder='Name'
                 
                value={name} 
                onChange={(e) => setName(e.target.value)} />
            </div>
            <div className={styles.field}>
                <FontAwesomeIcon className={styles.inputIcon} icon={faEnvelope} /> 

                <input type='email' 
                placeholder='Email'
                 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className={styles.field}>
                <FontAwesomeIcon className={styles.inputIcon} icon={faLock} /> 
                <input type='password' placeholder='Password'
                 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className={styles.field}>
                <FontAwesomeIcon className={styles.inputIcon} icon={faLock} /> 
                <input type='password' placeholder='Confirm Password'
                 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>

            <div className={styles.field} >
                
                <button className={styles.loginButton} disabled={signingUp}>
                    {signingUp ? 'Signing Up ...' : 'Sign Up'}
                    <div className={styles.arrowWrapper}>
                        <div className={styles.arrow}></div>
                    </div>
                </button>
            </div>

        </form>
    )
}

export default Register;