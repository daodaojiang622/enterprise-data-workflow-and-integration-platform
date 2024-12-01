import axios from "axios";


const httpRequest = axios.create();


httpRequest.interceptors.request.use(config => {
   config.url = `http://localhost:3500` + config.url;
   return config;
}, error => {
    return Promise.reject(error);
});

export {
    httpRequest
}