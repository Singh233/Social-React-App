import { useLocation, useParams, useNavigate } from 'react-router-dom';
// Styles
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks';
import styles from '../styles/css/settings.module.css';


import { toast } from 'react-hot-toast';
import { faL, faUnderline } from '@fortawesome/free-solid-svg-icons';
import { fetchUserProfile } from '../api';
import { Loader } from '../components';


const UserProfile = () => {
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(true);
    const {userId} = useParams();
    const navigate = useNavigate();
    const auth = useAuth();

    console.log('User Id', userId);

    useEffect(() => {
        const getuser = async () => {
            const response = await fetchUserProfile(userId);
            if (response.success) {
                setLoading(false);
                setUser(response.data.user);
            } else {
                setLoading(false);
                toast.error(response.message);
                return navigate('/');
            }

            
        }

        getuser();
    }, [userId]);

    if (loading) {
        return <Loader />
    }

    const checkIfUserIsAFriend = () => {
        
        const friends = auth.user.friends;

        if (friends === undefined) {
            return false;
        }
        const friendsId = friends.map(friend => friend.to_user._id);
        const index = friendsId.indexOf(userId);


        if (index !== -1) {
            return true;
        }

        return false;

    }


    



    



    return (
        <div>
            Settings
            <div className={styles.profileImg}>

            </div>

            <div className={styles.field}>

                <div className={styles.fieldName}>Email</div>
                <div className={styles.fieldValue}>{user.email}</div>

            </div>

            <div className={styles.field}>

                <div className={styles.fieldName}>Name</div>
                <div className={styles.fieldValue}>{user.name}</div>


            </div>

            <div className={styles.btnGroup}>
                {checkIfUserIsAFriend() ? ( <button>Remove friend</button>)
                : (<button>Add friend</button>)
                }
                
                
            </div>
        </div>
    )
}


export default UserProfile;