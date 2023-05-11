<template>
  <div class="download-container">
    <div class="none" v-if="downloadQueue.length===0">
        <img src="@/assets/none.png" alt="">
        <div>还没有任务要处理</div>
    </div>
    <div class="progress-container">
        <!-- <div class="download-item title">
            <div>名称</div>
            <div>上传进度</div>
        </div> -->
        <div class="download-item" v-for="(item) in downloadQueue" :key="item.modifier">
            <div class="left">
                <img :src="initIcon(item.type)" alt="">
            </div>
            <div class="middle">
                <div class="name">{{ item.name.length>maxNameLength?item.name.substring(0,maxNameLength)+'...': item.name }}</div>
                <div class="status">{{ checkStatus(item.status) }}</div>
                <div class="progress">
                    <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" :style="'width: '+item.progress+'%'">{{item.progress}}%</div>
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
export default {
  computed:{
        ...mapState(['downloadQueue'])
    },
    data(){
        return{
            maxNameLength:18
        }
    },
    methods:{
        ...mapMutations(['deleteFileIndownload']),
        checkStatus(status){
            switch(status){
                case 0:{
                    return '等待中..'
                }
                case 1:{
                    return '完成..'
                }
                case -1:{
                    return '下载失败'
                }
                case 2:{
                    return '解析中..'
                }
                case 3:{
                    return '下载中..'
                }
                case 4:{
                    return '网络连接错误'
                }
            }
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
        deleteItem(item){
            if(item.status===2||item.status===3){
                swal({
                    icon:require("@/assets/warn.png"),
                    text:'删除正在下载的文件会导致文件损坏!'
                })
                return
            }
            this.deleteFileIndownload({modifier:item.targetModifier,name:item.name})
        }
    }
}
</script>

<style lang="less" scoped>
.download-container{
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
      .download-item{
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
      .download-item:hover{
        background-color: #f5f5f5;
      }
    }
}

</style>