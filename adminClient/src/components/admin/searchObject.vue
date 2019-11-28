<template>
    <div id="examine-info">
        <div class="content"
        >
          <div class="search">
            <div>
              <el-input @keyup.native.enter="handleSearch"  v-model="keyWord" placeholder="请输入关键字" >
                <el-button @click.native="handleSearch" slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </div>
          </div>
          <ObjectShow v-if="searchOData.length" 
            :object-data="searchOData"
            @click-page="handleCPage"
            :page-size="searchPageSize"
            :total="searchTotal"
          />
          <NoData :showText="showText" v-else />
        </div>
    </div>
</template>
<script>
import {mapState, mapMutations} from 'vuex'
import ObjectShow from '../common/object_info.vue'
import NoData from '../common/no_data.vue'
export default {
  data() {
    return {
      keyWord: '',
      toggleRow: false,
      prevRow: null,
      objectTypeId: '',
      fullsLoad: false,
      showText: '搜索吧'
    }
  },

  created(){
    this.keyWord = this.target
  },
  computed:{
    ...mapState([
      'searchOData',
      'searchOPage',
      'searchPageSize',
      'searchTotal',
      'target'
    ])
  },
  
  methods: {
    ...mapMutations([
      'setState'
    ]),
    // 搜素事件
    handleSearch(){
       const {searchData, $message, $msg,
          target, setState} = this

        $msg && $msg.close()
        if(!target) return this.$msg = $message('请输入关键字')
        // 每次搜素都要归0 页码
        setState({searchOPage: 0, searchTotal: 0})
        searchData()
    },

    searchData(){
        const {searchObject, objectTypeId, $message,
          searchOPage, target, searchPageSize, setState} = this

      
        // 发送请求
        searchObject({
              objectTypeId,
              target,
              page: searchOPage,
              pageNum: searchPageSize,
        }).then(res =>{
            const {code, data, total} = res.data

            // 总数为 0 则设置
            !this.searchTotal && setState({
              searchTotal: total
            })
            
            if(!code && !this.searchOData.length) return this.showText = "暂无搜索信息"
            // 不管有没有搜索到都是 data
            setState({searchOData: data})        
        }, () =>{
            console.log('错误')
        })
    },

    // 页码改变触发
    handleCPage(page){
      this.setState({searchOPage: --page})
      this.searchData()
    }
  },
  watch:{
    keyWord(newData){
      this.setState({target: newData})
    }
  },
  components:{
    ObjectShow,
    NoData
  }
}
</script>

<style lang="less" scoped>
  #examine-info{
    .content{
      .search{
        padding: 10px 0;
      }
      .bigPic{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
      }
      .showPic{
        z-index: 100000;
      }
    }
  }
</style>