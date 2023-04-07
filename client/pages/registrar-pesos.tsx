import * as React from 'react';
import RegistrationWeights from '@/components/RegistrationWeights';
import styles from '@/styles/App.module.css';
import Navbar from '@/components/Navbar';
import withAuth from '@/hocs/withAuth';


const RegistrationWeightsPage = () => {
    return (
        <>
            <Navbar/>
            <div className={styles.container}>
                <RegistrationWeights/>
            </div>
        </>
    )
}

export default withAuth(RegistrationWeightsPage);