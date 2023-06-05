<template>
  <div class="login-main-container">
    <div class="title-container">
        <div :class="pageIndex===0?'select-box':'check-box'" @click="checkPage(0)">账号登陆</div>
        <div :class="pageIndex===1?'select-box':'check-box'" @click="checkPage(1)">账号注册</div>
    </div>
    <div class="inner-container">
      <router-view :isUpdate="isUpdate">
      </router-view>
    </div>
    <div class="updating" v-if="isUpdate">
      <div class="spinner-border text-info" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <div class="title">
        {{updateProgress.toFixed(2)}}%
      </div>
    </div>
  </div>
</template>
<script>
import {ipcRenderer} from 'electron'
import swal from 'sweetalert'
export default {
  beforeRouteUpdate(to,from,next){
    let i = this.pages.findIndex(item=>item.path==to.fullPath)
    this.pageIndex = i
    next()
  },
  data(){
    return{
      pageIndex:0,
      isUpdate:false,
      modifier:"",
      updateProgress:0,
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
    },
    initUpdateListener(){
      ipcRenderer.on('update-progress',(e,percent)=>{
        this.updateProgress = percent;
      });
      ipcRenderer.on('update-complete',async (e,msg)=>{
        let data;
        try{
          data = await this.$http.get('/update/getUpdateInfo/');
          data = data.data;
        }catch(e){
          console.log(e)
          swal("网络请求出错");
        }
        let isInstall = await swal({
          title:"下载完成是否安装?",
          text:data===undefined?"更新下载完毕,读取更新内容失败":data.msg,
          icon:require('@/assets/update.png'),
          className:"updateSwal",
          closeOnClickOutside:false,
          buttons:{
            donot:{
              text:"暂不安装",
              value:false
            },
            do:{
              text:"重启安装",
              value:true
            }
          },
        });
        if(isInstall){
          await ipcRenderer.invoke('installUpdate');
        }
        this.isUpdate = false;
        this.$emit('changeUpdate',false);
      });
      ipcRenderer.on('update-avaible',async (e,info)=>{
        let data = null;
        try{
          data = await this.$http.get('/update/getUpdateInfo/');
        }catch(e){
          data = {};
          data.data.msg = '无法获得更新内容'
        }
        let confirm = await swal({
          title:"更新提示",
          text:`有新的版本,是否要进行更新？\n${data.data.msg}`,
          className:"updateSwal",
          closeOnClickOutside:false,
          buttons:{
            donot:{
              text:"放弃更新",
              value:false
            },
            do:{
              text:"确认更新",
              value:true
            }
          },
          icon:require("@/assets/update.png")
        });
        if(confirm){
          this.$emit('changeUpdate',confirm);
          this.isUpdate = true;
          ipcRenderer.invoke('startUpdate');
        }else{
          this.isUpdate = false;
        }
      });
      ipcRenderer.on('update-error',(e,msg)=>{
        console.log(msg)
        if(msg===404){
          this.isUpdate = false;
          this.$emit('changeUpdate',false);
          return;
        }
        swal({
          title:"更新错误",
          text:"下载更新出错!"+msg,
          icon:"error"
        })
        this.isUpdate = false;
        this.$emit('changeUpdate',false);
      });

      ipcRenderer.on('update-no',()=>{
        console.log('no')
        this.isUpdate = false;
        this.$emit('changeUpdate',false);
        console.log(this.isUpdate)
      })
    }
  },
  async beforeCreate(){

  },
  created(){
    
    this.initUpdateListener();
    if(!this.isUpdate)
    {
      this.isUpdate = true;
      this.$emit('changeUpdate',false);
      ipcRenderer.invoke('checkUpdate')
    }
  },
  beforeUnmount(){
    console.log('destroyed')
    ipcRenderer.removeAllListeners('update-progress');
    ipcRenderer.removeAllListeners('update-complete');
    ipcRenderer.removeAllListeners('update-avaible');
    ipcRenderer.removeAllListeners('update-error');
    ipcRenderer.removeAllListeners('update-no');
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
      .updating{
        position: absolute;
        bottom: 10px;
        .title{
          font-size: 15px;
        }
      }
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