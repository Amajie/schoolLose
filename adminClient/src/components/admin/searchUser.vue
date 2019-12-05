<template>
    <div id="searchUser">
       <div class="content"
       >
          <div class="search">
            <el-input @keyup.native.enter="handleSearch"  v-model="keyWord" placeholder="请输入学号、用户名、邮箱搜索用户" >
              <el-button @click.native="handleSearch" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
          <div  v-if="searchUData" class="user-info">
            <div>
                <div class="info-list">
                  <h2>用户信息</h2>
                  <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="头像">
                        <el-image
                            :src="searchUData.avater" 
                            :preview-src-list="[searchUData.avater]"
                            style="width: 80px; height:80px"
                            fit="cover"
                          lazy></el-image>
                      </el-form-item>
                      <el-form-item label="证件">
                          <el-image
                            v-if="searchUData.credePic[0]"
                            :src="searchUData.credePic[0]" 
                            :preview-src-list="searchUData.credePic"
                            style="width: 80px; height:80px"
                            fit="cover"
                          lazy></el-image>
                          <span v-else>未上传</span>
                      </el-form-item>

                      <el-form-item label="激活">
                        <el-link :type="searchUData.freezeTag? 'success': 'danger'" disabled >{{ searchUData.userActive? '账户已激活': '账户未激活' }}</el-link>
                      </el-form-item>
                      <el-form-item label="身份">

                        <el-link v-if="searchUData.passStep === 0" type="danger" disabled >
                          信息未完善
                        </el-link>
                        <el-link v-if="searchUData.passStep === 1" type="danger" disabled >
                          信息已完善，未审核
                        </el-link>
                        <el-link v-if="searchUData.passStep === 2" type="success" disabled >
                          已通过审核
                        </el-link>
                        <el-button v-if="searchUData.passStep === 1" @click.native="sendComfirm" size="mini" type="success">通过</el-button>
                      </el-form-item>


                      <el-form-item label="姓名">
                        <span>{{ searchUData.name ? searchUData.name: noDataText }}</span>
                      </el-form-item>
                      <el-form-item :label="searchUData.userType | filterStId">
                        <span>{{ searchUData.stId ? searchUData.stId: noDataText }}</span>
                      </el-form-item>
                      
                      <el-form-item label="性别">
                        <span>{{ searchUData.gender ? searchUData.gender: noDataText }}</span>
                      </el-form-item>

                      <el-form-item v-if="searchUData.userType != 3" label="学院">
                        <span>{{ searchUData.courtyard ? searchUData.courtyard: noDataText}}</span>
                      </el-form-item>

                      <el-form-item label="电子邮箱">
                        <span>{{ searchUData.email }}</span>
                      </el-form-item>


                      <el-form-item v-if="searchUData.userType != 2" :label="searchUData.userType | filterMajor">
                        <span>{{ searchUData.major ? searchUData.major: noDataText }}</span>
                      </el-form-item>
                      
                      <el-form-item label="用户类型">
                        <span>{{ searchUData.userType | filterType }}</span>
                      </el-form-item>

                      <el-form-item v-if="searchUData.userType === 1" label="班级">
                        <span>{{ searchUData.classes ? searchUData.classes: noDataText }}</span>
                      </el-form-item>
                      
                  </el-form>
                </div>
                <div class="info-opa">
                  <h2>相关操作</h2>
                  <!-- 两种方法都可以解决刷新问题 -->
                    <el-form @submit.native.prevent label-position="left" inline class="demo-table-expand">
                      <el-form-item label="密码修改">
                        <div class="change-paw">
                          <div>
                            <el-input @keyup.native.enter="changePaw" type="password" size="mini" clearable v-model="password" placeholder="请输入密码"></el-input>
                          </div>
                          <div>
                            <el-button @click.native="changePaw" size="mini" type="success">提交</el-button>
                          </div>
                        </div>
                      </el-form-item>
                      <el-form-item label="账户状态">
                        <div>
                          <el-link :type="searchUData.freezeTag? 'success': 'danger'" disabled >{{searchUData.freezeTag? '正常': '已冻结'}}</el-link>
                          <span style="padding:0 10px;"></span>
                          <el-button :disabled="!searchUData.freezeTag" @click.native="handleUser(false)" size="mini" type="info">冻结账户</el-button>
                          <el-button :disabled="searchUData.freezeTag" @click.native="handleUser(true)" size="mini" type="success">解冻账户</el-button>
                        </div>
                      </el-form-item>                
                                  
                  </el-form>
                </div>
                <div class="info-list">
                  <h2>他的帖子</h2>
                  <!-- 两种方法都可以解决刷新问题 -->
                    <el-form @submit.native.prevent label-position="left" inline class="demo-table-expand">              
                      <el-form-item label="操作">
                        <div>
                          <el-button @click.native="handleshowObject" 
                              size="mini" type="success">{{showUObjectTag?'收起': '查看'}}</el-button>
                        </div>
                      </el-form-item>                
                  </el-form>
                </div>
            </div>
            <ObjectShow v-if="showUObjectTag" 
              :object-data="searchUOData"
              @click-page="handleCPage"
              :page-size="searchPageSize"
              :total="searchUOTotal"
              :is-freeze="searchUData.freezeTag"
              :user-tag="true"
             />
          </div>
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
        noDataText: '未填写',
        password: '',
        showText: '暂无数据'
      }
    },
    created(){
      this.keyWord = this.searchWord
    },

    computed:{
      ...mapState([
        'searchUData',
        'searchUOData',
        'showUObjectTag',
        'searchWord',
        'searchUOPage',
        'searchPageSize',
        'searchUOTotal'
      ])
    },
    methods: {
      ...mapMutations([
        'setState'
      ]),
      // 搜索用户
      handleSearch(){
        const {searchWord, searchUser, $message, setState, $msg} = this

        // 存在则关闭
        $msg && $msg.close()
        // 没有关键字 清除账户列表 
        if(!searchWord) return this.$msg = $message('请输入搜索账户')

        //否则搜索内容
        searchUser({searchWord}).then(res =>{
          const {code, searchUData} = res.data
        
          if(!code) {
            setState({searchUData: null})
            return this.showText = '该用户不存在'
          }
                  
          setState({searchUData})
        })
      },
      // 修改密码
      changePaw(){
        const {password, searchUData, updataUser,
        encrypt, $message} = this
        if(!password){
            return $message('请输入密码')
        }else if(password.length < 8){
            return $message('密码长度过短')
        }else if(password.length > 16){
            return $message('密码长度过长')
        } 

        updataUser({
            _id: searchUData._id,
            data:{
              password: encrypt(password)
            }
        }).then(res =>{
          const {code} = res.data
          if(!code) return $message('修改密码失败，请稍后再试')
          // 成功
          $message({
            message: '恭喜你，修改密码成功',
            type: 'success'
          })
        })
      },
      // 冻结 解冻
      handleUser(freezeTag){
        const {searchUData, $message, updataUser} = this

        this.$confirm(freezeTag?'是否取消冻结该账户？':'是否冻结该账户？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updataUser({
              _id: searchUData._id,
              data:{
                freezeTag
              }
          }).then(res =>{
            const {code} = res.data
            
            if(!code) return $message('操作失败，请稍后再试')

            // 操作成功了 设置当前的 freezeTag
            searchUData.freezeTag = freezeTag

            if(!freezeTag) return $message('已冻结该账户')
            
            // 成功
            $message({
              message: '已成功解冻该账户',
              type: 'success'
            })
          })
        }).catch(() => {})
      },
      //通过身份验证
      sendComfirm(){
        const {updataUser, searchUData, $alert, $message} = this
        this.$confirm(`是否通过 ${searchUData.userName} 的身份验证？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() =>{
          updataUser({
              _id: searchUData._id,
              email: searchUData.email,
              data:{
                passStep: 2
              }
          }).then(res =>{
            const {code} = res.data
            if(code === 0) return $alert('操作失败，请稍后重试', '提示', {
              confirmButtonText: '确定'
            })       

            searchUData.passStep = 2

            // 通过验证
            $message({
              message: '已通过该用户的身份验证',
              type: 'success'
            })
          })
        }).catch(() => {})
      },
      // 搜素帖子
      searchObjectData(){
          const {searchObject, searchUData,
           searchUOPage, searchPageSize, setState} = this
           
          // 发送请求
          searchObject({
               objectUserId: searchUData._id,
               page: searchUOPage,
               pageNum: searchPageSize,
          }).then(res =>{
              const {code, data, total} = res.data

              // 总数为 0 则设置
            !this.searchUOTotal && setState({
              searchUOTotal: total
            })

            setState({
              searchUOData: data,
              showUObjectTag: true
            })
              
          }, () =>{
              console.log('错误')
          })
      },

      // 点击查看和收起帖子信息
      handleshowObject(){
        const {searchObjectData, showUObjectTag, searchUOData, setState} = this
        
        // 取反操作
        setState({showUObjectTag: !showUObjectTag})
        // 没值搜素 搜素成功后在显示
        if(!searchUOData.length && !showUObjectTag) return searchObjectData()

       

      },
      // 页码
      handleCPage(page){
        this.setState({searchUOPage: --page})
        this.searchObjectData()
      },
    },
    watch:{
      keyWord(newData){

        this.setState({searchWord: newData})
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
      ObjectShow,
      NoData
    }
  }
</script>

<style lang="less" scoped>
#searchUser{
  height: 100%;
  .content{
    .search{
      padding: 10px 0;
    }
    .user-info{
      h2{
        margin: 10px 0;
      }
      .info-opa{
        .change-paw{
          > div{
            float: left;
          }
        }
      }
    }
  }

}
</style>