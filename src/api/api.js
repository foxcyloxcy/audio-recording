import axios from "axios";

export default axios.create({
   baseURL: 'http://localhost:80/',
//    baseURL: 'http://10.8.7.183/',
    //  baseURL: 'https://w4.core-access.com/',
    headers: { 'token' : 'cCW7PW2CRotxuALrBuMob5lXgVhY4xo'  }
});
