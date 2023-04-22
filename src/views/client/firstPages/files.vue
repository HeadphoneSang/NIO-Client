<template>
  <div class="file-container">
    <ContentBar :title="'files'"></ContentBar>
    <homeBody :title="'files'"></homeBody>
  </div>
</template>

<script>
import ContentBar from '@/components/home/contentBar.vue'
import homeBody from '@/components/home/homeBody.vue';
import {mapMutations,mapState} from 'vuex'

export default {
  components:{
    ContentBar,
    homeBody
  }
  ,
    computed:{
        ...mapState(['pathMap'])
    },
  methods:{
    ...mapMutations(['checkInRange','setFileList']),
    
  }
}
</script>

<style lang="less" scoped> 
  .file-container{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
</style>