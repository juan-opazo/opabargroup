import * as React from 'react';
import styles from '@/styles/App.module.css';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
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
import Image from 'next/image';
import { useRouter } from 'next/router';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Typography from '@mui/material/Typography';
import GaugeChart from '../components/charts/GaugeChart';


interface SoilAnalysis {
    id: number;
    alMeq: string;
    arcilla: string;
    arena: string;
    caMeq: string;
    caco3: string;
    ce: string;
    cic: string;
    claseTextural: string;
    date_created: string;
    k: string;
    kMeq: string;
    limo: string;
    mgMeq: string;
    mo: string;
    naMeq: string;
    owner: number;
    p: string;
    ph: string;
    sb: string;
    sector: number;
}

interface Sector {
    name: string;
    crop: string;
    area: number;
}

const SOIL_ANALYSIS = "Analisis de Suelos";
const PH_LIMITS = [
    {
        label: "Fuertemente acido",
        value: 0
    }, 
    {
        label: "Acido",
        value: 4.5
    }, 
    {
        label: "Neutro",
        value: 6.5
    }, 
    {
        label: "alcalino",
        value: 7.3
    }, 
    {
        label: "Fuertemente alcalino",
        value: 9.3
    }, 
];
const chartStyle = {
    // height: 250,
}

const SoilAnalysisPage = () => {
    const [soilAnalysis, setSoilAnalysis] = React.useState<SoilAnalysis[]>([]);
    const [SA_Selected, setSA_Selected] = React.useState<SoilAnalysis | null>(null);
    const [sectors, setSectors] = React.useState<Sector[]>([]);
    const router = useRouter();
    
    React.useEffect(() => {
        getSectors();
    }, []);

    const getSectors = async () => {
        const data = await apiUtils.getSectors();
        setSectors([...data]);
        getSoilAnalysis();
      };

    const getSoilAnalysis = async () => {
        const data = await apiUtils.getSoilAnalysis();
        console.log(data);
        setSoilAnalysis([...data]);
      };

    const getSectorById = (sectorId: number) => {
        return sectors.find((sector: Sector) => sectorId === sector.id);
    }

    const generateSAList = (soilAnalysis: SoilAnalysis[]) => {
        return soilAnalysis.map((sa) => 
            <ListItem
                key={sa.id}
            >
                <ListItemIcon>
                    <Image 
                      alt="analisis de suelos" 
                      src="/ANALISIS_SUELOS.png"
                      className={styles.list_item_icon_image}
                      onClick={() => setSA_Selected(sa)}
                      style={{}}
                      width={760}
                      height={500}
                    />
                </ListItemIcon>
                <ListItemText
                primary={`${getSectorById(sa.sector)!.name} - ${new Date(sa.date_created).getDate()}/${new Date(sa.date_created).getMonth()+1}/${new Date(sa.date_created).getFullYear()}`}
                sx={{color:'#0f0f0f'}}
                />
            </ListItem>
        );
    }

    const generateBreadcrumb = () => {
        return (
            <div role="presentation" style={{margin: '1em'}} onClick={handleClick}>
                <Breadcrumbs 
                    separator={<NavigateNextIcon fontSize="small"/>}
                    aria-label="breadcrumb"
                >
                    <Link underline="hover" color="inherit" href="/">
                        {SOIL_ANALYSIS}
                    </Link>
                    <Typography color="text.primary">{SA_Selected!.id}</Typography>
                </Breadcrumbs>
            </div>
        );
    }

    const generatephSection = () => {
        if (SA_Selected!.ph === null) return <></>
        
        const ph_result = PH_LIMITS.find((limit: any) => SA_Selected!.ph > limit.value)!.label;
        return (
            <div className={styles.container}>
                <Typography variant="h4" component="h5" textAlign="center" sx={{ color: 'black'}}>{ph_result}</Typography>
                <GaugeChart id="gauge-chart5"
                    style={chartStyle}
                    nrOfLevels={5}
                    arcsLength={[0.321,	0.143,	0.057,	0.143,	0.336]}



                    colors={['#f44336', '#cddc39', '#4caf50', '#cddc39', '#f44336']}
                    percent={Number(SA_Selected!.ph) / 14}
                    arcPadding={0.02}
                    formatTextValue={(value: number) => `${(value * 14 / 100).toFixed(0)}`}
                />
            </div>
            
        )
    }

    const generateContent = () => {
        if (!SA_Selected) {
            return (
                <Grid container spacing={1} sx={{ justifyContent: "center" }}>
                    <Grid item xs={12} md={6}>
                        <List>
                            {generateSAList(soilAnalysis)}
                        </List>
                    </Grid>
                </Grid>
            )
        } else {
            return (
                <>
                    {generateBreadcrumb()}
                    {generatephSection()}
                    
                </>
            )
        }
    }

    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        if (event.target.text === SOIL_ANALYSIS) setSA_Selected(null);
    }

    return (
      <>
        <Navbar/>
        <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
            {generateContent()}
        </Box>
      </>
        
      );
}

export default withAuth(SoilAnalysisPage); 