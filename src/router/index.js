import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login'
import home from '../components/home'

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
        component: home
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
