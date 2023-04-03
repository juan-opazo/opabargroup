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
import Typography from '@mui/material/Typography';

interface Record {
    amount: number;
    date: number;
}

const DashboardPage = () => {
    const [recordsWeight, setRecordsWeight] = React.useState<Record[]>([]);
    const [recordsWeightArea, setRecordsWeightArea] = React.useState<Record[]>([]);

    React.useEffect(() => {
        getSectors();
        
    }, []);

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

    const getRegWeights = async (sectors: any[]) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/registration-weight/registrationWeights/`, {
            method: "GET",
            headers: { 
            'Accept': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}` 
            },
        });
        let data = await res.json()
        if (res.ok) {
            getRecordWeights(data, sectors);
        } else {
            console.error(data);
        }
    }

    const getRecordWeights = async (regWeights: any[], sectors: any[]) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/record-weight/recordWeights/`, {
          method: "GET",
          headers: { 
          'Accept': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}` 
          },
        });
        const result = await res.json();
        if (res.ok) {
          const data = result.map(
            (ele: any) => ({
              ...ele, 
              amount: Number(ele.amount),
              date: regWeights.find((r: any) => r.id === ele.registration)!.date_created.split('T')[0],
              area: Number(sectors.find((s: any) => s.id === regWeights.find((r: any) => r.id === ele.registration)!.sector)!.area)
            })
          )
            console.log(data);
          const data_for_weight_area: any[] = Object.entries(data.reduce((accumulator: any, current: any) => {
            const { amount, date, area } = current;
            if (accumulator[date]) {
              accumulator[date] += amount / area;
            } else {
              accumulator[date] = amount / area;
            }
            return accumulator;
          }, {})).map(([date, amount]) => ({ date, amount })).sort((a, b) => a.date.localeCompare(b.date));
          setRecordsWeightArea([...data_for_weight_area]);

          const data_for_weight: any[] = Object.entries(data.reduce((accumulator: any, current: any) => {
            const { amount, date } = current;
            if (accumulator[date]) {
              accumulator[date] += amount;
            } else {
              accumulator[date] = amount;
            }
            return accumulator;
          }, {})).map(([date, amount]) => ({ date, amount })).sort((a, b) => a.date.localeCompare(b.date));
          setRecordsWeight([...data_for_weight]);

          
        } else {
            console.error(result);
        } 
    }

    return (
        <>
            <Navbar />
            <Box sx={{ width: '100%', padding: '1em' }}>
                <Typography variant="h3" component="h4" textAlign="center" sx={{ color: 'black'}}>
                    Peso por Tiempo
                </Typography>;
                <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 8, md: 10 }}>
                    <Grid item xs={12} sm={6} md={6}>
                        <VictoryChart
                            // adding the material theme provided with Victory
                            theme={VictoryTheme.material}
                            domainPadding={20}
                        >
                            <VictoryAxis
                            tickValues={recordsWeight.map((ele: any) => ele.date)}
                            tickFormat={recordsWeight.map((ele: any) => ele.date)}
                            />
                            <VictoryAxis
                            dependentAxis
                            tickFormat={(x) => (`${(x / 1000).toFixed(2)}Tn`)}
                            style={{
                                tickLabels: { fontSize: 10 },
                              }}
                            />
                            <VictoryLine
                            style={{
                                data: { stroke: "#c43a31" },
                                parent: { border: "1px solid #ccc"}
                            }}
                            data={recordsWeight}
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
                                    <TableCell align="right">PESO TOTAL (Kg)</TableCell>
                                    <TableCell align="right">FECHA</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {recordsWeight.map((row: any) => (
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
            <Box sx={{ width: '100%', padding: '1em' }}>
                <Typography variant="h3" component="h4" textAlign="center" sx={{ color: 'black'}}>
                    Peso/Area por Tiempo
                </Typography>;
                <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 8, md: 10 }}>
                    <Grid item xs={12} sm={6} md={6}>
                        <VictoryChart
                            // adding the material theme provided with Victory
                            theme={VictoryTheme.material}
                            domainPadding={20}
                        >
                            <VictoryAxis
                            tickValues={recordsWeightArea.map((ele: any) => ele.date)}
                            tickFormat={recordsWeightArea.map((ele: any) => ele.date)}
                            />
                            <VictoryAxis
                            dependentAxis
                            tickFormat={(x) => (`${(x / 1000).toFixed(2)}Tn/ha`)}
                            style={{
                                tickLabels: { fontSize: 10 },
                              }}
                            />
                            <VictoryLine
                            style={{
                                data: { stroke: "#c43a31" },
                                parent: { border: "1px solid #ccc"}
                            }}
                            data={recordsWeightArea}
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
                                    <TableCell align="right">PESO TOTAL / Area (Kg/ha)</TableCell>
                                    <TableCell align="right">FECHA</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {recordsWeightArea.map((row: any) => (
                                    <TableRow
                                    key={row.date}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                    <TableCell align="right">{(row.amount).toFixed(2)}</TableCell>
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