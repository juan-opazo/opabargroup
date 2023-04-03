import Navbar from '@/components/Navbar';
import React from 'react';
import { VictoryLine, VictoryChart, VictoryAxis,
    VictoryTheme } from 'victory';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import styles from '@/styles/App.module.css';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

interface Record {
    amount: number;
    date: number;
}

const DashboardPage = () => {
    const [records, setRecords] = React.useState<Record[]>([]);

    React.useEffect(() => {
        getRegWeights();
        
    }, []);

    const getRegWeights = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/registration-weight/registrationWeights/`, {
            method: "GET",
            headers: { 
            'Accept': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}` 
            },
        });
        let data = await res.json()
        if (res.ok) {
            getRecordWeights(data);
        } else {
            console.error(data);
        }
    }

    const getRecordWeights = async (regWeights: any[]) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/record-weight/recordWeights/`, {
          method: "GET",
          headers: { 
          'Accept': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}` 
          },
        });
        const result = await res.json();
        if (res.ok) {
          let data_formatted = result.map(
            (ele: any) => ({
              ...ele, 
              amount: Number(ele.amount), 
              date: regWeights.find((r: any) => r.id === ele.registration)!.date_created.split('T')[0],
            })
          )
          data_formatted = Object.entries(data_formatted.reduce((accumulator: any, current: any) => {
            const { amount, date } = current;
            if (accumulator[date]) {
              accumulator[date] += amount;
            } else {
              accumulator[date] = amount;
            }
            return accumulator;
          }, {})).map(([date, amount]) => ({ date, amount })).sort((a, b) => a.date.localeCompare(b.date));
          setRecords([...data_formatted]);
        } else {
            console.error(result);
        } 
    }

    return (
        <>
            <Navbar />
            <Box sx={{ width: '100%', padding: '1em' }}>
                <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 8, md: 10 }}>
                    <Grid item xs={12} sm={6} md={6}>
                    <VictoryChart
                    // adding the material theme provided with Victory
                    theme={VictoryTheme.material}
                    domainPadding={20}
                >
                    <VictoryAxis
                    tickValues={records.map((ele: any) => ele.date)}
                    tickFormat={records.map((ele: any) => ele.date)}
                    />
                    <VictoryAxis
                    dependentAxis
                    tickFormat={(x) => (`${x}kg`)}
                    />
                    <VictoryLine
                    style={{
                        data: { stroke: "#c43a31" },
                        parent: { border: "1px solid #ccc"}
                    }}
                    data={records}
                    x="date"
                    y="amount"
                    />
                </VictoryChart>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <TableContainer component={Paper} className={styles.table_container}>
                            <Table sx={{ minWidth: 350 }} aria-label="simple table">
                                <TableHead>
                                <TableRow>
                                    <TableCell align="right">PESO TOTAL</TableCell>
                                    <TableCell align="right">FECHA</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {records.map((row: any) => (
                                    <TableRow
                                    key={row.date}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                    <TableCell align="right">{row.amount}</TableCell>
                                    <TableCell align="right">{row.date}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Box>
            <div>
                
            </div>
            <div>
                
            </div>
            
        </>
        
    );
}

export default DashboardPage;