<template>
  <div class="body-container" @contextmenu.stop="clickBody">
    <div class="top-bar">
        <!-- <button @click.prevent="showMsg('测试标题一个','我是顶真我喜欢抽瑞克五代111111111111111111111','msg')">test</button> -->
        <!-- <input type="checkbox" id="checkAll" @click="selectAll({title:title})" v-model="checkAll"> -->
        <label>共{{ pathMap[title].fileList.length }}个</label>
    </div>
    <div class="files-container"> 
        <FileItem :item="item" v-for="(item,index) in pathMap[title].fileList" :key="index" :press-shirft="pressShirft" :pressCtrl="pressCtrl" :index="index" :father-ttitle="title" @selectMore="onSelectMore" @dblclick="onDbClickFile(item)"></FileItem>
    </div>
    <div :class="showMenu?'showSub border-shadow':'hiddenSub'" id="main" :style="{left:mouseX+'px',top:mouseY+'px'}">
        <div class="func-container" @click.stop="clickMenu('createDir')">新建文件夹</div>
        <div class="func-container" @click.stop="clickMenu('upload')">上传文件</div>
        <div class="func-container" @click.stop="clickMenu('refresh')">刷新页面</div>
    </div>
    <DownloadBar :title="title" v-if="pathMap[title].checkLength>1"></DownloadBar>
    <!-- <Message :message="msgContent" :title="msgTitle" :x="20" :y="20" ref="msg"></Message> -->
    <div :class="loading?'spinner-border':'spinner-hidden'" role="status">
        <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>

<script>
import {mapMutations,mapState} from 'vuex'
import FileItem from '@/components/home/fileItem.vue'
import Message from '@/components/universal/messageBar.vue'
import DownloadBar from '@/components/home/downloadBar.vue'
import swal from 'sweetalert';
import {ipcRenderer} from 'electron'
import bus from '@/views/bodyContentbus.js';

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
        ...mapState(['pathMap','userInfo']),
        allChecked(){
            return this.pathMap[this.title].fileList.checkLength==this.pathMap[this.title].fileList.length
        }
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
            loading:false,
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
        ...mapMutations(['checkInRange','setFileList','switchPostPath','pointContent','selectAll','priorityFilesDir']),
        onDbClickFile(item){
            if(item.type=="directory"){
                this.switchPostPath({
                    moduleName:this.title,
                    pathName:item.name,
                    modifier:item.modifier
                })
                bus.emit("updateDataEvent",{
                    title:this.title,
                    modifier:item.modifier
                })
            }
        },
        clickBody(e){
            this.mouseX = e.pageX
            this.mouseY = e.pageY
            this.showMenu = true
        },
        /**
         * 再当前目录创建一个文件夹
         */
        createDir(){
            let length = this.pathMap[this.title].stack.length
            let rootModifier = length===0?"":this.pathMap[this.title].stack[length-1].modifier
            swal("在这里写入文件夹名称:", {
              content: "input",
            })
            .then(async (value) => {
                if(value!=null&&value.replace(" ","")!="")
                {
                    let {data} = await this.$http.get(`/file/createDirByParModifier/${rootModifier}/${value}`)
                    if(data){
                        swal(`创建文件夹成功`);
                        await this.getFilelistByModifier(rootModifier)
                    }else{
                        swal("创建文件夹失败")
                    }
                    
                }
                else
                    swal(`取消了创建`);
            });
        },
        clickMenu(func){
            switch(func){
                case 'createDir':{
                    if(this.title==="files")
                        this.createDir()
                    else
                        swal("此处不允许创建文件夹")
                    break;
                }
                case 'upload':{
                    break;
                }
                case 'refresh':{
                    let length = this.pathMap[this.title].stack.length
                    let rootModifier = length===0?"":this.pathMap[this.title].stack[length-1].modifier
                    this.getFilelistByModifier(rootModifier)
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
        },
        async getFilelist(){
            if(this.loading)
                return
            this.loading = true
            if(this.title=="files")
            {
                await this.getDefaultFile()
            }else if(this.title=="favorite"){
                await this.getDefaultFavorite()
            }else if(this.title=="recycle"){
                await this.getRecycleList()
            }else if(this.title=="lock"){
                await this.getLockList()
            }
            this.pointContent({title:this.title})
            this.priorityFilesDir({title:this.title})
            this.loading = false;
        },
        async getLockList(){
            let res = await this.$http.get("/file/getLockFiles")
                if(res.status==200){
                    this.setFileList({
                        title:this.title,
                        fileList:res.data.list
                    })
                }
                else{
                    this.setFileList({
                        title:this.title,
                        fileList:[]
                    })
            }
        },
        /**
         * 加载默认的文件目录下的文件
         */
        async getDefaultFile(){
            let res = await this.$http.get("/file/getRootFiles")
                if(res.status==200){
                    this.setFileList({
                        title:this.title,
                        fileList:res.data
                    })
                }
                else{
                    this.setFileList({
                        title:this.title,
                        fileList:[]
                    })
            }
        },
        async getDefaultFavorite(){
            let res = await this.$http.get("/file/getFavoriteListByUsername/"+this.userInfo.username)
                if(res.status==200){
                    this.setFileList({
                        title:this.title,
                        fileList:res.data.list
                    })
                }
                else{
                    this.setFileList({
                        title:this.title,
                        fileList:[]
                    })
            }
        },
        async getRecycleList(){
            let res = await this.$http.get("/file/getRecycleFiles")
                if(res.status==200){
                    this.setFileList({
                        title:this.title,
                        fileList:res.data.list
                    })
                }
                else{
                    this.setFileList({
                        title:this.title,
                        fileList:[]
                    })
            }
        },
        async getFilelistByModifier(modifier){
            if(this.loading)
                return
            this.loading = true
            let res
            if(this.title=="favorite"&&modifier===""){
                res = await this.$http.get("/file/getFavoriteListByUsername/"+this.userInfo.username)
            }else if(this.title=="files"&&modifier===""){
                res = await this.$http.get(`/file/getFileListByModifier/${modifier}`)
            }else if(this.title==="recycle"&&modifier===""){
                res = await this.$http.get("/file/getRecycleFiles")
            }else if(this.title==="lock"&&modifier===""){
                res = await this.$http.get("/file/getLockFiles")
            }
            else{
                res = await this.$http.get(`/file/getFileListByModifier/${modifier}`)
            }
            if(res.status==200){
                this.setFileList({
                    title:this.title,
                    fileList:res.data.list
                })
            }
            else{
                this.setFileList({
                    title:this.title,
                    fileList:[]
                })
            }
            this.priorityFilesDir({title:this.title})
            this.loading = false;
        }
    },
    async created(){
        let data = await ipcRenderer.invoke('loadedHome',"need")
        this.$http.defaults.baseURL = data[1]
        if(this.pathMap[this.title].flag === 0){
          await this.getFilelist()
        }
        else{
            this.clickMenu("refresh")
        }
        /**
         * 注册监听
         */
        bus.on('needFresh',title=>{
            if(title===this.title){
                this.clickMenu("refresh")
            }
        })

    },
    mounted(){
        document.addEventListener('click', this.unshow,true)  
        document.addEventListener('keydown',this.keyDown,true)
        document.addEventListener('keyup',this.keyUp,true)
    },
    beforeUnmount(){
        document.removeEventListener('click', this.unshow, true)
        document.removeEventListener('keydown', this.keyDown, true)
        document.removeEventListener('keyUp', this.keyUp, true)
        bus.all.clear()
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
        .spinner-border{
            position: fixed;
            z-index: 999;
            left: 60%;
            top: 50%;
        }
        .spinner-hidden{
            display: none;
        }
        .showSub,.hiddenSub{
            display: flex;
            user-select: none;
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