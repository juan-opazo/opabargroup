import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import styles from '@/styles/App.module.css';

interface Sector {
    id: number;
    name: string;
    crop: string;
    area: number;
  }

  const getSectors = async (setSectors: any) => {
    fetch(`http://localhost:5005/api/sector/sectors/`, {
      method: "GET",
      headers: { 
        'Accept': 'application/json',
        'Authorization': 'Token 49516f48f7f6645b11ff98d9d85aa4df7f88311a' 
      },
    })
    .then(res => {
      res.json()
      .then(data => {
        if (res.ok) {
        //   console.log(data);
          setSectors([...data]);
        } else {
          console.error(data);
        }

      })
      .catch(err => {
        console.error(err);
      });
    })
    .catch(err => console.error(err));
  };

export default function SectorSelect() {
    const [sectors, setSectors] = React.useState([]);
    const [sectorSelected, setSectorSelected] = React.useState('');

    getSectors(setSectors);

    const handleChange = (event: SelectChangeEvent) => {
        console.log(event.target.value);
        setSectorSelected(event.target.value as string);
    };

    const generateSectorItems = () => {
        return sectors.map((sector: Sector) => 
            <MenuItem key={sector.id} value={sector.id}>{sector.name}</MenuItem>
        );
    };

    return (
        <Box sx={{ minWidth: 120 }} className={styles.sector_select}>
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Sector</InputLabel>
            <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={sectorSelected}
            label="Sector"
            onChange={handleChange}
            >
                {generateSectorItems()}
            </Select>
        </FormControl>
        </Box>
    );
}