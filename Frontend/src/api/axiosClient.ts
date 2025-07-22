import axios from 'axios';

const axiosClient = axios.create({
    //baseURL:'http://localhost:3001/api',
    baseURL: 'http://localhost:3000',
    headers :{
        'content-type':'application/json',
    }



});


export default axiosClient;
