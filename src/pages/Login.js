import { login } from '../api';
import { useState } from 'react';
import { useAuth } from '../hooks';

import styles from '../styles/css/login.module.css';

import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);
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

    return (
        <form className={styles.loginForm} onSubmit={handleSubmit}>
            <div className={styles.field}>
                <input type='email' 
                placeholder='Email'
                 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className={styles.field}>
                <input type='password' placeholder='Password'
                 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className={styles.field} >
                <button disabled={loggingIn}>
                    {loggingIn ? 'Logging in ...' : 'Log In'}
                </button>
            </div>

        </form>
    )
}

export default Login;