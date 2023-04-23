<template>
  <router-view/>
</template>

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

.cursor-pointer{
  cursor: url('@/assets/point.png'), pointer;
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
