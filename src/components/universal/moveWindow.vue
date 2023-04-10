<template>
  <div class="main-container border-shadow">
    <!-- 顶部栏 -->
    <div class="control-bar">
        <div class="title">移动到</div>
        <img src="@/assets/close.png" @click.stop="closeWindow">
    </div>
    <!-- 顶部栏 -->

    <!-- 路径切换和显示栏 -->
    <MiniPathView ></MiniPathView>
    <!-- 路径切换和显示栏 -->

    <!-- 路径总览区域 -->
    <div class="files-container">
        <div :class="item.type==='directory'?'file-item':'file-notallowed'" v-for="(item,index) in miniPathMap.files" :key="index">
            <div class="img-box">
                <img :src="initIcon(item.type)" >
            </div>
            <div class="name-box">
                {{ item.name }}
            </div>
        </div>
    </div>
    <!-- 路径总览区域 -->


    <!-- 底部栏 -->
    <div class="bottom-bar">
        <div class="left-container">
        </div>
        <div class="right-container">
            <a @click.stop="closeWindow">取消</a>
            <a @click.stop="">移动到此处</a>
        </div>
    </div>
    <!-- 底部栏 -->
  </div>
</template>

<script>
import MiniPathView from '@/components/universal/miniContentBar.vue'
import {mapMutations,mapState} from 'vuex'
export default {
  components:{
    MiniPathView
  },
  methods:{
    ...mapMutations(['hiddenSubWindow','priorityDir']),
    closeWindow(){
        this.hiddenSubWindow()
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
  },
  computed:{
    ...mapState(['miniPathMap'])
  },
  created(){
    this.priorityDir()
  }
}
</script>

<style lang="less" scoped>
.main-container{
    position: fixed;
    z-index: 100;
    width: 400px;
    height: 500px;
    background-color: #ffffff;
    border-radius: 15px;
    right: calc(50% - 200px);
    bottom: calc(50% - 250px);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .files-container{
        width: 100%;
        background-color: #ffffff;
        flex: 1;
        box-sizing: border-box;
        padding: 20px 5px 60px 5px;
        overflow: auto;
        display: flex;
        flex-direction: column;
        .file-item,.file-notallowed{
            display: flex;
            align-items: center;
            box-sizing: border-box;
            padding: 8px 10px;
            border-radius: 10px;
            cursor:pointer;
            user-select: none;
            .img-box{
                img{
                    height: 23px;
                }
                width: 30px;
                margin-right: 10px;
            }
            .name-box{
                font-size: 14px;
                color: #5c5c5c;
            }
        }
        .file-notallowed{
            cursor: not-allowed;
            .name-box{
                color: #a2a2a2;
            }
            .img-box{
                img{
                    filter: grayscale(70%);
                }
            }
        }
        .file-item:hover{
            background-color: #efefef;
        }
    }   
    .bottom-bar{
        position: absolute;
        bottom: 0;
        width: 100%;
        display: flex;
        justify-content: space-between;
        background-color: #F5F5F6;
        box-sizing: border-box;
        padding: 15px;
        a{
            user-select: none;
            box-sizing: border-box;
            font-size: 15px;
            color: #ffffff;
        }
        a:nth-child(1){
            color: #747474;
            border-radius: 5px;
            border: 1px solid #d1d1d1;
            padding: 5px 20px;
            cursor: pointer;
            margin-right: 10px;
        }
        a:nth-child(1):hover{
            background-color: #d9d9d9;
            color: #6476a8;
        }
        a:nth-child(2){
            color: #ffffff;
            border: 1px solid #b0b0b0;
            padding: 5px 20px;
            background-color: #637DFF;
            border-radius: 5px;
            cursor: pointer;
        }
        a:nth-child(2):hover{
            background-color: rgb(144, 166, 225);
        }
    }
    .control-bar{
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 25px 20px 5px 20px;
        user-select: none;
        .title{
            font-size: 15px;
            font-weight: 500;
        }
        img{
            height: 18px;
            cursor: pointer;
        }
        
    }
}
</style>