<template>
  <div class="records-container">
    <div class="no-records" v-if="recordsList.length===0">
        <img src="@/assets/home/doubt.png">
        <div class="title">为什么没有记录?</div>
        <div class="text">
            只有进行过操作才会有操作记录
        </div>
        <div class="text">
            试着去操作一下吧
        </div>
    </div>
    <div class="items-container">
        <div :class="'record-item '+(item.selected?'record-item-selected':'')" v-for="(item,index) in recordsList" :key="item.modifier" @click="selectItem(item,index)">
            <div class="left">
                <img :src="initIcon(item.type)" alt="">
            </div>
            <div class="middle">
                <div class="name">{{ item.fileName }}</div>
                <div class="time">{{ item.time }}</div>
            </div>
            <div class="right" @click.stop="deleteRecord(item.id)">
                <div class="close" title="删除此项">
                </div>
            </div>
        </div>
    </div>
    <div :class="loading?'spinner-border':'spinner-hidden'" role="status">
        <span class="sr-only">Loading...</span>
    </div>
    <div class="tools border-shadow" v-if="selectedLength>0">
        <div class="tools-item" @click="deleteAll()">
            <div class="tools-btn"><img src="@/assets/recycle.png"></div>
            <div class="tools-title">删除全部记录</div>
            
        </div>
        <div class="tools-item"  @click="openDocument()">
            <div class="tools-btn"><img src="@/assets/docu.png"></div>
            <div class="tools-title">打开下载目录</div>
            
        </div>
    </div>
  </div>
</template>

<script>
import swal from 'sweetalert'
import {mapState} from 'vuex'
import { ipcRenderer } from 'electron';
export default {
    props:{
        title:{
            type:String,
            required:true
        },
        name:{
            type:String,
            required:true
        }
    },
    computed:{
        ...mapState(['userInfo']),
        selectedLength(){
            return this.recordsList.filter((item)=>item.selected).length;
        }
    },
    data(){
        return{
            nowIndex:0,
            pageSize:6,
            recordsList:[],
            loading:false,
            press:false,
            pressCtrl:false,
            pressShirft:false,
            bIndex:-1,
            eIndex:-1,
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
        async deleteAll(){
            if(this.loading)
                return;
            this.loading = true;
            let res = await swal({
                title:"删除提示",
                icon:"warning",
                text:"你确定要删除所有的操作记录吗？",
                buttons:{
                    minimize:{
            
                      text:"取消",
                      value:false,
                    },
                    close:{
                      text:"确定",
                      value:true,
                    }
                }              
            })
            if(!res){
                this.loading = false;
                return;
            }
            switch(this.title){
                case "upload":{
                    await this.deleteAllUploadRecords();
                    break;
                }
                case "delete":{
                    await this.deleteAllDeleteRecords();
                    break;
                }
                case "download":{
                    await this.deleteAllDownloadRecords();
                    break;
                }
            }
            this.loading = false;
            this.initRecordsList();
        },
        async deleteAllDownloadRecords(){
            try{
                let {data} = await this.$http.delete(`/file/deleteDownloadRecordsAll/${this.userInfo.username}`);
                if(data.code==200){
                    swal({
                        title:"success",
                        title:"删除成功",
                        text:data.msg
                    })
                }else{
                    swal({
                        title:"error",
                        title:"删除异常",
                        text:data.msg
                    })
                }
            }catch(e){
                swal("网络连接错误");
                console.log(e)
            }
        },
        async deleteAllDeleteRecords(){
            try{
                let {data} = await this.$http.delete(`/file/deleteDeleteRecordsAll/${this.userInfo.username}`);
                if(data.code==200){
                    swal({
                        title:"success",
                        title:"删除成功",
                        text:data.msg
                    })
                }else{
                    swal({
                        title:"error",
                        title:"删除异常",
                        text:data.msg
                    })
                }
            }catch(e){
                swal("网络连接错误");
                console.log(e)
            }
        },
        async deleteAllUploadRecords(){
            try{
                let {data} = await this.$http.delete(`/file/deleteUploadRecordsAll/${this.userInfo.username}`);
                if(data.code==200){
                    swal({
                        title:"success",
                        title:"删除成功",
                        text:data.msg
                    })
                }else{
                    swal({
                        title:"error",
                        title:"删除异常",
                        text:data.msg
                    })
                }
            }catch(e){
                swal("网络连接错误");
                console.log(e)
            }
        },
        async openDocument(){
            ipcRenderer.invoke('onOpenDownloadDir')
        },
        async deleteRecord(id){
            if(this.loading)
                return;
            this.loading = true;
            switch(this.title){
                case "upload":{
                    await this.deleteUploadRecord(id);
                    break;
                }
                case "delete":{
                    await this.deleteDeleteRecord(id);
                    break;
                }
                case "download":{
                    await this.deleteDownloadRecord(id);
                    break;
                }
            }
            this.loading = false;
        },
        async deleteDownloadRecord(id){
            let ids = this.recordsList.filter((item)=>item.selected).map((value)=>{
                return value.id;
            })
            if(ids.length==0){
                ids = [id];
            }
            try{
                let {data} = await this.$http.post("/file/records/deleteDownloadRecordsById",ids);
                if(data.code==200){
                    swal({
                        icon:"success",
                        title:"删除成功",
                        text:data.msg
                    });
                }else{
                    swal({
                        icon:"eror",
                        title:"删除异常",
                        text:data.msg
                    })
                }
            }catch(e){
                console.log(e);
                swal("网络连接失败")
            }finally{
                this.getDownloadRecords();
            }
        },
        async deleteDeleteRecord(id){
            let ids = this.recordsList.filter((item)=>item.selected).map((value)=>{
                return value.id;
            })
            if(ids.length==0){
                ids = [id];
            }
            try{
                let {data} = await this.$http.post("/file/records/deleteDeleteRecordsById",ids);
                if(data.code==200){
                    swal({
                        icon:"success",
                        title:"删除成功",
                        text:data.msg
                    });
                }else{
                    swal({
                        icon:"eror",
                        title:"删除异常",
                        text:data.msg
                    })
                }
            }catch(e){
                console.log(e);
                swal("网络连接失败")
            }finally{
                this.getDeleteRecords();
            }
        },
        async deleteUploadRecord(id){
            let ids = this.recordsList.filter((item)=>item.selected).map((value)=>{
                return value.id;
            })
            if(ids.length==0){
                ids = [id];
            }
            try{
                let {data} = await this.$http.post("/file/records/deleteRecordsById",ids);
                if(data.code==200){
                    swal({
                        icon:"success",
                        title:"删除成功",
                        text:data.msg
                    });
                }else{
                    swal({
                        icon:"eror",
                        title:"删除异常",
                        text:data.msg
                    })
                }
            }catch(e){
                console.log(e);
                swal("网络连接失败")
            }finally{
                this.getUploadRecords();
            }
        },
        selectItem(item,index){
            if(!this.pressCtrl){
                this.recordsList.forEach(e=>{
                    if(e!==item)
                        e.selected = false;
                })
            }
            if(this.pressShirft){
                this.bIndex = this.eIndex
                this.eIndex = index
                if(this.bIndex!==-1){
                    let b = Math.min(this.bIndex,this.eIndex);
                    let e = Math.max(this.bIndex,this.eIndex);
                    for(let i = b;i<=e;i++){
                        this.recordsList[i].selected = true;
                    }
                    return;
                }
                else{
                    return item.selected = true;
                }
            }else{
                this.bIndex =this.eIndex= index;
            }   
            if(item.selected===undefined||!item.selected){
                item.selected = true;
            }else{
                item.selected = false;
            }
        },
        async getDeleteRecords(){
            try{
                let {data} = await this.$http.get(`/file/getDeleteRecordsByUsername/${this.userInfo.username}`)
                if(data.code===200){
                    this.recordsList = data.list
                }else{
                    swal("未获得任何记录")
                }
            }catch(e){
                console.log(e)
                swal({
                    icon:"error",
                    text:"网络连接错误,请求记录失败"
                })
            }
        },
        async getUploadRecords(){
            try{
                let {data} = await this.$http.get(`/file/getUploadRecordsByUsername/${this.userInfo.username}`)
                if(data.code===200){
                    this.recordsList = data.list
                }else{
                    swal("未获得任何记录")
                }
            }catch(e){
                console.log(e)
                swal({
                    icon:"error",
                    text:"网络连接错误,请求记录失败"
                })
            }
        },
        async getDownloadRecords(){
            try{
                let {data} = await this.$http.get(`/file/getDownloadRecordsByUsername/${this.userInfo.username}`)
                if(data.code===200){
                    this.recordsList = data.list
                }else{
                    swal("未获得任何记录")
                }
            }catch(e){
                console.log(e)
                swal({
                    icon:"error",
                    text:"网络连接错误,请求记录失败"
                })
            }
        },
        async initRecordsList(){
            this.loading = true
            switch(this.title){
                case "delete":{
                    await this.getDeleteRecords()
                    break;
                }
                case "download":{
                    await this.getDownloadRecords()
                    break;
                }
                case "upload":{
                    await this.getUploadRecords()
                    break;
                }
            }
            this.loading = false
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
            if(type.match(/(jpg|jpeg|gif|png|psd|tga|pcx)/)!==null){
                return require('@/assets/typesIcon/image.png')
            }
            return require('@/assets/typesIcon/invalid.png')
        },
    },
    async created(){
        await this.initRecordsList();
        document.addEventListener('keydown',this.keyDown);
        document.addEventListener('keyup',this.keyUp);
    },
    beforeUnmount(){    
        document.removeEventListener('keydown',this.keyDown);
        document.removeEventListener('keyup',this.keyUp);
    }
}
</script>

<style lang="less" scoped>
    .records-container{
        width: 100%;
        .tools{
            width: 220px;
            height:50px;
            position: absolute;
            left: calc(50% - 100px);
            bottom: 50px;
            display: flex;
            background-color: #e6e6e6;
            justify-content: space-around;
            align-items: center;
            border-radius: 15px;
            user-select: none;
            .tools-item{
                display: flex;
                cursor: pointer;
                background-color: #f7f7f7;
                border-radius: 5px;
                box-sizing: border-box;
                padding: 4px;
                justify-content: space-around;
                align-items: center;
                .tools-btn{
                    img{
                        width: 15px;
                    }
                    margin-right: 3px;
                }
                .tools-title{
                    font-size: 12px;
                    color: #595959;
                }
            }
            .tools-item:hover{
                background-color: #ffffff;

            }
        }
        .spinner-border{
            position: fixed;
            z-index: 999;
            left: 60%;
            top: 50%;
        }
        .spinner-hidden{
            display: none;
        }
        .no-records{
            user-select: none;
            position: absolute;
            top: calc(50% - 120px);
            left: calc(50% - 120px);
            img{
                width: 150px;
            }
            .title{
                font-size: 15px;
                margin-bottom: 8px;
                font-weight: 600;
            }
            .text{
                font-size: 14px;
                color: #838383;
            }
        }
        .items-container{
          width: 97%;
          cursor: pointer;
          max-height: 84%;
          position: absolute;
          overflow: auto;
          .title{
            border-top: 1px solid #efefef;
            border-bottom: 1px solid #efefef;
            font-size: 13px;
            color: #7c7c7c;
          }
          .title:hover{
            background-color: none;
          }
          .record-item{
            user-select: none;
            box-sizing: border-box;
            padding: 8px 5px;
            display: flex;
            width: 100%;
            align-items: center;
            font-size: 15px;
            margin-bottom: 5px;
            border-radius: 10px;
            .left{
                flex: 1;
                box-sizing: border-box;
                padding: 5px;
                img{
                    width: 40px;
                    margin-right: 5px;
                }

            }
            .middle{
                flex: 12;
                .name{
                    text-align: left;
                    width: 100%;
                    color: #0076c0;
                    margin-bottom: 5px;
                    font-size: 14px;
                }
                .time{
                    color: #7c7c7c;
                    font-size: 13px;
                    width: 100%;
                    text-align: left;
                }

            }
            .right{
                flex: 1;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                .close{
                    
                    background-size: cover;
                    background-image: url(@/assets/deleteRecord.png);
                    width: 15px;
                    height: 15px;
                }
            }

          }
          .record-item-selected{
            background-color: #e9e9e9;
          }
          .record-item:hover{
            background-color: #e9e9e9;
          }
        }
    }
</style>