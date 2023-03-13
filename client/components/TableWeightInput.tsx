import * as React from 'react';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import IosShareIcon from '@mui/icons-material/IosShare';
import styles from '@/styles/App.module.css';

interface Record {
    item: number;
    weight: number;
    box: number;
}

const exportDataToExcel = (data: Record[]) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    const fileName = 'my-data.xlsx';
    saveAs(new Blob([excelBuffer]), fileName);
  }  

const TableWeightInput = ({ addNewRecord, data }: any) => {
    const [weight, setWeight] = React.useState(null);
    const [box, setBox] = React.useState(null);

    const handleAddButton = () => {
        if (weight === null || box === null) return;
        addNewRecord(Number(weight), Number(box));
    }

    const handleExportButton = () => {
        console.log("exporting...");
        exportDataToExcel(data);
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
            <Button onClick={handleExportButton} color="success" variant="contained" endIcon={<IosShareIcon />}></Button>
        </Box>
    );
}

export default TableWeightInput;