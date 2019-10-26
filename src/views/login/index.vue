  <template>
  <div class="login-container">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px" class="login-form">
      <h2 class="login-title">管理系统</h2>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
    <script>
import { login, getUserInfo } from "@/api/login"; // 导入登录和获取用户信息的方法
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { min: 3, max: 10, message: "用户名3-5位", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 3, max: 10, message: "密码3-5位", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        // console.log(valid) 验证通过为true，有一个不通过就是false
        if (valid) {
          // 提交表单给后台验证是否正确
          login(this.form.username, this.form.password).then(response => {
            const res = response.data;
            console.log(res, res.flag, res.data.token, res.message);
            if (res.flag) {
              // 验证成功，通过token获取用户信息
              getUserInfo(res.data.token).then(response => {
                const resUser = response.data;
                if (resUser.flag) {
                  // 获取到了用户信息
                  console.log("userInfo", resUser.data);
                  // 保存token和用户信息
                  localStorage.setItem(
                    "zz-mms-user",
                    JSON.stringify(resUser.data)
                  );
                  localStorage.setItem("zz-mms-token", res.data.token);

                  // 前往首页
                  this.$router.push("/");
                } else {
                  // 使用elementui的消息提示
                  this.$message({
                    message: resUser.message,
                    type: "warning"
                  });
                }
              });
            }else {
          // 未通过，弹出警告
          // 使用elementui的消息提示
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
          });
        } else {
          // 验证未通过，弹出警告
          // 使用elementui的消息提示
        
          this.$message.error('验证未通过');
        }
      });
    }
  }
};
</script>

  <style acoped>
.login-form {
  width: 350px;
  margin: 160px auto; /* 上下间距160px，左右自动居中*/
  background-color: rgb(255, 255, 255, 0.8); /* 透明背景色 */
  padding: 30px;
  border-radius: 20px; /* 圆角 */
}

/* 背景 */
.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("../../assets/login.png");
}

/* 标题 */
.login-title {
  color: #303133;
  text-align: center;
}
</style> -->