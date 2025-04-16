<template>
    <el-header class="header">
        <div class="header-left">
            <el-icon class="menu-icon" @click="toggleSidebar">
                <Menu />
            </el-icon>
            <div class="title-container">
                <i class="iconfont icon-haitunyouxi logo-icon"></i>
                <span class="title">海豚外卖</span>
            </div>
        </div>

        <el-breadcrumb class="breadcrumb-container" separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据</el-breadcrumb-item>

        </el-breadcrumb>

        <div class="header-right">
            <el-dropdown>
                <span class="user-info">
                    <el-avatar :size="32" :icon="UserFilled" class="user-avatar" />
                    <span class="username">管理员</span>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="handleMenuClick('/home/user/myinfo')">个人信息</el-dropdown-item>
                        <el-dropdown-item>注销账号</el-dropdown-item>
                        <el-dropdown-item @click="handleMenuClick('/home/user/updpasword')">修改密码</el-dropdown-item>
                        <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </el-header>
</template>

<script setup>
import {
  Menu,
  UserFilled,
} from '@element-plus/icons-vue'
</script>

<style scoped></style>