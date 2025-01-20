import axios from "axios";
const BASE_URL = 'http://localhost:3002/V1';


const config = () => {
    const authToken = localStorage.getItem('authToken');

    const authTokenArr = JSON.parse(authToken);

    const token =authTokenArr.token;

    return {
        headers: {
            'Authorization': token ? `Bearer ${token}` : '', 
            'Content-Type': 'application/json'
        }
    }
}

export const loginHttps = async ({user, password}) => {

    try {
        return await axios.post(BASE_URL+'/auth',{
            user,
            password
        });
    } catch (error) {
        throw error;
    }
   
}

export const postHttps = async (url,body) => {

    try {
        return await axios.post(BASE_URL+'/'+url,body,config());
    } catch (error) {
        throw error;
    }
   
}

export const pachHttps = async (url,body) => {

    try {
        return await axios.patch(BASE_URL+'/'+url,body,config());
    } catch (error) {
        throw error;
    }
   
}

export const deleteHttps = async (url,id) => {

    try {
        return await axios.delete(BASE_URL+'/'+url+'/'+id,config());
    } catch (error) {
        throw error;
    }
   
}

export const getHttps = async (url) => {

    try {
        return await axios.get(BASE_URL+'/'+url,config());
    } catch (error) {
        if(error.status){
            //aqui es donde recibe
        }
        throw error;
    }
   
}

