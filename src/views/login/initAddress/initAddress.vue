<template>
  <div class="init-container">
    <div class="top-title">
        <div>登陆你的远程服务器</div>
        <div>什么是远程服务器?<span data-toggle="tooltip" data-html="true" title="<h4>了解详情</h4><b>远程文件服务器搭建完毕后,向外部开放的链接地址,例如:</b><br /><b>test.chbcraft.com</b>">了解详情<img src="@/assets/rightArrow.png" alt=""></span>
            
        </div>
    </div>
    <div class="input-container">
        <div class="select-bar">
            <div class="rate_tip">
                <span class="slider" :class="{ activeds: isRateActive == 'month' }"></span>
                <span
                  style="z-index: 66"
                  :class="{ actived: isRateActive == 'week' }"
                  @click="changeSelect('week')"
                  >历史服务器</span
                >
                <span
                  style="z-index: 66"
                  :class="{ actived: isRateActive == 'month' }"
                  @click="changeSelect('month')"
                  >新增服务器</span
                >
            </div>
        </div>
        <router-view></router-view>
    </div>
  </div>
</template>

<script>
import $ from 'jquery/dist/jquery.js'

export default {
    created(){
        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        })
    },
    data(){
        return {
            isRateActive:'week'
        }
    },
    methods:{
        changeSelect(str){
            this.isRateActive = str
            if(str=='week'){
                return this.$router.push("/initAddress/historyAddress")
            }
            this.$router.push("/initAddress/addNewAddress")
        }
    }
}
</script>

<style lang="less" scoped>
    .init-container{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        box-sizing: border-box;
        padding: 30px 50px;
        
        .top-title{
            width: 100%;
            text-align: left;
            margin-bottom: 30px;
            user-select: none;
            div:nth-child(1){
                font-size: 30px;
                font-weight: 900;
                margin-bottom: 10px;
                letter-spacing: 2px;
            }
            div:nth-child(2){
                color: #939393;
                span{
                    color: #0485d4;
                    cursor: pointer;
                }
            }
            img{
                height: 17px;
                margin-left: 5px;
                cursor: pointer;
            }
        }
        .input-container{
            width: 100%;
            .select-bar{
                margin-bottom: 10px;
                .rate_tip {
                    position: relative;
                    display: flex;
                    align-items: center;
                    border-radius: 10px;
                    box-sizing: border-box;
                    height: 40px;
                    width: 220px;
                    padding: 10px 3px;
                    background-color: rgb(229, 229, 229);
                    span {
                      cursor: pointer;
                      font-size: 15px;
                      display: inline-block;
                      padding: 0px 5px;
                      width: 50%;
                      color: #909090;
                    }
                    .slider {
                      color: #ffffff00;
                      transition: all 0.4s;
                      border-radius: 10px;
                      display: inline-block;
                      box-sizing: border-box;
                      height: 75%;
                      position: absolute;
                      background-color: #ffffff;
                      box-shadow: 2px 2px 4px rgba(169, 169, 169, 0.5),
                        -2px -2px 4px rgba(169, 169, 169, 0.5),
                        2px -2px 4px rgba(169, 169, 169, 0.5),
                        -2px 2px 4px rgba(169, 169, 169, 0.5);
                    }
                    .actived {
                      color: #535353;
                      border-radius: 5px;
                      z-index: 99;
                    }
                    .activeds {
                      margin-left: 47%;
                    }
                }
            }
            
        }
    }
    
</style>