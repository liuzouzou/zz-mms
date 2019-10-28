<template>
  <div class="navbar">
    <!--default-active默认选中的菜单，选中后颜色是 active-text-color  -->
    <!--  :router='true',true表示开启路由模式，开启之后，index值代表的就是路由地址-->
    <!-- :router='true'开启之后点击就会跳转到对应的路由，默认为false -->
    <el-menu
     :router='true'
      default-active="/"
      class="el-menu-vertical-demo"

      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
     
       <!-- class就是icon -->
      <el-menu-item index="/">
        <i class="el-icon-menu"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/member/">
        <i class="el-icon-s-custom"></i>   
        <span slot="title">会员管理</span>
      </el-menu-item>
      <el-menu-item index="/supplier/">
        <i class="el-icon-menu"></i>
        <span slot="title">供应商管理</span>
      </el-menu-item>
      <el-menu-item index="/goods/">
        <i class="el-icon-suitcase-1"></i>
        <span slot="title">商品管理</span>
      </el-menu-item>
      <el-menu-item index="/staff/">
        <i class="el-icon-user"></i>
        <span slot="title">员工管理</span>
      </el-menu-item>
      
    </el-menu>
  </div>
</template>


<style scoped>
/* 去掉右边框 */
.el-menu{
      border-right: none;
}

</style>