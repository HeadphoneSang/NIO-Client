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
        <div class="record-item" v-for="(item) in recordsList" :key="item.modifier">
            <div class="left">
                <img :src="initIcon(item.type)" alt="">
            </div>
            <div class="middle">
                <div class="name">{{ item.fileName }}</div>
                <div class="time">{{ item.time }}</div>
            </div>
            <div class="right">
                <div class="close" title="删除此项"></div>
            </div>
        </div>
    </div>
    <div :class="loading?'spinner-border':'spinner-hidden'" role="status">
        <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>

<script>
import swal from 'sweetalert'
import {mapState} from 'vuex'
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
        ...mapState(['userInfo'])
    },
    data(){
        return{
            nowIndex:0,
            pageSize:6,
            recordsList:[],
            loading:false
        }
    },
    methods:{
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
            console.log(this.userInfo)
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
        }
        ,
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
        }
    },
    async created(){
        await this.initRecordsList()
    }
}
</script>

<style lang="less" scoped>
    .records-container{
        width: 100%;
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
            }

          }
          .record-item:hover{
            background-color: #f5f5f5;
          }
        }
    }
</style>