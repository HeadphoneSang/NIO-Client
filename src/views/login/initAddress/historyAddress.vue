<template>
  <div class="add-container">


    <div :class="showWarn?'input-container-warn':'input-container'">
      <div class="input-group">
        <label for="remote-box"><img :src="remoteIcon" alt=""></label>
        <input type="text" id="remote-box" class="input-none" placeholder="输入远程地址" @focus="focusInput" @blur="blurInput" v-model="remoteAddress" @input="onInputChange" spellcheck ="false">
        <img src="@/assets/clear.png" class="clear" @click="remoteAddress=''" v-if="remoteAddress!==''">
      </div>
      <!-- 下拉菜单 -->
      <div class="sub-container" v-if="showSubList">
        <div class="sub-box" v-for="(item,index) in showHistory" :key="index" @mouseenter="clickSub(item.ip)">{{ item.ip }}</div>
      </div>
      <!-- 下拉菜单 -->
    </div>
    <div class="place"></div>
    <div :class="showWarn?'warn-tips':'warn-hidden'" >{{ warnMsg }}</div>
    <div class="select-box">
      <input type="checkbox" id="check" v-model="isRemeber"><label for="check">下次自动连接</label>
    </div>
    <div class="submit-box">
      <input type="submit" :class="comfirming?'submit-btn-disable':'submit-btn'" value="连接" @click.prevent="submit">
      <div class="submit-tips">
        点击「登录」表示连接到指定远程文件服务器
      </div>
    </div>
    <div :class="comfirming?'spinner-border':'spinner-border-hidden'" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
  
</template>

<script> 
import {ipcRenderer} from 'electron'

export default {
    watch:{
      isRemeber:{
        handler(newValue){
          window.localStorage.setItem("isRemeber",newValue)
        }
      }
    },
    data(){
      return{
        remoteIcon:'',
        icon1:require('@/assets/history2.png'),
        icon2:require('@/assets/history1.png'),
        isInputting:false,
        isRemeber:false,
        remoteAddress:'',
        showWarn:false,
        showSubList:false,
        comfirming:false,
        showHistory:[],
        warnMsg:'连接地址不能为空',
        history:[
          {
            ip:'mc.chbcraft.com:88',
            time:'1231233'
          },
          {
            ip:'test.oiport.edu:88',
            time:'1231234'
          },
          {
            ip:'ee.jinshandzi.com:344',
            time:'1231235'
          },
          {
            ip:'mc.cyu.com:2556',
            time:'1231236'
          },

        ]
      }
    },
    methods:{
      initRes(){
        this.remoteIcon = this.icon1
      },
      focusInput(){
        this.remoteIcon = this.icon2
        this.showSubList = true
        this.isInputting = true
        this.onInputChange()
      },
      blurInput(){
        this.remoteIcon = this.icon1
        this.showSubList = false
        this.isInputting = false
        if(this.remoteAddress===''){
          this.warnMsg = '连接地址不能为空'
          return this.showWarn = true
        }
        this.showWarn = false
      },
      onInputChange(){
        this.showHistory = this.history.filter(item=>item.ip.startsWith(this.remoteAddress)).slice(0,5)
      },
      clickSub(ip){
        this.remoteAddress = ip
      },
      async submit(){
        // this.$router.push('/mainEnter/loginMain')
        // window.localStorage.setItem("test","123123")
        if(this.remoteAddress==''){
          this.warnMsg = '连接地址不能为空'
          this.showWarn = true
          return
        }
        if(this.comfirming)
          return
        this.comfirming = true
        let seq = Math.ceil(Math.random()*10000)
        try {
          let port = this.remoteAddress.lastIndexOf(':')!==-1?null:25565
          let ret = await this.$http.get("http://"+(port!==null?this.remoteAddress+`:${port}`:this.remoteAddress)+"/login/confirm/"+seq)
          if(ret.status===200){
            if(ret.data==seq+1)
            {
              this.$http.defaults.baseURL = "http://"+(port!==null?this.remoteAddress+`:${port}`:this.remoteAddress)
              let has = this.history.find(item=>item.ip==this.remoteAddress)
              if(has===undefined){
                this.history = [
                  {
                    ip:this.remoteAddress
                  },
                  ...this.history
                ]
                window.localStorage.setItem("ipHistory",JSON.stringify(this.history.slice(0,5)))
                
              }
              window.localStorage.setItem("ip",this.remoteAddress)
              ipcRenderer.invoke("initAddressEvent",this.$http.defaults.baseURL)
              this.$router.push('/mainEnter/loginMain')
            }
          }else{
            this.warnMsg = '连接地址不可用,网络请求失败'
            this.showWarn = true
          }
        } catch (error) {
          this.warnMsg = '连接地址不可用,网络请求失败'
          this.showWarn = true
        }finally{
          this.comfirming = false;
        }
      },
    },
    async created(){
      this.initRes()
      let isRemeber = window.localStorage.getItem("isRemeber")
      let history = window.localStorage.getItem("ipHistory")
      if(history==null)
        this.history = []
      else
        this.history = JSON.parse(history)
      if(isRemeber!=null){
        this.isRemeber = isRemeber
      }
      if(isRemeber==="true"){
        let ip = window.localStorage.getItem("ip")
        if(ip==null)
          return;
        this.remoteAddress = ip
        await this.submit()
      }
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
    position: relative;
    .spinner-border{
      position: fixed;
      left: calc(50% - 12px);
      top: 50%;
    }
    .spinner-border-hidden{
      display: none;
    }
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
      margin-bottom: -15px;

    }
    .submit-box{
      width: 100%;
      margin-top: 20px;
      .submit-tips{
        margin-top: 20px;
        font-size: 14px;
        color: #7b7b7b;
      }
      .submit-btn,.submit-btn-disable{
        border: 0 solid #ffffff;
        background-color: #7690FF;
        color: #ffffff;
        height: 60px;
        border-radius: 50px;
        font-weight: 600;
        width: 100%;
        outline: none;
      }
      .submit-btn:hover{
        
        background-color: #546fe6;
        transition: all 0.5s;
      }
      .submit-btn-disable{
        background-color: #57618a;
        cursor:not-allowed;
      }
      .submit-btn-disable:hover{
        
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
    .place{
      width: 100%;
      height: 60px;
    }
    
    .input-container,.input-container-warn{
      position: absolute;
      width: 100%;
      border: 2px solid #c8c8c8;
      background-color: #ffffff;
      border-radius: 15px;
      .sub-box{
          position: relative;
          color: #757575;
          width: 100%;
          z-index: 100;
          box-sizing: border-box;
          padding: 5px 10px 5px 55px;
          text-align: left;
          cursor: url('@/assets/point.png'),pointer;
          margin-bottom: 9px;
        }
      .sub-box:hover{
          position: relative;
          color: #3a75bd;
          user-select: none;
          background-color: #cad5e2;
          width: 100%;
          z-index: 100;
        }
      .input-group{
        box-sizing: border-box;
        position: relative;
        padding: 5px 10px;
        display: flex;
        z-index: 99;
        height: 100%;
        align-items: center;
        label{
          margin: 0;
          img{
            height: 25px;
            margin: 10px 0 10px 10px;
          }
          
        }
        .clear{
            height: 20px;
            position: absolute;
            right: 20px;
            cursor: url('@/assets/point.png'),pointer;
        }
        .input-none{
          position: absolute;
          background-color: transparent;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          padding: 0px 10px 0px 55px;
          left: 0;
          top: 0;
          outline:none;
          border: 0px solid saddlebrown;
          color: #7b7b7b;
        }
      }
    }
    .input-container-warn{
      border: 2px solid #c30b0b;
    }
    .input-container-warn:hover{
      border: 2px solid #f61616;
      border-radius: 15px;
      transition: all 0.5s;
      box-shadow: 2px 2px 5px rgba(169, 169, 169, 0.5),
        -2px -2px 5px rgba(169, 169, 169, 0.5),
        2px -2px 5px rgba(169, 169, 169, 0.5),
        -2px 2px 5px rgba(169, 169, 169, 0.5);
    }
    .input-container:hover{
      border: 2px solid #167bf6;
      border-radius: 15px;
      transition: all 0.5s;
      box-shadow: 2px 2px 5px rgba(169, 169, 169, 0.5),
        -2px -2px 5px rgba(169, 169, 169, 0.5),
        2px -2px 5px rgba(169, 169, 169, 0.5),
        -2px 2px 5px rgba(169, 169, 169, 0.5);
    }
  }
  
</style>