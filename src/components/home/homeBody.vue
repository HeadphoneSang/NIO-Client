<template>
  <div class="body-container" @contextmenu.stop="clickBody">
    <div class="top-bar">
        <!-- <button @click.prevent="showMsg('测试标题一个','我是顶真我喜欢抽瑞克五代111111111111111111111','msg')">test</button> -->
        <input type="checkbox" id="checkAll">
        <label for="checkAll">共{{ pathMap[title].fileList.length }}个</label>
    </div>
    <div class="files-container"> 
        <FileItem :item="item" v-for="(item,index) in pathMap[title].fileList" :key="index" :press-shirft="pressShirft" :pressCtrl="pressCtrl" :index="index" :father-ttitle="title" @selectMore="onSelectMore"></FileItem>
    </div>
    <div :class="showMenu?'showSub border-shadow':'hiddenSub'" id="main" :style="{left:mouseX+'px',top:mouseY+'px'}">
        <div class="func-container" @click.stop="clickMenu('createDir')">新建文件夹</div>
        <div class="func-container" @click.stop="clickMenu('upload')">上传文件</div>
        <div class="func-container" @click.stop="clickMenu('refresh')">刷新页面</div>
    </div>
    <DownloadBar :title="title" v-if="pathMap[title].checkLength>1"></DownloadBar>
    <Message :message="msgContent" :title="msgTitle" :x="20" :y="20" ref="msg"></Message>
  </div>
</template>

<script>
import {mapMutations,mapState} from 'vuex'
import FileItem from '@/components/home/fileItem.vue'
import Message from '@/components/universal/messageBar.vue'
import DownloadBar from '@/components/home/downloadBar.vue'

export default {
    props:{
        title:{
            type:String,
            required:true
        }
    },
    watch:{
        pressCtrl:{
            handler(newV){
                if(this.press&&!newV){
                    this.pressCtrl = true
                }
            }
        }
    },
    components:{
        FileItem,Message,DownloadBar
    },
    computed:{
        ...mapState(['pathMap'])
    },
    data(){
        return {
            mouseX:0,
            mouseY:0,
            showMenu:false,
            msgContent:'我是顶真我喜欢抽瑞克五代阿三大苏打实打实的',
            msgTitle:'测试标题一个',
            pressCtrl:false,
            pressShirft:false,
            press:false,
            bIndex:-1,
            eIndex:-1,
            unshow:(e)=>{
            if (e.target.id!=='main') {
                    this.showMenu =false
                    this.pressCtrl = false
                }
            },
            keyDown:(e)=>{
                
                if(this.press)
                    return
                this.press = true
                if(e.key==='Control'){
                    this.pressCtrl = true
                }else if(e.key==='Shift'){
                    this.pressShirft = true
                }
            },
            keyUp:()=>{
                if(!this.press)
                    return
                this.press = false
                this.pressCtrl = false
                this.pressShirft = false
                this.bIndex = this.eIndex = -1
            }   
        }
    },
    methods:{
        ...mapMutations(['checkInRange']),
        clickBody(e){
            this.mouseX = e.pageX
            this.mouseY = e.pageY
            this.showMenu = true
        },
        clickMenu(func){
            switch(func){
                case 'createDir':{
                    break;
                }
                case 'upload':{
                    break;
                }
                case 'refresh':{
                    break;
                } 
            }
        },
        showMsg(title,msg,boxName){
            this.msgContent = msg
            this.msgTitle = title
            this.$refs[boxName].show = true
        },
        onSelectMore(newIndex){
            this.bIndex = this.eIndex
            this.eIndex = newIndex
            if(!this.pressShirft||this.bIndex==-1||this.eIndex==this.bIndex)
                return
            this.checkInRange({
                title:this.title,
                bIndex:Math.min(this.bIndex,this.eIndex),
                eIndex:Math.max(this.bIndex,this.eIndex)
            })
        }
    },
    created(){
    },mounted(){
        document.addEventListener('click', this.unshow,true)  
        document.addEventListener('keydown',this.keyDown,true)
        document.addEventListener('keyup',this.keyUp,true)
    },
    beforeUnmount(){
        document.removeEventListener('click', this.unshow, true)
        document.removeEventListener('keydown', this.keyDown, true)
        document.removeEventListener('keyUp', this.keyUp, true)
    }
    
}
</script>

<style lang="less" scoped>
    // ::-webkit-scrollbar{
    //   display: none;
    // }

    .body-container{
        width: 100%;
        flex: 1;
        box-sizing: border-box;
        padding: 10px 20px 10px 40px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        position: relative;
        .showSub,.hiddenSub{
            display: flex;
            flex-direction: column;
        }
        .hiddenSub{
            height: 0;
            max-height: 0;
            width: 50px;
            overflow: hidden;
            transition: height 0.5s;
        }   
        .showSub{
            width: 150px;
            height: 110px;
            position: fixed;
            background-color: #ffffff;
            color: #000000;
            transition: width 0.1s height 0.1s;
            z-index: 2;
            border-radius: 10px;
            box-sizing: border-box;
            padding: 5px;
            .func-container{
                text-align: left;
                box-sizing: border-box;
                padding: 5px 10px;
                font-size: 14px;
                border-radius: 5px;
            }
            .func-container:hover{
                background-color: #f4f4f4;
            }
        }
        .top-bar{
            display: flex;
            align-items: center;
            user-select: none;
            z-index: 1;
            background-color: #ffffff;
            box-sizing: border-box;
            padding: 0 0 20px 0;
            input{
                margin-right: 10px;
            }
            label{
                padding: 0;
                margin: 0;
                font-size: 12px;
                color: #8b8b8b;
                letter-spacing: 1px;
            }
        }
        .files-container{
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            flex: 1;
            overflow:auto;
            width: 95%;
            justify-content: flex-start;
            align-content: flex-start;
            position: absolute;
            height: 100%;
            box-sizing: border-box;
            padding:
            50px 10px 60px 10px;
        }
    }
</style>