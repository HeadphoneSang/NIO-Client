<template>
  <div class="download-container">
    <div class="progress-container">
        <div class="download-item title">
            <div>名称</div>
            <div class="right">
                <div>状态</div>
                <div>下载进度</div>
            </div>
        </div>
        <div class="download-item" v-for="(item) in downloadQueue" :key="item.modifier" :title="item.name">
            <div class="name">
                <img :src="initIcon(item.type)" alt="">
                {{ item.name.length>maxNameLength?item.name.substring(0,maxNameLength)+'...':item.name }}
                
                <div class="button" title="从下载队列中删除" @click="deleteItem(item)">
                </div>
            </div>
            <div class="right">
                <div class="status">{{ checkStatus(item.status) }}</div>
                <div class="progress-">{{ item.progress }}%</div>
            </div>
      </div>
    </div>
    <div class="progress">
  <div class="progress-bar progress-bar-striped  progress-bar-animated" role="progressbar" style="width: 30%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">30%</div>
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
            maxNameLength:6
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
            if(item.download===true){
                swal({
                    icon:require("@/assets/warn.png"),
                    text:'删除正在下载的文件会导致文件损坏!'
                })
                return
            }
            // this.deleteFileIndownload({modifier:item.targetModifier,name:item.name})
        }
    }
}
</script>

<style lang="less" scoped>
.download-container{
    width: 100%;
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
        padding: 5px 20px;
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        font-size: 15px;
        .right{
            display: flex;
            div{
                
                margin-left: 10px;
            }
            
        }
        .name{
            display: flex;
            align-items: center;
            img{
                width: 30px;
                margin-left: 10px;
            }
            .button{
                background-image: url(@/assets/close2.png);
                background-size:cover;
                user-select: none;
                width: 25px;
                height: 25px;
                margin-left: 10px;
            }
            .button:hover{
                background-image: url(@/assets/close3.png);
            }
        }
        
      }
      .download-item:hover{
        background-color: #efefef;
        cursor: pointer;
        border-radius: 10px;
      }
    }
}
</style>