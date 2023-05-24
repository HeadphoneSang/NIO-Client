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
    <div class="select-item">
        <div class="left">
            <div class="name">睡眠执行任务:</div>
        </div>
        <div class="right">
            <input type="checkbox" v-model="stopSleep" @change="changeSleep">
        </div>
    </div>
    <div class="select-item">
        <div class="left">
            <div class="name">并行传输文件限制:</div>
        </div>
        <div class="right">
            <input type="number" @change="changeMaxUpload" v-model="maxUpload">
        </div>
    </div>
    
  </div>
</template>

<script>
import {ipcRenderer} from 'electron'
import swal from 'sweetalert'
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
            autoOpenDir:false,
            maxUpload:3,
            itemList:[1,2,3,4,5],
            stopSleep:false
        }
    },
    methods:{
        async changeUrl(){
            let temp = await ipcRenderer.invoke("openSelectPathDialog")
            if(temp==null||temp==undefined)
                return
            this.url = temp
        },
        changeMaxUpload(){
            if(this.maxUpload >5){
                this.maxUpload = 3;
                ipcRenderer.invoke('changeMaxUpload',this.maxUpload);
                return swal({
                    icon:'error',
                    text:"最大同步下载不可以超过5",
                    buttons:{
                        exit:{
                            text:"确认"
                        }
                    }
                })
            }
            ipcRenderer.invoke('changeMaxUpload',this.maxUpload);
        },
        changeSleep(){
            ipcRenderer.invoke('changePowerState',this.stopSleep);
        }
    },
    async created(){
        let config = await ipcRenderer.invoke('getConfig');
        console.log(config);
        this.url = config.downloadPath;
        this.autoOpenDir = config.openDirAuto;
        this.stopSleep = config.stopSleep;
        this.maxUpload = config.maxUploadThread;
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
        .select-item:nth-child(4){
            input{
                border: 1px solid #bebebe;
                width: 20px;
                height: 20px;
                font-size: 12px;
                border-radius: 5px;
                text-align: center;
                color: #656565;
            }
            input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{
                -webkit-appearance: none !important;
            }
        }
            
    }
</style>