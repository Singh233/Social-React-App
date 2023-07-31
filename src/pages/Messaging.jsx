import React from 'react';

import styles from '../styles/css/messaging.module.scss';

// font awesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../hooks/useAuth.jsx';
import { Link } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import Chat from '../components/Chat';

export default function Messaging() {
  const auth = useAuth();

  return <Chat />;
}
