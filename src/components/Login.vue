<template>
  <div class="container">
    <div></div>
    <div class="loginContent">
      <el-form
        :model="userData"
        status-icon
        :rules="rules"
        ref="user"
        :label-position="labelPosition"
        label-width="80px"
        size="mini"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="userData.userName" autocomplete="off">
            <i slot="prefix" class="el-input__icon el-icon-message"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="userData.password" autocomplete="off">
            <i slot="prefix" class="el-input__icon el-icon-edit"></i>
          </el-input>
        </el-form-item>
        <div>
          <el-button class="submit" type="primary" size="medium" @click="submitForm('user')">登录</el-button>
        </div>
        <div class="foot">
          <span class="footSpan" @click="jump('doctorRegister')">医生注册</span>
          <span class="footSpan" @click="jump('patientRegister')">患者注册</span>
          <span class="footSpan" @click="jump('forget')">忘记密码</span>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import qs from 'qs'
export default {
  data() {
    return {
      userData: {
        userName: "",
        password: "",
        status: ""
      },
      labelPosition: "left",
      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 1, message: "用户名不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 1, message: "密码不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.axios
            .post("http://47.102.198.100:9999/api/system/login", {
              userName: this.userData.userName,
              password: this.userData.password
            })
            .then(res => {
              if ((res.data.loginStatus+'') == "true") {
                if ((res.data.userType+'' )== "patient") {
                  this.$router.push({ path: "/mainUser" });
                }else{
                   this.$router.push({ path: "/mainDoc" });
                }
              }
            })
            .catch(res => {
              console.log(res);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    jump(type) {
      switch (true) {
        case type == "doctorRegister":
          this.$router.push({ path: "/doctorRegister" });
          break;
        case type == "patientRegister":
          this.$router.push({ path: "/patientRegister" });
          break;
        case type == "forget":
          this.$router.push({ path: "/forget" });
          break;
      }
    }
  }
};
</script>
<style scoped>
.container {
  min-height: 600px;
  height: 100%;
}
.loginContent {
  background: rgba(143, 193, 250, 0.603);
  display: inline-block;
  border-radius: 4px;
  position: absolute;
  width: 300px;
  padding: 50px 10px;
  /* height: 220px; */
  top: 50%;
  right: 0;
  transform: translate(-50%, -50%);
}
.submit {
  width: 100%;
}
.footSpan {
  cursor: pointer;
  font-size: 12px;
  float: right;
  margin-left: 10px;
  color: black;
  text-decoration: underline;
}
.foot {
  margin-top: 10px;
}
</style>

