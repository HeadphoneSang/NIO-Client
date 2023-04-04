<template>
  <div class="recycle-container">
    <ContentBar :title="'recycle'"></ContentBar>
    <homeBody :title="'recycle'"></homeBody>
  </div>
</template>

<script>
import ContentBar from '@/components/home/contentBar.vue'
import homeBody from '@/components/home/homeBody.vue';
export default {
  components:{
    ContentBar,
    homeBody
  }
}
</script>

<style lang="less" scoped>
  .recycle-container{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
</style>