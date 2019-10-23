<template>
    <div id="person-info">
        <div class="info"> 
            <el-table
              :data="userData"
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
                          <el-form-item v-if="props.row.userType != 2" :label="props.row.userType | filterMajor">
                            <span>{{ props.row.major }}</span>
                          </el-form-item>

                          <el-form-item label="电子邮箱">
                            <span>{{ props.row.email }}</span>
                          </el-form-item>
                          <el-form-item v-if="props.row.userType != 3" label="学院">
                            <span>{{ props.row.courtyard }}</span>
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
                                style="width: 100px; height=100px"
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
                                <el-button @click.native="handleComfirm(false, props.row.userName, props.row._id)" type="info">不通过</el-button>
                                <el-button @click.native="handleComfirm(true, props.row.userName, props.row._id)" type="success">通过</el-button>
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
            </el-table>
        </div>
        <div class="page">
            <div>
                <el-pagination
                  background
                  layout="prev, pager, next"
                  :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
  export default {
    data() {
      return {
        userData: [],
        total: 0,
        page: 0,
        pageNum: 10,
        userType: 1// 默认学生
      }
    },

    created(){
      
      this.getInfo()
    },
    methods: {
      getInfo(){
        const {pageNum} = this
        this.aUserInfo({
          page: this.page++,
          pageNum
        }).then(res =>{
          const {total, userData} = res.data
          if(!total) return console.log('没有数据')
          // 此时只有初始化才会设置总页数
          if(!this.page) this.total = Math.ceil(total/pageNum)

          // 设置数据
          this.userData = userData
          console.log(userData)
        })
      },
      handleComfirm(passTag, userName, _id){
        let msg = `是否通过 ${userName} 的身份验证？`
        if(!passTag) msg = `是否拒绝 ${userName} 的身份验证？`
        this.$confirm(msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.sendComfirm(passTag, _id)
        }).catch(() => {
            console.log('取消')      
        })
      },
      sendComfirm(passTag, _id){
        let data = {
          _id,
          data: {
              passTag
          }
        }
        if(passTag) data = {
            _id,
            data: {
              authory: true,
              passTag: false
            }
        }

        this.aUpInfo(data).then(res =>{

        })
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