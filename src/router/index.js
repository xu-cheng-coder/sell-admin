import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/home/child/dash/Dashboard.vue'
import UserIndex from '../views/home/child/user/index.vue'
import UserList from '../views/home/child/user/child/UserList.vue'
import UserDetail from '../views/home/child/user/child/UserDetail.vue'
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
    children: [
      {
        path:'',
        redirect:'/home/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: 'user',
        component: UserIndex,
        children: [
          {
            path: 'userList',
            name: 'UserList',
            component: UserList
          },
          {
            path: 'detail/:id',
            name: 'UserDetail',
            component: UserDetail
          },
          {
            path: 'myinfo',
            name: 'MyInfo',
            component: MyInfo
          },
          {
            path: 'updpasword',
            name: 'UpdPassword',
            component: UpdPassword
          }
        ]
      },
      {
        path: 'goods',
        component: Goods,
        children: [
          {
            path: 'goodslist',
            name: 'GoodsList',
            component: GoodsList
          }, {
            path: 'category',
            name: 'category',
            component: Category
          },
          {
            path: 'add',
            name: 'add',
            component: AddGood
          }
        ]
      },
      {
        path: 'order',
        component: Orders,
        children: [
          {
            path: 'orderlist',
            name: 'OrderList',
            component: OrderList
          }
          , {
            path: 'orderdetail/:orderId',

            name: 'OrderDetail',
            component: OrderDetail
          }
        ]
      },
      {
        path: 'article',
        component: Article,
        children: [
          {
            path: 'articlelist',
            name: 'ArticleList',
            component: ArticleList
          },
          {
            path: 'addArticle',
            name: 'AddArticle',
            component: AddArticle
          }
          ,
          {
            path: 'articleDetail/:articleId',
            name: 'ArticleDetail',
            component: ArticleDetail
          },
          {
            path: 'articleClassify',
            name: 'ArticleClassify',
            component: ArticleClassify
          }, {
            path: 'articleForm',
            name: 'ArticleForm',
            component: ArticleForm
          }
        ]
      },
      {
        path: 'storeInfo',
        component: StoreInfo
      }, {
        path: 'chars',
        children: [
          {
            path: 'orderchar',
            name: 'Orderchar',
            component: OrderChar
          },
          {
            path: 'goodschar',
            name: 'Goodschar',
            component: GoodsChar
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
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