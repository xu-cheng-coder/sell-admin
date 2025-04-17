import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/home/child/dash/Dashboard.vue'
import UserIndex from '../views/home/child/user/index.vue'
import UserList from '../views/home/child/user/child/UserList.vue'
import Goods from '../views/home/child/goos/Goods.vue'
import GoodsList from '../views/home/child/goos/child/GoodsList.vue'
import AddGood from '../views/home/child/goos/child/AddGood.vue'
import Category from '../views/home/child/goos/child/Category.vue'
import MyInfo from '../views/home/child/user/child/MyInfo.vue'
import UpdPassword from '../views/home/child/user/child/UpdatePaword.vue'
import OrderList from '../views/home/child/orders/child/OrderList.vue'
import Orders from '../views/home/child/orders/Orders.vue'
import OrderDetail from '../views/home/child/orders/child/OrderDetaile.vue'
import ArticleList from '../views/home/child/article/child/ArticleList.vue'
import ArticleClassify from '../views/home/child/article/child/ArticleClassify.vue'
import Article from '../views/home/child/article/Article.vue'
import ArticleDetail from '../views/home/child/article/child/ArticleDetail.vue'
import AddArticle from '../views/home/child/article/child/AddArticle.vue'
import ArticleForm from '../views/home/child/article/child/ArticleForm.vue'
import StoreInfo from '../views/home/child/store/child/StoreInfo.vue'
import OrderChar from '../views/home/child/chars/child/OrderChar.vue'
import GoodsChar from '../views/home/child/chars/child/GoodsChar.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    component: Home,
    meta: { breadcrumb: '首页' },
    children: [
      {
        path: '',
        redirect: '/home/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { breadcrumb: '统计数据' }
      },
      {
        path: 'user',
        component: UserIndex,
        meta: { breadcrumb: '用户管理' },
        children: [
          {
            path: '',
            redirect: '/home/user/userList'
          },
          {
            path: 'userList',
            name: 'UserList',
            component: UserList,
            meta: { breadcrumb: '用户列表' }
          },
          {
            path: 'myinfo',
            name: 'MyInfo',
            component: MyInfo,
            meta: { breadcrumb: '我的信息' }
          },
          {
            path: 'updpasword',
            name: 'UpdPassword',
            component: UpdPassword,
            meta: { breadcrumb: '修改密码' }
          }
        ]
      },
      {
        path: 'goods',
        component: Goods,
        meta: { breadcrumb: '商品管理' },
        children: [
          {
            path: '',
            redirect: '/home/goods/goodslist',
          },
          {
            path: 'goodslist',
            name: 'GoodsList',
            component: GoodsList,
            meta: { breadcrumb: '商品列表' }
          },
          {
            path: 'category',
            name: 'category',
            component: Category,
            meta: { breadcrumb: '商品分类' }
          },
          {
            path: 'add',
            name: 'add',
            component: AddGood,
            meta: { breadcrumb: '添加商品' }
          }
        ]
      },
      {
        path: 'order',
        component: Orders,
        meta: { breadcrumb: '订单管理' },
        children: [
          {
            path: '',
            redirect: '/home/order/orderlist',
          },
          {
            path: 'orderlist',
            name: 'OrderList',
            component: OrderList,
            meta: { breadcrumb: '订单列表' }
          },
          {
            path: 'orderdetail/:orderId',
            name: 'OrderDetail',
            component: OrderDetail,
            meta: { breadcrumb: '订单详情' }
          }
        ]
      },
      {
        path: 'article',
        component: Article,
        meta: { breadcrumb: '文章管理' },
        children: [
          {
            path: '',
            redirect: '/home/article/articlelist',
          },
          {
            path: 'articlelist',
            name: 'ArticleList',
            component: ArticleList,
            meta: { breadcrumb: '文章列表' }
          },
          {
            path: 'addArticle',
            name: 'AddArticle',
            component: AddArticle,
            meta: { breadcrumb: '添加文章' }
          },
          {
            path: 'articleDetail/:articleId',
            name: 'ArticleDetail',
            component: ArticleDetail,
            meta: { breadcrumb: '文章详情' }
          },
          {
            path: 'articleClassify',
            name: 'ArticleClassify',
            component: ArticleClassify,
            meta: { breadcrumb: '文章分类' }
          },
          {
            path: 'articleForm',
            name: 'ArticleForm',
            component: ArticleForm,
            meta: { breadcrumb: '文章表单' }
          }
        ]
      },
      {
        path: 'storeInfo',
        component: StoreInfo,
        meta: { breadcrumb: '店铺信息' }
      },
      {
        path: 'chars',
        meta: { breadcrumb: '统计图表' },
        children: [
          {
            path: '',
            redirect: '/home/chars/orderchar',
          },
          {
            path: 'orderchar',
            name: 'Orderchar',
            component: OrderChar,
            meta: { breadcrumb: '订单图表' }
          },
          {
            path: 'goodschar',
            name: 'Goodschar',
            component: GoodsChar,
            meta: { breadcrumb: '商品图表' }
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { breadcrumb: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { breadcrumb: '注册' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  const authPages = ['/login', '/register']

  // 如果要访问的是登录/注册页
  if (authPages.includes(to.path)) {
    // 如果已经登录，则重定向到首页
    if (isAuthenticated) {
      return next('/home/dashboard')
    }
    return next()
  }

  // 对于其他所有路由
  if (!isAuthenticated) {
    return next('/login')
  }

  next()
})

export default router    