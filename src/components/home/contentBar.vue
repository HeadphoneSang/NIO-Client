<template>
  <div class="content-bar">
    <div class="content-container">
      <div :class="'cursor-pointer '+(pathMap[title].stack.length!==0?'content-item':'content-item-last')" @click.prevent="clickTitle()">{{ pathMap[title].title }}</div>
      <div v-if="itemList.length>max" class="cursor-pointer content-item hiddenMore" @click.prevent="clickMore()" @mouseenter.prevent="hoverSub=true" @mouseleave.prevent="hoverSub=false">
        ...
        <div class="back" v-if="hoverSub"></div>
        <div :class="showSubContent?'more-list':'unshow'">
          <div class="sub-file" v-for="(item,index) in itemList.slice(0,itemList.length-max)" :key="index" @click.prevent="clickPreContent(item)" @blur="clickMoreItem(item)">{{ item.name.length>fileLength?item.name.substring(0,fileLength)+'...':item.name }}</div>
        </div>
      </div>
      <div :class="'cursor-pointer '+(index!==(Math.min(itemList.length-1,max-1))?'content-item':'content-item-last')" v-for="(item,index) in itemList.slice(Math.max(0,itemList.length-max))" :key="index" @click.prevent="clickPreContent(item)">
        {{ item.name.length>fileLength?item.name.substring(0,fileLength)+'...':item.name }}
      </div>
    </div>
    <div class="right-additions">
      <div class="custom-input">
        <input type="text">
        <img src="@/assets/home/search.png" class="custom-icon-right">
      </div>
      <div class="upload cursor-pointer">
      </div>
    </div>
    <div :class="loading?'spinner-border':'spinner-hidden'" role="status">
        <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>
<script>
import {mapState,mapMutations} from 'vuex'
import bus from '@/views/bodyContentbus.js';
import swal from 'sweetalert';
export default {
  props:{
    title:{
      required:true,
      type:String
    },
  },
  computed:{
    ...mapState(['pathMap','userInfo'])
  },
  data(){
    return {
      itemList:[],
      loading:false,
      max:4,//路径栏最多显示的目录数目
      fileLength:6,
      pathObj:{},
      showSubContent:false,
      hoverSub:false,
      unshow:(e)=>{
        if (!(e.target.className.indexOf('content-item')!==-1||e.target.className.indexOf('sub-file')!==-1)) {
          this.showSubContent =false
        }
      }
    }
  },
  methods:{
    ...mapMutations(['switchPrePath','finishedFresh','clearPath','setFileList','resetCheckLength','priorityFilesDir']),
    /**
     * 点击路径栏的往前路径,更新路径栏,并请求对应目录的内容
     * @param {*} directory 跳转的路径对象
     */
    async clickPreContent(directory){
      if(this.loading)
        return
      this.loading = true
      if(!this.validate(directory)){
        this.loading = false;
        return
      }
      if(!await this.getFileList(directory.modifier))//获取服务器对应的目录内容,获取成功才去渲染
      {
        this.loading = false;  
        return 
      }
      this.priorityFilesDir({title:this.title})
      this.switchPrePath({
        title:this.title,
        modifier:directory.modifier
      })
      this.freshView()
      this.finishedFresh({
        title:this.title,
      })
      this.loading = false
    },
    /**
     * 点击路径栏的默认路径,请求对应模块的默认路径内容,并渲染路径模块
     */
    async clickTitle(){
      if(this.pathMap[this.title].stack.length===0)
        return
      if(this.loading)
        return
      this.loading = true
      switch(this.title){
        case "files":{
          await this.clickFileTitile()
          break;
        }
        case "favorite":{
          await this.clickFavoriteTitile()
          break;
        }
        case "recycle":{
          await this.clickRecycleTitle()
          break;
        }
        case "lock":{
          await this.clickLockTitle()
          break;
        }
      }
      this.priorityFilesDir({title:this.title})
      this.clearPath(this.title)
      this.freshView()
      this.loading = false
    },
    async clickLockTitle(){
      let res = await this.$http.get("/file/getLockFiles")
          if(res.status==200){
              this.setFileList({
                  title:this.title,
                  fileList:res.data.list
              })
          }
          else{
              this.setFileList({
                  title:this.title,
                  fileList:[]
              })
      }
    },
    async clickRecycleTitle(){
      let res = await this.$http.get("/file/getRecycleFiles")
          if(res.status==200){
              this.setFileList({
                  title:this.title,
                  fileList:res.data.list
              })
          }
          else{
              this.setFileList({
                  title:this.title,
                  fileList:[]
              })
      }
    },
    async clickFileTitile(){
      if(!await this.getFileList(''))//获取服务器对应的目录内容,获取成功才去渲染
        {
          swal("网络连接失败")
          return;
        }
    },
    async clickFavoriteTitile(){
      await this.getDefaultFavorite()
    },
    async getDefaultFavorite(){
        try{
          let res = await this.$http.get("/file/getFavoriteListByUsername/"+this.userInfo.username)
          if(res.status==200){
              this.setFileList({
                  title:this.title,
                  fileList:res.data.list
              })
          }
          else{
              this.setFileList({
                  title:this.title,
                  fileList:[]
              })
            }  
        }catch(e){
          console.log(e)
          swal("网络连接错误")
        }finally{
          this.priorityFilesDir({title:this.title})
        }
    },
    /**
     * 检查点击的往前路径是否可用,如果是当前路径,就不可用
     * @param {*} directory  目录对象
     */
    validate(directory){
      return directory.modifier!==this.itemList[this.itemList.length-1].modifier
    },
    freshView(){
      if(this.pathMap[this.title].needFresh){
        this.itemList = this.pathMap[this.title].stack.slice(0)
      }
    },
    //获得对应目录的文件列表
    async getFileList(modifier){
      try{
        let res = await this.$http.get(`/file/getFileListByModifier/${modifier}`)
        if(res.status==200){
          let data = res.data
          if(data.code==200){
            this.setFileList({
              title:this.title,
              fileList:res.data.list
            })
            return true
          }else{
            swal(data.msg)
            return false
          }
        }else{
          swal("读取文件内容失败!")
          return false
        }
      }catch(e){
        swal("读取文件内容失败!")
        return false
      }
    },
    /**
     * 初始化数据
     */
    initData(){
      this.itemList = this.pathMap[this.title].stack.slice(0)
      //浅复制一份文件路径数据
      
    },
    clickMore(){
      this.showSubContent= !this.showSubContent
    },
    clickMoreItem(item){

    } 
  },created(){
    this.initData()
    bus.on("updateDataEvent",async (params) => {
      if(this.loading)
        return;
      this.loading = true
      if(params.title===this.title){
        let res = await this.getFileList(params.modifier)
        if(res){
          this.freshView()
          this.resetCheckLength({title:this.title})
        }
        else
          this.switchPrePath({
            title:this.title,
            modifier:modifier
          })
        }
        this.loading = false
    })
    
  },mounted(){
      document.addEventListener('click', this.unshow,true)  
  },
  beforeUnmount(){
    document.removeEventListener('click', this.unshow, true)
  }
 
}
</script>

<style lang="less" scoped>
  @keyframes graduallymove {
        0%{
          height: 10px;
        }
        100%{
          height: 100px;
      }
  }
  .content-bar{
    width: 100%;
    height: 100px;
    box-sizing: border-box;
    padding: 50px 30px 20px 30px;
    // background-color: #487ac4;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .spinner-border{
        position: fixed;
        z-index: 999;
        left: 60%;
        top: 50%;
    }
    .spinner-hidden{
        display: none;
    }
    .unshow{
      .sub-file{
        display: none;
      }
      max-height: 0px;
    }
    .hiddenMore{
      position: relative;
      .back{
        height: 25px;
        width: 25px;
        border-radius: 5px;
        position: absolute;
        background-color: #dce2ff;
        left: 5px;
        top: 12px;
        z-index: -1;
      }
    }
    .more-list{
      position: absolute;
      color: #000000;
      background-color: #ffffff;
      z-index: 99;
      box-shadow: 1px 1px 1px rgba(230, 230, 230, 0.5),
      -1px -1px 1px rgba(230, 230, 230, 0.5),
      1px -1px 5px rgba(230, 230, 230, 0.5),
      -2px 2px 2px rgba(230, 230, 230, 0.5);
      padding: 5px;
      border-radius: 10px;
      transition: all 0.2s;
      .sub-file{
        font-size: 14px;
        position: relative;
        box-sizing: border-box;
        padding: 5px;
        min-width: 150px;
        text-align: left;
        border-radius: 5px;
      }
      .sub-file:hover{
        background-color: #eaeaea;
      }
    }
    .right-additions{
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 25%;
      .upload{
        user-select: none;
        background-image: url(@/assets/home/add2.png);
        height: 35px;
        width: 35px;
        background-size:cover;
      }
      .upload:hover{
        background-image: url(@/assets/home/add3.png);
      }
      .custom-input{
        width: 80%;        
        .custom-icon-right{
          box-sizing: border-box;
          height: 20px;
          top: 15px;
          right: 25px;
        }
        input{
          background-color: #ffffff;
          width: 80%;
        }
      }
    }
    .content-container{
      display: flex;
      .content-item,.content-item-last{
        box-sizing: border-box;
        padding: 10px 15px 10px 10px;
        position: relative;
        font-size: 17px;
        color: #a7a7a7;
        user-select: none;
      }
      .content-item-last{
        color: #141414;
        padding: 10px 10px 10px 10px;
        font-weight: 600;
        transition: color 1s;
      }
      .content-item::after{
        position: absolute;
        content: '';
        width: 8px;
        height: 8px;
        right: 0;
        top: 20px;
        background-image: url(@/assets/right.png) ;
        background-size: cover;
        display: block;
        
      }
      .content-item:hover{
        color: #7E92FA;
      }
    }
  }
</style>