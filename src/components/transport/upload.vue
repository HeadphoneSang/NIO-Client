<template>
  <div class="upload-container">
    <div class="progress-container">
        <div class="upload-item title">
            <div>名称</div>
            <div>上传进度</div>
        </div>
        <div class="upload-item" v-for="(item) in waitQueue" :key="item.targetModifier" :title="item.name">
            <div class="name">
                <img :src="initIcon(item.type)" alt="">
                {{ item.name.length>maxNameLength?item.name.substring(0,maxNameLength)+'...':item.name }}
                
                <div class="button" title="从上传队列中删除" @click="deleteItem(item)">
                </div>
            </div>
        <div class="progress-">{{ (item.progress*100).toFixed(1) }}%</div>
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
        ...mapState(['waitQueue'])
    },
    data(){
        return{
            maxNameLength:6
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
            return require('@/assets/typesIcon/invalid.png')
        },
        deleteItem(item){
            if(item.upload===true){
                swal({
                    icon:require("@/assets/warn.png"),
                    text:'删除正在上传的文件会导致文件损坏!'
                })
                return
            }
            this.deleteFileInUpload({modifier:item.targetModifier,name:item.name})
        }
    },
    created(){
    }
}
</script>

<style lang="less" scoped>
.upload-container{
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
      .upload-item{
        user-select: none;
        box-sizing: border-box;
        padding: 5px 20px;
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        font-size: 15px;
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
      .upload-item:hover{
        background-color: #efefef;
        cursor: pointer;
        border-radius: 10px;
      }
    }
}

</style>