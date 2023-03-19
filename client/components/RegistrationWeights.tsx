import * as React from 'react';
import TableWeightInput from './TableWeightInput';
import TableWeights from './TableWeights';
import styles from '@/styles/App.module.css';
import TableWeightHeader from './TableWeightHeader';
import withAuth from '@/hocs/withAuth';


const RegistrationWeights = ({ regWeightSelected }: any) => {
  const [data, setData] = React.useState<any[]>([]);
  const [title, setTitle] = React.useState<String>('');
  const [dateCreated, setDateCreated] = React.useState<String>('');
  const [sectorSelected, setSectorSelected] = React.useState<number | null>(null);

  React.useEffect(() => {
    console.log(regWeightSelected);
    if (regWeightSelected) {
      setData([]);
      getsavedData();
    }
  }, [regWeightSelected]);

  const getsavedData = () => {
    fetch(`http://52.0.138.19:5005/api/record-weight/recordWeights/`, {
      method: "GET",
      headers: { 
      'Accept': 'application/json',
      'Authorization': `Token ${localStorage.getItem('token')}` 
      },
    })
    .then(res => {
      res.json()
      .then(result => {
      if (res.ok) {
          const data_formatted = result.map((ele: any) => ({...ele, weight:Number(ele.amount), box:Number(ele.box)})).filter((ele: any) => ele.registration === regWeightSelected.id);
          console.log(data_formatted);
          setData([...data_formatted]);
      } else {
          console.error(result);
      }

      })
      .catch(err => {
          console.error(err);
      });
    })
    .catch(err => console.error(err));
  }

  const addNewRecord = (weight: number, box: number) => {
    if (data.length == 0) setData([{ item: 1, weight, box }]);
    else setData([...data, { item: Math.max(...data.map(({ item }: any) => item)) + 1, weight, box }]);
    console.log(data);
  }

  const updateTitle = (title: String) => {
    setTitle(title);
  }

  const updateDateCreated = (dateCreated: String) => {
    setDateCreated(dateCreated);
  }

  const updateSectorSelected = (sectorSelected: number) => {
    setSectorSelected(sectorSelected);
  }

  if (regWeightSelected) {
    return (
      <div className={styles.container}>
        <TableWeights data={data}/>
        <TableWeightInput addNewRecord={addNewRecord} data={data} title={title} dateCreated={dateCreated} sectorSelected={sectorSelected} regWeightSelected={regWeightSelected}/>
      </div>
    )
  } else {
    return (
      <div className={styles.container}>
        <TableWeightHeader updateTitle={updateTitle} updateDateCreated={updateDateCreated} updateSectorSelected={updateSectorSelected}/>
        <TableWeights data={data}/>
        <TableWeightInput addNewRecord={addNewRecord} data={data} title={title} dateCreated={dateCreated} sectorSelected={sectorSelected}/>
      </div>
    )
  }
}

export default withAuth(RegistrationWeights);