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
                    <el-button text type="primary">Collect</el-button>
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
            ]
        });

        const commentCentent = reactive({
            content: "",
        });

        const createComment = () => {
            proxy.$post('http://127.0.0.1:5173/api/posts/' + post_id + '/', commentCentent)
                .then((res: any) => {
                    console.log(res)
                    getPostDetail();
                    commentCentent.content = "";
                })
                .catch((err: any) => {
                    console.log(err)
                })


        };

        const getPostDetail = () => {
            console.log();
            proxy.$get('http://127.0.0.1:5173/api/posts/' + post_id)
                .then((res: any) => {
                    postDetail.value = res;
                    console.log(res)
                })
                .catch((err: any) => {
                    console.log(err)
                })
        };

        const goToPostList = () => {
            router.push({ path: '/postList' });
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

        }
    }
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

    .commentList {}

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