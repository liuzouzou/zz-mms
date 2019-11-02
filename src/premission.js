// 权限校验，要在main.js文件里导入才会有效

/*
Vue Router中的前置钩子函数beforeEach(to, from, next)
当进行路由跳转之前，进行判断是否已经登录过，登录过则允许访问非登录页面，否则，回到登录页面

to：即将要进入的目标路由对象
from：即将要离开的路由对象
next：是一个方法，可以指定路由地址，进行路由跳转
*/

import router from './router'  // 所有的路由跳转都是在这个里面的
import {getUserInfo} from './api/login'   // 获取用户信息的接口

router.beforeEach((to, from, next)=>{
    // 获取token
    const token = localStorage.getItem('zz-mms-token')

    if(!token){
        // 如果没有获取到，要访问非登录页面，则不让访问，回到登录页面 /login
        if(to.path !== '/login'){
            next({path: '/login'})
        }else{
            // 请求登录页面
            next()
        }
    }else{
        // 获取到token，
        // 请求路由是/login，则去目标路由
        if(to.path === '/login'){
            next()
        }else{
            // 请求路由非登录页面，先在本地查看是否有用户信息
            const userInfo = localStorage.getItem('zz-mms-user')
            if (userInfo){
                // 本地获取到，则直接去目标路由
                next()
            }else{
                // 如果本地没有，则通过token获取用户信息
                getUserInfo(token).then(response=>{
                    const res = response.data
                    if(res.flag){
                        // 如果获取到用户信息，则进行非登录页面，否则回到登录页面
                        // 保存到本地
                        localStorage.setItem('zz-mms-user',JSON.stringify(res.data))
                        next()
                    }else{
                        // 未获取到用户信息，重新登录
                        next({path: '/login'})
                    }
                })
            }
        }
    }
})