<template>
    <div class="delete-records-container">
        <Records :title="'delete'" :name="'删除记录'"></Records>
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