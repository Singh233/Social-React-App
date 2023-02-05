import PropTypes from 'prop-types';

import styles from '../../styles/css/home/leftnav.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faChartSimple } from '@fortawesome/free-solid-svg-icons';


const LeftNav = () => {


    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <p> Trending Now</p>
                <FontAwesomeIcon className={styles.icon}  icon={faGear} />

            </div>

            <div className={styles.content}>

            </div>
        </div>
    );
};


export default LeftNav;