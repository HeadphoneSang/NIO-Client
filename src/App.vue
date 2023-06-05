<template>
  <router-view/>
</template>
<script>
export default {
  
}
</script>
<style lang="less">
html,body{
  cursor: url('@/assets/download.png'), pointer;
  height: 100%;
  .swal-modal {
    border-radius: 20px;
    img{
      width:80px;
      user-select: none;
    }
    .swal-title{
      font-weight: 500;
      user-select: none;
    }
    input{
      border-radius: 10px;
    }
  }
  .swal-overlay {
    background-color: rgba(121, 122, 122, 0.45);
  }
}
.share{
  width: 430px;
  user-select: none;
  font-family:"Arial","Microsoft YaHei","黑体","宋体",sans-serif;
  .swal-footer{
    background-color: #efefef;
    margin-top: 35px;
  }
  .title{
    width: 100%;
    margin: 5px 0 10px 0;
    font-size: 19px;
    text-align: left;
    font-weight: 600;
    color: #363636;
    display: flex;
    align-items: center;
    justify-content: space-between;
    img{
      width: 22px;
      box-sizing: border-box;
      padding: 4px;
      border-radius: 5px;
      cursor: pointer;
    }
    img:hover{
      background-color: #eaeaea;
    }
  }
  .text{
    width: 100%;
    text-align: left;
    color: #979797;
    font-size: 13px;
  }
  .img-container{
    margin-top: 20px;
    img{
      width: 120px;
    }
    .desc{
      margin-top: 25px;
      color: #4a4c4d;
    }
  }
  .url-container{
    width: 100%;
    margin-top: 30px;
    .url-title{
      text-align: left;
      font-size: 15px;
    }
    .url{
      width: 100%;
      text-align: left;
      box-sizing: border-box;
      padding: 10px 10px;
      background-color: #f2f2f2;
      color: #939393;
      border-radius: 7px;
      font-size: 14px;
    }
  }
  .swal-button{
    width: 90px;
    height: 35px;
    font-size: 15px;
    padding: 5px;
    font-weight: 500;
    color: #ffffff;
  }
  .swal-button--uncopy{
      background-color: #f89b4f;
      outline: none;
  }
  .swal-button--uncopy:hover{
      background-color: #d17e3b;
      outline: none;
  }
  .swal-button--copy{
      background-color: #513ccb;
      outline: none;
  }
  .swal-button--copy:hover{
      background-color: #352498;
      outline: none;
  }
}
.file-info{
  width: 350px;
}
.updateSwal{
  widows: 450px;
  .swal-button--donot{
      background-color: #af2814;
      outline: none;
  }
  .swal-button--donot:hover{
      background-color: #861e0e;
      outline: none;
  }
  .swal-button--do{
      background-color: #1498af;
      outline: none;
  }
  .swal-button--do:hover{
      background-color: #05798e;
      outline: none;
  }
}
.dragUpload{
  width: 450px;
  .swal-icon{
    margin: 0;
    margin-top: 15px;
  }
  .swal-button--yes{
      background-color: #513ccb;
      outline: none;
  }
  .swal-button--yes:hover{
      background-color: #513ccb;
      outline: none;
  }
}
.cursor-pointer{
  cursor: url('@/assets/point.png'), pointer;
}
.closeWin{
  .swal-button-container:nth-child(2){
    .swal-button--close{
      background-color: #b82121;
      outline: none;
      
    }
  }
}
.closeUpload{
  .swal-button--one{
      background-color: #b82121;
      outline: none;
      
    }
    .swal-button--one:hover{
      background-color: #b82121;
      
    }
}


.file-info{
  .swal-button-container{
    .swal-button--minimize{
      background-color: #969696;
    }
    .swal-button--close{
      background-color: #5d8ed3;
      outline: none;
    }
  }
  
}
.blue-gradul-button{

  box-sizing: border-box;
  padding: 15px;
  width: 90%;
  color: #F5F5F6;
  border-radius: 15px;
  margin: 30px 0 20px 0;
  background-image: linear-gradient(to right, #3b62f1,#5972cd, rgb(119, 134, 209));
  user-select: none;
}
.blue-gradul-button:hover{
  background-image: linear-gradient(to right, #3152d7,#4a5fb3, #6671a4);
}
.button-disable{
  background-color: #4a4c4d;
  background-image: none;
  cursor: not-allowed;
}
.button-disable:hover{
  background-color: #4a4c4d;
  background-image: none;
  cursor: not-allowed;
}
.border-shadow{
  box-shadow: 4px 7px 7px rgba(196, 196, 196, 0.5),
      -1px -1px 1px rgba(222, 222, 222, 0.5),
      4px -2px 2px rgba(219, 219, 219, 0.5),
      -2px 2px 2px rgba(230, 230, 230, 0.5);
}
.custom-input,.custom-input-warn{
  display: flex;
  width: 90%;
  position: relative;
  justify-content: center;
  user-select: none;
  .custom-icon-right{
    height: 30px;
    position: absolute;
    right: 10px;
    top: 20%;
    cursor: url('@/assets/point.png'),pointer;
  }
  .custom-icon-left{
    height: 30px;
    position: absolute;
    right: 10px;
    top: 20%;
    cursor: url('@/assets/point.png'),pointer;
  }
  
  input{
    width: 100%;
    border: none;
    outline: none;
    padding: 10px 40px 10px 15px;
    margin: 0;
    border-radius: 10px;
    border: 1px solid #ffffff;
    background-color: #F5F5F6;
    box-sizing: border-box;
  }
  input:focus{
    background-color: #ffffff;
    border: 1px solid #769ff3;
  }
  .warn-input{
    border: 1px solid #e33535;
  }
  .warn-input:focus{
    border: 1px solid #e33535;

  }
}
.custom-input-warn{
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b943;
    }
  }
}
</style>
