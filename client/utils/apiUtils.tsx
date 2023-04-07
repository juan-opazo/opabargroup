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
      return data;
    } else {
      console.error(data);
      throw new Error(`Error fetching data from API: ${data}`);
    }
};

const getRegistrationWeights = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/registration-weight/registrationWeights/`, {
        method: "GET",
        headers: { 
        'Accept': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}` 
        },
    });
    const data = await res.json()
    if (res.ok) {
        return data
    } else {
        console.error(data);
    }
};

const getRecordWeights = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/record-weight/recordWeights/`, {
      method: "GET",
      headers: { 
      'Accept': 'application/json',
      'Authorization': `Token ${localStorage.getItem('token')}` 
      },
    });
    const data = await res.json();
    if (res.ok) {
        return data;
    } else {
        console.error(data);
    } 
}

const createRecordWeight = async (payload: any) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/record-weight/recordWeights/`, {
        method: "POST",
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
        return data;
    } else {
        console.error(data);
        throw new Error(`Error fetching data from API: ${data}`);
    }
}

const createRegistrationWeight = async (payload: any) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/registration-weight/registrationWeights/`, {
        method: "POST",
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
        return data;
    } else {
        throw new Error(`Error fetching data from API: ${data}`);
    }
}

const createSector = async (payload: any) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/sector/sectors/`, {
        method: "POST",
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
      return data;
    } else {
        throw new Error(`Error fetching data from API: ${data}`);
    }
}

const deleteRecordWeight = async (id: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/record-weight/recordWeights/${id}/`, {
        method: "DELETE",
        headers: { 
        'Accept': '*/*',
        'Authorization': `Token ${localStorage.getItem('token')}` 
        },
    });
    const data = await res.json();
    if (res.ok) return data;

    throw new Error(`Error fetching data from API: ${data}`);
}

export const apiUtils = {
    getSectors,
    getRegistrationWeights,
    getRecordWeights,
    createRecordWeight,
    createRegistrationWeight,
    createSector,
    deleteRecordWeight,
};