import PropTypes from 'prop-types';

import styles from '../../styles/css/home/main.module.css';


import { onHover } from '../../styles/js/main.js';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CreatePost, Post } from '../../components';
import toast from 'react-hot-toast';





const Main = ({posts}) => {

    

    return (


        <div className={styles.container}>
            <CreatePost />
        {posts.map((post, index) => (
            <Post post={post} key={`post-${post._id}`}/>
        ))}
            
            
        </div>
    );
};

Main.propTypes = {
    posts: PropTypes.array.isRequired,
}



export default Main;