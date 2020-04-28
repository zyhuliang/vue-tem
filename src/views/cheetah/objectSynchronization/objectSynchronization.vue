<template>
  <section id='bm-ch-sys-syschronization-tmp'>
    <div class="synchronizationsBox">
      <el-row class="btnClass">
        <div class="btn-right">
          <el-button type="info" id='bm-ch-sys-syschronization-create-button' @click="newTask"><i
            class="icon iconfont icon-ir-add"></i>创建
          </el-button>
          <el-button type="info" id='bm-ch-sys-syschronization-copy-button' @click="copyTask"
                     :disabled="multipleSelection.length != 1"><i class="el-icon-edit"></i>复制
          </el-button>
          <el-button type="info" id='bm-ch-sys-syschronization-edit-button' @click="editTask"
                     :disabled="!(multipleSelection.length == 1 && multipleSelection[0] && multipleSelection[0].status != 1)">
            <i class="el-icon-edit"></i>编辑
          </el-button>
          <el-button type="info" id='bm-ch-sys-syschronization-start-button' @click="startTask()"
                     :disabled="multipleSelection.length == 0"><i class="icon iconfont icon-ir-start"></i>启用
          </el-button>
          <el-button type="info" id='bm-ch-sys-syschronization-stop-button' @click="stopTask()"
                     :disabled="multipleSelection.length == 0"><i class="icon iconfont icon-ir-stop"></i>停用
          </el-button>
          <el-button type="info" id='bm-ch-sys-syschronization-delete-button' @click="delTable"
                     :disabled="multipleSelection.length == 0"><i class="icon iconfont icon-ir-directory-delete"></i>删除
          </el-button>
        </div>
        <div class="btnLeft">
          <search-date-data name='bm-ch-sys-syschronization-refSearchDate-search-select' ref="refSearchDate"
                            @searchDate="searchListTable" :pagesize="pagesize"
                            :searchInput="searchInput"></search-date-data>

          <!--todo周期过滤-->
          <div class="ers-pattern ers-pattern-col">
            <h4>周期</h4>
            <el-select name='bm-ch-sys-syschronization-srcTrigger-search-select' v-model="srcTrigger" placeholder="所有"
                       @visible-change="srcOption('srcTrigger')">
              <el-option
                v-for="item in ['所有', '单次执行','周期执行']"
                :key="item"
                :name="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </div>
          <!--todo状态过滤-->
          <div class="ers-pattern">
            <h4>状态</h4>
            <el-select name='bm-ch-sys-syschronization-status-search-select' v-model="srcStatus" multiple
                       placeholder="所有" @visible-change="srcOption('srcStatus')"
                       @remove-tag="srcOption('srcStatus', 'remove')">
              <el-option
                v-for="item in ['已创建', '已部署', '已停止' , '错 误', '未知']"
                :key="item"
                :name="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </div>
          <!--todo最后执行状态过滤-->
          <div class="ers-pattern">
            <h4>最后执行状态</h4>
            <el-select name='bm-ch-sys-syschronization-srcLastExecuteStatus-search-select'
                       v-model="srcLastExecuteStatus" multiple placeholder="所有"
                       @visible-change="srcOption('srcLastExecuteStatus')"
                       @remove-tag="srcOption('srcLastExecuteStatus', 'remove')">
              <el-option
                v-for="item in ['创建', '运行中', '完成', '失败', '未知']"
                :key="item"
                :name="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </div>
          <search-table-data ref="refSearchTable" name='bm-ch-sys-syschronization-searchListTable-search-select'
                             @searchKey="searchListTable" :pagesize="pagesize" :startTime="startTime"
                             :endTime="endTime"></search-table-data>
        </div>

        <!--<new-search :tableTitle="tableTitle" interFace = "synchronizations" @getTableData="getTableData"></new-search>-->
        <!-- <search-table-data ref="refSearchTable" @searchKey = "searchListTable" :pagesize = "pagesize" :startTime="startTime" :endTime="endTime"></search-table-data>
        <search-date-data  ref="refSearchDate" @searchDate="searchListTable" :pagesize = "pagesize" :searchInput="searchInput"></search-date-data> -->


      </el-row>
      <!--内容显示列表页面-->
      <template>
        <div class="rf-swap">
          <el-table id="bm-ch-syschronization-table" :data="tableData.content"
                    tooltip-effect="dark"
                    @selection-change="handleSelectionChange"
                    @sort-change="getOrder"
                    v-loading="loading"
                    height="calc(100vh - 220px)"
                    style="width: 100%">
            <el-table-column
              type="selection">
            </el-table-column>

            <el-table-column label="名称" prop="name" sortable="custom" min-width="200">
              <template slot-scope="scope">
                <a @click="nameDialog(scope.row.id)">
                  {{scope.row.name}}
                </a>
              </template>
            </el-table-column>
            <el-table-column label="数据源" prop="dataSource" sortable="custom" min-width="200">
              <!--<template slot-scope="scope">-->
              <!--<el-button-->
              <!--type="text"-->
              <!--size="small"-->
              <!--@click="datasourceDialog(scope.row.dataSourceId)"-->
              <!--&gt;-->
              <!--{{scope.row.dataSource}}-->
              <!--</el-button>-->
              <!--</template>-->

            </el-table-column>
            <el-table-column label="同步对象" prop="object" sortable="custom" width="150">
              <template slot-scope="scope">
                <a
                  @click="objectDialog(scope.row.dataSourceId, scope.row.object)"
                  v-if="JSON.parse(scope.row.taskJson).dataSource.type == 'JDBC'"
                >
                  {{scope.row.object}}
                </a>
                <span v-else>{{scope.row.object}}</span>
              </template>
            </el-table-column>
            <el-table-column label="周期情况" prop="trigger" width="100" align="left" sortable="custom">
              <template slot-scope="scope">
                <span v-if="!scope.row.trigger">单次执行</span>
                <span v-else>周期执行</span>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime" min-width="100" align="left" :formatter="dateFormat"
                             sortable="custom">
            </el-table-column>
            <el-table-column label="状态" prop="status" align="center" sortable="custom">
              <template slot-scope="scope">
                <div v-if="scope.row.status == 0" class="status-div-create">已创建</div>
                <div v-else-if="scope.row.status == 1" class="status-div-deploy">已部署</div>
                <div v-else-if="scope.row.status == 2" class="status-div-stop">已停止</div>
                <div v-else-if="scope.row.status == -1" class="status-div-error">错 误</div>
                <div v-else>未知</div>
              </template>
            </el-table-column>
            <el-table-column label="最后读入" prop="lastReadIn" align="center" sortable="custom" width="100">
            </el-table-column>
            <el-table-column label="最后写出" prop="lastWriteOut" align="center" sortable="custom" width="100">
            </el-table-column>
            <!--						<el-table-column label="最近变更" prop="lastChange"  align="center" sortable="custom" width="100">-->
            <!--						</el-table-column>-->
            <el-table-column label="最后执行状态" prop="lastExecuteStatus" width="130" align="center" sortable="custom">
              <template slot-scope="scope">
                <div v-if="scope.row.lastExecuteStatus == 0">创建</div>
                <div v-else-if="scope.row.lastExecuteStatus == 1">运行中</div>
                <div v-else-if="scope.row.lastExecuteStatus == 2">完成</div>
                <div v-else-if="scope.row.lastExecuteStatus == -1">失败</div>
                <div v-else-if="scope.row.lastExecuteStatus == -2">终止</div>
                <div v-else>未知</div>
              </template>
            </el-table-column>
            <el-table-column label="最后执行时间" prop="lastExecuteTime" min-width="140" :formatter="dateFormat" align="left"
                             sortable="custom">
            </el-table-column>
            <el-table-column width="80" align="center" fixed="right">
              <template slot-scope="scope">
                <router-link
                  type="text"
                  size="small"
                  :to="{ path: '/objectSynchronization/executeList/'+scope.row.id,query:{taskType: 'object'}}"
                >
                  执行列表
                </router-link>
              </template>
            </el-table-column>
            <!--<el-table-column width="90" fixed="right">-->
            <!--<template slot-scope="scope">-->
            <!--<a @click="dataPreview(scope.row.dataStoreId,scope.row.tenant.id)"-->
            <!--&gt;-->
            <!--预览数据集-->
            <!--</a>-->
            <!--</template>-->
            <!--</el-table-column>-->
          </el-table>
          <el-pagination
            name="bm-ch-4-el-pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[8, 16, 50, 100]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.totalElements">
          </el-pagination>
        </div>
      </template>
      <!--name dialog-->
      <preview-task-name ref="taskName"></preview-task-name>

      <!--数据源 dialog-->
      <preview-data-source ref="dataSource" :isShowDialog="isShowDialog" :dataStoreId="dataStoreId"
                           v-on:ShowDialog="ShowDialog"></preview-data-source>

      <!--同步对象 dialog-->
      <preview-object ref="object"></preview-object>

      <!--数据预览 dialog-->
      <preview-data-set ref="dataset"></preview-data-set>

      <router-view></router-view>
    </div>
  </section>
</template>

<script>
  import searchDateData from '@components/collectorSearch/searchDateData.vue'
  import searchTableData from '@components/collectorSearch/searchTableData.vue'
  import NewSearch from '@components/search/newSearch.vue'
  import previewDataSet from '@components/collector/taskDialog/datasetDialog.vue'
  import previewObject from '@components/collector/taskDialog/object.vue'
  import previewTaskName from '@components/collector/taskDialog/name.vue'
  import previewDataSource from '@components/collector/taskDialog/dataSource.vue'
  import {
    getCollectorTaskList,
    getCollectorIds,
    getObjectSynchronizationTaskList,
    getSynchronizationTaskExecuteList,
    deleteTasks,
    startTasks,
    stopTasks,
    getResource,
    previewDataset,
    getSchema
  } from '../../../api/api'
  import {getTaskJson, getDataSource, postSynchronizationTask} from '@api'
  import {queryObject, createParameter} from '@components/function/queryParameter.js';
  import task from '@components/jsTask/taskStep.js';

  var parameter = queryObject();
  export default {
    components: {
      NewSearch,
      searchDateData,
      searchTableData,
      previewDataSet,
      previewObject,
      previewTaskName,
      previewDataSource,
    },
    data() {

      return {
        dataStoreId: '',
        isShowDialog: false,
        cols: [],
        multipleSelection: [],
        option: "layout",
        tableData: {},
        show: false,
        currentPage: 1,
        pagesize: 8,
        loading: true,
        self: this,
        startTime: '',
        endTime: '',
        searchInput: '',
        parameter: "",
        form: '',
        dialogNewTaskJsonVisible: false,
        orderDirection: 'DESC',
        prop: 'lastModifiedTime',
        field: '',
        tableTitle: [{
          value: 'name',
          label: '名称',
        }, {
          value: 'dataSource',
          label: '数据源',
        }, {
          value: 'object',
          label: '同步对象',
        }, {
          value: 'dataStore',
          label: '数据集',
        }, {
          value: 'trigger',
          label: '周期情况',
        }, {
          value: 'createTime',
          label: '创建时间',
        }, {
          value: 'status',
          label: '状态',
          options: [{
            value: '0',
            label: '已创建',
          }, {
            value: '1',
            label: '已部署',
          }, {
            value: '2',
            label: '已停止',
          }, {
            value: '-1',
            label: '错误',
          }]
        }, {
          value: 'lastExecuteStatus',
          label: '最后执行状态',
          options: [{
            value: '0',
            label: '创建',
          }, {
            value: '1',
            label: '运行中',
          }, {
            value: '2',
            label: '完成',
          }, {
            value: '-1',
            label: '失败',
          }, {
            value: '-2',
            label: '失败',
          }]
        }, {
          value: 'lastExecuteTime',
          label: '最后执行时间',
        }],
        srcTrigger: ['所有'],
        srcStatus: [],
        srcLastExecuteStatus: [],
      }
    },
    methods: {
      getTableData(data) {
        this.tableData = data
      },
      ShowDialog() {
        this.isShowDialog = false;
      },
      handleSizeChange: function (size) {
        this.pagesize = size;
        this.parameter = createParameter().Build(this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput, this.parameter.fieldList))
        this.parameter.sortObject.field = this.prop
        this.parameter.sortObject.orderDirection = this.orderDirection
        this.getObjectSynchronizationTasks(this.parameter, this.resType)
      },
      handleCurrentChange: function (currentPage) {
        this.currentPage = currentPage
        this.parameter = this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput, this.parameter.fieldList)
        this.parameter.sortObject.field = this.prop
        this.parameter.sortObject.orderDirection = this.orderDirection
        this.getObjectSynchronizationTasks(this.parameter, this.resType)
      },
      handleSelectionChange: function handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //根据不同的字段进行筛选过滤
      srcOption: function (type, remove) {
        var that = this;
        that.currentPage = 1
//                //根据不同字段进行删除
        var len = that.parameter.fieldList ? that.parameter.fieldList.length : 0;
        var tmpField = that.parameter.fieldList ? that.parameter.fieldList.slice(0) : {};
        if (!remove) {
          for (var i = 0; i < len; i++) {
            if (type === 'srcTrigger' && tmpField[i].fieldName === 'trigger') {
              var l = that.parameter.fieldList.indexOf(tmpField[i])
              if (l > -1) {
                that.parameter.fieldList.splice(l, 1)
              }
            } else if (type === 'srcStatus' && tmpField[i].fieldName === 'status') {
              var l = that.parameter.fieldList.indexOf(tmpField[i])
              if (l > -1) {
                that.parameter.fieldList.splice(l, 1)
              }
            } else if (type === 'srcLastExecuteStatus' && tmpField[i].fieldName === 'lastExecuteStatus') {
              var l = that.parameter.fieldList.indexOf(tmpField[i])
              if (l > -1) {
                that.parameter.fieldList.splice(l, 1)
              }
            }
          }
        } else {
          //如果是两个参数，删除一个，另一个也没有用了
          var trigger = []
          var status = []
          var lastExecuteStatus = []
          for (var i = 0; i < len; i++) {
            if (that.parameter.fieldList[i].fieldName === 'trigger') {
              trigger.push(that.parameter.fieldList[i])
            } else if (that.parameter.fieldList[i].fieldName === 'status') {
              status.push(that.parameter.fieldList[i])
            } else if (that.parameter.fieldList[i].fieldName === 'lastExecuteStatus') {
              lastExecuteStatus.push(that.parameter.fieldList[i])
            }
          }
          if (type === 'srcTrigger') {
            trigger = []
          } else if (type === 'srcStatus') {
            status = []
          } else if (type === 'srcLastExecuteStatus') {
            lastExecuteStatus = []
          }
          that.parameter.fieldList = [].concat(trigger, status, lastExecuteStatus)
        }
        //根据某个字段拼成query参数
        if (type === 'srcTrigger') {
          if (that.srcTrigger === '单次执行') {
            that.parameter = createParameter("trigger", '', "EQUAL").Build(that.parameter);
          } else if (that.srcTrigger === '周期执行') {
            that.parameter = createParameter("trigger", '', "NOT_EQUAL").Build(that.parameter);
          }
        } else if (type === 'srcStatus') {
          if (that.srcStatus.length === 1) {
            if (that.srcStatus[0] === '已创建') {
              that.parameter = createParameter("status", '0', "EQUAL").Build(that.parameter);
            } else if (that.srcStatus[0] === '已部署') {
              that.parameter = createParameter("status", '1', "EQUAL").Build(that.parameter);
            } else if (that.srcStatus[0] === '已停止') {
              that.parameter = createParameter("status", '2', "EQUAL").Build(that.parameter);
            } else if (that.srcStatus[0] === '错 误') {
              that.parameter = createParameter("status", '-1', "EQUAL").Build(that.parameter);
            } else if (that.srcStatus[0] === '未知') {
              that.parameter = createParameter("status", '-2', "EQUAL").Build(that.parameter);
            }
          } else if (that.srcStatus.length > 1) {
            //根据选择的数据获取不需要的数据
            var tmpStatusArr = ['已创建', '已部署', '已停止', '错 误', '未知'];
            var statusArr = ['已创建', '已部署', '已停止', '错 误', '未知'];
            for (var i = 0; i < statusArr.length; i++) {
              for (var j = 0; j < that.srcStatus.length; j++) {
                if (statusArr[i] === that.srcStatus[j]) {
                  tmpStatusArr.splice(tmpStatusArr.indexOf(statusArr[i]), 1)
                }
              }
            }
            //将不需要的数据变成过滤条件
            for (var i = 0; i < tmpStatusArr.length; i++) {
              if (tmpStatusArr[i] === '已创建') {
                that.parameter = createParameter("status", '0', "NOT_EQUAL").Build(that.parameter);
              } else if (tmpStatusArr[i] === '已部署') {
                that.parameter = createParameter("status", '1', "NOT_EQUAL").Build(that.parameter);
              } else if (tmpStatusArr[i] === '已停止') {
                that.parameter = createParameter("status", '2', "NOT_EQUAL").Build(that.parameter);
              } else if (tmpStatusArr[i] === '错 误') {
                that.parameter = createParameter("status", '-1', "NOT_EQUAL").Build(that.parameter);
              } else if (tmpStatusArr[i] === '未知') {
                that.parameter = createParameter("status", '-2', "NOT_EQUAL").Build(that.parameter);
              }
            }
          }
        } else if (type === 'srcLastExecuteStatus') {
          if (that.srcLastExecuteStatus.length === 1) {
            if (that.srcLastExecuteStatus[0] === '创建') {
              that.parameter = createParameter("lastExecuteStatus", '0', "EQUAL").Build(that.parameter);
            } else if (that.srcLastExecuteStatus[0] === '运行中') {
              that.parameter = createParameter("lastExecuteStatus", '1', "EQUAL").Build(that.parameter);
            } else if (that.srcLastExecuteStatus[0] === '完成') {
              that.parameter = createParameter("lastExecuteStatus", '2', "EQUAL").Build(that.parameter);
            } else if (that.srcLastExecuteStatus[0] === '失败') {
              that.parameter = createParameter("lastExecuteStatus", '-1', "EQUAL").Build(that.parameter);
            } else if (that.srcLastExecuteStatus[0] === '未知') {
              that.parameter = createParameter("lastExecuteStatus", '-2', "EQUAL").Build(that.parameter);
            }
          } else if (that.srcLastExecuteStatus.length > 1) {
            //根据选择的数据获取不需要的数据
            var tmpStatusArr = ['创建', '运行中', '完成', '失败', '未知'];
            var statusArr = ['创建', '运行中', '完成', '失败', '未知'];
            for (var i = 0; i < statusArr.length; i++) {
              for (var j = 0; j < that.srcLastExecuteStatus.length; j++) {
                if (statusArr[i] === that.srcLastExecuteStatus[j]) {
                  tmpStatusArr.splice(tmpStatusArr.indexOf(statusArr[i]), 1)
                }
              }
            }
            //将不需要的数据变成过滤条件
            for (var i = 0; i < tmpStatusArr.length; i++) {
              if (tmpStatusArr[i] === '创建') {
                that.parameter = createParameter("lastExecuteStatus", '0', "NOT_EQUAL").Build(that.parameter);
              } else if (tmpStatusArr[i] === '运行中') {
                that.parameter = createParameter("lastExecuteStatus", '1', "NOT_EQUAL").Build(that.parameter);
              } else if (tmpStatusArr[i] === '完成') {
                that.parameter = createParameter("lastExecuteStatus", '2', "NOT_EQUAL").Build(that.parameter);
              } else if (tmpStatusArr[i] === '失败') {
                that.parameter = createParameter("lastExecuteStatus", '-1', "NOT_EQUAL").Build(that.parameter);
              } else if (tmpStatusArr[i] === '未知') {
                that.parameter = createParameter("lastExecuteStatus", '-2', "NOT_EQUAL").Build(that.parameter);
              }
            }
          }
        }
        that.parameter.fieldList = that.parameter.fieldList ? that.parameter.fieldList : []
        that.searchListTable()
      },
      //新建任务
      newTask: function () {
        var that = this;
        //添加复制标识变量
        localStorage.taskEntity = JSON.stringify({isCopy: undefined});
        that.$router.push({path: '/objectTask/add'})
      },
      //复制任务
      copyTask: function () {
        var that = this;
        //添加一个判断是不是复制的字段
        that.multipleSelection[0].isCopy = true
        //获取row内容放入localStorage
        localStorage.taskEntity = JSON.stringify(this.multipleSelection[0]);
        that.$router.push({path: '/objectTask/add'})
      },
      //编辑任务
      editTask: function () {
        //添加一个判断是不是复制的字段
        this.multipleSelection[0].isCopy = true
        //添加一个jobId
        this.multipleSelection[0].jobId = this.multipleSelection[0].id
        //获取row内容放入localStorage
        localStorage.taskEntity = JSON.stringify(this.multipleSelection[0]);
        this.$router.push({path: '/objectTask/add'})
      },
      //table查询的列表
      searchListTable: function (parameter, type, startTime, endTime, searchInput, pagesize) {
        var that = this;
        that.currentPage = 1
        if (pagesize) that.pagesize = pagesize;
        that.startTime = startTime;
        that.endTime = endTime;
        if (searchInput != undefined) that.searchInput = searchInput;
        var len = that.parameter.fieldList ? that.parameter.fieldList.length : 0;
        var tmpField = that.parameter.fieldList ? that.parameter.fieldList.slice(0) : {}
        for (var i = 0; i < len; i++) {
          if (startTime !== 'undefined' && tmpField[i].fieldName === 'lastModifiedTime' && (tmpField[i].comparatorOperator == "GREATER_THAN" || tmpField[i].comparatorOperator == "LESS_THAN")) {
            var l = that.parameter.fieldList.indexOf(tmpField[i])
            if (l > -1) {
              that.parameter.fieldList.splice(l, 1)
            }
          } else if (searchInput != undefined && tmpField[i].fieldName === 'name') {
            var l = that.parameter.fieldList.indexOf(tmpField[i])
            if (l > -1) {
              that.parameter.fieldList.splice(l, 1)
            }
          }
        }
        that.parameter = that.buildParameters(that.pagesize, that.currentPage, that.startTime, that.endTime, that.searchInput, this.parameter.fieldList);
        this.parameter = createParameter().Sort(this.prop, this.orderDirection).Limit(that.pagesize).Build(that.parameter, false)
        this.getObjectSynchronizationTasks(that.parameter)
      },
//			获取同步任务列表
      getObjectSynchronizationTasks: function (para) {
        if (!para) {
          para = this.parameter
        }
        this.loading = true;
        getObjectSynchronizationTaskList(para).then((res) => {
            this.tableData = res;
            this.loading = false;
          }, err => {
            this.$message({
              message: err.response.message,
              type: 'error',
              duration: 1500
            });
          }
        );
      },
//			删除同步任务
      delTable: function delTable() {
        var that = this;
        var tbIds = [];
        this.multipleSelection.forEach(function (i, index) {
          var tdIds = i.id;
          tbIds.push(tdIds);
        });
        that.$confirm('真的要删除' + tbIds.length + '个数据导入任务?', '提示', {}).then(() => {
          deleteTasks(tbIds).then(data => {
              that.getObjectSynchronizationTasks(this.parameter);
              that.$message({
                message: '恭喜你，删除已成功！',
                type: 'success'
              });
            }, err => {
              this.$message({
                message: err.response.message,
                type: 'error',
                duration: 1500
              });
            }
          )
        }).catch(() => {

        });
      },

//			启用同步任务
      startTask: function () {
        if (this.multipleSelection) {
          var that = this;
          var tdIds = []
          this.multipleSelection.forEach(function (i) {
            tdIds.push(i.id);
          });
          startTasks(tdIds).then(data => {
              that.getObjectSynchronizationTasks(this.parameter);
              that.$message({
                message: '恭喜你，任务已启用！',
                type: 'success'
              });
            }, err => {
              this.$message({
                message: err.response.message,
                type: 'error',
                duration: 1500
              });
            }
          )
        }
      },
//			停用同步任务
      stopTask: function () {
        if (this.multipleSelection) {
          var that = this;
          var tdIds = []
          this.multipleSelection.forEach(function (i) {
            tdIds.push(i.id);
          });
          stopTasks(tdIds).then(data => {
              that.getObjectSynchronizationTasks(this.parameter);
              that.$message({
                message: '恭喜你，任务已停用！',
                type: 'success'
              });
            }, err => {
              this.$message({
                message: err.response.message,
                type: 'error',
                duration: 1500
              });
            }
          )
        }
      },
//			数据预览
      dataPreview: function (dataStoreId, tenantId) {
        this.$refs.dataset.dataPreview(dataStoreId, tenantId)
      },
//			name查看任务详情
      nameDialog: function (id) {
        this.$refs.taskName.nameDialog(id)
      },
//			datasource信息编辑
      datasourceDialog: function (dataStoreId) {
        this.dataStoreId = dataStoreId;
        this.isShowDialog = true;
      },
//			object编辑
      objectDialog: function (id, table) {
        this.$refs.object.objectDialog(id, table)
      },
//			列表排序
      getOrder: function (column) {
        var that = this
        if (column.order === 'ascending') {
          this.orderDirection = 'ASC'
        } else {
          this.orderDirection = 'DESC'
        }
        this.prop = column.prop
        if (column.prop === null) {
          this.prop = 'lastModifiedTime'
          return false
        }
        this.currentPage = 1
        that.parameter = createParameter().Limit(this.pagesize).Sort(column.prop, this.orderDirection).Build(that.parameter, false);
        that.getObjectSynchronizationTasks(that.parameter);
      }
    },
    mounted() {
      var that = this;
      that.parameter = that.buildParameters(that.pagesize, that.currentPage, that.startTime, that.endTime, that.searchInput);
      that.getObjectSynchronizationTasks(that.parameter);
      //接受task提交之后的列表页刷新
      task.$on('refreshObjectSynchronizationList', function () {
        that.getObjectSynchronizationTasks();
      })
    },
    watch: {
      '$route'(to, from) {
        var that = this;
        that.parameter = that.buildParameters(that.pagesize, that.currentPage, that.startTime, that.endTime, that.searchInput, this.parameter.fieldList);
        //如果是执行列表返回就刷新列表
        if (from.name == "执行列表")
          that.getObjectSynchronizationTasks();
      }
    }
  };

</script>

<style lang="scss" scoped>
  .con-module {
    padding: 20px;
  }

  .con-module .el-row {
    float: left;
    width: 100%;
  }

  .con-module .el-row .el-button i {
    font-size: 13px;
  }

  .el-table {
    float: left;
  }

  .tpAddrl {
    color: #FFFFFF;
    margin-right: 0px;
    text-decoration: none;
  }

  .copy-button {
    margin-left: 10px;
    margin-right: 10px;
    font-size: 16px;
  }

  .ers-pattern {
    float: left;
    height: 40px;
    line-height: 40px;
    margin-right: 10px;
  }

  .ers-pattern-col {
    margin-left: 10px;
  }

  .ers-pattern h4 {
    margin: 0px;
    float: left;
  }

  .ers-pattern .el-select {
    float: left;
    margin-left: 10px;
  }

  .dialog-preview {
    background-color: #23b8a1;
  }

  dialog-preview-title {
    background-color: #000000;
    color: #ffffff;
  }

  .dialog-header {
    font-size: 20px;
    font-weight: 100
  }

  .dialog-body {
    width: 100%;
    margin-top: -15px;
    margin-bottom: 15px;
    max-height: 500px;
  }

  .synchronizationsBox {
    .btn-right {
      float: right;
      /*margin-right: 20px;*/
    }
  }

  .btnLeft {
    /*padding-left: 125px;*/
  }
</style>
