<template>
  <SubWindow v-if="showMove" ></SubWindow>
  <div :class="'home-container '+(showMove?'invalid':'')">

    <!-- 左侧功能栏的顶部选择部分 -->
    <div class="left-content">

      <!-- 左侧功能栏选项等等 -->
      <div class="functions">
        <div class="function-top">
          <div :class="'function-bar cursor-pointer '+(item.name===pageName?'clicked-bar':'')" v-for="(item,index) in functions" :key="index" @click="navToPage(item)">
            <img :src="item.icon" class="icon">
            {{item.name}}          
          </div>
        </div>
        <div class="functions-bottom">
          <div :class="'function-bar cursor-pointer '+(item.name===pageName?'clicked-bar':'')" v-for="(item,index) in extension" :key="index" @click="navToPage(item)">
            <img :src="item.icon" class="icon">
            {{item.name}}          
          </div>
        </div>
      </div>
      <!-- 左侧功能栏选项等等 -->


      <!-- 左侧右下角用户信息等等 -->
      <div class="user-info cursor-pointer" @click="navToUserInfo">
        <div class="head">
          <img :src="userInfo.head" alt="">
          <div class="nick">
            {{ userInfo.nick!==''?userInfo.nick:userInfo.username }}
          </div>
        </div>
        <div class="info">
          <img src="@/assets/info.png" alt="">
        </div>
      </div>
      <!-- 左侧右下角用户信息等等 -->

    </div>
    <!-- 左侧功能栏的顶部选择部分 -->

    <div class="right-context">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
import SubWindow from '@/components/universal/moveWindow.vue'
import {ipcRenderer} from 'electron'
import swal from 'sweetalert'

export default {
  components:{
    SubWindow
  },
  computed:{
    ...mapState(['showMove','userInfo'])
  },
  data(){
    return {
      pageName:"文件",
      functions:[
        {
          name:'文件',
          url:'/homePage/files',
          icon:require('@/assets/files.png')
        },
        {
          name:'收藏夹',
          url:'/homePage/favorite',
          icon:require('@/assets/favorite.png')

        },
        {
          name:'回收站',
          url:'/homePage/recycle',
          icon:require('@/assets/recycle.png')

        },
        {
          name:'密码箱',
          url:'/homePage/lock',
          icon:require('@/assets/lock.png')
        },
      ],  
      extension:[
        {
          name:'传输列表',
          url:'/homePage/transport',
          icon:require('@/assets/transport.png')
        }
      ]
    }
  },
  methods:{
    navToUserInfo(){
      this.$router.push('/homePage/userInfo')
      this.pageName = "用户信息"
    },
    navToPage(item){
      if(item.name==="密码箱")
        swal({
            icon:require("@/assets/pass.png"),
            title: "欢迎使用密码箱",
            content: {
              element: "input",
              attributes: {
                placeholder: "请在此输入密码",
                type: "password",
              },
            },
        }).then(async e=>{
          if(e===null)
            return swal("已取消")
          else{
            if(e==="")
              return swal("已取消")
            try{
              let {data} = await this.$http.get(`/file/checkLockBoxPassword/${e}`)
              if(data){
                swal("密码正确,登陆成功")
                this.pageName = item.name
                return this.$router.push(item.url)
              }
              swal("密码错误,请联系管理员获得密码")
            }catch(e){
              console.log(e)
              swal("网络请求出错")
            }
          }
        })
      else{
        this.$router.push(item.url)
        this.pageName = item.name
      }
    },
    ...mapMutations(['setUser'])
  },
  async created(){
    let data = await ipcRenderer.invoke('loadedHome',"need")
    this.$http.defaults.baseURL = data[1]
    this.setUser({username:data[0]})
  }
}
</script>

<style lang="less" scoped>
.swal-title {
  margin: 0px;
  font-size: 16px;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.21);
  margin-bottom: 28px;
}
.invalid{
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  filter: grayscale(100%);
  filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale"); 
  filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
  pointer-events:none
}

.home-container{
    height: 100%;
    width: 100%;
    
    .left-content{
      height: 100%;
      width: 240px;
      background-color: #F5F5F6;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding: 18px;
      justify-content: space-between;
      .functions{
        width: 100%;
        .function-bar{
          user-select: none;
            width: 100%;
            text-align: left;
            box-sizing: border-box;
            padding: 10px;
            display: flex;
            align-items: center;
            font-size: 14px;
            .icon{
              height: 20px;
              margin-right: 20px;
            }
          }
          .function-bar:hover{
            background-color: #ededed;
            border-radius: 10px;
          }
          .clicked-bar{
            background-color: #e6e6e6;
            border-radius: 10px;
          }
          .clicked-bar:hover{
            background-color: #e6e6e6;
            border-radius: 10px;
          }
        .function-top{
          width: 100%;
          padding-bottom: 30px;
          border-bottom: 1px solid #e1e1e1;
          margin-bottom: 15px;
        }
      }
      .user-info{
        display: flex;
        align-items: center;
        border-top: 1px solid #e1e1e1;
        box-sizing: border-box;
        padding: 20px 0px 10px 0px;
        justify-content: space-between;
        background-color: #F5F5F6;
        user-select: none;
        .head{
          display: flex;
          align-items: center;
          div{
            margin-left: 10px;
            font-size: 15px;
            color: #3b3b3b;
          }
          img{
            height: 40px;
            background-color: #E4E6EE;
            border-radius: 50%;
          }
        }
        .info{
          img{
            height: 20px;
          }
        }
      }
      .user-info:hover{
        font-weight: 500;
        img{
          border:1px dotted #e6e5e5;
        }
        .info{
          img{
            border:none;
          }
        }
      }
    }
    .right-context{
      position: absolute;
      height: 100%;
      width: calc(100% - 240px);
      right: 0;
      top: 0;
    }
}
</style>