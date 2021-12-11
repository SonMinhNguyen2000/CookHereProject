import {useEffect, useState} from 'react';
import axios from 'axios';

const useFetch = (url) => {
    const [data, setData] = useState(null)
    useEffect(()=>{
        const fetch = async(url) =>{
            const res = await axios.get(url);
            setData(data=> res.data.result)
        }
        fetch(url)
    },[url]);
    return {data}
};

export default useFetch;
