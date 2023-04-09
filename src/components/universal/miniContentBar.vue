<template>
  <div class="content-bar">
    <div class="content-container">
      <div :class="'cursor-pointer '+(miniPathMap.content.length!==0?'content-item':'content-item-last')" @click.prevent="clickTitle()">{{ nowPage }}</div>
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
    <!-- <div class="right-additions">
      <div class="custom-input">
        <input type="text">
        <img src="@/assets/home/search.png" class="custom-icon-right">
      </div>
      <div class="upload cursor-pointer">
      </div>
    </div> -->
  </div>
</template>
<script>
import {mapState,mapMutations} from 'vuex'
export default {
  computed:{
    ...mapState(['nowPage','miniPathMap'])
  },
  data(){
    return {
      itemList:[],
      max:3,//路径栏最多显示的目录数目
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
    ...mapMutations(['switchMiniPrePath','finishedMiniFresh','clearMiniPath']),
    /**
     * 点击路径栏的往前路径,更新路径栏,并请求对应目录的内容
     * @param {*} directory 跳转的路径对象
     */
    clickPreContent(directory){
      if(!this.validate(directory))
        return
      if(!this.getFileList(directory.modifier))//获取服务器对应的目录内容,获取成功才去渲染
        return 
      this.switchMiniPrePath({
        modifier:directory.modifier
      })
      this.freshView()
      this.finishedMiniFresh()
    },
    /**
     * 点击路径栏的默认路径,请求对应模块的默认路径内容,并渲染路径模块
     */
    clickTitle(){
      if(this.miniPathMap.content.length===0)
        return
      else{
        if(!this.getFileList(''))//获取服务器对应的目录内容,获取成功才去渲染
          return 
        this.clearMiniPath()
        this.freshView()
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
      if(this.miniPathMap.needFresh){
        this.itemList = this.miniPathMap.content.slice(0)
      }
    },
    //获得对应目录的文件列表
    async getFileList(modifier){
      if(modifier===''){//点击标题

      }
      return true
    },
    /**
     * 初始化数据
     */
    initData(){
      this.itemList = this.miniPathMap.content.slice(0)
      //浅复制一份文件路径数据
    },
    clickMore(){
      this.showSubContent= !this.showSubContent
    },
    clickMoreItem(item){
      alert(1)
    }
  },created(){
    this.initData()
    
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
    height: 30px;
    box-sizing: border-box;
    padding: 10px 10px 10px 10px;
    // background-color: #487ac4;
    display: flex;
    align-items: center;
    justify-content: space-between;
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
        left: calc(50% - 14px);
        top: calc(50% - 10px);
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
        font-size: 12px;
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
        height: 30px;
        width: 30px;
        background-size:contain;
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
        font-size: 12px;
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
        top: calc(50% - 4px);
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