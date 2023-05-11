<template>
  <div class="add-container">
    <div class="input-group">
      <label for="remote-box"><img :src="remoteIcon" alt=""></label>
      <input type="text" id="remote-box" :class="showWarn?'input-warn':'input-none'" placeholder="输入远程地址" @focus="focusInput" @blur="blurInput" v-model="remoteAddress">
    </div>
    <div :class="showWarn?'warn-tips':'warn-hidden'" >{{ warnMsg }}</div>
    <div class="select-box">
      <input type="checkbox" id="check" v-model="isRemeber"><label for="check">记录地址</label>
    </div>
    <div class="submit-box">
      <input type="submit" value="连接" :class="confirming?'submit-btn-disable':'submit-btn'" @click.prevent="submit()">
      <div class="submit-tips">
        点击「登录」表示连接到指定远程文件服务器
      </div>
    </div>
    <div :class="confirming?'spinner-border':'spinner-border-hidden'" role="status">
      <span class="sr-only">Loading...</span>
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
        showWarn:false,
        warnMsg:'连接地址不能为空',
        confirming:false
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
          this.showWarn = '连接地址不能为空'
          return this.showWarn = true
        }
        this.showWarn = false
      },
      async submit(){
        if(this.remoteAddress==''){
          this.showWarn = '连接地址不能为空'
          return this.showWarn = true
        }
        if(this.confirming)
          return
        this.confirming = true
        let seq = Math.ceil(Math.random()*10000)
        try {
          let port = this.remoteAddress.lastIndexOf(':')!==-1?null:25565
          let ret = await this.$http.get("http://"+(port!==null?this.remoteAddress+`:${port}`:this.remoteAddress)+"/login/confirm/"+seq)
          if(ret.status===200){
            if(ret.data==seq+1)
            {
              this.$http.defaults.baseURL = "http://"+(port!==null?this.remoteAddress+`:${port}`:this.remoteAddress)
              if(this.isRemeber){
                let str = window.localStorage.getItem("ipHistory")
                let has = false
                let history = []
                if(str!=null){
                  history = JSON.parse(str)
                  has = history.find(item=>item.ip==this.remoteAddress)
                }
                if(has===undefined||has==false){
                  history = [
                    {
                      ip:this.remoteAddress
                    },
                    ...history
                  ]
                  window.localStorage.setItem("ipHistory",JSON.stringify(history.slice(0,5)))
                }
                window.localStorage.setItem("ip",this.remoteAddress)
              }
              return this.$router.push('/mainEnter/loginMain')
            }
          }else{
            this.warnMsg = '连接地址不可用,网络请求失败'
            this.showWarn = true
          }
        } catch (error) {
          this.warnMsg = '连接地址不可用,网络请求失败'
          this.showWarn = true
          console.log(error)
        }finally{
          this.confirming = false;
        }
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
    .spinner-border{
      position: fixed;
      left: calc(50% - 12px);
      top: 50%;
      z-index: 99;
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
      margin-bottom: -15px;
      font-size: 13px;
      color: #ff0000;
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