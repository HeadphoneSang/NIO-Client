<template>
  <div class="register-container">
    <div :class="(this.username==''&&showPassWarn)?'input-warn':'input-container'">
      <input type="text" placeholder="请输入用户名" v-model="username" @blur="onBlur">
    </div>
    <div :class="(showPassWarn?'custom-input-warn':'custom-input')+' add-bottom'">
      <input :type="showPassword?'text':'password'" placeholder="请输入密码" v-model="password" @input="checkPassword" @blur="checkPassword">
      <img  class="custom-icon-right" :src="showPassword?showIcon:hiddenIcon" @click="changePasswordShow">
    </div>
    <div :class="(showPassWarn?'custom-input-warn':'custom-input')">
      <input :type="showPassword?'text':'password'" placeholder="请再次输入密码" v-model="confirmPassword" @input="checkPassword" @blur="checkPassword">
    </div>
    <div class="select-line">
      <input type="checkbox" id="autoLogin" v-model="autoLogin"><label for="autoLogin">下次自动登录</label>
    </div>
    <div :class="'blue-gradul-button cursor-pointer '+(loading?'button-disable':'')" @click="register">
      注册
    </div>
    <div class="warn" v-if="showPassWarn">{{ warnMsg }}</div>
    <div :class="loading?'spinner-border':'spinner-border-hidden'" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>

<script>
import swal from 'sweetalert';
export default {
  props:{
    isUpdate:{
      type:Boolean,
      required:true
    }
  },
  data(){
    return {
      showPassword:false,
      showIcon:require('@/assets/showPassword.png'),
      hiddenIcon:require('@/assets/hiddenPassword.png'),
      username:'',
      password:'',
      confirmPassword:'',
      autoLogin:false,
      showPassWarn:false,
      warnMsg:'',
      loading:false,
    }
  },
  methods:{
    changePasswordShow(){
      this.showPassword = !this.showPassword
    },
    checkPassword(){
      if(this.password!==this.confirmPassword){
        this.showPassWarn=true
        this.warnMsg = '两次输入的密码不相同'
      }
      else
        this.showPassWarn = false
    },
    onBlur(){
      if(this.username==''){
        this.warnMsg = '用户名不能为空'
        this.showPassWarn = true
      }else if(this.password!==this.confirmPassword){
        this.showPassWarn = false
      }
    },
    async register(){
      if(this.isUpdate){
        return swal({
          title:"更新检查提示",
          text:"请稍后...",
          icon:"warning"
        })
      }
      if(this.loading)
        return
      if(this.username==''||this.password!=this.confirmPassword){
        this.warnMsg = '请检查你的注册信息'
        this.showPassWarn = true
      }else{
        this.loading = true
        try{
          swal({
              title: `你确定要注册名为${this.username}的用户吗?`,
              text: `注册以后不可以再修改用户名!`,
              icon: "warning",
              buttons: true,
              dangerMode: true,
            }).then(async (willDelete) => {
              if (willDelete) {
                let res = await this.$http.post("/login/register",{
                  username:this.username,
                  password:this.password
                })
                if(res.status==200){
                  if(res.data.code==200){
                    if(this.autoLogin){
                      window.localStorage.setItem("lu",this.$encode(this.username))
                      window.localStorage.setItem("lp",this.$encode(this.password))
                      window.localStorage.setItem("autoLogin",true)
                    }
                    this.$router.back(-1)
                  }else{
                    this.warnMsg = res.data.msg
                    this.showPassWarn = true
                  }
                }else{
                  this.warnMsg = '网络连接失败'
                  this.showPassWarn = true
                }
              } else{
                swal(`取消注册`)
              }
          })
        }catch(e){
            this.warnMsg = '网络连接失败'
            this.showPassWarn = true
        }finally{
          this.loading = false
        }
      }
    }
  },
  created(){

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
    .spinner-border{
      position: fixed;
      left: calc(50% - 12px);
      top: 50%;
    }
    .spinner-border-hidden{
      display: none;
    }
    .warn{
      color: #ff0000;
      font-size: 15px;
    }
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