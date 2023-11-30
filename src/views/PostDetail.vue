<template>
    <div>
        <!--page header-->
        <el-page-header @back="goToPostList">
            <template #content>
                <span class="headerTitle"> Post Detail </span>
            </template>
        </el-page-header>
        <div class="postDetail">
            <!--user info-->
            <div class="userInfo">
                <!--avator & title & collect-->
                <div class="avatorAndTitleAndCollection">
                    <div class="avatorAndTitle">
                        <el-avatar size="40">
                            <img src="../assets/user.png">
                        </el-avatar>
                        <div class="postDetailTitle">{{ postDetail.title }}</div>
                    </div>
                    <div>
                        <el-button v-if="postDetail.is_favorite === false " text type="primary" @click="collectPost">Collect</el-button>
                        <el-button v-else text type="primary" @click="cancelCollectPost">Remove collection</el-button>
                        <el-button v-if="postDetail.author_username === localUsername" text type="danger" @click="ifDelete">Delete</el-button>
                    </div>
                </div>

                <!--username & create time-->
                <div class="usernameAndTime">
                    <div class="postDetailUsername">{{ postDetail.author_username }}</div>
                    <div class="postDetailCt">{{ formatTime(postDetail.created_at) }}</div>
                </div>
            </div>

            <!--main-->
            <div class="mainInfo">
                <el-tabs>
                    <el-tab-pane label="Content">
                        <div class="postInfo">{{ postDetail.content }}</div>
                    </el-tab-pane>
                    <el-tab-pane label="Comments">
                        <!--create comment-->
                        <div class="createComment">
                            <el-input class="inputBox" placeholder="Please input your comment"
                                v-model="commentCentent.content">

                            </el-input>
                            <el-button class="createCommentButton" size="small" type="primary" @click="createComment"
                                :icon="Plus" circle>
                            </el-button>
                        </div>

                        <!--comment list-->
                        <div class="commentList">
                            <el-timeline class="commentTimeline">
                                <el-timeline-item v-for="comment in postDetail.comments" :key="comment.unique_id"
                                    :timestamp="formatTime(comment.created_at)">
                                    <div class="commentUser">
                                        <el-avatar class="commentUserAvatar">
                                            <img src="../assets/user.png">
                                        </el-avatar>
                                        <div class="commnetUsername">{{ comment.author_username }}</div>
                                    </div>
                                    <div class="commentContent">{{ comment.content }}</div>
                                </el-timeline-item>
                            </el-timeline>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { reactive, ref, getCurrentInstance, onMounted } from 'vue'
import { formatTime } from '@/utils/time';
import { useRouter } from 'vue-router';
import { Plus, Star } from '@element-plus/icons-vue';
import { ElMessage,ElMessageBox } from 'element-plus';
import axios from 'axios';



export default {
    setup() {
        const router = useRouter();
        const post_id = router.currentRoute.value.params.id;
        const { proxy } = getCurrentInstance() as any;
        const postDetail = ref({
            post_id: "",
            title: "",
            content: "",
            author_username: "",
            created_at: "",
            comments: [
                {
                    unique_id: "",
                    post_id: "",
                    content: "",
                    author_username: "",
                    created_at: "",
                },
            ],
            is_favorite: false,
        });

        const localUsername = window.localStorage.getItem('username');

        const commentCentent = reactive({
            content: "",
        });
        const createComment = () => {
            proxy.$post("http://127.0.0.1:5173/api/posts/" + post_id + "/", commentCentent)
                .then((res: any) => {
                    console.log(res);
                    getPostDetail();
                    commentCentent.content = "";
                })
                .catch((err: any) => {
                    console.log(err);
                });
        };
        const getPostDetail = () => {
            console.log();
            proxy.$get("http://127.0.0.1:5173/api/posts/" + post_id)
                .then((res: any) => {
                    postDetail.value = res;
                    console.log(res.is_favorite);
                })
                .catch((err: any) => {
                    console.log(err);
                });
        };
        const collectPost = () => {
            proxy.$post("http://127.0.0.1:5173/api/favorites/add/" + post_id + "/")
                .then((res: any) => {
                    console.log(res);
                    ElMessage.success("Collect post successfully");
                    getPostDetail();
                })
                .catch((err: any) => {
                    console.log(err);
                });
        };

        const cancelCollectPost = async() => {
            try {
                await axios.delete('http://127.0.0.1:5173/api/favorites/remove/'+ post_id + "/");
                ElMessage.success("Remove collection successfully");
                getPostDetail();
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error('Error deleting resource:', error.response?.data);
                } else {
                    console.error('Unexpected error:', error);
                }
                throw error; 
            }
        };

        const goToPostList = () => {
            router.push({ path: "/postList" });
        };

        const ifDelete = () => {
            ElMessageBox.confirm("Are you sure to delete this post?", "Warning", {
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                type: "warning",
                title: "Delete My Post",
            })
                .then(() => {
                    deletePost();
                })
                .catch(() => {
                    ElMessage({
                        type: "info",
                        message: "Delete canceled",
                    });
                });
        };

        const deletePost = async () => {
            try {
                await axios.delete('http://127.0.0.1:5173/api/posts/delete/'+ post_id + "/");
                ElMessage.success("Delete post successfully");
                router.push({ path: "/postList" });
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error('Error deleting resource:', error.response?.data);
                } else {
                    console.error('Unexpected error:', error);
                }
                throw error; 
            }
            
        };

        onMounted(() => {
            getPostDetail();
            

        });
        return {
            postDetail,
            formatTime,
            post_id,
            commentCentent,
            createComment,
            Plus,
            goToPostList,
            Star,
            collectPost,
            cancelCollectPost,
            deletePost,
            localUsername,
            ifDelete
        };
    },
}

</script>

<style scoped lang="scss">
.headerTitle {
    font-family: PingFang SC;
    font-size: 14px;
    font-style: normal;
    color: #4E5969;
}

.postDetail {
    width: 925px;
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    background: var(--fill-1, #FFF);
    margin-top: 13px;
    padding: 20px 27px;
}

.userInfo {
    display: flex;
    flex-direction: column;
}

.avatorAndTitleAndCollection {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .avatorAndTitle {
        display: flex;
        flex-direction: row;
        align-items: center;


        .postDetailTitle {
            color: #000;
            font-family: PingFang SC;
            font-size: 28px;
            font-style: normal;
            font-weight: 500;
            line-height: 24px;
            margin-left: 20px;
        }
    }

}

.usernameAndTime {
    display: flex;
    flex-direction: row;
    background-color: #F8F8F8;
    height: 54px;
    border-radius: 5px;
    margin-top: 20px;
    align-items: center;

    .postDetailUsername {
        color: #4E5969;
        margin-left: 20px;
        font-family: PingFang SC;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
    }

    .postDetailCt {
        color: #4E5969;
        margin-left: 63px;
        font-family: PingFang SC;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
    }
}

.mainInfo {
    margin-top: 20px;
    display: flex;
    flex-direction: column;

    .createComment {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 20px;

        .inputBox {
            width: 880px;
            border-radius: 5px;
        }

        .createCommentButton {
            margin-left: 20px;
        }
    }

    .commentTimeline {
        margin-left: -38px;

        .commentUser {
            display: flex;
            flex-direction: row;
            align-items: center;
            color: #4E5969;

            .commentUserAvatar {
                width: 25px;
                height: 25px;
                margin-right: 10px;
            }

            .commentUsername {
                font-family: PingFang SC;
                font-size: 14px;
                line-height: 22px;
            }
        }

        .commentContent {
            font-size: 14px;
            line-height: 22px;
            margin-top: 10px;
        }
    }
}
</style>