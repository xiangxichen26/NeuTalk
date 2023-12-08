<template>
  <div class="common-layout">
    <el-container>
      <!--header-->
      <el-header class="homeHeader">
        <!--logo-->
        <div class="logo">
          <img src="../assets/logo.png" />
          <div class="logoFont">NEU Talk</div>
        </div>

        <div class="headerRight">
          <!--create button-->
          <el-button type="primary" round class="createButton" @click="createFormVisible = true">Create</el-button>
          <!--collections-->
          <el-tooltip class="box-item" effect="dark" content="My collections" placement="top-start">
          <el-button class="collectionButton" color="#f2f3f5" :icon="Star" circle @click="goToCollectionList">
          </el-button>
        </el-tooltip>
          <!--my post-->
          <el-tooltip class="box-item" effect="dark" content="My posts" placement="top-start">
            <el-button class="myPostButton" color="#f2f3f5" :icon="Folder" circle @click="goToMyPostList">
            </el-button>
          </el-tooltip>
          <!--vatar-->
          <el-dropdown class="avatar-container" trigger="click" @command="handleCommand">
            <div class="avatar-wrapper">
              <el-avatar shape="circle" :size="32">
                <img src="../assets/user.png">
              </el-avatar>
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
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
  <!--create post dialog-->
  <el-dialog v-model="createFormVisible" title="Create a post" class="createDialog">
    <el-form :model="createPostForm">
      <el-form-item label="Title">
        <el-input class="createFormItem" v-model="createPostForm.title" maxlength="100" type="textarea" autosize=true
          show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="Content">
        <el-input v-model="createPostForm.content" maxlength="1000" type="textarea" autosize=true
          show-word-limit></el-input>
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
import { getCurrentInstance, ref, reactive } from 'vue'
import { useRouter } from 'vue-router';
import { formatTime } from '../utils/time';
import { ChatLineRound, Search, Star, Folder } from '@element-plus/icons-vue';
import axios from 'axios';

export default {
  setup() {
    const { proxy } = getCurrentInstance() as any;

    const router = useRouter();

    const createFormVisible = ref(false);

    const usernameSearch = ref('');

    const createPostForm = reactive({
      title: '',
      content: ''
    });

    const postList = ref([
      {
        post_id: "",
        title: "",
        content: "",
        author_username: "",
        created_at: "",
      }
    ]);


    const createPost = () => {
      axios.post('new/', createPostForm)
        .then(() => {
          createPostForm.content = '';
          createPostForm.title = '';
          if (window.location.pathname === '/postList') {
            window.location.reload();
          }
          else {
            router.push({ path: '/postList' });
          }
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
        axios.post('logout/')
          .then(() => {
            window.sessionStorage.clear();
            ElMessage.success('Log out successfully');
            router.push({ path: '/login' });
          })
          .catch((err: any) => {
            ElMessage.error('Log out failed');
            console.log(err)
          })
      }
    };

    const handleClick = (tab: any) => {
      if (tab.name === 'Home') {
        router.push({ path: '/' });
        console.log('Home')
      }
      else if (tab.name === 'My Collection') {
        router.push({ path: '/postCollections' });
        console.log('My Collection')
      }
    };

    const getPostList = () => {
      axios.get('threads/')
        .then((res: any) => {
          postList.value = res;
          console.log(postList.value)
        })
        .catch((err: any) => {
          console.log(err)
        })
    };

    const goToCollectionList = () => {
      router.push({ path: '/myCollectionList' });
    };

    const goToMyPostList = () => {
      router.push({ path: '/myPostList' });
    };


    return {
      handleCommand,
      createPost,
      createFormVisible,
      createPostForm,
      formatTime,
      ChatLineRound,
      handleClick,
      getPostList,
      usernameSearch,
      Search,
      Star,
      Folder,
      goToCollectionList,
      goToMyPostList,
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

.logoFont {
  font-family: PingFang SC;
}

.el-container {
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
    font-family: PingfangSC;
    color: #1D2129;

    img {
      width: 40px;
      // height: 40px;
      margin-right: 10px;
    }
  }

  .avatar {
    width: 35px;
    height: 35px;
  }
}

.headerRight {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.searchInput {
  width: 200px;
  margin-right: 20px;
}

.createButton {
  margin-right: 85px;
}

.collectionButton {
  width: 32px;
  height: 32px;
}

.myPostButton {
  width: 32px;
  height: 32px;
  margin-right: 16px;
}


.homeMain {
  background: var(--fill-2, #F7F8FA);
  display: flex;
  flex-direction: column;
  align-items: center;
  // height: 91vh;
}

.createDialog {
  width: 500px;
  font-family: PingFangSC;
}
</style>
