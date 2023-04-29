<template>
  <div class="download-container" free="1">
    <div class="download-item" free="1" v-for="(item,index) in itemList" :key="index" @mouseenter="hoverItem(item)" @mouseleave="leaveItem(item)" @click="clickItem(item)">
        <img :src="item.ico" alt="" free="1">
        <div :class="item.show?'name':'name-hidden'" free="1">{{ item.title }}</div>
    </div>
    <div :class="loading?'spinner-border':'spinner-hidden'" role="status">
        <span class="sr-only">Loading...</span>
    </div>
  </div>
  
</template>

<script>
import {mapMutations,mapState} from 'vuex'
import swal  from 'sweetalert'
import bus from '@/views/bodyContentbus.js';
import {ipcRenderer} from 'electron'

export default {
    props:{
        title:{
            required:true,
            type:String
        }
    },
    computed:{
        ...mapState(['userInfo','pathMap','downloadQueue'])
    },
    methods:{
        ...mapMutations(['showSubWindow','pushFileToDownloadQueue','shiftDownloadQueue','resetCheckLength']),
        hoverItem(item){
            item.show = true
        },
        leaveItem(item){
            item.show = false
        },
        async clickItem(item){
            if(this.loading)
                return
            this.loading = true
            switch(item.value){
                case 'move':{
                    if(this.title==="files"||this.title==="recycle"||this.title==="lock"){
                        await this.moveContent()
                    }
                    else
                        swal("此处禁止此操作")
                    break;
                }
                case "favorite":{
                    if(this.title=='files')
                        await this.addFavorites()
                    else{
                        swal("此处禁止此操作")
                    }
                    break;
                }
                case "unfavorite":{
                    if(this.title=='favorite')
                        await this.deleteFavorites()
                    else
                        swal("此处禁止此操作")
                    break
                }
                case "recycle":{
                    if(this.title=="files"||this.title=="lock"){
                        await this.recycleItems()
                    }else{
                        swal("此处禁止此操作")
                    }
                    break;
                }
                case "delete":{
                    if(this.title=="files"||this.title=="recycle"||this.title=="lock"){
                        await this.deleteItems()
                    }else{
                        swal("此处禁止此操作")
                    }
                    break;
                }
                case "lock":{
                    if(this.title=="files"){
                        await this.moveToLock()
                    }else{
                        swal("此处禁止此操作")
                    }
                    break;
                }
                case "download":{
                    if(this.title=="recycle")
                        swal({
                            icon:"error",
                            text:"这里不可以下载,请将文件移除回收站再下载"
                        })
                    else{
                        this.pushFileDownloadQueue()
                    }
                }
            }
            this.loading = false;
        },
        pushFileDownloadQueue(){
            let list = this.pathMap[this.title].fileList.filter(item=>item.state==1)
            let items = list.map(item=>{
                return {
                    modifier:item.modifier,
                    name:item.name,
                    status:0,//0是等待,1是完成,-1是失败,2是下载准备中,3是下载
                    progress:0,
                    downloading:false,
                    username:this.userInfo.username,
                    type:item.type
                }
            })
            let flag = this.downloadQueue.length===0
            if(flag){
                items[0].status = 2;
            }
            items.forEach(item=>{
                this.pushFileToDownloadQueue({item:item})
            })
            if(flag){
                ipcRenderer.send("download",{
                    downloadPath:this.$http.defaults.baseURL+'/download/'+this.downloadQueue[0].modifier+"/"+this.userInfo.username,
                    fileName:this.downloadQueue[0].name
                })
            }
            swal({
                icon:"success",
                text:"成功添加到下载队列"
            })
        },
        async moveToLock(){
            let list = this.pathMap[this.title].fileList.filter(item=>item.state===1)
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
                  return await this.moveItemsToLock(list)
                }
                swal("密码错误,请联系管理员获得密码")
            }catch(e){
                console.log(e)
                swal("网络请求出错")
            }
        },
        async moveItemsToLock(list){
            try {
                let {data} = await this.$http.post('/file/lockItemsByItems',list)
                if(data.code==200){
                    swal({
                        icon:"success",
                        text:`成功存放到密码箱中`
                    })
                    bus.emit("needFresh",this.fatherTtitle)
                    this.resetCheckLength({title:this.title})

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
                bus.emit("needFresh",this.title)
                swal.close()
            }
        },
        async deleteItems(){
            try {
                let list = this.pathMap[this.title].fileList.filter(item=>item.state===1)
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
                    let {data} = await this.$http.post("/file/deleteFileByItems",{
                        username:this.userInfo.username,
                        items:list
                    })
                    if(data){
                        swal({
                            text:"删除成功",
                            icon:"success"
                        })
                        this.resetCheckLength({title:this.title})
                    }else{
                        swal("删除遇到问题,操作终止!")
                    }
                }else{
                    swal("操作已取消")
                    swal.close()
                }
            } catch (error) {
                console.log(e)
                swal("网络请求出错")
            }finally{
                bus.emit("needFresh",this.title)
                swal.close()

            }
        },
        async recycleItems(){
            try {
                let list = this.pathMap[this.title].fileList.filter(item=>item.state===1)
                let res = await swal({
                  title: "你确定要将选中文件移入回收站吗?",
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
                        let {data} = await this.$http.post('/file/recycleItemsByItems',list)
                        if(data.code==200){
                            swal(`成功移入回收站`, {
                                icon: "success",
                            });
                            this.resetCheckLength({title:this.title})
                        }else if(data.code==203){
                            swal("移入回收站出现问题,请检查")
                        }else{
                            swal(data.msg)
                        }
                    } catch (error) {
                        swal("网络连接出现错误")
                    }
                }
            } catch (error) {
                console.log(e)
                swal("网络请求出错")
            }finally{
                bus.emit("needFresh",this.title)
                swal.close()

            }
        },
        async moveContent(){
            try{
                let list = this.pathMap[this.title].fileList.filter(item=>item.state===1)
                let {data} = await this.$http.get("/file/getRootFiles")
                this.showSubWindow({
                    list:data,
                    moveQueue:list,
                    title:this.title
                })
            }catch(e){
                console.log(e)
                swal("网络请求出错")
            }
        },
        async deleteFavorites(){
            let list = []
            this.pathMap[this.title].fileList.forEach(item=>{
                if(item.state==1)
                    list.push(item.modifier)
            })
            let res = await swal({
              title: "你确定要将选中文件从收藏夹移除吗?",
              text: "请再次确认你的选项",
              icon: require("@/assets/qs.png"),
              buttons: ["取消","确定"],
              dangerMode: true,
            })
            if(res){
                try{
                    let {data} = await this.$http.post("/file/deleteFavorites",list)
                    if(data){
                        swal(`成功从收藏夹中移除`, {
                            icon: "success",
                        });
                    }else{
                        swal(`移除中断,可能有未移除项`, {
                            icon: require("@/assets/warn.png"),
                        });
                    }
                }catch(e){
                    console.log(e)
                }finally{
                    bus.emit("needFresh",this.title)
                }
            }else{
                swal("取消了操作")
            }
        },
        async addFavorites(){
            let list = this.pathMap[this.title].fileList.filter(item=>(item.username=this.userInfo.username)&&(item.state===1))
            let res = await swal({
              title: "你确定要将选中文件加入收藏夹吗?",
              text: "请再次确认你的选项",
              icon: require("@/assets/qs.png"),
              buttons: ["取消","确定"],
              dangerMode: true,
            })
            if(res){
                try{
                    let {data} = await this.$http.post("/file/addFavorites",list)
                    if(data){
                        swal(`成功添加到收藏夹`, {
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
    },
    data(){
        return{
            loading:false,
            itemList:[
                {
                    title:'下载',
                    ico:require('@/assets/home/download.png'),
                    value:'download',
                    show:false
                },
                {
                    title:'移动',
                    ico:require('@/assets/home/move.png'),
                    value:'move',
                    show:false
                },
                {
                    title:'喜欢',
                    ico:require('@/assets/home/favorite.png'),
                    value:'favorite',
                    show:false
                },
                {
                    title:'取消喜欢',
                    ico:require('@/assets/home/unfavorite.png'),
                    value:'unfavorite',
                    show:false
                },
                {
                    title:'密码箱',
                    ico:require('@/assets/home/lock.png'),
                    value:'lock',
                    show:false
                },
                {
                    title:'回收站',
                    ico:require('@/assets/home/recycle.png'),
                    value:'recycle',
                    show:false
                },
                {
                    title:'彻底删除',
                    ico:require('@/assets/home/delete.png'),
                    value:'delete',
                    show:false
                },
            ]
        }
    },
    created(){
    }
}
</script>

<style lang="less" scoped>
    .download-container{
        position: absolute;
        z-index: 99;
        box-sizing: border-box;
        padding: 10px 17px;
        width: 250px;
        border-radius: 10px;
        background-color: #2e2e2e;
        bottom: 40px;
        right: calc(50% - 100px);
        display: flex;
        justify-content: space-between;
        align-items: center;
        user-select: none;
        .spinner-border{
            position: fixed;
            z-index: 999;
            left: 60%;
            top: 50%;
        }
        .spinner-hidden{
            display: none;
        }
        .download-item{
            box-sizing: border-box;
            padding: 5px 8px;
            border-radius: 5px;
            position: relative;
            cursor: pointer;
            img{
                width: 15px;
            }
            .name-hidden{
                position: absolute;
                max-height: 0px;
                max-width: 0px;
                overflow: hidden;
                transition: all 0.1s;
                color: #ffffff;
                background-color: #515151;

            }
            .name{
                position: absolute;
                padding: 6px;
                top: -45px;
                right: -13px;
                background-color: #4d4d4d;
                color: #ffffff;
                width: 60px;
                border-radius: 6px;
                right: calc(50%-30px);
                font-size: 13px;
                transition: all 0.1s;
            }
        }
        .download-item:hover{
            background-color: #585858;
        }
    }
</style>