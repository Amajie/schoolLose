<template>
    <div id="person-info">
      <div v-if="userPageData.length">
        <div class="info"> 
            <el-table
              ref="table"
              :data="userPageData"
              stripe
              highlight-current-row
              @row-click="rowClick"
              style="width: 100%">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <div class="expand-wrap">
                        <el-form label-position="left" inline class="demo-table-expand">
                          <el-form-item label="姓名">
                            <span>{{ props.row.name }}</span>
                          </el-form-item>
                          <el-form-item :label="props.row.userType | filterStId">
                            <span>{{ props.row.stId }}</span>
                          </el-form-item>
                          
                          <el-form-item label="性别">
                            <span>{{ props.row.gender }}</span>
                          </el-form-item>

                          <el-form-item v-if="props.row.userType != 3" label="学院">
                            <span>{{ props.row.courtyard }}</span>
                          </el-form-item>

                          <el-form-item label="电子邮箱">
                            <span>{{ props.row.email }}</span>
                          </el-form-item>

                          <el-form-item v-if="props.row.userType != 2" :label="props.row.userType | filterMajor">
                            <span>{{ props.row.major }}</span>
                          </el-form-item>
                          
                          <el-form-item label="用户类型">
                            <span>{{ props.row.userType | filterType }}</span>
                          </el-form-item>

                          <el-form-item v-if="props.row.userType === 1" label="班级">
                            <span>{{ props.row.classes }}</span>
                          </el-form-item>
                          <el-form-item label="头像">
                            <el-image
                                :src="props.row.avater" 
                                :preview-src-list="[props.row.avater]"
                                style="width: 80px; height:80px"
                                fit="cover"
                              lazy></el-image>


                          </el-form-item>
                          <el-form-item label="证件">
                              <el-image
                                :src="props.row.credePic[0]" 
                                :preview-src-list="props.row.credePic"
                                style="width: 100px; height=100px"
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
                  label="电子邮件"
                  prop="email">
                </el-table-column>
                <!-- 待审核 -->
                <el-table-column
                  label="状态">
                  <template slot-scope="scope">
                    <el-link type="danger" v-if="scope.row.passStep === 1" disabled >待审核</el-link>
                    <el-link type="success" v-else-if="scope.row.passStep === 2" disabled >已通过验证</el-link>
                    <el-link type="warning" v-else disabled >未通过验证</el-link>
                  </template>
                </el-table-column>

            </el-table>
        </div>
        <div class="page">
            <div>
                <el-pagination
                  @prev-click="handlePage(false)"
                  @next-click="handlePage(true)"
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
      <NoData :showText="'暂无审核用户'" v-else/>
    </div>
</template>
<script>
import NoData from '../info_show/no_data.vue'
export default {
  data() {
    return {
      userData: [],
      userPageData:[],
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
    this.getInfo({authory : false, passStep: 1})
    console.log(this.$store.state)
  },
  
  methods: {
    getInfo(condition){
      this.aUserInfo({condition: JSON.stringify(condition)}).then(res =>{
        const {total, userData} = res.data
        if(!total) return console.log('没有数据')
        // 此时只有初始化才会设置总页数
        this.total = total
        this.pageCount = Math.ceil(total/this.pageSize)
        //设置数据
        this.userData = userData
        this.userPageData = userData.slice(0, this.pageSize)
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
      let msg = `是否通过 ${userName} 的身份验证？`
      if(!passTag) msg = `是否拒绝 ${userName} 的身份验证？`
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
    sendComfirm(passTag, row, remindInfo){

      let data = {passStep: 3}// 默认不能通过

      if(passTag) data = {
        authory: true,
        passStep: 2// 通过
      }

      this.aUpUInfo({
          _id: row._id,
          email: row.email,
          remindInfo,
          data
      }).then(res =>{
        const {code} = res.data
        if(code === 0) return this.$alert('操作失败，请稍后重试', '提示', {
          confirmButtonText: '确定'
        })

        row.activeBtn = true
        //未通过验证
        if(!passTag && code === 200) {
          row.passStep = 3
          return this.$message('已拒绝该用户的身份验证')
        }
        

        row.authory = true
        row.passStep = 2

        // 通过验证
        this.$message({
          message: '已通过该用户的身份验证',
          type: 'success'
        })
      })
    },

    // true 下一页 false 上一页
    handlePage(tag){
      if(tag){
        this.page++
      }else{
        this.page--
      }
      const {userData, pageSize, page} = this
      this.userPageData = userData.slice(page*pageSize, (page+1)*pageSize)
    },
    // 直接点击页码
    handleCPage(page){

      const {userData, pageSize} = this
      this.userPageData = userData.slice((page - 1)*pageSize, page*pageSize)
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
  #person-info{
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
    .page{
      position: relative;
      width: 100%;
      height: 60px;
      padding-top: 35px;
      > div{
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
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
</style>