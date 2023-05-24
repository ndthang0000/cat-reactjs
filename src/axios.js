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

const refreshAccessToken = async () => {
  try {
    console.log('refreshToken', localStorage.getItem('refreshToken'))
    const data = await axios.post(`${process.env.REACT_APP_DOMAIN}/auth/refresh-tokens`,
      {
        refreshToken: localStorage.getItem('refreshToken')
      }
    )
    if (data.data.status) {
      localStorage.setItem('refreshToken', data.data.refresh.token)
      localStorage.setItem('token', data.data.access.token)
    }
    return data.data.refresh.token
  } catch (error) {
    // localStorage.removeItem('refreshToken')
    // localStorage.removeItem('token')
    return null
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
  async function (err) {
    const originalRequest = err.config;
    if (err.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const access_token = await refreshAccessToken();
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
      return instance(originalRequest);
      //toast[convertStatus2Toast(null)]('Please login to continue use system')
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
