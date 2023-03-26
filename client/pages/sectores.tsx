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

interface Sector {
    name: string;
    crop: string;
    area: number;
  }

function generate(sectors: Sector[]) {
    return sectors.map((sector) => 
        <ListItem
            key={sector.name}
            secondaryAction={
            <IconButton edge="end" aria-label="delete">
                <DeleteIcon />
            </IconButton>
            }
        >
            <ListItemAvatar>
            <Avatar>
                <FolderIcon />
            </Avatar>
            </ListItemAvatar>
            <ListItemText
            primary={sector.name}
            secondary={null}
            sx={{color:'#0f0f0f'}}
            />
        </ListItem>
    );
  }


const SectorPage = () => {
    const [sectors, setSectors] = React.useState<Sector[]>([]);
    const [hasSectors, setHasSectors] = React.useState<Boolean>(true);

    const getSectors = async () => {
      fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/sector/sectors/`, {
        method: "GET",
        headers: { 
          'Accept': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}` 
        },
      })
      .then(res => {
        res.json()
        .then(data => {
          if (res.ok) {
            console.log(data);
            if (data.length === 0) {
              setHasSectors(false);
              return;
            }
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

    const handleAddButton = () => {

    }

    if (sectors.length === 0 && hasSectors) getSectors();

    return (
      <>
        <Navbar/>
        <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
          <Grid container spacing={1} sx={{ justifyContent: "center" }}>
            <Grid item xs={12} md={6}>
                <List>
                  {generate(sectors)}
                </List>
                <SectorForm btnTitle="CREAR SECTOR"/>
            </Grid>
          </Grid>
        </Box>
      </>
        
      );
}

export default withAuth(SectorPage); 