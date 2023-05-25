<template>
  <div class="upload-container">
    <div class="none" v-if="uploadQueue.length===0">
        <img src="@/assets/none.png" alt="">
        <div>还没有任务要处理</div>
    </div>
    <div class="progress-container">
        <!-- <div class="upload-item title">
            <div>名称</div>
            <div>上传进度</div>
        </div> -->
        <div class="upload-item" v-for="(item) in uploadQueue" :key="item.tarPath">
            <div class="left">
                <img :src="initIcon(item.type)" alt="">
            </div>
            <div class="middle">
                <div class="name">{{ item.name.length>maxNameLength?item.name.substring(0,maxNameLength)+'...': item.name }}</div>
                <div class="status">{{getStatus(item.status)}}</div>
                <div class="progress">
                    <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" :aria-valuenow="(item.progress*1).toFixed(0)" aria-valuemin="0" aria-valuemax="100" :style="'width: '+(item.progress*1).toFixed(0)+'%'">{{(item.progress*1).toFixed(2)}}%</div>
                </div>
            </div>
            <div class="right">
                <div class="close" title="删除此项" @click="deleteItem(item)"></div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import swal from 'sweetalert'
import {mapState,mapMutations} from 'vuex'
import mainBus from '@/views/mainBus.js'
import { ipcRenderer } from 'electron'
export default {
    computed:{
        ...mapState(['uploadQueue'])
    },
    data(){
        return{
            maxNameLength:18
        }
    },
    methods:{
        ...mapMutations(['deleteFileInUpload']),
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
        async deleteItem(item){
            if(item.status!=0&&item.status!=4&&item.status!=5){
                let confirm = await swal({
                    icon:require("@/assets/warn.png"),
                    title:"你确定要删除吗？",
                    text:'删除正在上传的文件会导致文件损坏!',
                    className:"closeUpload",
                    buttons:{
                        two:{
                            text:"取消",
                            value:false
                        },one:{
                            text:"确定",
                            value:true
                        }
                    }
                });
                if(!confirm){
                    return;
                }else{
                    if(item.status===6){
                        return swal({
                            icon:"warning",
                            text:"网络连接错误...请稍后",
                            title:"关闭提示"
                        })
                    }
                    await ipcRenderer.invoke('onForceDeleteUploadTask',item.tarPath,item.uuid);
                }
                
            }
            mainBus.emit('deleteUploadQueue',item.tarPath);
        },
        getStatus(code){
            switch(code){
                case 0:{
                    return '等待上传中...'
                }
                case 1:{
                    return '上传准备中...'
                }
                case 2:{
                    return '上传中...'
                }
                case 3:{
                    return '上传完成'
                }
                case 4:{
                    return '上传失败';
                }
                case 5:{
                    return '网络错误'
                }
                case 6:{
                    return '重新连接中'
                }
            }
        }
    },
    created(){
    }
}
</script>

<style lang="less" scoped>
.upload-container{
    width: 100%;
    .none{
        position: absolute;
        user-select: none;
        left: calc(50% - 90px);
        top: calc(50% - 90px);
        img{
            width: 180px;
        }
        div{
            font-size: 16px;
            color: #686868;
            font-weight: 600;
        }
    }
    .progress-container{
      width: 97%;
      max-height: 85%;
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
      .upload-item{
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
            .status{
                color: #7c7c7c;
                font-size: 13px;
                width: 100%;
                text-align: right;
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
                width: 35px;
                height: 35px;
                background-image: url(@/assets/close2.png);
                background-size:cover;
                cursor: pointer;
            }
            .close:hover{
                background-image: url(@/assets/close3.png);
            }
        }
        
      }
      .upload-item:hover{
        background-color: #f5f5f5;
      }
    }
}

</style>