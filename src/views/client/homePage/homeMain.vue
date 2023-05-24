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
    <Message :message="msgContent" :title="msgTitle" :x="20" :y="20" ref="msg"></Message>
  </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
import SubWindow from '@/components/universal/moveWindow.vue'
import {ipcRenderer} from 'electron'
import AsyncLock from 'async-lock/lib'
const lock = new AsyncLock();
import swal from 'sweetalert'
import mainBus from '@/views/mainBus.js'
import Message from '@/components/universal/messageBar.vue'
import{powerSaveBlocker} from 'electron'
import { connection } from 'websocket'

export default {
  components:{
    SubWindow,
    Message
  },
  computed:{
    ...mapState(['showMove','userInfo','uploadQueue','downloadQueue'])
  },
  data(){
    return {
      pageName:"文件",
      msgContent:"",
      msgTitle:"",
      uploadMap:new Map(),
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
    ...mapMutations(['setUser','shiftDownloadQueue','changeDownloadFirstStatus','updateDownloadProgress','pushUploadObjToQueue','changeUploadObjStatus','addObjToUploadMap','deleteObjInUploadQueue','deleteObjInUploadMap','clearUploadTask','addObjToUploadQueue']),
    showMsgWin(title,msg){
      this.$refs.msg.show = true
      this.msgTitle = title
      this.msgContent = msg
    },
    /**
     * 注册上传相关的监听器
     */
     registerUploadListener(){
      ipcRenderer.on('uploadTaskCreated',(e,key)=>{
        let fileObj =this.uploadMap.get(key); 
        if(fileObj!==null){
          fileObj.status = 2;
        }
      });
      ipcRenderer.on('uploadTaskProgress',(e,key,data)=>{
        let fileObj =this.uploadMap.get(key); 
        if(fileObj!==null){
          fileObj.progress = ((data*100)/fileObj.size).toFixed(2);
        }
      });
      ipcRenderer.on('uploadTaskCompleted',async (e,key)=>{
        lock.acquire('updateUploadQueue',async (done)=>{
          this.uploadMap.get(key).status = 3;
          let name = this.uploadMap.get(key).name;
          this.uploadMap.delete(key);
          this.deleteObjInUploadQueue(key);
          await this.commitQueueToupload();
          this.showMsgWin('上传提示',`${name}上传完毕`);
          done();
        })
      });
      ipcRenderer.on('uploadTaskFailed',(e,key)=>{
        this.uploadMap.get(key).status = 4;
        this.deleteObjInUploadMap(key);
      });
      ipcRenderer.on('uploadTaskClosed',(e,key)=>{
        this.uploadMap.get(key).status = 6;
      })
    },
    /**
     * 将等待队列的文件任务提交到上传进程
     */
     async commitQueueToupload(){
      for(let i = 0;i<this.uploadQueue.length;i++){
        let item = this.uploadQueue[i];
        if(item.status!==0&&item.status!==4&&item.status!==5)
          continue;
        let isOK = await ipcRenderer.invoke('commitMission',JSON.stringify(item));
        if(isOK){
          item.status = 1;
          this.uploadMap.set(item.tarPath,item);
        }
        else
          return
      }
    },
  },
  async created(){
    let data = await ipcRenderer.invoke('loadedHome',"need");
    this.$http.defaults.baseURL = data[1];
    this.setUser({username:data[0]});
    this.registerUploadListener();
    setInterval(()=>{
      //下载轮询检查
      if(this.downloadQueue.length>0){
        if(this.downloadQueue[0].preProgress===undefined){
          this.downloadQueue[0].detachedTime = 0
          this.downloadQueue[0].preProgress=this.downloadQueue[0].progress
          return
        }
        if(this.downloadQueue[0].preProgress==this.downloadQueue[0].progress){
          if(++this.downloadQueue[0].detachedTime>15){
            this.downloadQueue[0].status = 4
          }
          return
        }
        this.downloadQueue[0].preProgress=this.downloadQueue[0].progress
      }
    },2000);
    mainBus.on('upload',(items)=>{
      for(let i = 0;i<items.length;i++){
        let obj = items[i];
        if(this.uploadMap.has(obj.tarPath))
          continue;
        this.uploadQueue.push(obj);
      }
      this.commitQueueToupload()
    });
    mainBus.on('deleteUploadQueue',(key)=>{
      lock.acquire('updateUploadQueue',async (done)=>{
          this.uploadMap.delete(key);
          this.deleteObjInUploadQueue(key);
          await this.commitQueueToupload();
          done();
        })
    });
    ipcRenderer.on("downloadUpdateEvent",(data,evt)=>{
      
      if(this.downloadQueue[0].status===2)
         this.changeDownloadFirstStatus(3)
      else{
        if(this.downloadQueue[0].progress!=evt)
          this.changeDownloadFirstStatus(3)
      }
      this.updateDownloadProgress(evt)
    })
    ipcRenderer.on("downloadSuccessEvent",(e,data)=>{
      if(this.downloadQueue.length<1)
        return
      this.changeDownloadFirstStatus(1)
      this.showMsgWin("下载提示",`${this.downloadQueue[0].name}下载完成`)
      this.shiftDownloadQueue()
      if(this.downloadQueue.length!==0){
        this.changeDownloadFirstStatus(2)
        ipcRenderer.send("download",{
            downloadPath:this.$http.defaults.baseURL+'/download/'+this.downloadQueue[0].modifier+"/"+this.userInfo.username,
            fileName:this.downloadQueue[0].name
        })
      }
    })
    ipcRenderer.on("downloadFailedEvent",data=>{
      if(this.downloadQueue.length<1)
        return
      this.showMsgWin("下载提示",`${this.downloadQueue[0].name}下载失败`)
      this.changeDownloadFirstStatus(-1)
    })
    ipcRenderer.on('downloadInterruptedEvent',data=>{
      if(this.downloadQueue.length<1)
        return
      this.showMsgWin("下载提示",`${this.downloadQueue[0].name}网络请求错误`)
      this.changeDownloadFirstStatus(4)
    })
    ipcRenderer.on('close-win',()=>{
      swal({
        title: "你确定要关闭软件吗?",
        text: "如果关闭会强制中断正在进行的任务!",
        icon: "warning",
        className:'closeWin',
        closeOnClickOutside:true,
        showCloseButton: true,
        buttons: {
          minimize:{
            
            text:"最小化",
            value:false,
          },
          close:{
            text:"关闭",
            value:true,
          }
        },
        
      })
      .then((value) => {
        if(value==null)
          return;
        this.clearUploadTask();
        ipcRenderer.invoke('close-homeWin',value);
      });
    })
  },
  beforeUnmount(){
    mainBus.all.clear();
    ipcRenderer.removeAllListeners('uploadTaskCreated');
    ipcRenderer.removeAllListeners('uploadTaskProgress');
    ipcRenderer.removeAllListeners('uploadTaskFailed');
    ipcRenderer.removeAllListeners('uploadTaskClosed');
    ipcRenderer.removeAllListeners('updateUploadQueue');
    ipcRenderer.removeAllListeners('uploadTaskCompleted');
    
  },
  mounted(){
    this.$nextTick(()=>{
        // console.log(this.$refs.msg) // 输出实例
    })
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