<template>
  <div class="main-container">
    <div class="icon">
        <img src="@/assets/ICON.png">
        <img src="@/assets/text.png" alt="">
    </div>
    <div class="place"></div>
    <div class="main-view">
        <router-view @changeUpdate="changeUpdate"></router-view>
    </div>
    <div class="nav-bar" v-if="showNavBar">
        <a href="#" @click.prevent="backServer">
            <img src="@/assets/back.png" alt="">
            返回选择服务器</a>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return {
            isUpdate:false,
        }
    },
    computed:{
        showNavBar(){
            return (this.$route.fullPath.indexOf('initAddress')===-1)&&!this.isUpdate
        }
    },
    methods:{
        backServer(){
            if(this.$route.fullPath.indexOf('initAddress')===-1){
                window.localStorage.removeItem("ip")
                window.localStorage.setItem("isRemeber",false)
                this.$router.push('/mainEnter/initAddress/historyAddress')
            }
        },
        changeUpdate(update){
            this.isUpdate = update;
        }
    }
}
</script>

<style lang="less" scoped>

    .main-container{
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-image: radial-gradient( #969ed8,#ECEFFF);

        padding-bottom: 30px;
        
        .nav-bar{
            position: absolute;
            bottom: 15px;
            display: flex;
            align-items: center;
            
            a{
                text-decoration: none;
                color: #7b59ed;
                font-size: 13px;
                img{
                    height: 20px;
                }
            }
            a:hover{
                color: #8e73ea;
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
        .place{
            height:124px;
            width:100%;
        }
        .icon{
            width: 100%;
            display: flex;
            justify-content: center;
            position: absolute;
            top: 15px;
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
    
</style>