import Vue from 'vue'
import Router from 'vue-router'
//import todoItem from '@/components/todoItem'
const MainUser = () => import('../components/MainUser.vue')
const MainDoc = () => import('../components/MainDoc.vue')
const Login=()=>import('../components/Login.vue')
const patientRegister = () => import('../components/patientRegister')
const doctorRegister = () => import('../components/doctorRegister')
const forget = () => import('../components/forget')
Vue.use(Router)
export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/mainUser',
      name: 'mainUser',
      component: MainUser
    },
    {
      path: '/mainDoc',
      name: 'mainDoc',
      component: MainDoc
    },
    {
      path: '/patientRegister',
      name: 'patientRegister',
      component: patientRegister
    },
    {
      path: '/doctorRegister',
      name: 'doctorRegister',
      component: doctorRegister
    },
    {
      path: '/forget',
      name: 'forget',
      component: forget
    },
 

  ]
})
