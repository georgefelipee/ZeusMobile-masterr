import axios from "axios";

const api = axios.create({
    baseURL:'http://10.50.190.181:3000/'
})

export default api;