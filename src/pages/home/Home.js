import PropTypes from 'prop-types';

import styles from '../../styles/css/home/home.module.css';
import LeftNav from './LeftNav';
import RightNav from './RightNav';
import Main from './Main';

const Home = ({ posts }) => {


    return (
        <div className={styles.homeContainer}>

            <LeftNav/>

            <Main posts={posts}/>

            <RightNav/>
            
        </div>
    );
};

Home.propTypes = {
    posts: PropTypes.array.isRequired,
}

export default Home;