<template>
  <!-- logo和文字 -->
  <div class="head">
    <a href="#/">
      <img class="logo" src="@/assets/Logo1.png" width="25px" />
      <span class="company">邹邹管理系统</span>
    </a>
    <!-- logo和文字结束 -->


    <!--  下拉菜单-->
    <el-dropdown @command="handleCommand"><!--  绑定指令-->
      <span class="el-dropdown-link">
        您好，{{user.name}}  <!--  登录的用户名-->
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
          <!-- icon是修改图标 ，command是点击后传给方法的值-->
        <el-dropdown-item icon="el-icon-edit" command="edit">>修改密码</el-dropdown-item>
    
        <el-dropdown-item icon="el-icon-s-operation" command="quit">>退出登录</el-dropdown-item>
       
      </el-dropdown-menu>
    </el-dropdown>
      <!--  下拉菜单结束-->


    <!-- 修改密码弹出框开始 -->
    <!-- status-icon验证通过打√，失败打× -->
    <el-dialog title="修改密码" :closeOnClickModal=false :visible.sync="dialogFormVisible" width="400px">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="密码" prop="oldPass">
              <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="pass">
              <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <!-- 修改密码弹出框结束 -->

  </div>

</template>

<script>
import {logout} from '@/api/login.js'  // 导入退出登录的接口函数
import passwordApi from '@/api/password'
  export default {
    data(){
      // 在return上面进行声明自定义校验
      const validateOldPass = (rule, value,callback)=>{
        // console.log(this.user.id, value)
        // value就是输入的值
        passwordApi.checkPwd(this.user.id, value).then(response=>{
          const res = response.data
          if (res.flag){
            // 验证通过
            callback()
          }else{
            // 显示错误信息
            callback(new Error(res.message))
          }
        })
      }


      // 校验密码是否一致
      const validatePass = (rule, value, callback)=>{
        // value就是确认密码，this.ruleForm.pass是新密码
        if(value !==this.ruleForm.pass){
          callback(new Error('两次密码不一致'))
        }else{
          // 两次密码相同
          callback()
        }
      }

      // 在return上面进行声明自定义校验，不能以逗号结束
      return{
        // zz-mms-user：{"id":3338,"name":"谢平","roles":["manager"]}
        user: JSON.parse(localStorage.getItem('zz-mms-user')),  // 拿出来的是json，解析成对象的形式
        dialogFormVisible: false,
        rules:{
           oldPass: [
             { required: true, message: "原密码不能为空", trigger: "blur" },
            //  validator自定义校验，会调用validateOldPass
             {validator: validateOldPass, trigger: 'blur'}
               ],
           pass: [{ required: true, message: "新密码不能为空", trigger: "blur" }],
           checkPass: [
             { required: true, message: "确认密码不能为空", trigger: "blur" },
            //   validator自定义校验，会调用validatePass，值改变时就验证
             {validator: validatePass, trigger: 'change'}
                      ]
        },
        ruleForm:{
          // 校验的字段
          oldPass:'',
          pass: '',
          checkPass: ''
        }

      }
    },
    methods: {
      handleCommand(command) {
        switch (command) {
          case 'edit':
            // 修改密码
            this.handlePwd()
            break;

          case 'quit':
            // 退出登录
              this.handleLogout()
            break;
        
          default:
            break;
        }
      },
      // 退出登录
      handleLogout(){
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
      },
      // 打开修改密码窗口
      handlePwd(){
        // 打开弹框
          this.dialogFormVisible = true
          // 清除数据
          this.$nextTick(()=>{
            this.$refs['ruleForm'].resetFields()
          })
      },
    // 修改密码输入框重置功能
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 修改密码
    submitForm(formName){
      this.$refs[formName].validate(valid =>{
        if (valid){
          console.log('校验成功')
          passwordApi.updatePwd(this.user.id, this.ruleForm.checkPass).then(response=>{
            const res = response.data
            // 不管失败还是成功，都进行提示
            this.$message({
              message: res.message,
              type: res.flag ? 'success' : 'warning'
            })

            if(res.flag){
              // 更新成功，退出登录，回到登录页面
              this.handleLogout()
              // 关闭修改密码窗口
              this.dialogFormVisible = false
            }

          })
        }else{
          // 校验不通过
          return false
        }
      })
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