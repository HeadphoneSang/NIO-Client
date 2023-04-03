<template>
  <div class="recycle-container">
    <ContentBar :title="'recycle'"></ContentBar>
    <HomeBody :title="'recycle'"></HomeBody>
  </div>
</template>

<script>
import ContentBar from '@/components/home/contentBar.vue'
import HomeBody from '@/components/home/homeBody.vue'
export default {
  components:{
    ContentBar,
    HomeBody
  }
}
</script>

<style lang="less" scoped>
  .recycle-container{
    widows: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    
  }
</style>