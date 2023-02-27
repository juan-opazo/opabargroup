import * as React from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import styles from '@/styles/App.module.css';


const TableWeightInput = ({ addNewRecord }: any) => {
    const [weight, setWeight] = React.useState(null);
    const [box, setBox] = React.useState(null);

    const handleAddButton = () => {
        if (weight === null || box === null) return;
        addNewRecord(Number(weight), Number(box));
    }
    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
            className={styles.input_container}>

            <TextField id="outlined-basic" label="PESO" variant="outlined" value={weight} onChange={(e: any) => setWeight(e.target.value)} />
            <TextField id="outlined-basic" label="malla/caja" variant="outlined" value={box} onChange={(e: any) => setBox(e.target.value)} />
            <Button onClick={handleAddButton} variant="contained" endIcon={<AddIcon />}></Button>
        </Box>
    );
}

export default TableWeightInput;