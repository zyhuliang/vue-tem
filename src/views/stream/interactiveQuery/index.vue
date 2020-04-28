<template>
	<section class="interactiveQuery">
		<el-row class="btnClass xbtnClass">
			<div class="marTop">
				<el-input v-model="addForm.dataset" placeholder="请选择内容" class="input-with-select" disabled>
					<el-button slot="append" icon="icon iconfont icon-ir-search" @click="dataInquire"></el-button>
				</el-input>
        <div class="datasetName">
          <el-alert
            v-for="(item, index) in Object.keys(selectedDataset)" :key="item"
            :title="item"
            @close="closeDatasetName(item)"
            type="success">
            <el-tooltip class="item" effect="dark" content="复制" placement="top-start">
              <i class="el-icon-document" v-clipboard:copy="'`'+item +'`'"></i>
            </el-tooltip>
          </el-alert>
        </div>
				<!-- Dataset -->
				<el-dialog v-dialog-drag title="数据集查询" :visible.sync="dialogDataVisible"  :close-on-click-modal="false" :modal-append-to-body="false"  append-to-body custom-class="dialogClass">
					<el-form>
						<data-inquire @thisSelectDateVal="getSelectDateVal" :multipleTable="true"></data-inquire>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button type="primary" @click="submitData">确定</el-button>
						<el-button @click="dialogDataVisible = false">取消</el-button>
					</div>
				</el-dialog>
			</div>
		</el-row>
    <div class="queryContent">
      <div class="editor-box">
        <el-button type="primary" plain @click="checkSql" :disabled="checkSqlButton">检测</el-button>
        <el-button type="primary" plain @click="SelectTableNamedialog" :disabled="!Object.keys(selectedDataset).length">提示</el-button>
        <el-button type="primary" @click="terminationQuery" plain  :disabled="!checkSqlButton">终止查询</el-button>
        <el-button type="primary" plain @click="history">查看执行历史</el-button>
        <span class="timer">{{ `已经等待：${formatSeconds(timeMeter)}, 可以手动关闭`}}</span>
        <!-- sql 查询编辑器 -->
        <sql-editor @getValue="getValue" @methods="methods" :isUseTableName="true" :dictionaries="dictionaries" :sqlConfig="sqlConfig" :defaultsql="sqlValue"></sql-editor>
      </div>
      <!-- sql 查询结果 -->
      <div class="tableContent">
        <el-button icon="el-icon-caret-right" type="primary" plain @click="dialogVisualization = true">生成可视化图</el-button>
        <el-button icon="el-icon-caret-right" type="primary" plain @click="_exportCSV">导出 CSV</el-button>
        <el-button icon="el-icon-caret-right" type="primary" plain @click="_exportJSON">导出 JSON</el-button>
        <table-btn
            id="bm-hippo-visit-timeTop-btn"
            :columns="columns"
            :options="options"
            :list="list" >
        </table-btn>
      </div>
    </div>
    <!-- 输出日志 -->
      <el-card class="box-card card-height" shadow="never">
        <div slot="header" class="clearfix">
            <span>日志信息</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="isShowLog">{{ toggle ? '隐藏' : '显示'}}</el-button>
        </div>
        <div class="log">
            <div v-for="log in logContent"><pre>{{log}}</pre></div>
        </div>
      </el-card>
    <!-- 生成的折线图 -->
    <el-dialog v-dialog-drag title="可视化" :visible.sync="dialogVisualization" :modal-append-to-body="false" custom-class="dialogClass">
        <visualization :restaurants="columns" :tableData="list"></visualization>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary"  @click="dialogVisualization = false">确定</el-button>
        </div>
		</el-dialog>
     <!-- history -->
    <el-dialog v-dialog-drag title="执行历史" :visible.sync="dialogHistory" :modal-append-to-body="false" custom-class="dialogClass">
        <ul v-if="historyData.length !== 0">
          <li class="historyList" v-for="(item, index ) in historyData" :key="item.time">
            <el-input placeholder="请输入内容" v-model="item.sqlValue" disabled>
              <el-button slot="append" @click="userHistorySql(item, index)">使用sql</el-button>
            </el-input>
            <p>执行日期：{{item.time}}</p>
          </li>
        </ul>
        <p v-else>暂无历史记录</p>
		</el-dialog>
	</section>
</template>
<script>
    import moment from "moment"//时间格式化
    import dataInquire from '@components/dataSetInq/dataInquire.vue';
    // sql查询组件
    import sqlEditor from '@components/aceEditor/aceEditor'
    // 日志
    import logs from '@views/stream/interactiveQuery/log/log'
    // 列表
    import TableBtn from '@components/table/tableList-btn.vue'
  // 把秒转成 时分秒
    import {formatSeconds} from "@function/comFunction";
    // 可视化
    import Visualization from '@views/stream/interactiveQuery/visualization/visualization'
    import { getSchema, analyzeinit, analyzeresult, executeinit, executeresult, analyzeCancel } from '@api'
    export default {
        components: {dataInquire, sqlEditor, logs, TableBtn, Visualization},
        data() {
            return {
              toggle: '隐藏',
              formatSeconds: formatSeconds,
              logContent: [],  // 错误信息
              statementId: '',
              clusterId:'',
              dictionaries: {},
              sqlValue: '',
              sqlConfig: {
                height: '100%',
                loading: false
              }, // sql 编辑器默认值
              // 可视化是否显示
              dialogVisualization: false,
              historyData: [],
              dialogHistory: false,
              list: [],
              options: {
                height: window.innerHeight - 400
              },
              columns: [], // 需要展示的列
              getSelvalData:"",
              dataSetId:"",
              dialogDataVisible:false,
              multipleSelection: [],
              addForm: {
                  name: '',
                  dataset: '',
              },
              sqlFormatter: null,  // sql格式化
              SelectTableNamedialog: '', // sql 选择表名 和字段
              selectedDataset: {},
              timer: null, // 请求服务定时器指针
              timeMeter:0 , // 计时器
              timer2: null,  // 计时器指针
              checkSqlButton: false, // 检测按钮状态
              dialog: null, // 编辑器提示
              content: [],
              windowHeight: 0,
            }
        },
        methods: {
          // 下载 CSV
          _exportCSV () {
            this.exportCSV(this.list)
          },
          // 下载 JSON
          _exportJSON () {
            this.exportJSON(this.list)
          },
          // 获取 sql 编辑器的方法
          methods (sqlFormatter, dialog) {
            this.sqlFormatter = sqlFormatter
            this.SelectTableNamedialog = dialog;
          },
          // 获取 sql 编辑器 的内容
          getValue (val) {
            this.sqlValue = val
            this.dialogHistory = false
          },
          // 检测sql
          checkSql () {
            // 调用子组件的方法
            this.sqlFormatter()
            let curTime = moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss")
            if (!this.sqlValue) {
              return
            }
            this.historyData.unshift({sqlValue:  this.sqlValue, time: curTime, selectedDataset: this.selectedDataset})
            try {
                localStorage.setItem('sqlHistoryData', JSON.stringify(this.historyData));
             } catch (e) {
                //如果存储满了,就全部删掉
                localStorage.clear();//全部删除
                localStorage.setItem('sqlHistoryData', JSON.stringify(this.historyData));
            }
            this.checkAadTable()
          },
          // 终止任务
          terminationQuery () {
              analyzeCancel(this.statementId,this.clusterId)
                .then( (res) => {
                  this.sqlConfig.loading = false
                  this.checkSqlButton = false
                  clearInterval(this.timer)
                  clearInterval(this.timer2)
                  this.timer = null
                  this.timer2 = null
                })
          },
          // 获取 sql 语句中包含的 id 存放在 ids 中
          getSqlIds () {
            let result = []
            let datasetName = Object.keys(this.selectedDataset)
            for (let index of datasetName) {
              // 定义匹配正则
              let reg = new RegExp(index, 'gim')
              // 如果包含 true
              if (this.sqlValue.match(reg)) {
                // 赋值给 总数据
                result.push(this.selectedDataset[index].id)
              }
            }
            return result
          },
          // 验证并且返回 table 头部信息
          checkAadTable () {
            this.sqlConfig.loading = true
            this.checkSqlButton = true
            this.timeMeter = 0
            this.timer2 = setInterval(() => {
              this.timeMeter++
            }, 1000)
            this.paramsData = {
              sql:  this.sqlValue,
              ids: this.getSqlIds().toString()  // 获取 sql 语句中包含的 id 存放在 ids 中
            }
            this._analyzeinit()
            // 通过 sql 查询需要 四次接口
          },
          // 第1次调用接口
          _analyzeinit () {
            analyzeinit(this.paramsData).then( (res) => {
              // 清空日志
              this.logContent = []
              this.statementId = res.statementId
              this.clusterId = res.clusterId
              this._analyzeresult()
            }, err => {
              this.sqlConfig.loading = false
              this.checkSqlButton = false
              clearTimeout(this.timer)
              clearInterval(this.timer2)
              this.sqlConfig.loading = false
              if (err.response.data.detailMsg === 'param sql and ids both can\'t be null.') {
                this.$message.error('请选择表名对应的数据集');
              } else {
                this.$message.error(err.response.data.detailMsg);
              }
            })
          },
          // 第2次调用接口
          _analyzeresult () {
            this.timer = setTimeout(() => {
              analyzeresult(this.statementId,this.clusterId)
                .then( (res) => {
                  if (res.statement === 'available' || res.statement === 'error' || res.statement === 'cancelled') {
                    this.content = res.content
                    clearTimeout(this.timer)
                    this.getColumns(this.content)
                    this._executeinit()
                  } else {
                    // 轮询
                    this._analyzeresult (this.statementId,this.clusterId)
                  }
                }, err => {
                    this.logContent = err.response.data.errorlog
                    clearTimeout(this.timer)
                    clearInterval(this.timer2)
                    this.checkSqlButton = false
                    this.sqlConfig.loading = false
                })
              }, 1000)
          },
          // 第3次调用接口
          _executeinit() {
            executeinit(this.paramsData)
              .then((res)=>{
                this.statementId = res.statementId
                this.clusterId = res.clusterId
                this._executeresult(this.statementId,this.clusterId)
              })
              .catch( (err) => {
                this.$message.error(err.response.data.detailMsg);
                clearTimeout(this.timer)
                clearInterval(this.timer2)
                this.checkSqlButton = false
                this.sqlConfig.loading = false
              })
          },
          // 第4次调用接口
          _executeresult (statementId, clusterId) {
              this.timer = setTimeout(() => {
                executeresult(statementId,clusterId, this.content)
                  .then( (res) => {
                      this.list = res.content ? res.content : []
                      if (res.content) {
                        // 需要在最后一步清楚 计时器 定时器
                        clearTimeout(this.timer)
                        clearInterval(this.timer2)
                        this.checkSqlButton = false
                        this.sqlConfig.loading = false
                      } else {
                        // 轮询
                        this._executeresult(this.statementId,this.clusterId)
                      }
                  })
                  .catch( (err) => {
                      this.logContent = err.response.data.errorlog
                      clearTimeout(this.timer)
                      clearInterval(this.timer2)
                      this.checkSqlButton = false
                      this.sqlConfig.loading = false
                  })
                }, 1000)
          },
          getColumns (columns) {
            if (!columns) {
              return
            }
            this.columns = []
            // 生成可视化需要的数据格式
            for (let value of columns) {
              this.columns.push({
                prop: value.alias,
                label: value.alias,
                value: value.alias
              })
            }
          },
          // 执行历史 的sql 语句
          history () {
            this.historyData = JSON.parse(window.localStorage.getItem('sqlHistoryData'))
            this.dialogHistory = true
            let localStorage = window.localStorage.getItem('sqlHistoryData')
            if (!localStorage) {
              this.historyData = []
              return
            }
          },
          //data查询
          dataInquire:function () {
              //弹出"data查询"层
              this.dialogDataVisible = true;
          },
          //获取子组件的data
          getSelectDateVal(data){
            this.getSelvalData = data
          },
          // 获取 schema 字段
          getschema (schemaId, callback) {
            let schema= []
            getSchema(schemaId).then((schemaEntity) => {
              for (let index in schemaEntity.fields) {
                schema.push(schemaEntity.fields[index].name)
              }
              callback(schema)
            }, error => {
               this.$message.error('获取 表字段（schema）失败');
            })
          },
          // 获取到 子组件的 数据之后 拼装 sql 编辑器智能提示 需要的字段
          getDictionaries () {
            this.dictionaries = {}
            let dictionaries = []
            let datasetName = Object.keys(this.selectedDataset)
            for (let index of datasetName) {
              this.getschema(this.selectedDataset[index].schemaId, (val) => {
                let tmp = new Object()
                tmp.schemas = val
                this.$set(this.dictionaries,index, tmp )
              })
            }
          },
          submitData:function () {
          //data查询数据提交
              let data = this.getSelvalData;
              for (let index in data) {
                this.selectedDataset[data[index].name] = {
                  id: data[index].id,
                  schemaId: data[index].schemaId || data[index].schema.id
                }
              }
              this.getDictionaries()
              this.dialogDataVisible = false;
              // 从新获取高度
              this.selfAdaption()
          },
          selfAdaption () {
              if (!this.toggle) {
              // 从新获取高度
              this.$nextTick( () => {
                $('.card-height').height(50)
                let autoHeight = this.windowHeight - (60+ $('.marTop').height())
                $('.queryContent').height(autoHeight)
                this.options.height = autoHeight - 50
              })
            } else {
              this.$nextTick( () => {
                $('.card-height').height(250)
                let autoHeight = this.windowHeight - (270+ $('.marTop').height())
                $('.queryContent').height(autoHeight)
                this.options.height = autoHeight - 50
              })
            }
          },
          // 删除 上栏的  datasetName
          closeDatasetName (item) {
            this.$delete(this.selectedDataset, item)
            // 删除之后从新获取数据
            this.$delete(this.dictionaries, item)
            this.selfAdaption()
          },
          // 使用历史记录
          userHistorySql (item, index) {
            this.sqlValue = item.sqlValue
            this.selectedDataset = Object.assign(this.selectedDataset, this.historyData[index].selectedDataset);
            this.dialogHistory = true
          },
          isShowLog () {
            this.toggle = !this.toggle
            this.selfAdaption()
          }
        },
        mounted() {
          this.windowHeight = $('.interactiveQuery').height()
        }
    };

</script>

<style lang="scss" scoped>
.el-icon-document{
  margin: 0 5px;
}
.timer{
  color: #409EFF
}
.editor-box{
  width: 40%;
  .ace{
      height: calc(100% - 50px);
  }
}
.interactiveQuery{
  height: 100%;
  .input-with-select{
    width: 300px;
  }
  .queryContent{
    height: calc(100vh - 350px);
    display: flex;
  }
  .tableContent{
    width: 60%;
  }
}
	.xbtnClass{
		z-index: 98;
	}
  .historyList{
    border: 1px solid #f0f0f0;
    padding: 20px 40px;
    margin: 20px 10px;
    p{
      margin-top: 15px;
    }
  }
  .el-dialog__footer{
    bottom: none;
  }
  .datasetName{
    display: flex;
    flex-wrap: wrap;
    margin-top: 5px;
    .el-alert{
      width: auto;
      margin: 15px 30px 5px 0;
    }
  }
    .card-height{
    height: 250px;
    overflow: hidden;
    .clearfix{
        span, .el-button{
            color: #666;
        }
    }
    .log{
        overflow-y: auto;
        height: 170px;
    }
    .button-color{
        float: right;
        color: #fff;
    }
  }
</style>
