<template>
  <div class="message-container border-shadow" v-show="show" :style="{right:x+'px',bottom:y+'px'}">
    <div class="title">
        <img :src="ico" alt="" class="ico">
        <div class="letter">
            {{ title }}
        </div>
        <div class="close-button">
            <img src="@/assets/close.png" @click.stop="close">
        </div>
    </div>
    <div class="message">
        <div class="letter">
            {{ message }}
        </div>
    </div>
  </div>
</template>

<script>
export default {
    props:{
        message:{
            type:String,
            required:true
        },
        title:{
            type:String,
            required:true
        },
        x:{
            type:Number,
            default:10
        },
        y:{
            type:Number,
            default:0
        },
        ico:{
            type:String,
            default:require('@/assets/tips.png')
        }
    },
    data(){
        return {
            show:true
        }
    },
    methods:{
        close(){
            this.show = false
        }
    },
    created(){
    }
}
</script>

<style lang="less" scoped>
    .message-container{
        position: fixed;
        z-index: 99;
        display: flex;
        flex-direction: column;
        border-radius: 10px;
        background-color: #ffffff;
        max-width: 260px;
        .title,.message{
            box-sizing: border-box;
            padding: 10px;
            user-select: none;
            width: 100%;
            display: flex;
            font-size: 15px;
            align-items: center;
            justify-content: space-between;
            .ico{
                height: 17px;
                margin-right: 10px;
            }
            .letter{
                width: 100%;
                text-align: left;
            }
            .close-button{
                img{
                    height: 17px;
                    margin-left: 100px;
                    cursor: pointer;
                }
            }
            
        }
        .title{
            border-bottom: 1px solid #dadada;
            font-weight: 900;
        }
        .message{
            color: #5b5b5b;
            background-color: #f6f6f6;
            font-size: 14px;
            display: flex;
            flex-wrap: wrap;
            width: 100%;
        }
    }
</style>