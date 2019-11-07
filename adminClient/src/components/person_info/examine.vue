<template>
    <div id="examine-info">
        <div class="content">
          <div v-if="examinePageData.length">
            <div class="info"> 
                <el-table
                  ref="table"
                  :data="examinePageData"
                  stripe
                  highlight-current-row
                  @row-click="rowClick"
                  style="width: 100%">
                    <el-table-column type="expand">
                      <template slot-scope="props">
                        <div class="expand-wrap">
                            <el-form label-position="left" inline class="demo-table-expand">
                              <el-form-item label="分类">
                                <span>{{ props.row.objectTypeId | filterTypeName}}</span>
                              </el-form-item>
                              <el-form-item label="物品名称">
                                <span>{{ props.row.objectName}}</span>
                              </el-form-item>
                              <el-form-item label="丢失地点">
                                <span>{{ props.row.objectAddress}}</span>
                              </el-form-item>
                              <el-form-item label="丢失时间">
                                <span>{{ props.row.objectTime | filterTime(true)}}</span>
                              </el-form-item>
                              <el-form-item label="楼主说明">
                                <span>{{ props.row.objectDesc}}</span>
                              </el-form-item>
                              <el-form-item label="发布时间">
                                <span>{{ props.row.sendTime | filterTime(true)}}</span>
                              </el-form-item>
                              <el-form-item label="上传图片">
                                <el-image
                                    :src="props.row.objectImg[0]" 
                                    :preview-src-list="props.row.objectImg"
                                    style="width: 80px; height:80px"
                                    fit="cover"
                                  lazy></el-image>
                              </el-form-item>
                            </el-form>
                            <div class="btn">
                                <div>
                                    <el-button :disabled="props.row.activeBtn" @click.native="handleComfirm(false, props.row)" type="info">不通过</el-button>
                                    <el-button :disabled="props.row.activeBtn" @click.native="handleComfirm(true, props.row)" type="success">通过</el-button>
                                </div>
                            </div>
                        </div>
                      </template>
                    </el-table-column>

                    <el-table-column
                      label="用户名"
                      prop="userName">
                    </el-table-column>
                    <el-table-column
                      label="物品名称"
                      prop="objectName">
                    </el-table-column>
                    <!-- 待审核 -->
                    <el-table-column
                      label="状态">
                      <template slot-scope="scope">
                        <el-link type="danger" v-if="scope.row.objectStepTag === 1" disabled >待审核</el-link>
                        <el-link type="warning" v-else-if="scope.row.objectStepTag === 3" disabled >未通过验证</el-link>
                        <el-link type="success" v-else-if="scope.row.objectStepTag === 2" disabled >已通过验证</el-link>
                      </template>
                    </el-table-column>

                </el-table>
            </div>
            <div class="page">
                <div>
                    <el-pagination
                      @current-change="handleCPage"
                      background
                      :page-size="pageSize"
                      :page-count="pageCount"
                      layout="prev, pager, next"
                      :total="total">
                    </el-pagination>
                </div>
            </div>
          </div>
          <NoData :showText="'暂无审核帖子'" v-else />
        </div>
    </div>
</template>
<script>
import NoData from '../common/no_data.vue'
export default {
  data() {
    return {
      examineData: [],
      examinePageData:[],
      page: 0,
      pageSize: 2,
      total: 0,
      pageCount: 0,
      userType: 1,// 默认学生
      toggleRow: false,
      prevRow: null
    }
  },

  created(){
    // 默认显示待审核信息
    this.getEData()
  },
  
  methods: {
    
    getEData(){
        this.examineObject({
              
          }).then(res =>{
              const {code, data, total} = res.data

              console.log(data)
              

              // 此时只有初始化才会设置总页数
              this.total = total
              this.pageCount = Math.ceil(total/this.pageSize)
              this.examineData = data
              this.examinePageData = data.slice(0, this.pageSize)
              console.log(this.examinePageData)
          }, () =>{
              console.log('错误')
          })
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
    handleComfirm(passTag, row){
      const {userName, _id} = row
      let msg = `是否通过 ${userName} 发布的帖子？`
      if(!passTag) msg = `是否拒绝 ${userName} 发布的帖子？`
          this.$confirm(msg, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
            if(passTag) return this.sendComfirm(passTag, row, '')
              this.$prompt('拒绝理由', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPlaceholder: '输入拒绝理由'
            }).then(({ value }) => {
                this.sendComfirm(passTag, row, value)
            }).catch(() => {
                  
            })
      }).catch(() => {
          console.log('取消')      
      })
    },
    sendComfirm(passTag, row, objectReason){

      let data = {
        objectStepTag : 3,
        objectReason
      }

      if(passTag) data = {
        objectStepTag : 2,
        objectPassTag : true,
        objectReason
      }

      this.updataObject({
          objectId: row.objectId,
          data
      }).then(res =>{
        const {code} = res.data
        if(code === 0) return this.$alert('操作失败，请稍后重试', '提示', {
          confirmButtonText: '确定'
        })

        row.activeBtn = true

        //未通过验证
        if(!passTag && code === 200) {
          row.objectStepTag = 3
          return this.$message('已拒绝帖子发布申请')
        }
        

        row.objectPassTag = true
        row.objectStepTag = 2

        // 通过验证
        this.$message({
          message: '已通过帖子发布申请',
          type: 'success'
        })
      })
    },

    // 直接点击页码
    handleCPage(page){
      const {examineData, pageSize} = this
      // this.page = page
      console.log(page)
      this.examinePageData = examineData.slice((page - 1)*pageSize, page*pageSize)

    }
  },
  filters:{
    filterType(userType){
      if(userType === 1){
        return '学生'
      }else if(userType === 2){
        return '教师'
      }else{
        return '访客'
      }
    },
    filterStId(userType){
      if(userType === 1){
        return '学号'
      }else if(userType === 2){
        return '教工号'
      }else{
        return '证件号'
      }
    },
    filterMajor(userType){
      if(userType === 1){
        return '专业'
      }else{
        return '职业'
      }
    },
    filterTime(time, tag){
        const data = new Date(Number(time))
        if(!tag) return `${data.getFullYear()}-${('0'+(1+data.getMonth())).slice(-2)}-${('0'+data.getDate()).slice(-2)}`
        return `${data.getFullYear()}-${('0'+(1+data.getMonth())).slice(-2)}-${('0'+data.getDate()).slice(-2)} 
                        ${('0'+data.getHours()).slice(-2)}:
                        ${('0'+data.getMinutes()).slice(-2)}`
    }
  },
  components:{
    NoData
  }
}
</script>

<style lang="less" scoped>
  #examine-info{
    .content{
      .info{
        .expand-wrap{
          .btn{
            margin: 20px 0;
            height: 50px;
            position: relative;
            > div{
              position: absolute;
              left: 50%;
              transform: translateX(-50%);
            }
          }
        }
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