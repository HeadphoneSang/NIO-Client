<template>
  <router-view/>
</template>

<style lang="less">
html,body{
  cursor: url('@/assets/download.png'), pointer;
  height: 100%;
}

.cursor-pointer{
  cursor: url('@/assets/point.png'),pointer;
}
.blue-gradul-button{

  box-sizing: border-box;
  padding: 15px;
  width: 90%;
  color: #F5F5F6;
  border-radius: 15px;
  margin: 30px 0 20px 0;
  background-image: linear-gradient(to right, #3b62f1,#5972cd, rgb(119, 138, 209));
  user-select: none;
}
.blue-gradul-button:hover{
  background-image: linear-gradient(to right, #3152d7,#4a5fb3, #6671a4);
}
.custom-input{
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
      color: #42b983;
    }
  }
}
</style>
