<template>
  <div class="LoginApp">
    <div class="formBox">
      <h1>酒店后台登录</h1>
      <el-form
        status-icon
        ref="loginForm"
        :model="formData"
        :rules="rules"
        label-width="80px"
        label-position="left"
      >
        <el-form-item prop="username">
          <el-input v-model="formData.username" placeholder="账号"
            ><template slot="prepend"><i class="el-icon-user"></i></template
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="formData.password"
            autocomplete="off"
            placeholder="密码"
            :show-password="true"
            ><template slot="prepend"><i class="el-icon-view"></i></template
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            class="loginBtn"
            type="primary"
            @click="submitForm('loginForm')"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from "../../api";

export default {
  name: "LoginApp",
  data() {
    var validatePass = (rules, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      formData: {
        username: "",
        password: "",
      },
      rules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          //   alert("submit!");
          //   const data = "username=" + this.formData.username + "&" + "password=" + this.formData.password;

          const params = new URLSearchParams();
          params.append("username", this.formData.username);
          params.append("password", this.formData.password);
          // console.log("ok", params);
          // 登录返回结果
          const loginData = await login(params);
          // console.log(loginData.status);
          if (loginData.data.code === 400) {
            this.$message.error("账号或者密码错误，请重新登录");
          } else if (loginData.status === 200 && loginData.data.code === 200) {
            // 存储token
            window.localStorage.token = loginData.data.data.token;
            window.localStorage.name = loginData.data.data.name;
            this.$message({
              message: "登录成功",
              type: "success",
            });
            this.$router.replace({ path: "/" });
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.LoginApp {
  width: 100vw;
  height: 100vh;
  background-color: rgb(43, 58, 75);
  display: flex;
  /* 横向剧中 */
  justify-content: center;
  /* 竖向剧中 */
  align-items: center;
}
.formBox {
  /* color: rgba(255,255,255,.7); */
  width: 400px;
  height: 300px;
  display: flex;
  flex-direction: column;
  /* 横向剧中 */
  justify-content: center;
  /* 竖向剧中 */
  align-items: center;
  color: white;
}
.el-form {
  margin-top: 30px;
}
h1 {
  font-size: 20px;
}
.loginBtn {
  width: 100%;
}
.el-form-item {
  margin-left: -80px;
}
</style>
