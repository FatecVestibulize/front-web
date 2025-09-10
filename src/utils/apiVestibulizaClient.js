import axios from 'axios';

export default axios.create({
    baseURL: import.meta.env.VITE_API_URL + '/v1/',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
})