<template>
  <div class="home-container">

    <!-- 左侧功能栏的顶部选择部分 -->
    <div class="left-content">

      <!-- 左侧功能栏选项等等 -->
      <div class="functions">
        <div class="function-top">
          <div class="function-bar cursor-pointer" v-for="(item,index) in functions" :key="index" @click="navToPage(item.url)">
            <img :src="item.icon" class="icon">
            {{item.name}}          
          </div>
        </div>
        <div class="functions-bottom">
          <div class="function-bar cursor-pointer" v-for="(item,index) in extension" :key="index" @click="navToPage(item.url)">
            <img :src="item.icon" class="icon">
            {{item.name}}          
          </div>
        </div>
      </div>
      <!-- 左侧功能栏选项等等 -->


      <!-- 左侧右下角用户信息等等 -->
      <div class="user-info cursor-pointer">
        <div class="head">
          <img :src="userInfo.head" alt="">
          <div class="nick">
            {{ userInfo.nick!==''?userInfo.nick:userInfo.account }}
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

export default {
  data(){
    return {
      userInfo:{
        nick:'19892332313',
        account:'32331335333',
        head:require('@/assets/head.png'),
        permission:'user'
      },
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
    navToPage(url){
      this.$router.push(url)
    }
  }
}
</script>

<style lang="less" scoped>
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