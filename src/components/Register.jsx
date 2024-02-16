import { login } from '../api';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';

import styles from '../styles/css/login.module.css';
// icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faUser } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';

import { Button } from '@mui/joy';
import { ArrowForward } from '@mui/icons-material';
import { toast } from 'sonner';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signingUp, setSigningUp] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSigningUp(true);

    if (!email || !password || !name || !confirmPassword) {
      setSigningUp(false);
      return toast.warning('Please fill all the fields!');
    }

    if (password !== confirmPassword) {
      setSigningUp(false);
      return toast.warning("Passwords doesn't match!");
    }

    const toastId = toast.loading('Signing Up...');

    setTimeout(async () => {
      const response = await auth.signUp(
        name,
        email,
        password,
        confirmPassword
      );
      setSigningUp(false);

      if (response.success) {
        navigate('/');
        return toast.success('Sign Up Successfull!', {
          id: toastId,
        });
      } else {
        setSigningUp(false);

        return toast.error("User already exists!", {
          id: toastId,
        });
      }
    }, 700);
  };

  if (auth.user) {
    navigate('/');
  }
  return (
    <form
      className={`${styles.loginForm} animate__animated animate__fadeIn`}
      onSubmit={handleSubmit}
    >
      <div className={styles.field}>
        <FontAwesomeIcon className={styles.inputIcon} icon={faUser} />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <FontAwesomeIcon className={styles.inputIcon} icon={faEnvelope} />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <FontAwesomeIcon className={styles.inputIcon} icon={faLock} />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <FontAwesomeIcon className={styles.inputIcon} icon={faLock} />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <Button
          loading={signingUp}
          loadingPosition="end"
          onClick={handleSubmit}
          endDecorator={<ArrowForward />}
          size="md"
          variant="solid"
          style={{ margin: 10, borderRadius: 20 }}
        >
          Sign Up
        </Button>
      </div>
    </form>
  );
};

export default Register;
