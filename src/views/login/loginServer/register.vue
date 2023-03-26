<template>
  <div class="register-container">
    <div class="input-container">
      <input type="text" placeholder="请输入用户名" v-model="username">
    </div>
    <div class="custom-input add-bottom">
      <input :type="showPassword?'text':'password'" placeholder="请输入密码" v-model="password" :class="showPassWarn?'warn-input':''" @input="checkPassword" @blur="checkPassword">
      <img  class="custom-icon-right" :src="showPassword?showIcon:hiddenIcon" @click="changePasswordShow">
    </div>
    <div class="custom-input">
      <input :type="showPassword?'text':'password'" placeholder="请再次输入密码" v-model="confirmPassword" :class="showPassWarn?'warn-input':''" @input="checkPassword" @blur="checkPassword">
    </div>
    <div class="select-line">
      <input type="checkbox" id="autoLogin" v-model="autoLogin"><label for="autoLogin">下次自动登录</label>
    </div>
    <div class="blue-gradul-button cursor-pointer">
      注册
    </div>
    
  </div>
</template>

<script>
export default {
  data(){
    return {
      showPassword:false,
      showIcon:require('@/assets/showPassword.png'),
      hiddenIcon:require('@/assets/hiddenPassword.png'),
      username:'',
      password:'',
      confirmPassword:'',
      autoLogin:true,
      showPassWarn:false
    }
  },
  methods:{
    changePasswordShow(){
      this.showPassword = !this.showPassword
    },
    checkPassword(){
      console.log(1)
      if(this.password!==this.confirmPassword)
        this.showPassWarn=true
      else
        this.showPassWarn = false
      console.log(this.showPassWarn)
    }
  }
}
</script>

<style lang="less" scoped>
::-webkit-input-placeholder{
  font-size: 17px;
  color: #AAABAD
}
  .register-container{
    width: 100%;
    box-sizing: border-box;
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .add-bottom{
      margin-bottom: 20px;
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
    .input-container{
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
    
  }
</style>