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
  export default {
    methods: {
      handleCommand(command) {
        this.$message('click on item ' + command);
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