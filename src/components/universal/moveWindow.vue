<template>
  <div class="main-container border-shadow">
    <div class="control-bar">
        <div class="title">移动到</div>
        <img src="@/assets/close.png" @click.stop="closeWindow">
    </div>
    <MiniPathView ></MiniPathView>
    <div class="bottom-bar">
        <div class="left-container">

        </div>
        <div class="right-container">
            <a @click.stop="closeWindow">取消</a>
            <a @click.stop="">移动到此处</a>
        </div>
    </div>
  </div>
</template>

<script>
import MiniPathView from '@/components/universal/miniContentBar.vue'
import {mapMutations} from 'vuex'
export default {
  components:{
    MiniPathView
  },
  methods:{
    ...mapMutations(['hiddenSubWindow']),
    closeWindow(){
        this.hiddenSubWindow()
    }
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
    .bottom-bar{
        position: absolute;
        bottom: 0;
        width: 100%;
        display: flex;
        justify-content: space-between;
        background-color: #eaeaea;
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
            border: 1px solid #b0b0b0;
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
            background-color: #314888;
            border-radius: 5px;
            cursor: pointer;
        }
        a:nth-child(2):hover{
            background-color: #435da2;
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
            font-weight: 600;
        }
        img{
            height: 18px;
            cursor: pointer;
        }
        
    }
}
</style>