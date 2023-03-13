import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import styles from '@/styles/App.module.css';


export default function TableWeights({ data }: any) {
  return (
    <TableContainer component={Paper} className={styles.table_container}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ITEM</TableCell>
            <TableCell align="right">PESO</TableCell>
            <TableCell align="right">malla/caja</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row: any) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="right">{row.weight}</TableCell>
              <TableCell align="right">{row.box}</TableCell>
            </TableRow>
          ))}
          <TableRow
              key="Total"
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">Total</TableCell>
              <TableCell align="right">{data.reduce((acc: number, e: any) => acc + e.weight, 0)}</TableCell>
              <TableCell align="right">{data.reduce((acc: number, e: any) => acc + e.box, 0)}</TableCell>
            </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
