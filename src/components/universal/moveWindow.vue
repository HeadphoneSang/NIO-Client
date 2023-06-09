<template>
  <div class="main-container border-shadow">
    <!-- 顶部栏 -->
    <div class="control-bar">
        <div class="title">移动到</div>
        <img src="@/assets/close.png" @click.stop="closeWindow">
    </div>
    <!-- 顶部栏 -->

    <!-- 路径切换和显示栏 -->
    <MiniPathView ></MiniPathView>
    <!-- 路径切换和显示栏 -->

    <!-- 路径总览区域 -->
    <div class="files-container">
        <div :class="item.type==='directory'?'file-item':'file-notallowed'" v-for="(item,index) in miniPathMap.files" :key="index" @dblclick="clickDir(item)">
            <div class="img-box">
                <img :src="initIcon(item.type)" >
            </div>
            <div class="name-box">
                {{ item.name }}
            </div>
        </div>
    </div>
    <!-- 路径总览区域 -->


    <!-- 底部栏 -->
    <div class="bottom-bar">
        <div class="left-container">
        </div>
        <div class="right-container">
            <a @click.stop="closeWindow">取消</a>
            <a @click.stop="moveContent">移动到此处</a>
        </div>
    </div>
    <!-- 底部栏 -->
  </div>
</template>

<script>
import MiniPathView from '@/components/universal/miniContentBar.vue'
import {mapMutations,mapState} from 'vuex'
import swal from 'sweetalert'
import bus from '@/views/miniBus.js'
import bodyBus from '@/views/bodyContentbus.js';

export default {
  components:{
    MiniPathView
  },
  data(){
    return {
        moveQueue:[],
        title:''
    }
  },
  methods:{
    ...mapMutations(['hiddenSubWindow','priorityDir','switchMiniPostPath','setMiniFileList','resetCheckLength']),
    async clickDir(item){
       if(item.type==="directory"){
        if(this.miniPathMap.moveQueue.some(to=>to.modifier==item.modifier)){
            swal({
                title:"危险操作!",
                text:"不可以将文件夹移动到自己里面\n避免造成无限递归",
                icon:"error",
                buttons:{
                    ok:{
                        text:"确定"
                    }
                }
            })
            return;
        }
        try{
            let {data} = await this.$http.get(`/file/getFileListByModifier/${item.modifier}`)
            if(data.code==200){
                let list = data.list
                this.switchMiniPostPath({
                    pathName:item.name,
                    modifier:item.modifier
                })
                this.setMiniFileList({
                    fileList:list
                })
                this.priorityDir()
                bus.emit("needFresh",list)
            }else{
                swal("文件夹出现内部错误")
            }
        }catch(e){
            console.log(e)
            swal("网络请求出错")
        }
       }
    },
    closeWindow(){
        this.hiddenSubWindow()
    },
    initIcon(type){
        if(type.match(/(zip|gz|tar|7z|rar)/)!==null){
            return require('@/assets/typesIcon/zip.png')
        }
        if(type=='directory')
            return require('@/assets/typesIcon/directory.png')
        if(type.match(/(txt|js|json|md|yml|yaml|py)/)!==null){
            return require('@/assets/typesIcon/file.png')
        }
        if(type.match(/(xls)/)!==null){
            return require('@/assets/typesIcon/excel.png')
        }
        if(type.match(/(pdf)/)!==null){
            return require('@/assets/typesIcon/pdf.png')
        }
        if(type.match(/(mp3|wav|wma|ogg|ape|acc)/)!==null){
            return require('@/assets/typesIcon/music.png')
        }
        if(type.match(/(swf|flv|mp4|rmvb|avi|mpeg|ra|ram|mov|wmv|mkv)/)!==null){
            return require('@/assets/typesIcon/MP4.png')
        }
        if(type==='ppt'||type==='pptx'){
            return require('@/assets/typesIcon/ppt.png')
        }
        if(type==='html'){
            return require('@/assets/typesIcon/html.png')
        }
        if(type==='doc'||type==='docx'){
            return require('@/assets/typesIcon/doc.png')
        }
        if(type==='jar'){
            return require('@/assets/typesIcon/JAR.png')
        }
        if(type==='css'){
            return require('@/assets/typesIcon/css.png')
        }
        return require('@/assets/typesIcon/invalid.png')
    },
    async moveContent(){
        let name = await swal({
            title:"你确定要移动此文件吗?",
            text: '移动后源文件会直接转移位置',
            closeOnClickOutside:false,
            buttons:{
                close:{
                    text: "关闭",
                    closeModal:true
                },
                default:{
                    text: "移动",
                    closeModal: false,
                }
            }
        })
        if(name==="default"){
            let length = this.miniPathMap.content.length;
            let modifier = length>0?this.miniPathMap.content[length-1].modifier:""
            try {
                let {data} = await this.$http.post("/file/moveAtoBItem",{
                        targetItem:{
                            modifier:modifier,
                            name:"",
                            type:"directory",
                            state:0,
                            time:0,
                        },
                        moveItems:this.miniPathMap.moveQueue
                    }
                )
                if(data.code==200){
                    swal.close()
                    swal({
                      title: "转移成功!",
                      text: "点击确认按钮退出",
                      icon: "success",
                      button: "确认",
                    });
                    this.resetCheckLength({title:this.miniPathMap.title})
                    bodyBus.emit('needFresh',this.miniPathMap.title)
                }else if(data.code==203){
                    swal({
                      title: "转移出现失败流程!",
                      text: "点击确认按钮退出",
                      icon: "error",
                      button: "确认",
                    });
                }else{
                    swal({
                      title: "转移出错!",
                      text: `${data.msg}`,
                      icon: "error",
                      button: "确认",
                    });
                }
            } catch (error) {
                console.log(error)
              swal.close()
              swal({
                  title: " 网络连接错误",
                  icon: "warning",
                  dangerMode: true,
                })
            }
            
        }else{
            swal.close()
            swal("取消了移动")
        }
    }
  },
  computed:{
    ...mapState(['miniPathMap'])
  },
  created(){
    this.priorityDir()
  }
}
</script>

<style lang="less" scoped>
.main-container{
    position: fixed;
    z-index: 100;
    width: 400px;
    height: 500px;
    background-color: #ffffff;
    border-radius: 15px;
    right: calc(50% - 200px);
    bottom: calc(50% - 250px);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .files-container{
        width: 100%;
        background-color: #ffffff;
        flex: 1;
        box-sizing: border-box;
        padding: 20px 5px 60px 5px;
        overflow: auto;
        display: flex;
        flex-direction: column;
        .file-item,.file-notallowed{
            display: flex;
            align-items: center;
            box-sizing: border-box;
            padding: 8px 10px;
            border-radius: 10px;
            cursor:pointer;
            user-select: none;
            .img-box{
                img{
                    height: 23px;
                }
                width: 30px;
                margin-right: 10px;
            }
            .name-box{
                font-size: 14px;
                color: #5c5c5c;
            }
        }
        .file-notallowed{
            cursor: not-allowed;
            .name-box{
                color: #a2a2a2;
            }
            .img-box{
                img{
                    filter: grayscale(70%);
                }
            }
        }
        .file-item:hover{
            background-color: #efefef;
        }
    }   
    .bottom-bar{
        position: absolute;
        bottom: 0;
        width: 100%;
        display: flex;
        justify-content: space-between;
        background-color: #F5F5F6;
        box-sizing: border-box;
        padding: 15px;
        a{
            user-select: none;
            box-sizing: border-box;
            font-size: 15px;
            color: #ffffff;
        }
        a:nth-child(1){
            color: #747474;
            border-radius: 5px;
            border: 1px solid #d1d1d1;
            padding: 5px 20px;
            cursor: pointer;
            margin-right: 10px;
        }
        a:nth-child(1):hover{
            background-color: #d9d9d9;
            color: #6476a8;
        }
        a:nth-child(2){
            color: #ffffff;
            border: 1px solid #b0b0b0;
            padding: 5px 20px;
            background-color: #637DFF;
            border-radius: 5px;
            cursor: pointer;
        }
        a:nth-child(2):hover{
            background-color: rgb(144, 166, 225);
        }
    }
    .control-bar{
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 25px 20px 5px 20px;
        user-select: none;
        .title{
            font-size: 15px;
            font-weight: 500;
        }
        img{
            height: 18px;
            cursor: pointer;
        }
        
    }
}
</style>