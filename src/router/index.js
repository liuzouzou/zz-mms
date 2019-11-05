import Vue from "vue";
import Router from "vue-router";
// import Login from '@/views/login/index'

// 下面的情况，默认会导入@/views/login下的index.vue组件
import Login from '@/views/login'  // 登录
import Layout from '@/components/Layout.vue' // 布局
import Home from '@/views/home/index.vue' // 首页
import Member from '@/views/member' // 会员管理
import Supplier from '@/views/supplier' // 供应商管理
import Staff from '@/views/staff' // 员工管理
import Goods from '@/views/goods' // 商品管理

Vue.use(Router);

// 不写下面的，点击相同的路由会报错
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};


export default new Router({
      routes: [
        {
          path: '/login', // 登录
          name: 'login', // 路由名称
          component: Login // 组件对象
        },
        {
          path: '/',  // 首页
          name: 'layout',
          component: Layout,
          redirect: '/home',  // 重定向到home路由
          children: [  // home是布局的子组件，写在children里
            {
              // 当访问/home时，会找到它的父组件Layout.vue，而我们
              // 的出口是在AppMain下的index.vue里写的，所以会渲染在主区域页面上
              path: '/home',  
              component: Home,
              meta: {title: '首页'}
            }
            // {
            //   path: '/member',  // 会员管理
            //   component: Member  这样写可以，也可以以下面的方式写
            // }
          ]

        },
        {
          path: '/member',
          component: Layout, // 访问/member时加载的是Layout组件
          children:[
              {
                path: '/',  // 等价于 /member/,因为AppNavbar下的index.vue写的是/member/
                component: Member,
                meta: {title: '会员管理'}
              }
          ]
          
        },
        {
          path: '/supplier',
          component: Layout,
          children:[
              {
                path: '/',  
                component: Supplier,
                meta: {title: '供应商管理'}
              }
          ]
          
        },
        {
          path: '/goods',
          component: Layout,
          children:[
              {
                path: '/',  
                component: Goods,
                meta: {title: '商品管理'}
              }
          ]
          
        },
        {
          path: '/staff',
          component: Layout,
          children:[
              {
                path: '/',  
                component: Staff,
                meta: {title: '员工管理'}
              }
          ]
          
        }
      ]
});

