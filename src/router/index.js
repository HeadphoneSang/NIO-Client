import { createRouter, createWebHashHistory } from 'vue-router'
import InitAddressView from '@/views/login/initAddress/initAddress.vue'
import AddNewAddressView from '@/views/login/initAddress/addNewAddress.vue'
import HistoryAddressView from '@/views/login/initAddress/historyAddress.vue'
import MainEnterView from '@/views/login/initAddress/mainEnter.vue'
import LoginMainView from '@/views/login/loginServer/loginMain.vue'
import LoginView from '@/views/login/loginServer/login.vue'
import RegisterView from '@/views/login/loginServer/register.vue'
import HomeMainView from '@/views/client/homePage/homeMain.vue'
import FileView from '@/views/client/firstPages/files.vue'
import Favorite from '@/views/client/firstPages/favorite.vue'
import Recycle from '@/views/client/firstPages/recycle.vue'
import Lock from '@/views/client/firstPages/lock.vue'
import Transport from '@/views/client/firstPages/transport.vue'
import UserInfoView from '@/views/client/firstPages/userInfo/userInfo.vue'
import UploadRecordsView from '@/views/client/firstPages/userInfo/uploadRecords.vue'
import DownloadRecordsView from '@/views/client/firstPages/userInfo/downloadRecords.vue'
import DeleteRecordsView from '@/views/client/firstPages/userInfo/deleteRecords.vue'
import UploadView from '@/components/transport/upload.vue'
import DownloadView from '@/components/transport/download.vue'
import DownloadSettings from '@/views/client/firstPages/userInfo/downloadSettings.vue'

const routes = [
  {
    path: '/',
    name: 'mainEnter',
    redirect:'/mainEnter',
  },
  {
    path: '/homePage',
    name: 'homePage',
    component:HomeMainView,
    redirect:'/homePage/files',
    children:[
      {
        path:'files',
        name:'files',
        component:FileView,
      },
      {
        path:'userInfo',
        name:'userInfo',
        component:UserInfoView,
        redirect:'/homePage/userInfo/uploadRecords',
        children:[
          {
            path:'uploadRecords',
            name:'uploadRecords',
            component:UploadRecordsView,
          },
          {
            path:'downloadRecords',
            name:'downloadRecords',
            component:DownloadRecordsView,
          },
          {
            path:'deleteRecords',
            name:'deleteRecords',
            component:DeleteRecordsView,
          },
          {
            path:'downloadSettings',
            name:'downloadSettings',
            component:DownloadSettings,
          },
        ]
      },
      {
        path:'favorite',
        name:'favorite',
        component:Favorite,
      },
      {
        path:'recycle',
        name:'recycle',
        component:Recycle,
      },
      {
        path:'lock',
        name:'lock',
        component:Lock,
      },
      {
        path:'transport',
        name:'transport',
        component:Transport,
        redirect:'/homePage/transport/upload',
        children:[
          {
            path:'upload',
            name:'upload',
            component:UploadView,
          },
          {
            path:'download',
            name:'download',
            component:DownloadView,
          },
        ]
      },
    ]
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
