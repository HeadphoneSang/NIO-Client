<template>
  <div class="add-container">
    <div class="input-group">
      <label for="remote-box"><img :src="remoteIcon" alt=""></label>
      <input type="text" id="remote-box" :class="showWarn?'input-warn':'input-none'" placeholder="输入远程地址" @focus="focusInput" @blur="blurInput" v-model="remoteAddress">
    </div>
    <div :class="showWarn?'warn-tips':'warn-hidden'" >连接地址不可以为空</div>
    <div class="select-box">
      <input type="checkbox" id="check" v-model="isRemeber"><label for="check">记录地址</label>
    </div>
    <div class="submit-box">
      <input type="submit" value="连接" @click.prevent="">
      <div class="submit-tips">
        点击「登录」表示连接到指定远程文件服务器
      </div>
    </div>
  </div>
</template>

<script>

export default {
    data(){
      return{
        remoteIcon:'',
        icon1:require('@/assets/remote0.png'),
        icon2:require('@/assets/remote1.png'),
        isRemeber:false,
        remoteAddress:'',
        showWarn:false
      }
    },
    methods:{
      initRes(){
        this.remoteIcon = this.icon1
      },
      focusInput(){
        this.remoteIcon = this.icon2
      },
      blurInput(){
        this.remoteIcon = this.icon1
        if(this.remoteAddress===''){
          return this.showWarn = true
        }
        this.showWarn = false
      }
    },
    created(){
      this.initRes()
    }
}
</script>

<style lang="less" scoped>
  ::-webkit-input-placeholder { 
    /* WebKit browsers，webkit内核浏览器 */
    color: #afafaf; 
    font-size: 18px;
    font-weight: 530;
    }
  .add-container{
    width: 100%;
    .warn-hidden{
      display: none;
    }
    .warn-tips{
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-top: 10px;
      font-size: 13px;
      color: #ff0000;
    }
    .submit-box{
      width: 100%;
      margin-top: 20px;
      .submit-tips{
        margin-top: 20px;
        font-size: 15px;
        color: #7b7b7b;
      }
      input[type="submit"]{
        border: 0 solid #ffffff;
        background-color: #7690FF;
        color: #ffffff;
        height: 60px;
        border-radius: 10px;
        font-weight: 600;
        width: 100%;
      }
      input[type="submit"]:hover{
        outline: none;
        background-color: #546fe6;
        transition: all 0.5s;
      }
    }
    .select-box{
      margin-top: 15px;
      margin-left: 3px;
      width: 100%;
      display: flex;
      align-items: center;
      user-select: none;
      label{
        margin: 0;
        margin-left: 10px;
        font-size: 15px;
        color: #7b7b7b;
        cursor: pointer;
      }
    }
    .input-group{
      box-sizing: border-box;
      position: relative;
      padding: 5px 10px;
      border-radius: 15px;
      display: flex;
      z-index: 99;
      align-items: center;
      border:2px solid #ffffff;
      
      label{
        margin: 0;
        img{
          height: 25px;
          margin: 10px 0 10px 10px;
        }
      }
      .input-none,.input-warn{
        position: absolute;
        background-color: transparent;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border: 2px solid #c8c8c8;
        border-radius: 15px;
        padding: 0px 10px 0px 55px;
        left: 0;
        top: 0;
        outline:none;
      }
      .input-warn{
        border: 2px solid #c30b0b;
      }
      .input-none:focus{
        outline:none;
        border: 2px solid #167bf6;
        border-radius: 15px;
        transition: all 0.5s;
        box-shadow: 2px 2px 5px rgba(169, 169, 169, 0.5),
          -2px -2px 5px rgba(169, 169, 169, 0.5),
          2px -2px 5px rgba(169, 169, 169, 0.5),
          -2px 2px 5px rgba(169, 169, 169, 0.5);
      }
      .input-warn:focus{
        outline:none;
        border: 2px solid #f61616;
        border-radius: 15px;
        transition: all 0.5s;
        box-shadow: 2px 2px 5px rgba(169, 169, 169, 0.5),
          -2px -2px 5px rgba(169, 169, 169, 0.5),
          2px -2px 5px rgba(169, 169, 169, 0.5),
          -2px 2px 5px rgba(169, 169, 169, 0.5);
      }
    }
  }
  
</style>