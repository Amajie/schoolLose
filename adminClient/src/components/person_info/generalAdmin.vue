<template>
    <div id="general">
        <Admin />
    </div>
</template>

<script>
import Admin from '../common/admin_opa.vue'
export default {
    data(){
        return {}
    },
    components:{
        Admin
    }
}
</script>
<style lang="less" scoped>
#general{
    padding: 0 5%;
}
</style>