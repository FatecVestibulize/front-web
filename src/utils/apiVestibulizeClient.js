import axios from 'axios';

export default axios.create({
    baseURL: import.meta.env.VITE_API_URL + '/v1/',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
})

export const traitExpiredToken = (responseMessage) => {

    if(responseMessage.includes("JWT expired")){
        alert("Token expirado. Por favor, faça login novamente.");
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        navigate('/');
    }

}