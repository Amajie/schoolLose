<template>
    <div id="manage-data">
        <div class="content">
            <Courtyard />
            <TypeNav />
        </div>
       
    </div>
</template>
<script>
import TypeNav from '../data/typeNav.vue'
import Courtyard from '../data/courtyard.vue'
export default {
    data(){
        return{

        }
    },
    computed:{

    },
    created(){
    },
    methods:{

    },
    components:{
        TypeNav,
        Courtyard
    }
}
</script>

<style lang="less" scoped>
#manage-data{
    .content{
        padding: 0 5%;
        > div{
            .title{
                padding: 15px 0;
                display: flex;
                justify-content: space-between;
                h2{
                    color: #666;
                }
            }
        }
        .custom-tree-node {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            padding-right: 8px;
        }
        .type-icon{
            width: 50px;
            height: 50px;
            border-radius: 50%;
        }
    }
    .add-type{
        .add-opa{
            position: relative;
            .add-icon{
                position: absolute;
                top: 0;
                left: 100px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                margin: 0 10px;
            }
        }
    }
}
</style>