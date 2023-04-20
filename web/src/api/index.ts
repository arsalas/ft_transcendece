import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
// import { useAuthStore } from '../app/auth/store';
import { CONFIG } from '../config'

axios.defaults.timeout = 5000;


const config: AxiosRequestConfig = {
    baseURL: CONFIG.API_URL,
};

const api: AxiosInstance = axios.create(config);

// Add a request interceptor
api.interceptors.request.use((config) => {
    // Do something before request is sent
    // const token: string = useAuthStore().token;
    // config.headers.Authorization = token;
    return config;
}, function (error) {
    // Do something with request error
    console.log('error: ', error)
    return Promise.reject(error);
});


// Add a response interceptor
api.interceptors.response.use((response) => {
    return response;
}, function (error) {
    // Do something with response error
    console.log('error: ', error.response)
    return Promise.reject(error.response);
});

export default api