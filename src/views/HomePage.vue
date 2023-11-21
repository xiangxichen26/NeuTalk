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
          <el-button type="primary" round size="small" class="createButton"
            @click="createFormVisible = true">Create</el-button>
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
        <!--post list-->
        <div class="postListCard">
          <div class="postItem" v-for="post in postList" :key="post.post_id" @click="getPostDetail(post.post_id)">
            <div class="postItemAvatar">
              <el-avatar shape="circle" :size="40">
                <img src="../assets/user.svg">
              </el-avatar>
            </div>
            <div class="postItemContent">
              <div class="postTitle">{{ post.author }} create a post: {{ post.title }}</div>
              <div class="postContent">{{ post.content }}</div>
              <div class="postTime">{{ formatTime(post.created_at) }}</div>
              <el-divider></el-divider>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
  <el-dialog v-model="createFormVisible" title="Create a post" class="createDialog">
    <el-form :model="createPostForm">
      <el-form-item label="Title">
        <el-input v-model="createPostForm.title" maxlength="100" type="textarea" autosize=true show-word-limit></el-input>
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
import { getCurrentInstance, ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { formatTime } from '../utils/time';
import { ChatLineRound } from '@element-plus/icons-vue';

export default {
  setup() {
    const { proxy } = getCurrentInstance() as any;

    const router = useRouter();

    const createFormVisible = ref(false);

    const createPostForm = reactive({
      title: '',
      content: ''
    });

    const postList = ref([
      {
        post_id:"",
        title:"",
        content:"",
        author:"",
        created_at:"",
      }
    ]);


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

    const getPostList = () => {
      //console.log(localStorage.getItem('token'))
      proxy.$get('threads/')
        .then((res: any) => {
          postList.value = res;
          console.log(postList.value)
        })
        .catch((err: any) => {
          console.log(err)
        })
    };

    const getPostDetail = (postid :String) => {
      let id = postid.toString();
      router.push({ name: 'postDetail', params: { id: id } })
    };

    onMounted(() => {
      getPostList();
    });


    return {
      handleCommand,
      createPost,
      createFormVisible,
      createPostForm,
      postList,
      formatTime,
      ChatLineRound,
      getPostDetail,
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
    font-family: PingfangSC-Medium;
    color: #1D2129;

    img {
      width: 40px;
      height: 40px;
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
  flex-direction: column;
  align-items: center;
  // height: 91vh;
}

.postListCard {
  width: 925px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 4px;
  background: var(--fill-1, #FFF);
  margin-top: 37px;
  padding: 20px 27px;
}

.postItem {
  height: auto;
  padding: 13px 20px;
  align-self: stretch;
  display: flex;
  flex-direction: row;
}

.postItemAvatar {
  width: 40px;
  margin-right: 16px;
}

.postItemContent {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
}


.postTitle {
  font-size: 14px;
  font-weight: 500;
  font-family: PingFangSC;
  line-height: 22px;
  color: #1D2129;
  margin-bottom: 10px;
}

.postContent {
  font-size: 14px;
  font-family: PingFangSC;
  font-weight: 400;
  line-height: 22px;
  color: #4E5969;
  margin-bottom: 10px;

}

.postTime {
  font-size: 12px;
  font-family: PingFangSC;
  font-weight: 400;
  color: #4E5969;
  display: flex;
  justify-content: flex-end;
}

.createDialog {
  width: 500px;
  font-family: PingFangSC;
}
</style>
