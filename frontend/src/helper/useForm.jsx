import {useState} from 'react';

const useForm = (initialValue) => {
    const [value, setValue] = useState(initialValue);
    return [
        value,
        (e) => {
            const {name, value} = e.target;
            setValue(value=>({...value, [name]:e.target.value})) 
        }
    ]
}

export default useForm;