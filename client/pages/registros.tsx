import * as React from 'react';
import Navbar from '@/components/Navbar';
import withAuth from '@/hocs/withAuth';
import { DataGrid, GridColDef, GridValueGetterParams, GridCellParams } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RegistrationWeights from '@/components/RegistrationWeights';


interface RegistrationWeight {
    id: number;
    name: string;
    sector: number;
    sector_name: string | undefined;
    date_created: string;
  }

interface Sector {
    id: number;
    name: string;
    crop: string;
    area: number;
  }

const RegistrationPage = () => {
    const [rows, setRows] = React.useState<RegistrationWeight[]>([]);
    const [regWeightSelected, setRegWeightSelected] = React.useState<RegistrationWeight | null>(null);

    React.useEffect(() => {
        getSectors();
    }, []);

    const searchForSectorName = (id: number, sectors: Sector[]) => sectors.find((s: Sector) => s.id && s.id === id)?.name;

    const getSectors = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/sector/sectors/`, {
          method: "GET",
          headers: { 
            'Accept': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}` 
          },
        });
        const data = await res.json();
        if (res.ok) {
          if (data.length === 0) {
            return;
          }
          getRegWeights(data);
        } else {
          console.error(data);
        }
      };

    const getRegWeights = async (sectors: Sector[]) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/registration-weight/registrationWeights/`, {
            method: "GET",
            headers: { 
            'Accept': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}` 
            },
        });
        let data = await res.json()
        if (res.ok) {
            if (data.length === 0) {
              return;
            }
            data = data.map((reg: RegistrationWeight) => {
                reg.sector_name = searchForSectorName(reg.sector, sectors);
                return reg;
            })
            setRows([...data]);
        } else {
            console.error(data);
        }
    }

    const handleVisibilityClick = (regWeight: RegistrationWeight) => {
        setRegWeightSelected(regWeight);
    }

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Titulo', width: 200 },
        { field: 'sector_name', headerName: 'Sector', width: 100 },
        { field: 'date_created', headerName: 'Fecha', width: 130 },
        {
            field: 'visibility',
            headerName: '',
            width: 50,
            sortable: false,
            renderCell: (params: GridCellParams) => (
                <VisibilityIcon onClick={() => handleVisibilityClick(params.row)}/>
            ),
        },
      ];

    return (
      <>
        <Navbar/>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
          />
        </div>
        { regWeightSelected ? <RegistrationWeights regWeightSelected={regWeightSelected}/> : null }
      </>
        
      );
}

export default withAuth(RegistrationPage); 