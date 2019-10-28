<template>
    <div id="examine-info">
        <div class="content"
        >
          <div class="search">
            <div>
              <el-input @keyup.native.enter="handleSearch"  v-model="keyWord" placeholder="请输入关键字" >
                <el-select
                  v-model="objectTypeId" slot="prepend" placeholder="请选择">
                  <el-option 
                    v-for="(item ,index) in $store.state.type_nav"
                    :key="index"
                    :label="item.type" :value="index"></el-option>
                </el-select>
                <el-button @click.native="handleSearch" slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </div>
          </div>
          <ObjectShow v-if="searchOData.length" 
            :object-data="searchOData"
            @p-n-page="handlePN" 
            @click-page="handleCPage"
            :page-size="pageSize"
            :total="searchTotal"
          />
          <NoData :showText="showText" v-else />
        </div>
    </div>
</template>
<script>
import {mapState, mapMutations} from 'vuex'
import ObjectShow from '../info_show/object_info.vue'
import NoData from '../info_show/no_data.vue'
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
      'pageSize',
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
        const {gSearchInfo, objectTypeId, $message,
          searchOPage, target, pageSize, setState} = this

      
        // 发送请求
        gSearchInfo({
              objectTypeId,
              target,
              page: searchOPage,
              pageNum: pageSize,
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

    //处理上下一夜
    handlePN(tag){
      let {setState, searchOPage, searchData} = this
      // true 即为下一页 false 上一页
      if(tag){
        ++searchOPage
      }else{
        --searchOPage
      }
      this.setState({searchOPage: searchOPage})
      searchData()
    },

    // 页码
    handleCPage(page){
      this.setState({searchOPage: --page})
      this.searchData()
    },

    rowClick(row, column, event){
      const {toggleRow, prevRow, $refs} = this
      if(prevRow === row){
        this.toggleRow = !toggleRow
      }else{
        this.toggleRow = true
        prevRow && $refs.table.toggleRowExpansion(prevRow, false)
        this.prevRow = row
      }
      // 展开 关闭
      $refs.table.toggleRowExpansion(row, this.toggleRow)
    },

    sendComfirm(row){
      const {aUpOInfo, $confirm, $alert} = this

      $confirm(`是否通过 ${row.userName} 发布的帖子？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        aUpOInfo({
          objectId: row.objectId,
          data: {
            objectStepTag : 2,
            objectPassTag : true,
            objectReason: ''
          }
        }).then(res =>{
          const {code} = res.data
          if(code === 0) return $alert('操作失败，请稍后重试', '提示', {
            confirmButtonText: '确定'
          })

          row.objectPassTag = true
          row.objectStepTag = 2

          // 通过验证
          this.$message({
            message: '已通过帖子发布申请',
            type: 'success'
          })
        })
      }).catch(() => {
          console.log('取消')      
      })
      
    },
    // 处理权限的问题
    handleAuthory(objectAuthory, row){

      const {searchUData, $message, aUpOInfo} = this

      this.$confirm(objectAuthory?'是否解除该帖子的冻结？':'是否冻结该帖子？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        aUpOInfo({
          objectId: row.objectId,
          data:{
            objectAuthory
          }
        }).then(res =>{
          const {code} = res.data
          
          if(!code) return $message('操作失败，请稍后再试')

          // 操作成功了 设置当前的 freezeTag
          row.objectAuthory = objectAuthory

          if(!objectAuthory) return this.$message('已冻结该帖子')
          
          // 成功
          $message({
            message: '已成功解冻该帖子',
            type: 'success'
          })
        })
      }).catch(() => {
          console.log('取消')       
      })
    },
  },
  watch:{
    keyWord(newData){
      this.setState({target: newData})

      console.log(this.target)
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
      width: 980px;
      margin-left: 50px;
      padding-bottom: 100px;
      .search{
        padding: 20px 0;
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