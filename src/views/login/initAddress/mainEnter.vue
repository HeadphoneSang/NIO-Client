<template>
  <div class="main-container">
    <div class="icon">
        <img src="@/assets/ICON.png">
        <img src="@/assets/text.png" alt="">
    </div>
    <router-view class="main-view">

    </router-view>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>

    .main-container{
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-image: radial-gradient( #969ed8,#ECEFFF);

        padding-bottom: 30px;
        .icon{
            width: 100%;
            display: flex;
            justify-content: center;
            margin-left: -10px;
            img{
                margin: 0 5px 0 0;
                height: 100px;
                user-select: none;
            }
            img:nth-child(2){
                height: 50px;
            }
            margin-bottom: 20px;
            display: flex;
            align-items: center;
        }
    }
    .main-view{
        width: 80%;
        background-color: #ffffff;
        border-radius: 25px;
        box-shadow: 2px 2px 8px rgba(169, 169, 169, 0.5),
          -2px -2px 8px rgba(169, 169, 169, 0.5),
          2px -2px 8px rgba(169, 169, 169, 0.5),
          -2px 2px 8px rgba(169, 169, 169, 0.5);
    }
</style>