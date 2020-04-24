<template>
    <div class="home-continer">
        <el-button type="info" @click="out">退出</el-button>
    </div>
</template>

<script>
    export default {
        data() {
            return {}
        },
        methods: {
            out(){
                window.sessionStorage.clear()
                this.$router.push('/login')
            }
        }

    }
</script>
<!--scoped 代表当前页面生效-->
<style lang="less" scoped>

</style>
