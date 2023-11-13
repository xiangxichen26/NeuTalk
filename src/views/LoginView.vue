<template>
  <div class="loginContainer">
    <div class="loginBox">
      <!--left login img-->
      <div>
        <img class="loginImg" src="../assets/img/login.svg" />
      </div>
      <!--right login form -->
      <div class="loginForm" v-if="showLoginForm">
        <div class="loginWord">NEU Talk</div>
        <el-form class="loginInputForm">
          <el-form-item class="loginInputItem">
            <el-input
              placeholder="please input username"
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item class="loginInputItem">
            <el-input
              placeholder="please input password"
              :prefix-icon="Lock"
              type="password"
              v-model="loginForm.password"
            ></el-input>
          </el-form-item>
          <el-form-item class="loginButton">
            <el-button type="primary" @click="login">Login</el-button>
            <el-button>Cancel</el-button>
          </el-form-item>
        </el-form>
        <!--link to register-->
        <div class="linkToRegister">
          <span style="font-size: 14px">Do not have an account </span>
          <el-link :underline="false" type="primary" @click="showLoginForm = false"
            >Register</el-link
          >
        </div>
      </div>

      <!--right register form-->
      <div class="registerForm" v-if="showLoginForm === false">
        <div class="loginWord">NEU Talk</div>
        <el-form class="registerInputForm">
          <el-form-item class="registerInputItem">
            <el-input
              placeholder="please input username"
              :prefix-icon="User"
              v-model="registerForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item class="registerInputItem">
            <el-input
              placeholder="please input password"
              :prefix-icon="Lock"
              v-model="registerForm.password"
            ></el-input>
          </el-form-item>
          <el-form-item class="registerBotton">
            <el-button type="primary" @click = register >Register</el-button>
          </el-form-item>
        </el-form>
        <!--link to login-->
        <div class="linkToLogin">
          <span style="font-size: 14px">Already have an account </span>
          <el-link :underline="false" type="primary" @click="showLoginForm = true">Login</el-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, ref, getCurrentInstance } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const { proxy } = getCurrentInstance() as any;
    const loginForm = reactive({
      username: '',
      password: ''
    })
    const registerForm = reactive({
      username: '',
      password: ''
    })
    const router = useRouter();
    let showLoginForm = ref(true)

    // login function
    const login = () => {
      proxy.$post('login/', loginForm).then((res: any) => {
        ElMessage({
          message: 'Login successfully',
          type: 'success'
        });
        router.push({ path: '/' })
      })
      .catch((err: any) => {
        ElMessage({
          message: 'Login failed',
          type: 'error'
        });
        console.log(err)
      })
    }
    // register function
    const register = () => {
      proxy.$post('register/', registerForm)
      .then((res: any) => {
        // show login form
        showLoginForm.value = true;
        ElMessage({
          message: 'Register successfully',
          type: 'success'
        })
        console.log(res)
      })
      .catch((err: any) => {
        ElMessage({
          message: 'Register failed',
          type: 'error'
        });
        console.log(err)
      })
    }

    return {
      loginForm,
      registerForm,
      showLoginForm,
      login,
      register,
      User,
      Lock
    }
  }
}
</script>

<style scoped lang="scss">
.loginContainer {
  width: 100%;
  height: 100%;
}

.loginBox {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 700px;
  height: 400px;
  background-color: #fff;
  border-radius: 20px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px rgba(184, 182, 182);
}

.loginImg {
  width: 300px;
  margin-left: 50px;
}

.loginWord {
  font-family: PingFangSC-Semibold;
  font-size: 30px;
  font-weight: 400;
}

.loginForm {
  margin-right: 50px;
}

.loginInputForm {
  margin-top: 50px;
}

.loginInputItem {
  display: flex;
  flex-direction: row;
}

.registerForm {
  margin-right: 50px;
}
.registerInputForm {
  margin-top: 50px;
}

.registerInputItem {
  display: flex;
  flex-direction: row;
}
</style>
