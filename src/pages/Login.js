import { login } from '../api';
import { useState } from 'react';
import styles from '../styles/css/login.module.css';

import { toast } from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);
    
    const handleSubmit = async(e) => {
        e.preventDefault();

        setLoggingIn(true);
        if (!email || !password) {
            return toast.error("Please enter both email and password!");
        }

        const response = await login(email, password);

        if (response.success) {
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