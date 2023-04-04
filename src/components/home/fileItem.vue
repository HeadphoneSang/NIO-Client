<template>
  <div class="file-item cursor-pointer" :title="item.name" @mouseenter.stop="hover=true" @mouseleave.stop="hover=false" @click.stop="clickItem">
    <div class="out-container">
        <img :src="ico">
        <div class="name">
            {{ item.name.length>6?item.name.substring(0,6)+'...':item.name }}
        </div>
        <div class="time">
            {{ item.time }}
        </div>
        <div :class="hover?'hover-menu':'hover-hidden'" @click.stop="clickMenu"></div>
    </div>
  </div>
</template>

<script>
export default {
    props:{
        item:{
            type:Object,
        }
    },
    data(){
        return {
            ico:'',
            nameLength:6,
            hover:false
        }
    },
    methods:{
        clickMenu(){
            console.log('menu:'+this.item.name)
        },
        clickItem(){
            console.log('item:'+this.item.name)
        }
    },
    created(){
        this.ico = require('@/assets/typesIcon/'+this.item.type+'.png')
        console.log(this.ico)
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
                width: 100px;
                height: 80px;
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