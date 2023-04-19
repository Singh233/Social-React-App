import { login } from '../api';
import { useState } from 'react';
import { useAuth } from '../hooks';
import { useEffect, useRef } from 'react';

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
import Register from './Register';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);
    const [withEmail, setWithEmail] = useState(false);
    const [register, setRegister] = useState(false);
    const auth = useAuth();
    const navigate = useNavigate();

    const [response, setResponse] = useState(null);

    useEffect(() => {
        if (response) {
            handleGoogleLogin(response, 'login');
        }

    }, [response]);


    const handleSubmit = async(e) => {
        e.preventDefault();

        setLoggingIn(true);
        if (!email || !password) {
            setLoggingIn(false);
            return toast.error("Please enter both email and password!");
        }

        const response = await auth.login(email, password);

        if (response.success) {
            // console.log(auth);
            setLoggingIn(false);
            navigate('/');
            return toast.success("Successfully logged in!");
        } else {
            return toast.error(response.message);
        }
    }

    const handleGoogleLogin = async (cred, type) => {


        toast.loading(type == 'login' ? 'Signing In...' : 'Signing Up...' , {
            duration: 700,
        });

        

            const token = cred.credential;
            const response = await auth.googleLogin(token);

            if (response.success) {
                navigate('/');
                if (type == 'login') {
                    return toast.success("Sign In Successfull!");
                } else {
                    return toast.success("Sign Up Successfull!");
                }
            } else {
                return toast.error(response.message);
            }
        
    }

    if (auth.user) {
        navigate('/');
    }

    

    return (
        <div className={`${styles.container} ${withEmail ? styles.animateForEmail : ''} ${register ? styles.animateForRegister : ''}`} >
            <img className={styles.avatar}  src={profile} />
            
            
            
                {/* <img onClick={handleGoogleLogin} className={styles.socialIcons}  src={google} /> */}
                {
                    !register ? (
                        <>
                        <p className={`${styles.welcomeText} animate__animated animate__fadeIn`}>Welcome Back!</p>
                        <p> <span> Sign in to continue </span> </p>
                        <div className={styles.signInOptions}>
                            <GoogleLogin
                                onSuccess={response => {
                                    setResponse(response);
                                }}
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                                theme="filled_blue"
                                size="large"
                                text='Sign in with Google'
                                shape='pill'
                                
                            />
                        </div>
                        </>
                        
                    ) : (
                        <>
                        <p className={`${styles.welcomeText} animate__animated animate__fadeIn`}>Ready to board?</p>
                        <p> <span> One click sign up with Google. </span> </p>
                        <div className={styles.signInOptions}>
                            <GoogleLogin
                                onSuccess={response => {
                                    // handleGoogleLogin(response , 'register');

                                }}
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                                theme="filled_blue"
                                size="large"
                                text='continue_with'
                                shape='pill'
                                type='standard'
                                
                                
                            />
                        </div>
                        </>
                    )


                }
                

                {/* <img className={styles.socialIcons}  src={apple} />
                <img className={styles.socialIcons}  src={fb} /> */}
                
           
            
            <p className={styles.or} onClick={() => setWithEmail(false)}>or Continue using</p>

            {
                withEmail && !register ? (
                    <>
                    
                    <form className={`animate__animated animate__fadeIn ${styles.loginForm}`} onSubmit={handleSubmit}>
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
                    <p className={`animate__animated ${withEmail ? 'animate__fadeInDown' : ''} ${styles.signUpLink}`}>Don't have an account? &nbsp; <span onClick={(e) => setRegister(!register)} >Sign Up here</span> </p>

                    </>
                ) : !register && (
                    <>
                        <p onClick={() => setWithEmail(true)} className={`animate__animated ${withEmail ? 'animate__slideOutDown' : ''} ${styles.emailOption}`}> 
                                                <FontAwesomeIcon className={styles.emailIcon} icon={faEnvelope} /> 
                                                Sign in with Email
                                            </p>
                        <p className={`animate__animated ${withEmail ? 'animate__fadeInDown' : ''} ${styles.signUpLink}`}>Don't have an account? &nbsp; <span onClick={(e) => setRegister(!register)}>Sign Up here</span> </p>

                    </>
                    
                )
            }

            {
                register && (
                    <>
                        <Register />
                        <p className={`animate__animated ${withEmail ? 'animate__fadeInDown' : ''} ${styles.signUpLink}`}>Already have an account? &nbsp; <span onClick={(e) => setRegister(!register)} style={{color: '#1B90FF'}}>Sign In here</span> </p>
                    </>
                )
            }
            
            

            {/* <div className={styles.signInOptions}>
                <img className={styles.otherIcons}  src={mail} />
                <img className={styles.otherIcons}  src={phone} />
            </div> */}


        </div>
        
    )
}

export default Login;