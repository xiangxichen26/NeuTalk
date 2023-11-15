<template>
  <div class="common-layout">
    <el-container>
      <!--header-->
      <el-header class="homeHeader">
        <!--logo-->
        <div class="logo">
          <img src="../assets/logo.svg" />
          <div>NEU Talk</div>
        </div>
        <div class="headerRight">
          <!--create button-->
          <el-button type="primary" round size="small" class="createButton" @click="createFormVisible = true">Create</el-button>
          <!--vatar-->
          <el-dropdown class="avatar-container" trigger="click" @command="handleCommand">
            <div class="avatar-wrapper">
              <el-avatar shape="circle" :size="40">
                <img src="../assets/user.svg">
              </el-avatar>
              <i class="el-icon-s-tools"></i>
            </div>
            <template #dropdown>
              <el-dropdown-menu class="user-dropdown">
                <el-dropdown-item command='logout'>
                  Log out
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <!--main-->
      <el-main class="homeMain">

      </el-main>
    </el-container>
  </div>
  <el-dialog v-model="createFormVisible" title="Create a post" class="createDialog">
    <el-form :model="createPostForm">
      <el-form-item label="title" >
        <el-input v-model="createPostForm.title" maxlength="100" type="textarea"  autosize=true show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="Content" >
        <el-input v-model="createPostForm.content" maxlength="1000" type="textarea" autosize=true show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="createFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click='createPost'>
          Create
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>


<script lang="ts">
import { ElMessage } from 'element-plus';
import { getCurrentInstance,ref,reactive } from 'vue'
import { useRoute } from 'vue-router';

export default {
  setup() {
    const { proxy } = getCurrentInstance() as any;

    const router = useRoute();

    const createFormVisible = ref(false);

    const createPostForm = reactive({
      title: '',
      content: ''
    });


    const createPost = () => {
      proxy.$post('new/', createPostForm)
        .then((res: any) => {
          ElMessage.success('Create post successfully');
          createFormVisible.value = false;
        })
        .catch((err: any) => {
          ElMessage.error('Create post failed');
          console.log(err)
        })
      
    };

    const handleCommand = (command: string | number | object) => {
      if (command === 'logout') {
        proxy.$post('logout/')
          .then((res: any) => {
            window.localStorage.clear();
            ElMessage.success('Log out successfully');
          })
          .catch((err: any) => {
            ElMessage.error('Log out failed');
            console.log(err)
          })
      }
    };

    
    return {
      handleCommand,
      createPost,
      createFormVisible,
      createPostForm,
    }

  }

}

</script>


<style scoped lang="scss">
.common-layout {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.homeHeader {
  height: 60px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--line-2, #E5E6EB);
  background: var(--fill-1, #FFF);

  .logo {
    display: flex;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
    font-family: PingfangSC-Medium;
    color: #1D2129;

    img {
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }
  }

  .avatar {
    width: 40px;
    height: 40px;
  }
}

.headerRight {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.createButton {
  margin-right: 80px;
  display: flex;
  padding: 5px 16px;
  justify-content: center;
  align-items: center;
  gap: 8px;
}


.homeMain {
  background: var(--fill-2, #F7F8FA);
  display: flex;
  padding-bottom: 0px;
  flex-direction: column;
  align-items: center;
  gap: 37px;
  height: 91vh;
}

.createDialog {
  width: 500px;
  font-family: PingFangSC;
}



</style>
