import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import styles from '@/styles/App.module.css';
import { apiUtils } from '@/utils/apiUtils';


interface Sector {
    id: number;
    name: string;
    crop: string;
    area: number;
  }

export default function SectorSelect({ updateSectorSelected }: any) {
  const [sectors, setSectors] = React.useState<Sector[]>([]);
  const [sectorSelected, setSectorSelected] = React.useState('');

  React.useEffect(() => {
    getSectors();
  }, []);

  const getSectors = async () => {
    const data = await apiUtils.getSectors();
    setSectors([...data]);
  };

  const handleChange = (event: SelectChangeEvent) => {
      console.log(event.target.value);
      updateSectorSelected(event.target.value);
      setSectorSelected(event.target.value as string);
  };

  const generateSectorItems = () => {
      return sectors.map((sector: Sector) => 
          <MenuItem key={sector.id} value={sector.id}>{sector.name}</MenuItem>
      );
  };

  return (
    <Box sx={{ minWidth: 120 }} className={styles.table_header_item}>
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