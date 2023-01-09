import { login } from '../api';
import { useState } from 'react';
import { useAuth } from '../hooks';
import { useNavigate } from 'react-router-dom';

import styles from '../styles/css/login.module.css';

import { toast } from 'react-hot-toast';

const SignUp = () => {
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
            return toast.error("Please enter both email and password!");
        }

        if (password !== confirmPassword) {
            setSigningUp(false);
            return toast.error("Passwords doesn't match!");
        }

        const response = await auth.signUp(name, email, password, confirmPassword);
        setSigningUp(false);
        if (response.success) {
            navigate('/');
            return toast.success("Account created successfully!");
        } else {
            return toast.error(response.message);
        }
    }

    return (
        <form className={styles.loginForm} onSubmit={handleSubmit}>
            Register page
            <div className={styles.field}>
                <input type='text' 
                placeholder='Name'
                 
                value={name} 
                onChange={(e) => setName(e.target.value)} />
            </div>
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

            <div className={styles.field}>
                <input type='password' placeholder='Confirm Password'
                 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>

            <div className={styles.field} >
                <button disabled={signingUp}>
                    {signingUp ? 'Signing Un ...' : 'Sign Up'}
                </button>
            </div>

        </form>
    )
}

export default SignUp;