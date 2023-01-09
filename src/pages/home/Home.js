import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { getPosts } from '../../api';
import { Loader } from '../../components';

import styles from '../../styles/css/home/home.module.css';
import LeftNav from './LeftNav';
import RightNav from './RightNav';
import Main from './Main';

const Home = () => {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
        const response = await getPosts();
        console.log('response', response);

        if (response.success) {
            setPosts(response.data.posts);
        }
        setLoading(false);
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <Loader/>
    }

    return (
        <div className={styles.homeContainer}>

            <LeftNav/>

            <Main posts={posts}/>

            <RightNav/>
            
        </div>
    );
};


export default Home;