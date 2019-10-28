import Vue from "vue";
import Router from "vue-router";
// import Login from '@/views/login/index'

// 下面的情况，默认会导入@/views/login下的index.vue组件
import Login from '@/views/login'
import Layout from '@/components/Layout.vue'
import Member from '@/views/member'

Vue.use(Router);



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
          component: Layout
        },
        {
          path: '/member',
          name: 'member',
          component: Member
        }
        
      ]
});

