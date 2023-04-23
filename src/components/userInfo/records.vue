<template>
  <div class="records-container">
    <div class="no-records">
        <img src="@/assets/home/doubt.png">
        <div class="title">为什么没有记录?</div>
        <div class="text">
            只有进行过操作才会有操作记录
        </div>
        <div class="text">
            试着去操作一下吧
        </div>
    </div>
  </div>
</template>

<script>
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
            recordsList:[]
        }
    }
}
</script>

<style lang="less" scoped>
    .records-container{
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
    }
</style>