import { createRouter, createWebHashHistory } from 'vue-router'
import InitAddressView from '@/views/login/initAddress/initAddress.vue'
import AddNewAddressView from '@/views/login/initAddress/addNewAddress.vue'
import HistoryAddressView from '@/views/login/initAddress/historyAddress.vue'

const routes = [
  {
    path: '/',
    name: 'initAddress',
    redirect:'/initAddress',
    
  },
  {
    path:'/initAddress',
    component:InitAddressView,
    redirect:'/initAddress/addNewAddress',
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
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
