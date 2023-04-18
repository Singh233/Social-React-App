import React from 'react'

import styles from '../styles/css/messaging.module.scss'

// font awesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../hooks'
import { Link } from 'react-router-dom'
import LoadingBar from 'react-top-loading-bar'


export default function Messaging() {
    const auth = useAuth();


    return (
        <div className={styles.chatContainer}>
            <LoadingBar color="#f11946" progress="100" />
            <div className={styles.heading}>
                <Link to="/">
                    <FontAwesomeIcon icon={faChevronLeft} />
                </Link>
                <p>{auth.user.name}</p>
            </div>

                🛠️Direct Messaging in progress!
        </div>
    )
}
