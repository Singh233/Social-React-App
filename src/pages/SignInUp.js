import PropTypes from 'prop-types';
import { Loader, Login, Register } from '../components';
import styles from '../styles/css/signinup.module.css';
import { useEffect, useRef, useState } from 'react';


const SignInUp = () => {



    return (
        <div className={styles.container}>
            <div className={styles.loginContainer} >
                <Login />
            </div>
            
        </div>
        
    );
};


export default SignInUp;