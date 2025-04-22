<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
    <Header :isCollapse="isCollapse" @toggle-sidebar="toggleSidebar" />
    
    <div class="main-container">
      <!-- 侧边菜单栏 -->
      <Sidebar :isCollapse="isCollapse" @menu-click="handleMenuClick" />
      
      <!-- 主内容区 -->
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from '@/views/home/component/Header.vue'
import Sidebar from '@/views/home/component/Sidebar.vue'

const isCollapse = ref(false)

const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

const handleMenuClick = (path) => {
  // 可以在这里添加菜单点击的逻辑
}
</script>

<style scoped>
.home-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.main {
  flex: 1;
  padding: 20px;
  background-color: #f0f2f5;
  overflow-y: auto;
}
</style>