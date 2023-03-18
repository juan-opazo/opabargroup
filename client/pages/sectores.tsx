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
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import Navbar from '@/components/Navbar';

interface Sector {
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
          console.log(data);
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

function generate(sectors: Sector[]) {

    // const sectors = [
    //     {
    //         name: "Sector A",
    //         crop: "Maracuyá",
    //         area: 23.4
    //     },
    //     {
    //         name: "Sector B",
    //         crop: "Mango",
    //         area: 2.1
    //     },
    // ]
    // if (!sectors) return null;
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
            />
        </ListItem>
    );
  }


const SectorPage = () => {
    const [sectors, setSectors] = React.useState([]);
    getSectors(setSectors);
    return (
      <>
        <Navbar/>
        <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
          <Grid container spacing={1} sx={{ justifyContent: "center" }}>
            <Grid item xs={12} md={6}>
              <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                Avatar with text and icon
              </Typography>
                <List>
                  {generate(sectors)}
                </List>
            </Grid>
          </Grid>
        </Box>
      </>
        
      );
}

export default SectorPage;