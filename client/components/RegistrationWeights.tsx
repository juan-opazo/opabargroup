import * as React from 'react';
import TableWeightInput from './TableWeightInput';
import TableWeights from './TableWeights';
import SectorSelect from './SectorSelect';
import styles from '@/styles/App.module.css';


const RegistrationWeights = () => {
  const [data, setData] = React.useState<any[]>([]);
  const addNewRecord = (weight: number, box: number) => {
    if (data.length == 0) setData([{ id: 1, weight, box }]);
    else setData([...data, { id: Math.max(...data.map(({ id }: any) => id)) + 1, weight, box }]);
    console.log(data);
  }
  return (
    <div className={styles.container}>
      <SectorSelect/>
      <TableWeights data={data}/>
      <TableWeightInput addNewRecord={addNewRecord} data={data}/>
    </div>
  )
}

export default RegistrationWeights;