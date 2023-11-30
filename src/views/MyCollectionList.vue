<template>
    <div>
        <!--page header-->
        <el-page-header @back="goToPostList">
            <template #content>
                <span class="headerTitle"> My Collection </span>
            </template>
        </el-page-header>
        <!--post list-->
        
        <div v-if="postList.length !== 0" class="postListCard">
            <div class="postItem" v-for="post in postList" :key="post.id" @click="getPostDetail(post.post_detail.post_id)">
                <div class="postItemAvatar">
                    <el-avatar shape="circle" :size="40">
                        <img src="../assets/user.png">
                    </el-avatar>
                </div>
                <div class="postItemContent">
                    <div class="postHeader">
                        <div class="postUser">{{ post.post_detail.author_username }} create a post: </div>
                        <div class="postTitle">{{ post.post_detail.title }}</div>
                    </div>
                    <div class="postContent">{{ post.post_detail.content }}</div>
                    <div class="postTime">{{ formatTime(post.post_detail.created_at) }}</div>
                    <el-divider class="dividerLine"></el-divider>
                </div>
            </div>
        </div>
        <div class="emptyImg" v-else>
            <el-empty description="No Data" />
        </div>
    </div>
</template>
  
<script lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { formatTime } from '../utils/time';
import { ChatLineRound, Search } from '@element-plus/icons-vue';
import axios from 'axios';


export default {
    setup() {
        const router = useRouter();

        const postList = ref([
            {
                id: "",
                post_detail: {
                    post_id: "",
                    title: "",
                    content: "",
                    author_username: "",
                    created_at: "",
                }
            },
        ]);


        const getPostDetail = (postid: String) => {
            let id = postid.toString();
            router.push({ name: 'postDetail', params: { id: id } })
        };

        const goToPostList = () => {
            router.push({ path: "/postList" });
        };

        const getMyCollectionList = () => {
            axios.get('favorites/')
                .then((res: any) => {
                    postList.value = res.data;
                    console.log(postList.value)
                })
                .catch((err: any) => {
                    console.log(err)
                })
        };


        onMounted(() => {
            getMyCollectionList();
        });


        return {
            postList,
            formatTime,
            ChatLineRound,
            getPostDetail,
            Search,
            goToPostList,
            getMyCollectionList,
        }
    }
}


</script>
  
<style scoped>

.headerTitle {
    font-family: PingFang SC;
    font-size: 14px;
    font-style: normal;
    color: #4E5969;
}

.postListCard {
    width: 925px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 4px;
    background: var(--fill-1, #FFF);
    padding: 20px 27px;
    margin-top: 13px;
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
    font-family: PingFang SC;
}

.postHeader {
    display: flex;
    flex-direction: row;
    align-items: center;

}

.postUser {
    font-family: PingFang SC;
    font-size: 14px;
    color: #4E5969;

}


.postTitle {
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 450;
    color: #1D2129;
    margin-left: 10px;
}

.postContent {
    font-size: 14px;
    font-family: PingFang SC;
    color: #4E5969;

}

.postTime {
    font-size: 12px;
    font-family: PingFang SC;
    color: #4E5969;
    display: flex;
    justify-content: flex-end;
}

.dividerLine {
    margin-top: 10px;
}

.emptyImg {
    display: flex;
    width: 925px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 4px;
    background: var(--fill-1, #FFF);
    padding: 20px 27px;
    margin-top: 13px;
    
}

</style>