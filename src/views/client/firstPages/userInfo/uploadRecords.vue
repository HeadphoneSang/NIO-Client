<template>
    <div class="upload-records-container">
        <Records :title="'upload'" :name="'上传记录'"></Records>
    </div>
</template>

<script>
import Records from '@/components/userInfo/records.vue';
export default {
    components:{
        Records
    }
}
</script>

<style lang="less" scoped>
    .upload-records-container{
        width: 100%;
        
    }
</style>