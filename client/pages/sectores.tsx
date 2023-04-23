import * as React from 'react';
import styles from '@/styles/App.module.css';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import Navbar from '@/components/Navbar';
import withAuth from '@/hocs/withAuth';
import SectorForm from '@/components/SectorForm';
import { apiUtils } from '@/utils/apiUtils';

interface Sector {
    name: string;
    crop: string;
    area: number;
  }

const generate = (sectors: Sector[]) => {
    return sectors.map((sector) => 
        <ListItem
            key={sector.name}
            // secondaryAction={
            // <IconButton edge="end" aria-label="delete">
            //     <DeleteIcon />
            // </IconButton>
            // }
        >
            <ListItemAvatar>
            <Avatar>
                <FolderIcon />
            </Avatar>
            </ListItemAvatar>
            <ListItemText
            primary={sector.name}
            secondary={`${sector.area} ha`}
            sx={{color:'#0f0f0f'}}
            />
        </ListItem>
    );
  }


const SectorPage = () => {
    const [sectors, setSectors] = React.useState<Sector[]>([]);

    React.useEffect(() => {
        getSectors();
    }, []);

    const getSectors = async () => {
      const data = await apiUtils.getSectors();
      setSectors([...data]);
    };

    const handleAddButton = () => {

    }

    return (
      <>
        <Navbar/>
        <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
          <Grid container spacing={1} sx={{ justifyContent: "center" }}>
            <Grid item xs={12} md={6}>
                <List>
                  {generate(sectors)}
                </List>
                <SectorForm btnTitle="CREAR CAMPO"/>
            </Grid>
          </Grid>
        </Box>
      </>
        
      );
}

export default withAuth(SectorPage); 