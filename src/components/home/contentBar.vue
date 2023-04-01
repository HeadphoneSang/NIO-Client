<template>
  <div class="content-bar">
    <div class="content-container">
      <div :class="'cursor-pointer '+(pathMap[title].stack.length!==0?'content-item':'content-item-last')" @click="clickTitle()">{{ pathMap[title].title }}</div>
      <div :class="'cursor-pointer '+(index!==pathMap[title].stack.length-1?'content-item':'content-item-last')" v-for="(item,index) in itemList" :key="index" @click="clickPreContent(item)">
        {{ item.name }}
      </div>
    </div>
    <div class="right-additions">
      111
    </div>
  </div>
</template>
<script>
import {mapState,mapMutations} from 'vuex'
export default {
  props:{
    title:{
      required:true,
      type:String
    },
  },
  computed:{
    ...mapState(['pathMap'])
  },
  data(){
    return {
      itemList:[],
      pathObj:{}
    }
  },
  methods:{
    ...mapMutations(['switchPrePath','finishedFresh','clearPath']),
    /**
     * 点击路径栏的往前路径,更新路径栏,并请求对应目录的内容
     * @param {*} directory 跳转的路径对象
     */
    clickPreContent(directory){
      if(!this.validate(directory))
        return
      if(!this.getFileList(directory.modifier))//获取服务器对应的目录内容,获取成功才去渲染
        return 
      this.switchPrePath({
        title:this.title,
        modifier:directory.modifier
      })
      this.freshView()
      this.finishedFresh({
        title:this.title,
      })
    },
    /**
     * 点击路径栏的默认路径,请求对应模块的默认路径内容,并渲染路径模块
     */
    clickTitle(){
      if(this.pathMap[this.title].stack.length===0)
        return
      else{
        if(!this.getFileList(''))//获取服务器对应的目录内容,获取成功才去渲染
          return 
        this.clearPath(this.title)
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
      if(this.pathMap[this.title].needFresh){
        this.itemList = this.pathMap[this.title].stack.slice(0)
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
      this.itemList = this.pathMap[this.title].stack.slice(0)
      //浅复制一份文件路径数据
    }
  },created(){
    this.initData()
  }
}
</script>

<style lang="less" scoped>
  .content-bar{
    width: 100%;
    height: 120px;
    box-sizing: border-box;
    padding: 50px 30px 20px 30px;
    // background-color: #487ac4;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .content-container{
      display: flex;
      .content-item,.content-item-last{
        box-sizing: border-box;
        padding: 10px 15px 10px 10px;
        position: relative;
        font-size: 18px;
        color: #909090;
        user-select: none;
      }
      .content-item-last{
        color: #141414;
        padding: 10px 10px 10px 10px;
        font-weight: 600;
        transition: color 1.2s;
      }
      .content-item::after{
        position: absolute;
        content: ' ';
        width: 8px;
        height: 8px;
        right: 0;
        top: 20px;
        background-image: url(@/assets/right.png) ;
        background-size: cover;
        display: block;
        
      }
      .content-item:hover{
        color: #487ac4;
      }
    }
  }
</style>