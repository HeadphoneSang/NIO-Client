<template>
  <div class="user-info-container">
    <div class="header-bar">
        <div class="header-item username">{{ userInfo.username }}</div>
        <div :class="(item.index===nowIndex?'header-item-selected ':'')+'header-item'" v-for="(item) in items" :key="item.index" @click="clickItem(item)">{{ item.title }}</div>
    </div>
    <div class="content-contaniner">
        <router-view></router-view>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
    computed:{
        ...mapState(['userInfo'])
    },
    data(){
        return {
            nowIndex:0,
            items:[
                {
                    index:0,
                    title:'个人上传记录',
                    path:'/homePage/userInfo/uploadRecords'
                },
                {
                    index:1,
                    title:'个人下载记录',
                    path:'/homePage/userInfo/downloadRecords'
                },
                {
                    index:2,
                    title:'个人删除记录',
                    path:'/homePage/userInfo/deleteRecords'
                },
                {
                    index:3,
                    title:'下载路径设置',
                    path:'/homePage/userInfo/downloadSettings'
                },
            ]
        }
    },
    methods:{
        clickItem(item){
            this.nowIndex = item.index
            this.$router.push(item.path)
        }
    }
}
</script>

<style lang="less" scoped>
    .user-info-container{
        height: 100%;
        box-sizing: border-box;
        padding: 25px;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .content-contaniner{
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            
        }
        .header-bar{
            width: 100%;
            display: flex;
            align-items: flex-end;
            margin: 20px 0;
            margin-left: 25px;
            
            .header-item {
                cursor: pointer;
                margin-right: 30px;
                font-size: 12px;
                user-select: none;
                font-weight: 600;
                color: #b1b1b1;
                box-sizing: border-box;
                padding: 5px;
                border-radius: 5px;
            }
            .header-item:hover{
                color: #464646;
                background-color: #eeeeee;
            }
            .header-item-selected{
                color: #464646;
                background-color: #eeeeee;
            }
            .username{
                color: #000000;
                font-size: 23px;
                font-weight: 600;
                margin-bottom: -5px;
            }
            .username:hover{
                color: #000000;
                background-color: #ffffff;
            }
        }
    }
</style>