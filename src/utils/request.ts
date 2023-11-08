// 进行axios的二次封装
import axios from 'axios';
import { ElMessage } from 'element-plus';

// 第一步：创建一个axios实例
const request = axios.create({
  // 请求的基础路径
  baseURL: '/api',
  // 超时时间
  timeout: 10000,
});

// 第二步：request 实例添加请求和响应拦截器
request.interceptors.request.use((config) => {
    // config 配置对象，headers 请求头对象,经常给服务器端携带公共参数
    // 返回配置对象
    return config;
})

// 第三步：响应拦截器
request.interceptors.response.use((response) => {
    //成功的回调
    return response.data;
},(error) => {
    //失败的回调:处理http错误状态码
    //定义一个变量来接收错误信息
    let message = '';
    const status = error.response.status;
    switch(status){
        case 401:
            message = "Token 过期";
            break;
        case 403:
            message = "禁止访问";
            break;
        case 404:
            message = "资源不存在";
            break;
        case 500:
            message = "服务器内部错误";
            break;
        default:
            message = "未知错误";
            break;
    }
    // 提示错误信息
    ElMessage({
        type: 'error',
        message,
    });

    return Promise.reject(error);
})

// 第四步：对外暴露
export default request;