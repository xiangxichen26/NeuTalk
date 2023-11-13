// 进行axios的二次封装
import axios from 'axios'
import router from '../router'
import { ElMessage } from 'element-plus'

// 1. 配置默认请求地址
axios.defaults.baseURL = 'api'

// 2. 设置请求超时时间
axios.defaults.timeout = 10000

// 3. 自动携带cookie
axios.defaults.withCredentials = true

axios.interceptors.request.use( //响应拦截
    async config => {
        // 每次发送请求之前判断vuex中是否存在token        
        // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
        // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断 
        config.headers.token = sessionStorage.getItem('token')
        return config;
    },
    error => {
        return Promise.reject(error);
    })
// 响应拦截器
axios.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return Promise.resolve(response); //进行中        
        } else {
            return Promise.reject(response); //失败       
        }
    },
    // 服务器状态码不是200的情况    
    error => {
        if (error.response.status) {
            switch (error.response.status) {
                // 401: 未登录                
                // 未登录则跳转登录页面，并携带当前页面的路径                
                // 在登录成功后返回当前页面，这一步需要在登录页操作。                
                case 401:
                    router.replace({
                        path: '/login',
                        query: {
                            redirect: router.currentRoute.value.fullPath
                        }
                    });
                    break;
                // 404请求不存在                
                case 404:
                    ElMessage.error(error.response.data.message);
                    break;
                // 其他错误，直接抛出错误提示                
                default:
                    ElMessage.error(error.response.data.message);
            }
            return Promise.reject(error.response);
        }
    }
);
/** 
 * get方法，对应get请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
const $get = (url: string, params: object) => {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params,
        })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}
/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
const $post = (url: string, params: object) => {
    return new Promise((resolve, reject) => {
        axios.post(url, params) //是将对象 序列化成URL的形式，以&进行拼接   
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}

export default {
  install: (app: any) => {
      app.config.globalProperties['$get'] = $get;
      app.config.globalProperties['$post'] = $post;
      app.config.globalProperties['$axios'] = axios;
  }
}