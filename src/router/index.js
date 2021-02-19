import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/login'
import MainLayout from '@/components/app/MainLayout'
import Home from '@/pages/home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: Home
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
