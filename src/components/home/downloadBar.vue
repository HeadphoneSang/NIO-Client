<template>
  <div class="download-container" free="1">
    <div class="download-item" free="1" v-for="(item,index) in itemList" :key="index" @mouseenter="hoverItem(item)" @mouseleave="leaveItem(item)" @click="clickItem(item)">
        <img :src="item.ico" alt="" free="1">
        <div :class="item.show?'name':'name-hidden'" free="1">{{ item.title }}</div>
    </div>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'
export default {
    props:{
        title:{
            required:true,
            type:String
        }
    },
    methods:{
        ...mapMutations(['showSubWindow']),
        hoverItem(item){
            item.show = true
        },
        leaveItem(item){
            item.show = false
        },
        clickItem(item){
            switch(item.title){
                case '移动':{
                    this.showSubWindow()
                    break;
                }
            }
        }
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
            ]
        }
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