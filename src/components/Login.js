import { login } from '../api';
import { useState } from 'react';
import { useAuth } from '../hooks';

import styles from '../styles/css/login.module.css';
import 'animate.css';
// images 
import profile from '../styles/memojis/memo3.png';
import google from '../styles/icon/google.png';
import apple from '../styles/icon/apple.png';
import fb from '../styles/icon/facebook4.png';
import mail from '../styles/icon/mail.png';
import phone from '../styles/icon/phone.png';


// icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';

import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);
    const [withEmail, setWithEmail] = useState(false);
    const auth = useAuth();
    const navigate = useNavigate();


    const handleSubmit = async(e) => {
        e.preventDefault();

        setLoggingIn(true);
        if (!email || !password) {
            setLoggingIn(false);
            return toast.error("Please enter both email and password!");
        }

        const response = await auth.login(email, password);

        if (response.success) {
            console.log(auth);
            setLoggingIn(false);
            navigate('/');
            return toast.success("Successfully logged in!");
        } else {
            return toast.error(response.message);
        }
    }

    if (auth.user) {
        navigate('/');
    }

    

    return (
        <div className={styles.container}>
            <img className={styles.avatar}  src={profile} />
            <p className={styles.welcomeText}>Welcome Back!</p>
            <p> <span> Sign in to continue </span> </p>
            
            <div className={styles.signInOptions}>
                <img className={styles.socialIcons}  src={google} />
                <img className={styles.socialIcons}  src={apple} />
                <img className={styles.socialIcons}  src={fb} />
                
            </div>
            
            <p onClick={() => setWithEmail(false)}>or Continue using</p>

            {
                withEmail ? (
                    <>
                    
                    <form className={`animate__animated animate__fadeInDown ${styles.loginForm}`} onSubmit={handleSubmit}>
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

                        <div className={styles.field} >
                            <button className={styles.loginButton} disabled={loggingIn}>
                                {loggingIn ? 'Logging in ...' : 'Sign in'}
                                <div className={styles.arrowWrapper}>
                                    <div className={styles.arrow}></div>
                                </div>
                            </button>
                        </div>

                    </form>
                   
                    </>
                ) : (
                    <p onClick={() => setWithEmail(true)} className={`animate__animated ${withEmail ? 'animate__slideOutDown' : ''} ${styles.emailOption}`}> 
                        <FontAwesomeIcon className={styles.emailIcon} icon={faEnvelope} /> 
                        Sign in with Email
                    </p>
                )
            }
            
            

            {/* <div className={styles.signInOptions}>
                <img className={styles.otherIcons}  src={mail} />
                <img className={styles.otherIcons}  src={phone} />
            </div> */}


            <p className={`animate__animated ${withEmail ? 'animate__fadeInDown' : ''} ${styles.signUpLink}`}>Don't have an account? &nbsp; <span style={{color: '#1B90FF'}}>Sign Up here</span> </p>
        </div>
        
    )
}

export default Login;