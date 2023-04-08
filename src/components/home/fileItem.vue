<template>
  <div class="file-item" :title="item.name" >
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
            <div class="func-container" @click.stop="clickSubItem('download')">下载</div>
            <div class="func-container" @click.stop="clickSubItem('delete')">回收站</div>
            <div class="func-container" @click.stop="clickSubItem('lock')">密码箱</div>
            <div class="func-container" @click.stop="clickSubItem('collect')">收藏</div>
            <div class="func-container" @click.stop="clickSubItem('move')">移动</div>
        </div>
    </div>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'
export default {
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
    data(){
        return {
            ico:'',
            nameLength:10,
            hover:false,
            showSub:false,
            flag:this.item.modifier+'b',
            unshow:(e)=>{
                if (e.target.id!==this.item.modifier) {
                    this.showSub =false
                }
                if(this.pressCtrl)
                    return 
                if(e.target.attributes['flag']===undefined&&this.item.state===1)
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
        ...mapMutations(['changeFileState']),
        clickMenu(){
            console.log('menu:'+this.item.type)
            this.showSub = true
        },
        clickItem(){
            this.changeFileState({
                state:1^this.item.state,
                title:this.fatherTtitle,
                index:this.index
            })
        },
        clickSubItem(func){
            switch(func){
                case 'download':{
                    break;
                }
                case 'delete':{
                    break;
                }
                case 'lock':{
                    break;
                }
                case 'collect':{
                    break;
                }
                case 'move':{
                    break;
                }
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
            this.ico = require('@/assets/typesIcon/invalid.png')
        }
    },
    created(){
        this.initIcon()
    },mounted(){
        document.addEventListener('click', this.unshow,true)  
        document.addEventListener('contextmenu', this.unshow,true)  
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
        .out-container:hover{
            background-color: #f2f2f2;
            border-radius: 20px;
        }
        .checked{
            background-color: #f2f2f2;
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
                height: 170px;
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