import PropTypes from 'prop-types';

import { Loader } from '../../components';

import styles from '../../styles/css/home/home.module.css';
import LeftNav from './LeftNav';
import RightNav from './RightNav';
import Main from './Main';
import { useAuth, usePosts } from '../../hooks';

const Home = () => {

    const auth = useAuth();
    const posts = usePosts();


    

    if (posts.loading) {
        return <Loader/>
    }

    

    return (
        <div className={styles.homeContainer}>

            <LeftNav/>

            <Main posts={posts.data}/>

            <RightNav/>
            
        </div>
    );
};


export default Home;