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
    date_created: string;
  }

const RegistrationPage = () => {
    const [rows, setRows] = React.useState<RegistrationWeight[]>([]);
    const [hasRegWeights, setHasRegWeights] = React.useState<Boolean>(true);
    const [regWeightSelected, setRegWeightSelected] = React.useState<RegistrationWeight | null>(null);

    const getRegWeights = async () => {
        fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/registration-weight/registrationWeights/`, {
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
                    setHasRegWeights(false);
                return;
                }
                setRows([...data]);
            } else {
                console.error(data);
            }
    
            })
            .catch(err => {
            console.error(err);
            });
        })
        .catch(err => console.error(err));
    }

    const handleVisibilityClick = (regWeight: RegistrationWeight) => {
        setRegWeightSelected(regWeight);
    }

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Titulo', width: 100 },
        { field: 'sector', headerName: 'Sector', width: 100 },
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

    if (rows.length === 0 && hasRegWeights) getRegWeights();

    return (
      <>
        <Navbar/>
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                // pageSize={5}
                // rowsPerPageOptions={[5]}
                // checkboxSelection
            />
        </div>
        { regWeightSelected ? <RegistrationWeights regWeightSelected={regWeightSelected}/> : null }
      </>
        
      );
}

export default withAuth(RegistrationPage); 