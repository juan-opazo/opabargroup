import * as React from 'react';
import RegistrationWeights from '@/components/RegistrationWeights';
import styles from '@/styles/App.module.css';


const RegistrationWeightsPage = () => {
    return (
        <div className={styles.container}>
            <RegistrationWeights/>
        </div>
    )
}

export default RegistrationWeightsPage;