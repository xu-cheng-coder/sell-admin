<template>
  <el-aside :width="isCollapse ? '64px' : '200px'" class="aside">
    <el-menu 
      router 
      unique-opened 
      :default-active="activeMenu" 
      class="el-menu-vertical" 
      :collapse="isCollapse"
      background-color="#304156" 
      text-color="#bfcbd9" 
      active-text-color="#409EFF"
    >
      <template v-for="item in menus">
        <!-- 判断是否有子菜单 -->
        <el-sub-menu v-if="item.children && item.children.length" :index="item.path" :key="item.path">
          <template #title>
            <el-icon>
              <component :is="item.icon" />
            </el-icon>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item 
            v-for="child in item.children" 
            :index="child.path" 
            :key="child.path"
            @click="handleMenuClick(child.path)"
          >
            <el-icon>
              <component :is="child.icon" />
            </el-icon>
            <span>{{ child.title }}</span>
          </el-menu-item>
        </el-sub-menu>

        <!-- 判断是否没有子菜单 -->
        <el-menu-item v-else :index="item.path" @click="handleMenuClick(item.path)">
          <el-icon>
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  House,
  Goods,
  ShoppingCart,
  User,
  Shop,
  HelpFilled,
  Notebook,
  List,
  Plus,
  Edit
} from '@element-plus/icons-vue'
import { markRaw } from 'vue'

const props = defineProps({
  isCollapse: Boolean
})

const emit = defineEmits(['menu-click'])

const router = useRouter()
const route = useRoute()

// 菜单数据
const menus = ref([
  {
    path: '/home/dashboard',
    title: '首页',
    icon: markRaw(House)
  },
  {
    path: '/home/user',
    title: '用户管理',
    icon: markRaw(User),
    children: [
      {
        path: '/home/user/userList',
        title: '用户列表',
        icon: markRaw(List)
      },
      {
        path: '/home/user/myinfo',
        title: '个人信息',
        icon: markRaw(List)
      },
      {
        path: '/home/user/updpasword',
        title: '修改密码',
        icon: markRaw(Edit)
      }
    ]
  },
  {
    path: '/home/goods',
    title: '商品管理',
    icon: markRaw(Goods),
    children: [
      {
        path: '/home/goods/category',
        title: '商品分类',
        icon: markRaw(List)
      },
      {
        path: '/home/goods/goodslist',
        title: '商品列表',
        icon: markRaw(Goods)
      },
      {
        path: '/home/goods/add',
        title: '添加商品',
        icon: markRaw(Plus)
      }
    ]
  },
  {
    path: '/home/order/orderlist',
    title: '订单管理',
    icon: markRaw(ShoppingCart)
  },
  {
    path: '/home/storeInfo',
    title: '店铺设置',
    icon: markRaw(Shop)
  },
  {
    path: '/home/article',
    title: '文章管理',
    icon: markRaw(Notebook),
    children: [
      {
        path: '/home/article/articlelist',
        title: '文章列表',
        icon: markRaw(Notebook)
      },
      {
        path: '/home/article/articleClassify',
        title: '文章分类',
        icon: markRaw(Notebook)
      },
      {
        path: '/home/article/addArticle',
        title: '添加文章',
        icon: markRaw(Plus)
      }
    ]
  },
  {
    path: '/home/chars',
    title: '报表统计',
    icon: markRaw(HelpFilled),
    children: [
      {
        path: '/home/chars/orderchar',
        title: '订单统计',
        icon: markRaw(HelpFilled)
      },
      {
        path: '/home/chars/goodschar',
        title: '商品统计',
        icon: markRaw(HelpFilled)
      }
    ]
  }
])

// 动态计算当前激活菜单
const activeMenu = computed(() => {
  return route.path;
})

const handleMenuClick = (path) => {
  emit('menu-click', path)
  router.push(path)
}
</script>

<style scoped>
.aside {
  background-color: #304156;
  transition: width 0.3s;
}

.el-menu-vertical {
  border-right: none;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
}
</style>