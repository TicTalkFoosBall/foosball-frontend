import axios from 'axios';
import { notification } from 'antd';
import storage from 'utils/storage';

// 新老版本切换按钮
const newVersion = false;

let domain = '';

if (newVersion) {
  domain = 'http://tanka-drf-admin.dev.tictalk.pro:8080';
} else {
  domain = 'https://api-admin-tanka-stage.tictalk.com';
}

export const baseURL = `${domain}`;

const http = axios.create({
  baseURL,
  timeout: 20000
});

http.newVersion = newVersion;

http.interceptors.request.use(request => {
  const token = storage.getToken();
  if (token) {
    request.headers.Authorization = `Admin ${token}`;
  }
  return request;
});

http.interceptors.response.use(
  response => {
    console.log(response);
    return response;
  },
  error => {
    const { response = {} } = error;
    notification.error({
      message: (response.data && response.data.error) || '请求失败',
      description: error.message
    });
    return Promise.reject(error);
  }
);

export default http;