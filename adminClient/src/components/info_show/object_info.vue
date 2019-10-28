<template>
    <div id="object-info">
        <div class=" object-wrap"
        >
          <div class="object-info"> 
              <el-table
                ref="table"
                :data="objectData"
                stripe
                highlight-current-row
                @row-click="rowClick"
                style="width: 100%">
                  <el-table-column type="expand">
                    <template slot-scope="props">
                      <div class="expand-wrap">
                          <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="头像">
                              <el-image
                                  :src="props.row.avater" 
                                  :preview-src-list="[props.row.avater]"
                                  style="width: 80px; height:80px"
                                  fit="cover"
                                lazy></el-image>
                            </el-form-item>

                            <el-form-item label="上传图片">
                              <el-image
                                  :src="props.row.objectImg[0]" 
                                  :preview-src-list="props.row.objectImg"
                                  style="width: 80px; height:80px"
                                  fit="cover"
                                lazy>
                              </el-image>
                            </el-form-item>

                            <el-form-item label="分类">
                              <span>{{ props.row.objectTypeId}}</span>
                            </el-form-item>
                            <el-form-item label="物品名称">
                              <span>{{ props.row.objectName}}</span>
                            </el-form-item>
                            <el-form-item label="丢失地点">
                              <span>{{ props.row.objectAddress}}</span>
                            </el-form-item>
                            <el-form-item label="丢失时间">
                              <span>{{ props.row.objectTime}}</span>
                            </el-form-item>
                            <el-form-item label="楼主说明">
                              <span>{{ props.row.objectDesc}}</span>
                            </el-form-item>
                            <el-form-item label="发布时间">
                              <span>{{ props.row.sendTime}}</span>
                            </el-form-item>
                            
                            <el-form-item label="帖子状态">
                              <div>
                                <el-link type="danger" v-if="props.row.objectStepTag === 1" disabled >待审核</el-link>
                                <el-link type="warning" v-else-if="props.row.objectStepTag === 3" disabled >未通过验证</el-link>
                                <el-link type="success" v-else-if="props.row.objectStepTag === 2" disabled >已通过验证</el-link>
                                <span style="padding:0 10px;"></span>
                                <el-button size="mini" v-if="props.row.objectStepTag === 1" 
                                  @click.native="sendComfirm(props.row)"
                                  type="success">通过</el-button>
                              </div>
                            </el-form-item> 
                            <el-form-item label="权限设置">
                              <div>
                                <el-link :type="props.row.objectAuthory? 'success':'danger'" disabled >
                                  {{props.row.objectAuthory? '正常':'已冻结'}}
                                </el-link>
                                <span style="padding:0 10px;"></span>
                                <el-button :disabled="!props.row.objectAuthory"
                                  @click.native="handleAuthory(false, props.row)" 
                                  size="mini" type="info">禁止访问</el-button>
                                <el-button :disabled="props.row.objectAuthory" 
                                  @click.native="handleAuthory(true, props.row)"
                                  size="mini" type="success">允许访问</el-button>
                              </div>
                            </el-form-item> 
                          </el-form>
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

                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="danger"
                        @click.native.stop="handleFinish(scope.row)">点击完成</el-button>
        
                    </template>
                  </el-table-column>

              </el-table>
          </div>
          <div class="page">
              <div>
                  <el-pagination
                    @prev-click="handlePrev(false)"
                    @next-click="handlePrev(true)"
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
    </div>
</template>
<script>
import {mapState} from 'vuex'
  export default {
    data() {
      return {
        userType: 1,// 默认学生
        toggleRow: false,
        prevRow: null,
        objectTypeId: '',
        fullsLoad: false,
        pageCount: 0
      }
    },

    created(){
        this.pageCount = Math.ceil(this.total/this.pageSize)
    },
    
    methods: {
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
      // 完成交易
      handleFinish(row){

        const {searchUData, $message, aUpOInfo, $confirm} = this

        $confirm(`是否完成发布的帖子`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          aUpOInfo({
            objectId: row.objectId,
            data:{
              objectAuthory: false
            }
          }).then(res =>{
            const {code} = res.data
            
            if(!code) return $message('操作失败，请稍后再试')

            // 操作成功了完成失物找回
            row.objectAuthory = false

            // 成功
            $message({
              message: '操作成功',
              type: 'success'
            })
          })
        }).catch(() => {
           console.log('取消')       
        })
      },
      handleCPage(page){
        this.$emit('click-page', page)
      },
      // 上下一页
      handlePrev(tag){
        this.$emit('p-n-page', tag)
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
    props: ['objectData', 'pageSize', 'total']
  }
</script>

<style lang="less" scoped>
  #object-info{
    .object-wrap{
      padding-bottom: 100px;
      .object-info{
        min-height: 400px;
      }
      .page{
        position: relative;
        width: 100%;
        height: 60px;
        padding-top: 15px;
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
  }
</style>