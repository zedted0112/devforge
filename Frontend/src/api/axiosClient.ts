import axios from 'axios';

const axiosClient = axios.create({
    //baseURL:'http://localhost:3001/api',
    baseURL:import.meta.env.VITE_API_BASE_URL,
    headers :{
        'content-type':'application/json',
    }



});


export default axiosClient;
