<template>
  <div class="download-container" free="1">
    <div class="download-item" free="1" v-for="(item,index) in itemList" :key="index" @mouseenter="hoverItem(item)" @mouseleave="leaveItem(item)" @click="clickItem(item)">
        <img :src="item.ico" alt="" free="1">
        <div :class="item.show?'name':'name-hidden'" free="1">{{ item.title }}</div>
    </div>
  </div>
</template>

<script>
import {mapMutations,mapState} from 'vuex'
import swal  from 'sweetalert'
import bus from '@/views/bodyContentbus.js';


export default {
    props:{
        title:{
            required:true,
            type:String
        }
    },
    computed:{
        ...mapState(['userInfo','pathMap'])
    },
    methods:{
        ...mapMutations(['showSubWindow']),
        hoverItem(item){
            item.show = true
        },
        leaveItem(item){
            item.show = false
        },
        async clickItem(item){
            switch(item.title){
                case '移动':{
                    if(this.title==="files"||this.title==="recycle"){
                        this.moveContent()
                    }
                    else
                        swal("此处禁止此操作")
                    break;
                }
                case "喜欢":{
                    if(this.title=='files')
                        this.addFavorites()
                    else{
                        swal("此处禁止此操作")
                    }
                    break;
                }
                case "取消喜欢":{
                    if(this.title=='favorite')
                        this.deleteFavorites()
                    else
                        swal("此处禁止此操作")
                    break
                }
                case "回收站":{
                    if(this.title=="files"){
                        this.recycleItems()
                    }else{
                        swal("此处禁止此操作")
                    }
                    break;
                }
                case "彻底删除":{
                    if(this.title=="files"||this.title=="recycle"||this.title=="lock"){
                        this.deleteItems()
                    }else{
                        swal("此处禁止此操作")
                    }
                    break;
                }
            }
        },
        async deleteItems(){
            try {
                let list = []
                this.pathMap[this.title].fileList.forEach(item=>{
                    if(item.state==1)
                        list.push(item.modifier)
                })
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
                    let {data} = await this.$http.post("/file/deleteFileByModifiers",list)
                    if(data){
                        swal({
                            text:"删除成功",
                            icon:"success"
                        })
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
                let list = []
                this.pathMap[this.title].fileList.forEach(item=>{
                    if(item.state==1)
                        list.push(item.modifier)
                })
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
                        let {data} = await this.$http.post(`/file/recycleItems`,list)
                        if(data.code==200){
                            swal(`成功移入回收站`, {
                                icon: "success",
                            });
                            bus.emit("needFresh",this.title)
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
            } catch (error) {
                console.log(e)
                swal("网络请求出错")
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
            console.log(list)
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