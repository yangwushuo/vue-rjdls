//对于axios进行二次封装
import axios from 'axios';

import store from '@/store'
//使用进度条
import nprogress from 'nprogress'
// nprogress.configure({  });
//引入进度条样式
import 'nprogress/nprogress.css'

const requests = axios.create({
  baseURL: '/api',
  timeout: 50000,
});

requests.interceptors.request.use((config) => {
  nprogress.start()

  //每次发送请求需要获取本机id
  //添加token

  return config;
})

requests.interceptors.response.use(
  (res) => {
    nprogress.done();
    return res.data;
  },
  (error) => {
    nprogress.done();
    console.log("request err:",error);
    return Promise.reject(new Error('faile'));
  }
)

//对外暴露
export default requests;