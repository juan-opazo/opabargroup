import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { FormControl, FormHelperText, Input, InputLabel, TextField } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useForm, SubmitHandler } from "react-hook-form";
import SaveIcon from '@mui/icons-material/Save';
import styles from '@/styles/App.module.css';
import { useRouter } from 'next/router';


type Inputs = {
  name: string,
  area: number,
  crop: string,
};

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#fafafa',
  boxShadow: 24,
  p: 4,
  borderRadius: '4px',
  color: '#0f0f0f'
};

export default function SectorForm({ btnTitle }: any) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [cropSelected, setCropSelected] = React.useState('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = data => createSector(data);

  const handleChange = (event: SelectChangeEvent) => {
    setCropSelected(event.target.value as string);
  };

  const createSector = async (payload: any) => {
    payload.area = String(payload.area);
    payload.crop = cropSelected;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/sector/sectors/`, {
        method: "POST",
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (res.ok) {
      router.push(`/sectores`);
      handleClose();
    } else {
        console.error(result);
    }
  }

  return (
    <div>
      <Button onClick={handleOpen}>{btnTitle}</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField 
            sx={{ margin: '1em' }} 
            type="text" 
            {...register("name", {required: true, maxLength: 80})} 
            label="Nombre" 
            variant="outlined"
          />
          <TextField 
            sx={{ margin: '1em' }} 
            type="number" 
            {...register("area", {required: true})} 
            label="Área" 
            variant="outlined" 
          />
          <div>
            <Select
              sx={{ margin: '1em' }} 
              value={cropSelected}
              label="Cultivo"
              onChange={handleChange}
            >
              <MenuItem value="PASS">Maracuyá</MenuItem>
              <MenuItem value="MANG">Mango</MenuItem>
            </Select>
          </div>
          <Button 
            type="submit"
            sx={{ margin: '1em' }} 
            className={styles.save_row_button} 
            color="error" 
            variant="contained" 
            size="large" 
          >
            <SaveIcon />
          </Button>
        </form>
        </Box>
      </Modal>
    </div>
  );
}