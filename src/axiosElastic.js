import axios from 'axios';

const axiosElastic = axios.create({
  baseURL: 'http://localhost:9200',
  headers: { 'Content-Type': 'application/json' }
})

export default axiosElastic
