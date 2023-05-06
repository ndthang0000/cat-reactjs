import axios from 'axios';
import { toast } from 'react-toastify';

const convertStatus2Toast = (status) => {
  if (status === null) {
    return 'warning'
  }
  if (status) {
    return 'success'
  }
  if (!status) {
    return 'error'
  }
}

const instance = axios.create({
  baseURL: process.env.REACT_APP_DOMAIN,
});

instance.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

instance.interceptors.response.use(function (response) {
  if (response.data.message) {
    toast[convertStatus2Toast(response.data.status)](response.data.message)
  }
  return response
},
  function (err) {
    if (err.response.status == 401) {
      toast[convertStatus2Toast(null)]('Please login to continue use system')
    }
    else if (err.response.data.message) {
      toast[convertStatus2Toast(false)](err.response.data.message)
    }
    else {
      toast[convertStatus2Toast(false)]('Something went wrong !!!')

    }
    return Promise.reject(err)
  });

export default instance