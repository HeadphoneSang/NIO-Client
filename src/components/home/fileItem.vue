<template>
  <div class="file-item" :title="item.name" @dblclick="preView()">
    <div :class="'out-container cursor-pointer '+(item.state===1?'checked':' ')" @mouseenter.stop="hover=true" @mouseleave.stop="hover=false" @click.stop="clickItem" :flag="flag">
        <img :src="ico" :flag="flag">
        <div class="name"  :flag="flag">
            {{ item.name.length>nameLength?item.name.substring(0,nameLength)+'...':item.name }}
        </div>
        <div class="time" :flag="flag">
            {{ item.time }}
        </div>
        <div :class="'hover '+(hover?'hover-menu':'hover-hidden')" @click.stop="clickMenu" :flag="flag">
        </div>
        <div :class="showSub?'showSub border-shadow':'hiddenSub'" :id="item.modifier" :flag="flag">
            <div class="func-container" @click.stop="clickSubItem('download')" v-if="item.type!=='directory'"> 下载</div>
            <div class="func-container" @click.stop="clickSubItem('recycle')" v-if="fatherTtitle=='files'||fatherTtitle=='lock'">回收站</div>
            <div class="func-container" @click.stop="clickSubItem('delete')" v-if="fatherTtitle=='recycle'||fatherTtitle=='files'||fatherTtitle=='lock'">删除</div>
            <div class="func-container" @click.stop="clickSubItem('lock')" v-if="fatherTtitle=='files'">密码箱</div>
            <div class="func-container" @click.stop="clickSubItem('collect')" v-if="fatherTtitle=='files'">收藏</div>
            <div class="func-container" @click.stop="clickSubItem('uncollect')" v-if="fatherTtitle=='favorite'">移除收藏夹</div>
            <div class="func-container" @click.stop="clickSubItem('move')" v-if="fatherTtitle=='files'||fatherTtitle=='recycle'||fatherTtitle=='lock'">移动</div>
            <div class="func-container" @click.stop="clickSubItem('rename')" v-if="fatherTtitle=='files'||fatherTtitle=='recycle'||fatherTtitle=='lock'">重命名</div>
            <div class="func-container" @click.stop="clickSubItem('detail')">详细信息</div>
            <div class="func-container" @click.stop="clickSubItem('share')" v-if="item.type!='directory'">分享下载链接</div>
        </div>
    </div>
    <div :class="loading?'spinner-border':'spinner-hidden'" role="status">
        <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>

<script>
import {mapMutations,mapState} from 'vuex'
import bus from '@/views/bodyContentbus.js';
import swal from 'sweetalert';
import {ipcRenderer} from 'electron'
export default {
    watch:{
        "item.type":{
            handler(){
                this.initIcon()
            }
        }
    },
    props:{
        item:{
            type:Object,
        },
        index:{
            required:true
        },
        pressCtrl:{
            required:true
        },
        pressShirft:{
            required:true
        },
        fatherTtitle:{
            required:true,
            type:String
        }
    },
    computed:{
        ...mapState(['showMove','userInfo','downloadQueue'])
    },
    data(){
        return {
            loading:false,
            ico:'',
            nameLength:8,
            hover:false,
            showSub:false,
            flag:this.item.modifier+'b',
            previewIcon:'',
            unshow:(e)=>{
                if(this.showMove){
                    return
                }
                if (e.target.id!==this.item.modifier) {
                    this.showSub =false
                }
                if(this.pressCtrl||(e.target.attributes['free']!==undefined))
                    return 
                if(e.target.attributes['flag']===undefined)
                    
                    if(this.pressShirft)
                        return
                    
                    else if(this.item.state===1)
                        return this.changeFileState({
                            state:0,
                            title:this.fatherTtitle,
                            index:this.index
                        })
                if(this.item.state===1&&e.target.attributes['flag'].value!==this.flag)
                {
                    return this.changeFileState({
                        state:0,
                        title:this.fatherTtitle,
                        index:this.index
                    }) 
                }
                
            }
        }
    },
    methods:{
        ...mapMutations(['changeFileState','showSubWindow','pushFileToDownloadQueue']),
        preView(){
            if(this.item.type.match(/(jpg|jpeg|gif|png|psd|tga|pcx|ico)/)!==null){
                this.$preview(this.previewIcon);
            }
        },
        clickMenu(){
            this.showSub = true
        },
        clickItem(){
            this.changeFileState({
                state:1^this.item.state,
                title:this.fatherTtitle,
                index:this.index
            })
            this.$emit('selectMore',this.index)
        },
        async clickSubItem(func){
            if(this.loading)
                return
            this.loading = true
            switch(func){
                case 'download':{
                    this.pushToDownloadQueu();
                    break;
                }
                case 'recycle':{
                    await this.recycleItem();
                    break;
                }
                case 'delete':{
                    await this.delete();
                    break;
                }
                case 'lock':{
                    await this.lock();
                    break;
                }
                case 'collect':{
                    await this.collect();
                    break;
                }
                case 'move':{
                    this.moveItem();
                    break;
                }
                case 'uncollect':{
                    await this.uncollect();
                    break;
                }
                case 'rename':{
                    await this.renameFile();
                    break;
                }
                case 'detail':{
                    await this.getDetail();
                    break;
                }
                case 'share':{
                    await this.shareDownload();
                    break;
                }
            }
            this.loading = false
        },
        async shareDownload(){
            var elem = document.createElement("div");
            let url = `${this.$http.defaults.baseURL}/download/${this.item.modifier}/`;
            if(this.item.type==='html'||this.item.type==='htm'){
                url = `${this.$http.defaults.baseURL}/file/getHtml/${this.item.modifier}`
            }
            let close = require('@/assets/close.png')
            elem.innerHTML = `
            <div class='title'>分享文件<img src="${close}" onclick="swal.close()"></img> </div>
            <div class='text'>请勿分享奇怪的东西,出现任何后果一律由操作用户承担!</div>
            <div class='img-container'>
                <img src="${this.ico}"></img>
                <div class='desc'>${this.item.name} </div>
            </div>
            <div class='url-container'>
                <div class='url-title'>分享链接</div>
                <div class='url'>${url.length>30?(url.substring(0,40))+'...':url}</div>
            </div>
            `;
            let confirm = await swal({
                className: 'share',
                content:elem,
                closeOnClickOutside:false,
                buttons:{
                    copy:{
                        text:"复制链接",
                        value:true
                    }
                }
            })
            if(confirm){
                let area = document.createElement('textarea');
                area.innerText = url;
                document.body.appendChild(area);
                area.select();
                document.execCommand("Copy");
                document.body.removeChild(area);
                swal({
                    title:"分享提示",
                    text:"已复制链接到剪贴板!",
                    icon:"success"
                })
            }
        },
        async getDetail(){
            try {
                let {data} = await this.$http.get(`/file/getFileDescByModifier/${this.item.modifier}`)
                if(data.code!=200){
                    swal({
                        title:"文件出错",
                        text:"错误代码: "+data.code
                    })
                }
                var elem = document.createElement("div");
                elem.innerHTML = `
                <div style="width:100%;display:flex;align-items:center;margin-bottom:10px">
                    <img src="${this.ico}" style="width:40px;margin-right:10px"></img>
                    <span style="color:#4a4c4d;font-weight:600;font-size:14px" @click="clickName">${this.item.name}</span>
                </div>
                <div style="width:100%">
                    <div style='width:100%;text-align:left;font-size:15px;margin-bottom:5px'>文件大小:</div>
                    <div style="width:100%;text-align:left;color:#696969;font-size:14px">${data.desc.size}</div>     
                </div>
                <hr/>
                <div style="width:100%;margin-bottom:5px">
                    <div style='width:100%;text-align:left;font-size:15px;margin-bottom:5px'>创建时间:</div>
                    <div style="width:100%;text-align:left;color:#696969;font-size:14px">${data.desc.createTime}</div>     
                </div>
                <div style="width:100%;margin-bottom:5px">
                    <div style='width:100%;text-align:left;font-size:15px;margin-bottom:5px'>修改时间:</div>
                    <div style="width:100%;text-align:left;color:#696969;font-size:14px">${data.desc.modifierTime}</div>     
                </div>
                <div style="width:100%;margin-bottom:5px">
                    <div style='width:100%;text-align:left;font-size:15px;margin-bottom:5px'>访问时间:</div>
                    <div style="width:100%;text-align:left;color:#696969;font-size:14px">${data.desc.accessTime}</div>     
                </div>
                <div style="width:100%;margin-bottom:5px">
                    <div style='width:100%;text-align:left;font-size:15px;margin-bottom:5px'>上传时间:</div>
                    <div style="width:100%;text-align:left;color:#696969;font-size:14px">${data.desc.uploadTime}</div>     
                </div>
                <div style="width:100%">
                    <div style='width:100%;text-align:left;font-size:15px;margin-bottom:5px'>上传用户:</div>
                    <div style="width:100%;text-align:left;color:#696969;font-size:14px">${data.desc.username}</div>     
                </div>
                `;
                swal(
                    {
                        className:'file-info',
                        content:elem,
                        buttons:{
                            minimize:{        
                              text:"取消",
                              value:false,
                            },
                            close:{
                              text:"关闭",
                              value:true,
                            }
                        }
                    }
                )
            } catch (error) {
                console.log(error)
            }
            
        },
        clickName(){
            console.log(2)
        },
        async renameFile(){
            let pass = await swal({
                icon:require("@/assets/home/rename.png"),
                title: "请输入要修改的名称",
                content: {
                  element: "input",
                  attributes: {
                    placeholder: "请输入新文件名称(不包括后缀扩展名)",
                  },
                },
            })
            if(pass==null||pass==""){
                return swal("已取消")
            }
            try{
                let {data} = await this.$http.post("/file/renameFileByModifier",{
                    modifier:this.item.modifier,
                    name:pass
                })
                swal(data.msg)
                bus.emit("needFresh",this.fatherTtitle)
            }catch(e){
                console.log(e)
                swal("网络请求出错")
            }
        },
        pushToDownloadQueu(){
            let flag = this.downloadQueue.length === 0
            this.pushFileToDownloadQueue({
                item:{
                    modifier:this.item.modifier,
                    name:this.item.name,
                    status:flag?2:0,//0是等待,1是完成,-1是失败,2是下载准备中,3是下载
                    progress:0,
                    downloading:false,
                    username:this.userInfo.username,
                    type:this.item.type,
                    beforeTime:0,
                    sendByte:0,
                    size:0,
                    speed:0
                }
            })
            swal({
                icon:"success",
                text:`已将${this.item.name}加入下载队列`
            })
            if(flag){
                ipcRenderer.send("download",{
                    downloadPath:this.$http.defaults.baseURL+'/download/'+this.item.modifier+"/"+this.userInfo.username,
                    fileName:this.item.name
                })
            }
        },
        async lock(){
            let pass = await swal({
                icon:require("@/assets/pass.png"),
                title: "请输入密码,来继续操作",
                content: {
                  element: "input",
                  attributes: {
                    placeholder: "请在此输入密码",
                    type: "password",
                  },
                },
            })
            if(pass==null||pass==""){
                return swal("已取消")
            }
            try{
                let {data} = await this.$http.get(`/file/checkLockBoxPassword/${pass}`)
                if(data){
                  swal({
                    title:"密码正确",
                    text:"文件转移请稍等...",
                    closeOnClickOutside:false,
                    buttons:{
                        ok:{
                            text:"退出",
                            closeModal:false
                        }
                    }
                  })
                  return await this.moveToLock()
                }
                swal("密码错误,请联系管理员获得密码")
            }catch(e){
                console.log(e)
                swal("网络请求出错")
            }
        },
        async moveToLock(){
            try {
                let {data} = await this.$http.post('/file/lockItemsByItems',[this.item])
                if(data.code==200){
                    swal({
                        icon:"success",
                        text:`已经将${this.item.name}存放到密码箱中`
                    })
                    bus.emit("needFresh",this.fatherTtitle)

                }else if(data.code=203){
                    swal({
                        icon:"error",
                        text:"文件转移出现问题?已中断"
                    })
                }else{
                    swal({
                        icon:"error",
                        text:"服务器内部出现问题"
                    })
                }
            } catch (error) {
                swal("网络连接错误")
            }finally{
                swal.close()
            }
        },
        async delete(){
            let res = await swal({
              title: "你确定要将此文件彻底删除吗?",
              text: "删除后将无法再次找回",
              icon: "error",
              buttons: {
                false:{
                    text:'取消'
                },
                true:{
                    text:'确定',
                    closeModal: false,
                }
              },
              dangerMode: true,
              closeOnClickOutside:false,
            })
            if(res=="true"){
                try {
                    let {data} = await this.$http.post("/file/deleteFileByItems",{
                        username:this.userInfo.username,
                        items:[this.item]
                    })
                    if(data){
                        swal({
                            text:"删除成功",
                            icon:"success"
                        })
                    }else{
                        swal("删除遇到问题,操作终止!")
                    }
                } catch (error) {
                    swal("网络请求出错")
                }finally{
                    swal.close()
                    bus.emit("needFresh",this.fatherTtitle)
                }
            }else{
                swal("操作已取消")
                swal.close()
            }
        }
        ,
        async recycleItem(){
            let res = await swal({
              title: "你确定要将此文件移入回收站吗?",
              text: "请再次确认你的选项",
              icon: require("@/assets/qs.png"),
              buttons: {
                false:{
                    text:'取消'
                },
                true:{
                    text:'确定',
                    closeModal: false,
                }
              },
              dangerMode: true,
              closeOnClickOutside:false,
            })
            if(res=='true'){
                try {
                    let {data} = await this.$http.post('/file/recycleItemsByItems',[this.item])
                    if(data.code==200){
                        swal(`成功将: ${this.item.name} 移入回收站`, {
                            icon: "success",
                        });
                        bus.emit("needFresh",this.fatherTtitle)
                        swal.close()
                    }else if(data.code==203){
                        swal("移入回收站出现问题,请检查")
                        swal.close()
                    }else{
                        swal(data.msg)
                        swal.close()
                    }
                } catch (error) {
                    swal.close()
                    swal("网络连接出现错误")
                }
            }
        },
        async moveItem(){
            try{
                let {data} = await this.$http.get("/file/getRootFiles") 
                this.showSubWindow({
                    list:data,
                    moveQueue:[this.item],
                    title:this.fatherTtitle
                })
            }catch(e){
                console.log(e)
                swal("网络请求出错")
            }
        },
        async uncollect(){
            let res = await swal({
              title: "你确定要将此文件从收藏夹中移除吗?",
              text: "请再次确认你的选项",
              icon: require("@/assets/qs.png"),
              buttons: ["取消","确定"],
              dangerMode: true,
            })
            if(res){
                try{
                    let {data} = await this.$http.get(`/file/deleteFavoriteRecordByModifier/${this.item.modifier}`)
                    if(data){
                        swal(`成功将: ${this.item.name} 从收藏夹中移除`, {
                            icon: "success",
                        });
                        bus.emit("needFresh","favorite")
                    }else{
                        swal(`移除失败,可能文件不在收藏夹中`, {
                            icon: require("@/assets/warn.png"),
                        });
                    }
                }catch(e){
                    console.log(e)
                    swal(`网络连接错误`, {
                            icon: require("@/assets/warn.png"),
                        });
                }
            }
        },
        /**
         * 收藏按钮方法
         */
        async collect(){
            let res = await swal({
              title: "你确定要将此文件加入收藏夹吗?",
              text: "请再次确认你的选项",
              icon: require("@/assets/qs.png"),
              buttons: ["取消","确定"],
              dangerMode: true,
            })
            if(res){
                try{
                    let {data} = await this.$http.post("/file/addFavorites",[{
                        modifier:this.item.modifier,
                        name:this.item.name,
                        type:this.item.type,
                        username:this.userInfo.username,
                        time:this.item.time
                    }])
                    if(data){
                        swal(`成功将: ${this.item.name} 添加到收藏夹`, {
                            icon: "success",
                        });
                    }else{
                        swal(`添加失败,可能已经在收藏夹中`, {
                            icon: require("@/assets/warn.png"),
                        });
                    }
                }catch(E){
                    console.log(E)
                    swal("网络连接失败!", {
                        icon: require("@/assets/warn.png"),
                    });
                }
                
            }else{
                swal("取消了收藏");
            }
        },
        initIcon(){
            
            if(this.item.type.match(/(zip|gz|tar|7z|rar)/)!==null){
                return this.ico = require('@/assets/typesIcon/zip.png')
            }
            if(this.item.type=='directory')
                return this.ico = require('@/assets/typesIcon/directory.png')
            if(this.item.type.match(/(txt|js|json|md|yml|yaml|py)/)!==null){
                return this.ico = require('@/assets/typesIcon/file.png')
            }
            if(this.item.type.match(/(xls)/)!==null){
                return this.ico = require('@/assets/typesIcon/excel.png')
            }
            if(this.item.type.match(/(pdf)/)!==null){
                return this.ico = require('@/assets/typesIcon/pdf.png')
            }
            if(this.item.type.match(/(mp3|wav|wma|ogg|ape|acc)/)!==null){
                return this.ico = require('@/assets/typesIcon/music.png')
            }
            if(this.item.type.match(/(swf|flv|mp4|rmvb|avi|mpeg|ra|ram|mov|wmv|mkv)/)!==null){
                return this.ico = require('@/assets/typesIcon/MP4.png')
            }
            if(this.item.type==='ppt'||this.item.type==='pptx'){
                return this.ico = require('@/assets/typesIcon/ppt.png')
            }
            if(this.item.type==='html'){
                return this.ico = require('@/assets/typesIcon/html.png')
            }
            if(this.item.type==='doc'||this.item.type==='docx'){
                return this.ico = require('@/assets/typesIcon/doc.png')
            }
            if(this.item.type==='jar'){
                return this.ico = require('@/assets/typesIcon/JAR.png')
            }
            if(this.item.type==='css'){
                return this.ico = require('@/assets/typesIcon/css.png')
            }
            if(this.item.type.match(/(jpg|jpeg|gif|png|psd|tga|pcx|ico)/)!==null){
                // return this.ico = require('@/assets/typesIcon/image.png')
                this.previewIcon = this.$http.defaults.baseURL+"/file/getImgByModifier/"+this.item.modifier;
                return this.ico = this.$http.defaults.baseURL+"/file/getResourceByModifier/"+this.item.modifier;
            }
            
            this.ico = require('@/assets/typesIcon/invalid.png')
        }
    },
    created(){
        if(this.item.type.match(/(jpg|jpeg|gif|png|psd|tga|pcx|ico)/)!==null){
            this.ico = require('@/assets/typesIcon/image.png')
        }
        this.initIcon()
        
        
    },mounted(){
        document.addEventListener('click', this.unshow,true)  
        document.addEventListener('contextmenu', this.unshow,true);
         
    },
    beforeUnmount(){
        document.removeEventListener('click', this.unshow, true)
        document.removeEventListener('contextmenu', this.unshow, true)
    }
}
</script>

<style lang="less" scoped>
    .file-item{
        padding: 1px;
        box-sizing: border-box;
        margin-bottom: 10px;
        user-select: none;
        width: 150px;
        .spinner-border{
            position: fixed;
            z-index: 999;
            left: 60%;
            top: 50%;
        }
        .spinner-hidden{
            display: none;
        }
        .out-container:hover{
            background-color: #f2f2f2;
            border-radius: 20px;

        }
        .checked{
            background-color: #d3e6fd;
            border-radius: 20px;
        }
        .checked:hover{
            background-color: #d3e6fd;
            border-radius: 20px;
        }
        .out-container{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 80%;
            padding: 10px 0;
            height: 100%;
            position: relative;
            img{
                width: 80px;
                margin-bottom: 10px;
                max-height: 100px;
            }
            .name{
                font-size: 14px;
                margin-bottom: 5px;
                color: #696969;
            }
            .time{
                font-size: 13px;
                color: #a4a4a4;
            }
            .showSub,.hiddenSub{
                position: absolute;
                display: flex;
                flex-direction: column;
            }
            .hiddenSub{
                height: 0;
                max-height: 0;
                top: 0;
                right: 0;
                width: 50px;
                overflow: hidden;
                transition: all 0.5s;
            }   
            .showSub{
                top: 35px;
                right: -115px;
                width: 150px;
                background-color: #ffffff;
                color: #000000;
                transition: all 0.2s;
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
            .hover-hidden{
                height: 0px;
                width: 0px;
            }
            .hover-menu{
                position: absolute;
                top: 5px;
                right: 10px;
                width: 25px;
                height: 25px;
                background-image: url(@/assets/home/hoverMenu.png);
                background-size:contain;
                background-color: #ffffff;
                box-sizing: border-box;
                border-radius: 5px;
                transition: all 0.4s;
            }
        }
        
    }
</style>