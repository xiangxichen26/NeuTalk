<template>
    <div class="common-layout">
        <el-container>
            <!--header-->
            <el-header class="homeHeader">
                <div class="logo">Logo</div>
                <el-avatar class="avatar">
                    <el-dropdown>
                        <span class="el-dropdown-link">
                            <img src="https://avatars.githubusercontent.com/u/22588905?v=4" alt="avatar">
                        </span>
                        <el-dropdown-menu >
                            <el-dropdown-item v-if="isLogin === true">Log in</el-dropdown-item>
                            <el-dropdown-item v-if="isLogin === false">Log out</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-avatar>
            </el-header>
            <!--main-->
            <el-main>Main</el-main>
        </el-container>
    </div>
</template>

<script lang="ts">
export default {
    name: 'HomePage',
    data() {
        return {
            isLogin: false
        }
    }
}
</script>
<script setup lang="ts">



</script>

<style scoped lang="scss">



</style>

