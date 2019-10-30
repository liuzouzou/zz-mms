<template>
  <!-- logo和文字 -->
  <div class="head">
    <a href="#/">
      <img class="logo" src="@/assets/Logo1.png" width="25px" />
      <span class="company">邹邹管理系统</span>
    </a>

    <!--  下拉菜单-->
    <el-dropdown @command="handleCommand"><!--  绑定指令-->
      <span class="el-dropdown-link">
        系统管理
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
          <!-- icon是修改图标 ，command是点击后传给方法的值-->
        <el-dropdown-item icon="el-icon-edit" command="edit">>修改密码</el-dropdown-item>
    
        <el-dropdown-item icon="el-icon-s-operation" command="quit">>退出登录</el-dropdown-item>
       
      </el-dropdown-menu>
    </el-dropdown>
  </div>

  <!--  右边区域-->
</template>

<script>
import {logout} from '@/api/login.js'  // 导入退出登录的接口函数

  export default {
    methods: {
      handleCommand(command) {
        switch (command) {
          case 'edit':
            // 修改密码
            this.$message('修改密码');
            break;

          case 'quit':
            // 退出登录
            // 获取token，在浏览器的localStorage里存着
            logout(localStorage.getItem("zz-mms-user")).then(response =>{
              const res = response.data
              if (res.flag){
                // 退出成功，清除本地数据
                    localStorage.removeItem("zz-mms-user");
                    localStorage.removeItem("zz-mms-token");
                    this.$router.push('/login')
              }else{
                // 退出失败
                this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'warning'
        });
              }
            })
            break;
        
          default:
            break;
        }
      }
    }
  }
</script>

<style scoped>
/* logo */
.logo {
  vertical-align: middle; /* 居中 */
  padding: 0px 10px 0px 40px; /* 上右下左 */
}

/* 文字 */
.company {
  position: absolute;
  color: white;
}

/* 下拉菜单 */
.el-dropdown{
    float: right; /* 浮动在右边 */
    margin-right: 40px; /* 靠右40px */
}
/* 系统管理 */
.el-dropdown-link{
    color: white;
    cursor: pointer; /* 鼠标放上去是手的形状 */
}
</style>