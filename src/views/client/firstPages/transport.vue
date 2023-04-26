<template>
  <div class="transport-container">
    <div class="title">
      <div class="main">传输列表</div>
      <div :class="'sub-title '+(index===0?'sub-title-selected':'')" @click="clickSubTitle(0)">上传列表</div>
      <div :class="'sub-title '+(index===1?'sub-title-selected':'')" @click="clickSubTitle(1)">下载列表</div>
    </div>
    
    <router-view></router-view>
  </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
export default {
  computed:{
    ...mapState(['waitQueue'])
  },
  data(){
    return{
      index:0
    }
  },
  methods:{
    ...mapMutations(['pushFileToUploadQueue']),
    submit(){
      let files = this.$refs.file.files
      for(let i = 0;i<files.length;i++){
        let file = files[i]
        let item = {
          file:file
        }
        this.$upload("vue",file,"progress")
      }
    },
    clickSubTitle(index){
      this.index = index
      if(this.index==0){
        this.$router.push('/homePage/transport/upload')
      }else{
        this.$router.push('/homePage/transport/download')
      }
    }
  },
  created(){
    
  },
  mounted(){
  }
}
</script>

<style lang="less" scoped>
    .transport-container{
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      padding: 20px;
      .title{
        width: 100%;
        display: flex;
        box-sizing: border-box;
        padding: 20px;
        align-items: flex-end;
        user-select: none;
        .main{
          margin-right: 20px;
          font-weight: 600;
          font-size: 23px;
        }
        .sub-title{
          margin-right: 10px;
          cursor: pointer;
          font-weight: 600px;
          color: #747373;
          font-size: 13px;
          box-sizing: border-box;
          padding: 5px;
          border-radius: 5px;
        }
        .sub-title:hover{
          background-color: #efefef;
        }
        .sub-title-selected{
          background-color: #efefef;
          color: #000000;
        }
      }
      
    }
</style>