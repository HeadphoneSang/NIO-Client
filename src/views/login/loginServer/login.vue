<template>
  <div class="login-container">
    <div :class="(this.username==''&&showWarn)?'input-warn':'input-container'">
      <input type="text" placeholder="请输入用户名" v-model="username" @blur="onUsernameBlur" ref="username">
    </div>
    <div :class="(this.password==''&&showWarn)?'custom-input-warn':'custom-input'">
      <input :type="showPassword?'text':'password'" placeholder="请输入密码" v-model="password" @blur="onPasswordBlur">
      <img  class="custom-icon-right" :src="showPassword?showIcon:hiddenIcon" @click="changePasswordShow">
    </div>
    <div class="select-line">
      <input type="checkbox" id="autoLogin" v-model="autoLogin" @click="clickAutoLogin"><label for="autoLogin">下次自动登录</label>
      
    </div>
    <div :class="'blue-gradul-button cursor-pointer '+(loading?'button-disable':'')" @click="login">
      登录
    </div>
    <div :class="showWarn?'warn':'warn-hidden'">{{warnMsg}}</div>
    <div class="submit-tips">
        点击「登录」表示连接到指定远程文件服务器
      </div>
    <div :class="loading?'spinner-border':'spinner-border-hidden'" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>

<script>
import {ipcRenderer} from 'electron'
export default {
  watch:{
    autoLogin:{
      handler(){
        window.localStorage.setItem("autoLogin",this.autoLogin)
      }
    }
  },
  data(){
    return {
      showPassword:false,
      showIcon:require('@/assets/showPassword.png'),
      hiddenIcon:require('@/assets/hiddenPassword.png'),
      username:'',
      password:'',
      autoLogin:false,
      showWarn:false,
      warnMsg:'',
      loading:false
    }
  },
  methods:{
    changePasswordShow(){
      this.showPassword = !this.showPassword
    },
    async login(){
      if(this.loading||this.username==''||this.password==''){
        return
      }
      try {
        this.loading = true
        let data
        data = await this.$http.get(`/login/checkPassword/${this.username}/${this.password}`)
        if(data.status==200){
          if(data.data.code==200){
            if(this.autoLogin){
              window.localStorage.setItem("lu",this.$encode(this.username))
              window.localStorage.setItem("lp",this.$encode(this.password))
            }
            this.autoLogin = false
            ipcRenderer.invoke('clickloginButton',this.username,this.$http.defaults.baseURL)
          }
          else{
            this.warnMsg = data.data.msg
            this.showWarn = true
          }
        }else{
            this.warnMsg = '网络连接失败'
            this.showWarn = true
        }
      } catch (error) {
          this.warnMsg = '网络连接失败'
          this.showWarn = true
      }finally{
        this.loading = false;
      }
      
    },
    onUsernameBlur(){
     if(this.username===''){
        this.warnMsg = '账号或密码不能为空'
        this.showWarn=true
      }else if(this.username!=''&&this.password!='')
        this.showWarn = false
    },
    onPasswordBlur(){
      if(this.password===''){
        this.warnMsg = '账号或密码不能为空'
        this.showWarn = true
      }else if(this.username!==''&&this.password!=='')
      {  
        this.showWarn = false
        
      }
    },
    clickAutoLogin(){
      
    }
  },
  async created(){
    let autoLogin = window.localStorage.getItem("autoLogin")
    if(autoLogin!=null)
      this.autoLogin = autoLogin
    if(autoLogin==='true'){
      let lu = window.localStorage.getItem("lu")
      let lp = window.localStorage.getItem("lp")
      if(lu!=null&&lp!=null){
        this.username = this.$decode(lu)
        this.password = this.$decode(lp)
        this.login()
      }
    }
  }
}
</script>

<style lang="less" scoped>
::-webkit-input-placeholder{
  font-size: 17px;
  color: #AAABAD
}
  .login-container{
    width: 100%;
    box-sizing: border-box;
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .spinner-border{
      position: fixed;
      top: 50%;
    }
    .spinner-border-hidden{
      display: none;
    }
    .warn{
      color: #ff0000;
      font-size: 15px;
      margin: 0%;
      user-select: none;
    }
    .warn-hidden{
      display: none;
    }
    .submit-tips{
        margin: 20px 0;
        font-size: 14px;
        color: #7b7b7b;
        user-select: none;
      }
    .select-line{
      user-select: none;
      display: flex;
      width: 90%;
      align-items: center;
      margin-top: 20px;
      label{
        padding: 0px;
        margin: 0px;
        font-size: 14px;
        color: #AAABAD;
      }
      input{
        margin-right: 5px;
      }
    }
    .input-container,.input-warn{
      width: 100%;
      input{
        width: 90%;
        border: none;
        background-color: #F5F5F6;
        margin-bottom: 20px;
        box-sizing: border-box;
        padding: 10px 15px;
        border-radius: 10px;
        border: 1px solid #ffffff;
        outline: none;
      }
      input:focus{
        background-color: #ffffff;
        border: 1px solid #769ff3;
      }
    }
    .input-warn{
        input{
          border: 1px solid #ff0000;
          transition: all 0.5s;
      box-shadow: 2px 2px 5px rgba(169, 169, 169, 0.5),
        -2px -2px 5px rgba(169, 169, 169, 0.5),
        2px -2px 5px rgba(169, 169, 169, 0.5),
        -2px 2px 5px rgba(169, 169, 169, 0.5);
        }
        input:focus{
          background-color: #ffffff;
          border: 1px solid #ff0000;
        }
      }
  }
</style>