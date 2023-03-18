import * as React from 'react';
import RegistrationWeights from '@/components/RegistrationWeights';
import styles from '@/styles/App.module.css';
import Navbar from '@/components/Navbar';


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

export default RegistrationWeightsPage;