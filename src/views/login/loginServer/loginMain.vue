<template>
  <div class="login-main-container">
    <div class="title-container">
        <div :class="pageIndex===0?'select-box':'check-box'" @click="checkPage(0)">账号登陆</div>
        <div :class="pageIndex===1?'select-box':'check-box'" @click="checkPage(1)">账号注册</div>
    </div>
    <div class="inner-container">
      <router-view>
      </router-view>
    </div>
  </div>
</template>

<script>

export default {
  beforeRouteUpdate(to,from,next){
    let i = this.pages.findIndex(item=>item.path==to.fullPath)
    this.pageIndex = i
    next()
  },
  data(){
    return{
      pageIndex:0,
      pages:[
        {
          path:'/mainEnter/loginMain/login'
        },
        {
          path:'/mainEnter/loginMain/register'
        },
      ]
    }
  },
  methods:{
    checkPage(index){
      
      if(this.pageIndex!==index){
        this.pageIndex = index
        this.$router.push(this.pages[index])
      }
    }
  }
}
</script>

<style lang="less" scoped>
    .login-main-container{
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-sizing: border-box;
      
        .title-container{
          display: flex;
          
          align-items: center;
          width: 100%;
          .check-box,.select-box{
            width: 50%;
            box-sizing: border-box;
            border-radius: 25px;
            padding: 15px;
            background-color: #F5F5F6;
            font-size: 20px;
            font-weight: 600;
            color: #BABBBD;
            user-select: none;
            cursor: url('@/assets/point.png'),pointer;
          }
          .check-box:nth-child(1){
            border-radius: 25px 0 0 0;
          }
          .check-box:nth-child(2){
            border-radius: 0 25px 0 0;
          }
          .select-box{
            background-color: #ffffff;
            color: #000
          }
        }
        .inner-container{
          width: 100%;
        }
    }
</style>