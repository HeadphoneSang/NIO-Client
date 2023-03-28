import { createRouter, createWebHashHistory } from 'vue-router'
import InitAddressView from '@/views/login/initAddress/initAddress.vue'
import AddNewAddressView from '@/views/login/initAddress/addNewAddress.vue'
import HistoryAddressView from '@/views/login/initAddress/historyAddress.vue'
import MainEnterView from '@/views/login/initAddress/mainEnter.vue'
import LoginMainView from '@/views/login/loginServer/loginMain.vue'
import LoginView from '@/views/login/loginServer/login.vue'
import RegisterView from '@/views/login/loginServer/register.vue'
import HomeMainView from '@/views/client/homePage/homeMain.vue'

const routes = [
  {
    path: '/',
    name: 'mainEnter',
    redirect:'/mainEnter',
  },
  {
    path: '/homePage',
    name: 'homePage',
    component:HomeMainView
  },
  {
    path: '/mainEnter',
    component:MainEnterView,
    redirect:'/mainEnter/initAddress',
    children:[
      {
        path:'initAddress',
        component:InitAddressView,
        redirect:'/mainEnter/initAddress/historyAddress',
        children:[
          {
            path: 'addNewAddress',
            name: 'addNewAddress',
            component:AddNewAddressView
          },
          {
            path: 'historyAddress',
            name: 'historyAddress',
            component:HistoryAddressView 
          },
        ]
      },
      {
        path:'loginMain',
        component:LoginMainView,
        redirect:'/mainEnter/loginMain/login',
        children:[
          {
            path: 'register',
            name: 'register',
            component:RegisterView 
          },
          {
            path: 'login',
            name: 'login',
            component:LoginView 
          },
        ]
      }
    ]
  },
  
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
