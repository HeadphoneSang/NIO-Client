<template>
  <div class="favorite-container">
    <ContentBar :title="'favorite'"></ContentBar>
    <homeBody :title="'favorite'"></homeBody>
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
  .favorite-container{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
</style>