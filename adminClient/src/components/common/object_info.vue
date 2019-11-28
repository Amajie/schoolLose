<template>
    <div id="object-info">
        <div class=" object-wrap"
        >
          <div class="info object-info"> 
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

                            <el-form-item label="物品图片">
                              <el-image
                                  :src="props.row.objectImg[0]" 
                                  :preview-src-list="props.row.objectImg"
                                  style="width: 80px; height:80px"
                                  fit="cover"
                                lazy>
                              </el-image>
                            </el-form-item>

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
                            
                            <el-form-item label="帖子状态">
                              <!-- <div> -->
                                <el-link type="danger" v-if="props.row.objectStepTag === 1" disabled >待审核</el-link>
                                <el-link type="warning" v-else-if="props.row.objectStepTag === 3" disabled >未通过验证</el-link>
                                <el-link type="success" v-else-if="props.row.objectStepTag === 2" disabled >已通过验证</el-link>
                                <el-button size="mini" v-if="props.row.objectStepTag === 1" 
                                  @click.native="sendComfirm(props.row)"
                                  type="success">通过</el-button>
                              <!-- </div> -->
                            </el-form-item> 
                            <el-form-item label="权限设置">
                              <div>
                                <el-link :type="props.row.objectAuthory? 'success':'danger'" disabled >
                                  {{props.row | filterText(isFreeze, userTag)}}
                                </el-link>
                                <span style="padding:0 10px;"></span>
                                <!-- 如果已经完成 无需在设置禁止访问字段  -->
                                <!-- 不允许访问或者已完成 没通过审核或者楼主账号已冻结 都无需设置 -->
                                <el-button :disabled="props.row | filterClick(!props.row.objectAuthory, isFreeze)"
                                  @click.native="handleAuthory(false, props.row)" 
                                  size="mini" type="info">禁止访问</el-button>
                                <el-button :disabled="props.row | filterClick(props.row.objectAuthory, isFreeze)" 
                                  @click.native="handleAuthory(true, props.row)"
                                  size="mini" type="success">允许访问</el-button>
                              </div>
                            </el-form-item> 
                            <el-form-item label="账户状态">
                                <el-link v-if="userTag" :type="isFreeze? 'success':'danger'" disabled >
                                  {{isFreeze ? '正常':'已被冻结'}}</el-link>
                                <el-link v-else :type="props.row.freezeTag? 'success':'danger'" disabled >
                                  {{props.row.freezeTag ? '正常':'已被冻结'}}
                                <!-- <el-link :type="(isFreeze != '1' && isFreeze) || props.row.freezeTag ? 'success':'danger'" disabled >
                                  {{(isFreeze != '1' && isFreeze) || props.row.freezeTag ? '正常':'已被冻结'}} -->
                                </el-link>
                            </el-form-item> 
                            <el-form-item label="是否删除">
                                <el-link :type="props.row.objectDelect? 'success':'danger'" disabled >
                                  {{props.row.objectDelect?'未删除':'已删除'}}
                                </el-link>
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
                        :type="scope.row.objectFinish?'success': 'danger'"
                        :disabled="scope.row | filterClick(!scope.row.objectAuthory, isFreeze)"
                        @click.native.stop="handleFinish(scope.row)">
                            {{scope.row.objectFinish?'点击完成': '已完成'}}</el-button>
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
        const {updataObject, $confirm, $alert} = this

        $confirm(`是否通过 ${row.userName} 发布的帖子？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
          updataObject({
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

        const {searchUData, $message, updataObject} = this

        this.$confirm(objectAuthory?'是否解除该帖子的冻结？':'是否冻结该帖子？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updataObject({
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

        const {searchUData, $message, updataObject, $confirm} = this

        $confirm(`是否完成发布的帖子`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updataObject({
            objectId: row.objectId,
            data:{
              objectFinish: false
            }
          }).then(res =>{
            const {code} = res.data
            
            if(!code) return $message('操作失败，请稍后再试')

            // 操作成功了完成失物找回
            row.objectFinish = false

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
      }
    },
    filters:{
      // isFreeze 搜素用户传过来的
      filterClick({objectFinish, objectStepTag, objectDelect, freezeTag}, objectAuthoryTag, isFreeze){
        
        // 如果不存在 则靠拿取
        if(!isFreeze){
          isFreeze = freezeTag
        }

        if(objectAuthoryTag || !objectFinish || !objectDelect
            || objectStepTag !=2 || !isFreeze) return true

        return false
      },

      // 根据权限的设置显示不同的提示信息
      filterText({object, freezeTag, objectAuthory}, isFreeze, userTag){
        
        // 如果不存在 则靠拿取
        if(!userTag){
          isFreeze = freezeTag
        }

        // 已被冻结
        if(!objectAuthory) return '已冻结'
        if(!isFreeze) return '账户已冻结'

        return '正常'
      }
    },
    props: ['objectData', 'pageSize', 'total', 'isFreeze', 'userTag']
  }
</script>

<style lang="less" scoped>
  #object-info{
    .object-wrap{
      .object-info{
        min-height: 400px;
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