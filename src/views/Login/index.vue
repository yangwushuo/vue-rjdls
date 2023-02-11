<template>
  <div class="login-wrapper" ref="vantaRef">
    <div class="container" :class="{ active: loginStatus }">
      <div class="form-container sign-up-container">
        <div class="form">
          <span style="height: 30px; color: #ff0b00">{{
            registerInfo.registerErr ? "注册失败" : ""
          }}</span>
          <h2>注册</h2>
          <div>
            <!-- <a-radio-group
              v-model="registerInfo.role"
              :default-value="registerInfo.role"
              type="button"
            >
              <a-radio value="1">客户</a-radio>
              <a-radio value="2">代理商</a-radio>
              <a-radio value="3">管理员</a-radio>
            </a-radio-group> -->
          </div>
          <input
            type="text"
            name="phone"
            id="phone"
            placeholder="手机号"
            v-model="registerInfo.phone"
            @change="accountInput"
            :class="{ 'input-err': registerInfo.phoneErr }"
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="密码"
            v-model="registerInfo.password"
            :class="{ 'input-err': registerInfo.passwordErr }"
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="确认密码"
            v-model="registerInfo.confirmPassword"
            @change="passwordInput"
            :class="{ 'input-err': registerInfo.passwordErr }"
          />
          <button class="signUp" @click="register">注册</button>
        </div>
      </div>
      <div class="form-container sign-in-container">
        <div class="form">
          <span style="height: 30px; color: #ff0b00">{{
            loginInfo.loginErr ? "登录失败" : ""
          }}</span>
          <h2>登录</h2>
          <div>
            <a-radio-group
              v-model="loginInfo.role"
              :default-value="loginInfo.role"
              type="button"
            >
              <a-radio value="1">客户</a-radio>
              <a-radio value="2">代理商</a-radio>
              <a-radio value="3">管理员</a-radio>
            </a-radio-group>
          </div>

          <input
            type="text"
            name="phone"
            id="phone"
            placeholder="手机号"
            v-model="loginInfo.phone"
            @change="accountInput"
            :class="{ 'input-err': loginInfo.phoneErr }"
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="密码"
            v-model="loginInfo.password"
            @change="passwordInput"
            :class="{ 'input-err': loginInfo.passwordErr }"
          />
          <a href="#" class="forget-password">忘记密码</a>
          <button class="signIn" @click="login">登录</button>
        </div>
      </div>
      <div class="overlay_container">
        <div class="overlay">
          <!-- overlay left -->
          <div class="overlay_panel overlay_left_container">
            <h2>欢迎回来!</h2>
            <p>为了与我们保持联系，请使用您的个人信息登录</p>
            <button id="sign-in" @click="toSignIn">登录</button>
          </div>
          <div class="overlay_panel overlay_right_container">
            <h2>你好!</h2>
            <p>输入您的个人详细信息并开始我们的旅程</p>
            <button id="sign-up" @click="toSignUp">注册</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "@vue/reactivity";
import { useRouter, useRoute } from "vue-router";
import store from "@/store";
import _ from "lodash";
import { reqCustomerRegister } from '@/api';
import { NotificationSuccess } from "@/common/Notification";
export default {
  name: "Login",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const loginStatus = ref(false);

    var loginInfo = reactive({
      role: "1",
      phone: "",
      password: "",
      phoneErr: false,
      passwordErr: false,
      loginErr: false,
    });

    var registerInfo = reactive({
      phone: "",
      password: "",
      confirmPassword: "",
      phoneErr: false,
      passwordErr: false,
      registerErr: false,
    });

    function login() {
      //校验学号密码
      if (!(loginInfo.phone && loginInfo.password)) {
        //提示
        if (!loginInfo.phone) {
          loginInfo.phoneErr = true;
        }

        if (!loginInfo.password) {
          loginInfo.passwordErr = true;
        }

        return;
      }

      //请求登录
      store
        .dispatch("userstore/login", {
          role: loginInfo.role,
          phone: loginInfo.phone,
          password: loginInfo.password,
        })
        .then(() => {
          //登录成功跳转
          loginInfo.loginErr = false;
          if (route.query.redirect) {
            router.push({
              name: route.query.redirect,
              query: _.omit(route.query, ["redirect"]),
            });
          } else {
            router.push("/");
          }
        })
        .catch((err) => {
          console.log(err.message);
          loginInfo.loginErr = true;
        });
    }

    function register() {
      console.log("开始注册");
      //校验学号，两次密码
      if(!registerInfo.phone){
        registerInfo.phoneErr = true
        return 
      }

      if(!(registerInfo.password == registerInfo.confirmPassword) || !registerInfo.password || !registerInfo.confirmPassword){
        registerInfo.passwordErr = true
        return
      }

      //请求注册
      reqCustomerRegister({
        phone: registerInfo.phone,
        password: registerInfo.confirmPassword
      }).then(res => {
        console.log(res);
        if(res.code == 1){
          NotificationSuccess({
            title: "注册成功"
          })
          loginStatus.value = false
          registerInfo.phone = ""
          registerInfo.password = ""
          registerInfo.confirmPassword = ""
        }else{
          registerInfo.registerErr = true
        }
      }).catch(err => {
        console.log(err);
        registerInfo.registerErr = true
      })
      //注册成功跳转
      //注册失败提示
    }

    function toSignIn() {
      loginStatus.value = false;
    }

    function toSignUp() {
      loginStatus.value = true;
    }

    function accountInput() {
      if (loginInfo.phone) {
        loginInfo.phoneErr = false;
      }

      if(loginInfo.loginErr){
        loginInfo.loginErr = false
      }

      if (registerInfo.phone) {
        registerInfo.phoneErr = false;
      }

      if(registerInfo.registerErr){
        registerInfo.registerErr = false
      }

    }

    function passwordInput() {
      if (loginInfo.password) {
        loginInfo.passwordErr = false;
      }

      if(loginInfo.loginErr){
        loginInfo.loginErr = false
      }

      if(registerInfo.confirmPassword){
        registerInfo.passwordErr = false;
      }

      if(registerInfo.registerErr){
        registerInfo.registerErr = false
      }

    }

    return {
      loginInfo,
      registerInfo,
      loginStatus,
      login,
      register,
      toSignIn,
      toSignUp,
      accountInput,
      passwordInput,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/common.scss";
// * {
//   margin: 0;
//   padding: 0;
//   box-sizing: border-box;
// }
.login-wrapper {
  height: 80vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

h2 {
  margin-bottom: 10px;
  font-size: 32px;
  text-transform: capitalize;
}

.container {
  position: relative;
  width: 768px;
  height: 480px;
  background-color: white;
  box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px,
    rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;
  border-radius: 10px;
  overflow: hidden;
}

.form-container {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  background-color: white;
  transition: all 0.6s ease-in-out;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
  padding: 0 50px;
}

input {
  width: 100%;
  margin: 8px 0;
  padding: 12px;
  background-color: #eee;
  border: none;
  outline: none;
}

.input-err {
  box-shadow: rgba(237, 28, 36, 1) 0px 0px 0px 2px;
}

.forget-password {
  display: inline-block;
  height: 20px;
  text-decoration: none;
  color: #bbb;
  text-transform: capitalize;
  font-size: 12px;
}

.forget-password:hover {
  color: lightslategray;
  border-bottom: 2px solid $bc1;
}

button {
  background: $bc1;
  padding: 10px 50px;
  border: 1px solid transparent;
  border-radius: 20px;
  text-transform: uppercase;
  color: white;
  margin-top: 10px;
  outline: none;
  transition: transform 80;
}

button:active {
  transform: scale(0.95);
}

.overlay_container {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  z-index: 100;
  right: 0;
  overflow: hidden;
  transition: all 0.6s ease-in-out;
}

.overlay {
  position: absolute;
  width: 200%;
  height: 100%;
  left: -100%;
  background-color: $bc1;
}

.overlay_panel {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100%;
  color: white;
  padding: 0 40px;
  text-align: center;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.overlay_panel button {
  background-color: transparent;
  border: 1px solid white;
}

.overlay_panel p {
  font-size: 12px;
  margin: 10px 0 15px 0;
}

.overlay_right_container {
  right: 0;
}

.container.active .sign-up-container {
  transform: translateX(100%);
  z-index: 5;
}

.container.active .sign-in-container {
  transform: translateX(100%);
}

.container.active .overlay_container {
  transform: translateX(-100%);
}

.container.active .overlay {
  transform: translateX(50%);
}
</style>