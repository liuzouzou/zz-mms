import axios from 'axios'
import { Loading } from 'element-ui'; // 加载loading
import { Message } from 'element-ui'; // 消息提示

// loading开启和关闭
const loading = {
    loadingInstance: null, // loading实例
    // 打开加载loading
    open: function(){
        // 创建实例，并且会打开加载窗口,找到class=main的标签会加载loading
        this.loadingInstance = Loading.service({target: '.main',text:'死命加载中',background:'rgba(0,0,0,0.5)'})
    },
    // 关闭实例
    close: function(){
        // 不为空时，则关闭加载窗口
        if(this.loadingInstance !== null){
            this.loadingInstance.close()
        }
        // 关闭之后置为null，下次才能正常调用
        this.loadingInstance = null
    }
}

const request = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, //基础路径,.env.development
    timeout: 5000 //超时时间，5000毫秒
})

// 请求拦截器，在调用ajax进行处理
request.interceptors.request.use(config =>{
    // 打开加载窗口
    loading.open()
    return config
},error =>{
    // 关闭加载窗口
    loading.close()
    // 出现异常
    return Promise.reject(error);
}
)


// 响应拦截器
request.interceptors.response.use(response =>{
    // 关闭加载窗口
    loading.close()
    return response
},error =>{
    // 关闭加载窗口
    loading.close()

    
    // 出现异常
    console.log('response.error', error.response.status)
    Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
        
    })
    
    return Promise.reject(error);
})

// request.get('./db.json').then(response =>{ // 使用request。而不是使用axios
//     console.log(response.data)
// })
export default request  // 导出自定义的axios对象