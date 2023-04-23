<template>
    <div class="download-records-container">
        <Records :title="'download'" :name="'下载记录'"></Records>
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

</style>