<template>
  <div class="download-settings">
    <div class="select-item">
        <div class="left">
            <div class="name">位置:</div>
            <div class="url">{{ url }}</div>
        </div>
        <div class="right">
            <a href="#" @click.prevent="changeUrl()">修改路径</a>
        </div>
    </div>
    <div class="select-item">
        <div class="left">
            <div class="name">下载完后自动打开目录:</div>
        </div>
        <div class="right">
            <input type="checkbox" v-model="autoOpenDir">
        </div>
    </div>
  </div>
</template>

<script>
import {ipcRenderer} from 'electron'
export default {
    watch:{
        autoOpenDir:{
            handler(newV){
                ipcRenderer.invoke("changeAutoOpen",newV)
            }
        }
    },
    data(){
        return{
            url:'',
            autoOpenDir:false
        }
    },
    methods:{
        async changeUrl(){
            let temp = await ipcRenderer.invoke("openSelectPathDialog")
            if(temp==null||temp==undefined)
                return
            this.url = temp
        }
    },
    async created(){
        let config = await ipcRenderer.invoke('getConfig')
        this.url = config.downloadPath
        this.autoOpenDir = config.openDirAuto
    }
}
</script>

<style lang="less" scoped>
    .download-settings{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 95%;
        align-items: flex-start;
        box-sizing: border-box;
        padding: 5px;
        border-radius: 20px;
        box-shadow: 4px 7px 7px rgba(196, 196, 196, 0.5),
            -1px -1px 1px rgba(222, 222, 222, 0.5),
            4px -2px 2px rgba(219, 219, 219, 0.5),
            -2px 2px 2px rgba(230, 230, 230, 0.5);
        .select-item{
            box-sizing: border-box;
            padding: 10px 15px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            .left{
                .name{
                    user-select: none;
                    font-size: 15px;
                    color: #656565;
                    text-align: left;
                }
                .url{
                    font-size: 14px;
                    color: #929292;
                }
            }
            .right{
                a{
                    text-decoration: none;
                    font-size: 15px;
                    color: #3f45f9;
                    box-sizing: border-box;
                    padding: 10px;
                    background-color: #ffffff;
                    border-radius: 10px;
                    border: 1px solid #c2c2c2;
                }
                a:hover{
                    background-color: #efefef;
                }
            }
        }
        .select-item:nth-child(1){
            border-bottom: 1px solid #e9e9e9;
        }
    }
</style>