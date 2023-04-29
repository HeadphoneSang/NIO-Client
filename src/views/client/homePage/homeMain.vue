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
import swal from 'sweetalert'
import mainBus from '@/views/mainBus.js'
import Message from '@/components/universal/messageBar.vue'

export default {
  components:{
    SubWindow,
    Message
  },
  computed:{
    ...mapState(['showMove','userInfo','waitQueue','downloadQueue'])
  },
  data(){
    return {
      pageName:"文件",
      msgContent:"",
      msgTitle:"",
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
    ...mapMutations(['setUser','pushFileToUploadQueue','shirftWaitQueue','shiftDownloadQueue','changeDownloadFirstStatus','updateDownloadProgress']),
    socketUpload(fileItem){
      let url = this.$http.defaults.baseURL.substring(this.$http.defaults.baseURL.lastIndexOf("/")+1);
      let ws = new WebSocket(`ws://${url}/ws`);
      fileItem.upload = true
      ws.onopen=()=>{
        ws.send(JSON.stringify({
          fileName:fileItem.name,
          fileSize:fileItem.file.size,
          modifier:fileItem.targetModifier,
          username:fileItem.username
        }))
        fileItem.status = 1
      }
      ws.onmessage = (evt)=>{
        let response = JSON.parse(evt.data)
        if(response.code==101){
          let pieceSize = 64*1024
          let pieceCount = fileItem.file.size/pieceSize
          let fileSize = fileItem.file.size;
          for(let i = 0;i<pieceCount;i++){
            let s = pieceSize*i
            let e = Math.min(fileSize,s+pieceSize)
            let blob = fileItem.file.slice(s,e)
            ws.send(blob)
          }
        }else if(response.code==100){
          fileItem.progress = response.data[0]
          if(response.data[1]==fileItem.file.size)
          {
            ws.close()
            this.$refs.msg.show = true
            this.msgTitle = '上传提示'
            this.msgContent = `${fileItem.name}上传完毕`
            fileItem.status = 2
          }
        }else if(response.code==403){
          this.$refs.msg.show = true
          this.msgTitle = '上传提示'
            this.msgContent = `${fileItem.name}上传被拒绝`
          fileItem.status=-1
        }
      }
      ws.onclose = ()=>{
        fileItem.status=fileItem.status>0?2:-1
      }
    },
    showMsgWin(title,msg){
      this.$refs.msg.show = true
      this.msgTitle = title
      this.msgContent = msg
    }
  },
  async created(){
    let data = await ipcRenderer.invoke('loadedHome',"need")
    this.$http.defaults.baseURL = data[1]
    this.setUser({username:data[0]})
    setInterval(()=>{
      if(this.waitQueue.length!=0){
        let file = this.waitQueue[0]
        if(file.progress==1||file.status==-1||file.status==2)
          return this.shirftWaitQueue()
        if(!file.upload)
          this.socketUpload(file)
      }
    },1000);
    mainBus.on('upload',(items)=>{
      items.forEach(e=>{
        this.pushFileToUploadQueue({file:e})
        this.showMsgWin("上传提示",`${e.name}已加入上传队列`)
      })
    })
    ipcRenderer.on("downloadUpdateEvent",(data,evt)=>{
      this.updateDownloadProgress(evt)
      this.changeDownloadFirstStatus(3)
    })
    ipcRenderer.on("downloadSuccessEvent",(e,data)=>{
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
      this.showMsgWin("下载提示",`${this.downloadQueue[0].name}下载失败`)
      this.shiftDownloadQueue()
      if(this.downloadQueue.length!==0){
        this.changeDownloadFirstStatus(2)
        ipcRenderer.send("download",{
          downloadPath:this.$http.defaults.baseURL+'/download/'+this.downloadQueue[0].modifier+"/"+this.userInfo.username,
          fileName:this.downloadQueue[0].name
        })
      }
    })
    ipcRenderer.on('downloadInterruptedEvent',data=>{
      this.showMsgWin("下载提示",`${this.downloadQueue[0].name}下载被中断`)
      this.shiftDownloadQueue()
        if(this.downloadQueue.length!==0){
        this.changeDownloadFirstStatus(2)
        ipcRenderer.send("download",{
          downloadPath:this.$http.defaults.baseURL+'/download/'+this.downloadQueue[0].modifier+"/"+this.userInfo.username,
          fileName:this.downloadQueue[0].name
        })
      }
    })
    ipcRenderer.on('close-win',()=>{
      swal({
        title: "你确定要关闭软件吗?",
        text: "如果关闭会强制中断正在进行的任务!",
        icon: "warning",
        closeOnClickOutside:false,
        buttons: {
          minimize:{
            
            text:"最小化",
            value:false,
          },
          close:{
            text:"关闭",
            value:true,
            color:'#000000'
          }
        },
        
      })
      .then((value) => {
        ipcRenderer.invoke('close-homeWin',value)
      });
    })
  },
  beforeUnmount(){
    mainBus.all.clear() 
  },
  mounted(){
    this.$nextTick(()=>{
        console.log(this.$refs.msg) // 输出实例
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