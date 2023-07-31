import React from 'react';

import styles from '../styles/css/search.module.scss';

// FAS Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faAt } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faCloud } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { searchUsers } from '../api';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { Link } from 'react-router-dom';

import profile from '../styles/memojis/memo3.png';
import toast from 'react-hot-toast';

export default function Search() {
  const [results, setResults] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [cancelIcon, setCancelIcon] = useState(false);

  const auth = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await searchUsers(searchText);

      if (response.success) {
        // filter out the current user
        const filteredUsers = response.data.users.filter(
          (user) => user._id !== auth.user._id
        );
        setResults(filteredUsers);

        if (response.data.users.length === 0) {
          toast.error('No users found', {
            position: 'bottom-center',
          });
        }
      } else {
        toast.error('Something went wrong');
      }
    };

    if (searchText.length > 0) {
      fetchUsers();
      setCancelIcon(true);
    } else {
      setResults([]);
      setCancelIcon(false);
    }
  }, [searchText]);

  return (
    <div className={styles.searchContainer}>
      <div className={styles.header}>
        <FontAwesomeIcon
          className={styles.searchIcon}
          icon={faMagnifyingGlass}
        />
        <input
          placeholder="Explore"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          // on escape key press clear the search text
          onKeyPress={(e) => e.key === 'Escape' && setSearchText('')}
        />

        <p onClick={() => setSearchText('')} className={styles.cancelButton}>
          Cancel
        </p>
      </div>

      {results.length > 0 ? (
        <div className={`${styles.results} animate__animated animate__fadeIn`}>
          {results.map((user, index) => (
            <div
              key={index}
              className={`${styles.result} animate__animated animate__fadeIn`}
            >
              {/* <Link to={`/user/${user._id}`}> */}
              <Link to={'/users/profile/' + user._id}>
                <img className={styles.resultsAvatar} src={profile} />
                <p>{user.name}</p>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noResults}>
          <FontAwesomeIcon
            className={styles.searchIcon}
            icon={faMagnifyingGlass}
          />
          <p>Search for users</p>
        </div>
      )}
    </div>
  );
}
