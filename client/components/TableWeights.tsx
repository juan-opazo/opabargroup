import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import styles from '@/styles/App.module.css';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';


export default function TableWeights({ data, deleteRow }: any) {
  data.sort((a: any, b: any) => a.item - b.item);

  return (
    <TableContainer component={Paper} className={styles.table_container}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ITEM</TableCell>
            <TableCell align="right">PESO</TableCell>
            <TableCell align="right">malla/caja</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row: any) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.item}
              </TableCell>
              <TableCell align="right">{row.weight}</TableCell>
              <TableCell align="right">{row.box}</TableCell>
              <TableCell align="right">
                <IconButton color="primary" onClick={() => deleteRow(row)} aria-label="edit" >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
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
