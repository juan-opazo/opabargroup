import * as React from 'react';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import IosShareIcon from '@mui/icons-material/IosShare';
import SaveIcon from '@mui/icons-material/Save';
import styles from '@/styles/App.module.css';
import { useRouter } from 'next/router';

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

const TableWeightInput = ({ addNewRecord, data, title, dateCreated, sectorSelected, regWeightSelected }: any) => {
    const router = useRouter();
    const [weight, setWeight] = React.useState(null);
    const [box, setBox] = React.useState(null);
    const [error, setError] = React. useState(null);

    const createRegistrationWeight = async (payload: any) => {
        return fetch(`http://52.0.138.19:5005/api/registration-weight/registrationWeights/`, {
            method: "POST",
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}` 
            },
            body: JSON.stringify(payload),
        })
        .then(res => {
            return res.json()
            .then(data => {
                if (res.ok) {
                    console.log(data);
                    return data;
                } else {
                    console.error(data);
                    setError(data);
                }
            })
            .catch(err => {
                console.error(err);
                setError(err);
            });
        })
        .catch(err => {
            console.error(err);
            setError(err);
        });
    };
    
    const createRecordWeights = async (regWeight: any) => {
        console.warn(data);
        const data_not_saved = data.filter((ele: any) => ele.id === undefined);
        const payload = data_not_saved.map(
            (record: any) => ({
                item: record.item,
                amount: record.weight,
                box: record.box,
                registration: regWeight.id
            })
        );
        console.warn(payload);
        payload.forEach((ele: any) => {
            fetch(`http://52.0.138.19:5005/api/record-weight/recordWeights/`, {
                method: "POST",
                headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}` 
                },
                body: JSON.stringify(ele),
            })
            .then(res => {
                res.json()
                .then(result => {
                    if (res.ok) {
                        console.log(result);
                        if (!regWeightSelected) router.push(`/registros`);

                        data = data.map((ele: any) => ele.item === result.item ? {...ele, id: result.id} : ele);
                    } else {
                        console.error(result);
                        setError(result);
                    }
                })
                .catch(err => {
                    console.error(err);
                    setError(err);
                });
            })
            .catch(err => {
                console.error(err);
                setError(err);
            });
        });
    }

    const handleAddButton = () => {
        if (weight === null || box === null) return;
        addNewRecord(Number(weight), Number(box));
    }

    const handleSaveButton = async () => {
        if (regWeightSelected) {
            console.warn(regWeightSelected);
            createRecordWeights(regWeightSelected);
            return;
        }

        const registrationWeight = await createRegistrationWeight({
            date_created: dateCreated,
            name: title,
            sector: sectorSelected,
        });
        console.warn(registrationWeight);
        if (data.length === 0) router.push(`/registros`);
        
        if(!error) {
            createRecordWeights(registrationWeight);
        }
    }

    const handleExportButton = () => {
        console.log("exporting...");
        exportDataToExcel(data);
    }

    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1 },
            }}
            noValidate
            autoComplete="off"
            className={styles.input_container}
        >
            <div className={styles.input_text_fields_container}>
                <TextField id="outlined-basic" style={{'padding': '0.5em'}} label="PESO" variant="outlined" value={weight} onChange={(e: any) => setWeight(e.target.value)} />
                <TextField id="outlined-basic" style={{'padding': '0.5em'}} label="malla/caja" variant="outlined" value={box} onChange={(e: any) => setBox(e.target.value)} />
            </div>

            <div className={styles.input_buttons_container}>
                <Button sx={{ margin: '1em' }} className={styles.add_row_button} onClick={handleAddButton} variant="contained" size="large"><AddIcon /></Button>
                <Button sx={{ margin: '1em' }} className={styles.save_row_button} onClick={handleSaveButton} color="error" variant="contained" size="large" ><SaveIcon /></Button>
                <Button sx={{ margin: '1em' }} className={styles.export_button} onClick={handleExportButton} color="success" variant="contained" size="large" ><IosShareIcon /></Button>    
            </div>    
            
        </Box>
    );
}

export default TableWeightInput;