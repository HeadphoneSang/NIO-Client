<template>
  <div class="body-container">
    <div class="top-bar">
        <input type="checkbox" id="checkAll">
        <label for="checkAll">共{{ pathMap[title].fileList.length }}个</label>
    </div>
    <div class="files-container">
        <FileItem :item="item" v-for="(item,index) in pathMap[title].fileList" :key="index"></FileItem>
    </div>
  </div>
</template>

<script>
import {mapMutations,mapState} from 'vuex'
import FileItem from '@/components/home/fileItem.vue'
export default {
    props:{
        title:{
            type:String,
            required:true
        }
    },
    components:{
        FileItem
    },
    computed:{
        ...mapState(['pathMap'])
    },
    data(){
        return {
        }
    },
    methods:{

    },
    created(){
    }
    
}
</script>

<style lang="less" scoped>
    ::-webkit-scrollbar{
      display: none;
    }

    .body-container{
        width: 100%;
        flex: 1;
        box-sizing: border-box;
        padding: 10px 20px 10px 40px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        position: relative;
        .top-bar{
            display: flex;
            align-items: center;
            user-select: none;
            z-index: 1;
            background-color: #ffffff;
            box-sizing: border-box;
            padding: 0 0 20px 0;
            input{
                margin-right: 10px;
            }
            label{
                padding: 0;
                margin: 0;
                font-size: 12px;
                color: #8b8b8b;
                letter-spacing: 5px;
            }
        }
        .files-container{
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            flex: 1;
            overflow: auto;
            justify-content: flex-start;
            align-content: flex-start;
            position: absolute;
            height: 100%;
            box-sizing: border-box;
            padding:
            50px 10px 60px 10px;
        }
    }
</style>