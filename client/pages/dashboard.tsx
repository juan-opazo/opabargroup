import Navbar from '@/components/Navbar';
import React from 'react';
import { 
  VictoryLine, 
  VictoryChart, 
  VictoryAxis,
  VictoryTheme, 
  VictoryTooltip, 
  VictoryVoronoiContainer,
  VictoryLegend
} from 'victory';
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
import { apiUtils } from '@/utils/apiUtils';
import withAuth from '@/hocs/withAuth';


enum Type {
  AMOUNT = "amount",
  AMOUNT_AREA = "amount_area",
}

const TOTAL = {
  label: "total",
  color: "#c43a31",
};

const colors = [
  "#ff8c00",
  "#f44336",
  "#00bcd4",
  "#9c27b0",
  "#4caf50",
  "#795548",
  "#2196f3",
  "#ffc107",
  "#673ab7",
  "#cddc39",
]

const DashboardPage = () => {
  const [aggResults, setAggResults] = React.useState<any>({});
  const [sectorNames, setSectorNames] = React.useState<string[]>([]);
/**
 * {
 *    "2023-2-3": {
 *      "amount": {
 *        "CAMPO A": 32,
 *        "CAMPO B": 43,
 *        "CAMPO C": 51
 *      },
 *      "amount_area": {
 *        "CAMPO A": 12,
 *        "CAMPO B": 10,
 *        "CAMPO C": 2,
 *      }
 *    }
 * }
 */
  React.useEffect(() => {
      getSectors();
  }, []);

  const getRecordWeights = async (regWeights: any[], sectors: any[]) => {
    const records = await apiUtils.getRecordWeights();
    const data = records.map(
      (ele: any) => ({
        ...ele, 
        amount: Number(ele.amount),
        date: regWeights.find((r: any) => r.id === ele.registration)!.date_created.split('T')[0],
        area: Number(sectors.find((s: any) => s.id === regWeights.find((r: any) => r.id === ele.registration)!.sector)!.area),
        sector_name: sectors.find((s: any) => s.id === regWeights.find((r: any) => r.id === ele.registration)!.sector)!.name,
      })
    );
    const data_for_agg_results: any = data.reduce((accumulator: any, current: any) => {
      const { amount, date, area, sector_name } = current;
      if (!accumulator[date]) {
        accumulator[date] = {
          [Type.AMOUNT]: {},
          [Type.AMOUNT_AREA]: {}
        }
      }

      if (accumulator[date].amount[sector_name]) { accumulator[date].amount[sector_name] += amount; } 
      else { accumulator[date].amount[sector_name] = amount; }
      accumulator[date].amount[TOTAL.label] = accumulator[date].amount[TOTAL.label] 
        ? accumulator[date].amount[TOTAL.label] + amount 
        : amount;

      if (accumulator[date].amount_area[sector_name]) { accumulator[date].amount_area[sector_name] += amount / area; } 
      else { accumulator[date].amount_area[sector_name] = amount / area; }
      accumulator[date].amount_area[TOTAL.label] = accumulator[date].amount_area[TOTAL.label] 
        ? accumulator[date].amount_area[TOTAL.label] + amount / area 
        : amount / area;

      return accumulator;
    }, {});
    console.warn(data_for_agg_results);
    setAggResults(data_for_agg_results);
  }

  const getRegWeights = async (sectors: any[]) => {
    const regWeights = await apiUtils.getRegistrationWeights();
    getRecordWeights(regWeights, sectors);
  }

  const getSectors = async () => {
    const sectors = await apiUtils.getSectors();
    setSectorNames(sectors.map((sector: any) => sector.name));
    getRegWeights(sectors);
  };

  const getDateValues = () => {
    return Object.entries(aggResults).map(
      ([date, ele]: [string, any]) => date).sort((a, b) => a.localeCompare(b)
    );
  };

  const generateLegendData = () => {
    const result = sectorNames.map((sectorName: string, index: number) => 
      ({ name: sectorName, symbol: { fill: colors[index % colors.length] } })
    );
    return [...result, {name: TOTAL.label, symbol: { fill: TOTAL.color}}]
  }

  const getRecordsBySectorAndType = (sectorName: string, type: Type) => {
    const aux = Object.entries(aggResults); // ["2023-3-2", {"amount": {...}, "amount_area":{...}}]
    const result = aux.map(([date, ele]: [string, any]) => {
      const amount = ele[type][sectorName] ? ele[type][sectorName] : 0;
      return { date, amount, label: sectorName };
    }).sort((a, b) => a.date.localeCompare(b.date));
    return result;
  }

  const createVictoryLine = (color: string, name: string, data: any[]) => {
    return (
      <VictoryLine
          key={name}
          style={{
              data: { stroke: color },
              parent: { border: "1px solid #ccc"}
          }}
          labelComponent={<VictoryTooltip/>}
          events={[{
            target: "data",
            eventHandlers: {
              onMouseOver: () => {
                return [
                  {
                    target: "data",
                    mutation: () => ({style: {fill: "gold", width: 30}})
                  }, {
                    target: "labels",
                    mutation: () => ({ active: true })
                  }
                ];
              },
              onMouseOut: () => {
                return [
                  {
                    target: "data",
                    mutation: () => {}
                  }, {
                    target: "labels",
                    mutation: () => ({ active: false })
                  }
                ];
              }
            }
          }]}
          data={data}
          x="date"
          y="amount"
        />
    )
  }

  const generateVictoryLines = (type: Type) => {
    const result = sectorNames.map((sectorName: string, index: number) => {
      return createVictoryLine(
        colors[index % colors.length], 
        sectorName, 
        getRecordsBySectorAndType(sectorName, type)
      )
    });
    const total = createVictoryLine(
      TOTAL.color, 
      TOTAL.label, 
      getRecordsBySectorAndType(TOTAL.label, type)
    )
    return [...result, total];
  }

  const generateTableHeadCellsPerSectorAndType = (type: Type) => {
    return sectorNames.map((sectorName: string) => {
      if (type === Type.AMOUNT) {
        return <TableCell key={sectorName} align="right">{sectorName} (Kg)</TableCell>
      } else {
        return <TableCell key={sectorName} align="right">{sectorName} (Kg/ha)</TableCell>
      }
    })
  }

  const generateTableRowsandCellsPerType = (type: Type) => {
    const aux = Object.entries(aggResults); // ["2023-3-2", {"amount": {...}, "amount_area":{...}}]
    const orderedValues = aux.map(([date, ele]: [string, any]) => {
      const data = ele[type];
      return { date, data };
    }).sort((a, b) => a.date.localeCompare(b.date));
    return orderedValues.map((row: any) => (
      <TableRow
        key={row.date}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell align="right">{row.date}</TableCell>
        {sectorNames.map((sectorName: string) => <TableCell key={sectorName} align="right">{row.data[sectorName]?.toFixed(2) || 0}</TableCell>)}
        <TableCell align="right">{row.data[TOTAL.label]?.toFixed(2)}</TableCell>
      </TableRow>
    ));
  }

  const generateGraphs = () => {
    const graphs = [
      {
        title: "Peso por Tiempo (Tn)",
        type: Type.AMOUNT,
        totalTitleTable: "PESO TOTAL (Kg)"
      },
      {
        title:"Peso/Area por Tiempo (Tn/ha)",
        type: Type.AMOUNT_AREA,
        totalTitleTable: "PESO TOTAL / Area (Kg/ha)"
      }
    ]
    return graphs.map((graph: any) => (
      <Box key={graph.type} sx={{ width: '100%', padding: '1em' }}>
        <Typography variant="h4" component="h5" textAlign="center" sx={{ color: 'black'}}>{graph.title}</Typography>;
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 8, md: 10 }}>
          {/* GRAPH SECTION */}
          <Grid item xs={12} sm={6} md={6}>
            <VictoryChart
              // adding the material theme provided with Victory
              theme={VictoryTheme.material}
              domainPadding={20}
              containerComponent={<VictoryVoronoiContainer/>}
            >
              <VictoryAxis
              tickValues={getDateValues()}
              tickFormat={getDateValues()}
              style={{
                tickLabels: { angle: -45, padding: 15, fontSize: 10 },
              }}
              />
              <VictoryAxis
              dependentAxis
              tickFormat={(x) => (`${(x / 1000).toFixed(2)}`)}
              style={{
                  tickLabels: { fontSize: 10 },
                }}
              />
              {generateVictoryLines(graph.type)}
              <VictoryLegend x={30} y={0} orientation="horizontal" gutter={20} data={generateLegendData()} />
            </VictoryChart>
          </Grid>
          {/* TABLE SECTION */}
          <Grid item xs={12} sm={6} md={6}>
            <TableContainer component={Paper} className={styles.table_container}>
              <Table sx={{ minWidth: 350 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="right">FECHA</TableCell>
                    {generateTableHeadCellsPerSectorAndType(graph.type)}
                    <TableCell align="right">{graph.totalTitleTable}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {generateTableRowsandCellsPerType(graph.type)}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    ))
  }

  return (
    <>
      <Navbar />
      {generateGraphs()}
    </>
  );
}

export default withAuth(DashboardPage); 