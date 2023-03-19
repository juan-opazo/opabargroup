import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
import styles from '@/styles/App.module.css';


export default function DateSelect({ updateDateCreated }: any) {
    const [value, setValue] = React.useState<Dayjs | null>(null);
    const handleDateSelected = (value: Dayjs) => {
        updateDateCreated(value.format('YYYY-MM-DD'));
        setValue(value);
    }
    return (
        <Box className={styles.table_header_item}>
            <LocalizationProvider 
                dateAdapter={AdapterDayjs} 
                className={styles.table_header_item}
            >
                    <DatePicker 
                        label="Basic date picker" 
                        value={value}
                        onChange={(newValue: any) => handleDateSelected(newValue)}
                    />
            </LocalizationProvider>
        </Box>
    );
}