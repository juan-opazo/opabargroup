import * as React from 'react';
import TableWeightInput from './TableWeightInput';
import TableWeights from './TableWeights';
import styles from '@/styles/App.module.css';
import TableWeightHeader from './TableWeightHeader';
import withAuth from '@/hocs/withAuth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const RegistrationWeights = ({ regWeightSelected }: any) => {
  const [data, setData] = React.useState<any[]>([]);
  const [title, setTitle] = React.useState<String>('');
  const [dateCreated, setDateCreated] = React.useState<String>('');
  const [sectorSelected, setSectorSelected] = React.useState<number | null>(null);
  const [showIcon, setShowIcon] = React.useState(false);

  React.useEffect(() => {
    if (regWeightSelected) {
      setData([]);
      getsavedData();
    }
  }, [regWeightSelected]);

  const getsavedData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/record-weight/recordWeights/`, {
      method: "GET",
      headers: { 
      'Accept': 'application/json',
      'Authorization': `Token ${localStorage.getItem('token')}` 
      },
    });
    const result = await res.json();
    if (res.ok) {
      const data_formatted = result.map(
        (ele: any) => ({
          ...ele, 
          weight:Number(ele.amount), 
          box:Number(ele.box)
        })
      ).filter((ele: any) => ele.registration === regWeightSelected.id);
      data_formatted.sort((a: any, b: any) => a.id - b.id);
      for (let i = 0; i < data_formatted.length; i++) {
        data_formatted[i] = { ...data_formatted[i], item: i + 1};
      }
      setData([...data_formatted]);
    } else {
        console.error(result);
    }
  }

  const addNewRecord = (weight: number, box: number) => {
    if (data.length == 0) setData([{ item: 1, weight, box }]);
    else setData([...data, { item: Math.max(...data.map(({ item }: any) => item)) + 1, weight, box }]);
    console.log(data);
  }

  const deleteRow = (row: any) => {
    setData(data.filter((r: any) => r.item !== row.item));
    if (row.id) {
      fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/record-weight/recordWeights/${row.id}/`, {
        method: "DELETE",
        headers: { 
        'Accept': '*/*',
        'Authorization': `Token ${localStorage.getItem('token')}` 
        },
      })
      .then(res => {
        res.json()
        .then(result => {
          if (res.ok) {
              console.log(result);
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

  const updateData = (data: any[]) => {
    setShowIcon(true);
    setData([...data]);
    setTimeout(() => {
      setShowIcon(false);
    }, 2000);
  }

  if (regWeightSelected) {
    return (
      <div className={styles.container}>
        <TableWeights data={data} deleteRow={deleteRow}/>
        {showIcon && <CheckCircleIcon style={{ color: '#0e9453' }} />}
        <TableWeightInput 
          addNewRecord={addNewRecord} 
          data={data} 
          title={title} 
          dateCreated={dateCreated} 
          sectorSelected={sectorSelected} 
          regWeightSelected={regWeightSelected}
          updateData={updateData}
        />
      </div>
    )
  } else {
    return (
      <div className={styles.container}>
        <TableWeightHeader updateTitle={updateTitle} updateDateCreated={updateDateCreated} updateSectorSelected={updateSectorSelected}/>
        <TableWeights data={data} deleteRow={deleteRow} updateData={updateData}/>
        {showIcon && <CheckCircleIcon style={{ color: '#0e9453' }} />}
        <TableWeightInput 
          addNewRecord={addNewRecord} 
          data={data} 
          title={title} 
          dateCreated={dateCreated} 
          sectorSelected={sectorSelected}
        />
      </div>
    )
  }
}

export default withAuth(RegistrationWeights);