import * as React from 'react';
import styles from '@/styles/App.module.css';
import SectorSelect from './SectorSelect';
import DateSelect from './DateSelect';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

export default function TableWeightHeader({ updateTitle, updateDateCreated, updateSectorSelected }: any) {
    const [title, setTitle] = React.useState<String>('');

    const handleTitle = (value: String) => {
        updateTitle(value);
        setTitle(value);
    }

    return (
        <div className={styles.table_header_container}>
            <SectorSelect updateSectorSelected={updateSectorSelected}/>
            <DateSelect updateDateCreated={updateDateCreated}/>
            <Box className={styles.table_header_item}>
                <TextField 
                    id="outlined-basic" 
                    className={styles.table_header_item} 
                    label="TITULO" 
                    variant="outlined" 
                    value={title} 
                    onChange={(e: any) => handleTitle(e.target.value)} 
                />
            </Box>
        </div>
    
  );
}