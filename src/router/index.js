import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login'
import home from '../components/home'
import welcome from '../components/welcome'
import users from '../components/user/users'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: login
    },
    {
        path: '/home',
        component: home,
        redirect:'/welcome',
        children:[
            {path:'/welcome',component:welcome},
            {path:'/user',component: users}
        ]
    }

]

const router = new VueRouter({
    routes
})




//路由守卫
router.beforeEach(
    (to, from, next) => {
      if(to.path=='/login') return next()
      var token  = window.sessionStorage.getItem('token')
      if(token!=null) {
        next()
      }else {
        next('/login')
      }
    }
)

export default router
