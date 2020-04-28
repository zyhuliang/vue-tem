<template>
    <div id="bm-ch-col-metaDataSyn-tmp">
        <!--数据集设置 dialog-->
        <el-dialog
                :visible.sync="dialogsetVisible"
                :close-on-click-modal="false"
                width="60%"
                :modal-append-to-body="false"
                title="设置元数据同步的数据集参数"
        >
            <el-form :model="form" id="bm-ch-col-metaDataSyn-set-form">

                <el-form-item label="type" :label-width="formLabelWidth">
                    <el-input name="bm-ch-col-dataStore-type-input" v-model="form.dataStore.type" auto-complete="off"
                              :disabled="true"></el-input>
                </el-form-item>

                <el-form-item label="path" :label-width="formLabelWidth">
                    <el-input name="bm-ch-col-dataStore-path-input" v-model="form.dataStore.path" auto-complete="off"
                              :disabled="form.useSystemStore"></el-input>
                </el-form-item>

                <el-form-item label="format" :label-width="formLabelWidth">
                    <el-select name="bm-ch-col-dataStore-format-select" v-model="form.dataStore.format"
                               :disabled="form.useSystemStore">
                        <el-option
                                v-for="item in [{name:'csv',value:'csv'},{ name:'parquet',value:'parquet'}]"
                                :key="item.name"
                                :name="item.name"
                                :label="item.value | cn"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="separator" :label-width="formLabelWidth">
                    <el-input name="bm-ch-col-dataStore-separator-input" v-model="form.dataStore.separator"
                              auto-complete="off" :disabled="form.useSystemStore"></el-input>
                </el-form-item>

                <el-form-item :label="'dataset存放位置'| cn" :label-width="formLabelWidth">
                    <el-input placeholder="不填为默认路径（同步成功后，请为用户分配此目录权限！）" :value="form.dataStore.dataResource" name="dataset存放位置"
                              :disabled="form.useSystemStore"
                              class="input-form-width">
                        <el-button slot="append" icon="icon iconfont icon-ir-search"
                                   @click="dialogDataSetTreeVisible=true" name="datasetTree"></el-button>
                    </el-input>
                </el-form-item>

                <el-form-item :label="'schema存放位置'| cn" :label-width="formLabelWidth">
                    <el-input placeholder="不填为默认路径（同步成功后，请为用户分配此目录权限！）" name="schema存放位置" :value="form.dataStore.schemaResource"
                              :disabled="form.useSystemStore"
                              class="input-form-width">
                        <el-button slot="append" icon="icon iconfont icon-ir-search"
                                   @click="dialogSchemaTreeVisible=true" name="schemaTree"></el-button>
                    </el-input>
                </el-form-item>

                <el-form-item label="clusterId" :label-width="formLabelWidth">
                    <el-select name="bm-ch-col-dataStore-format-select" v-model="form.dataStore.clusterId">
                        <el-option
                                v-for="item in selectCluster"
                                :key="item.id"
                                :name="item.name"
                                :label="item.name | cn"
                                :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="sliceTime" :label-width="formLabelWidth">
                    <el-input name="bm-ch-col-dataStore-type-input" v-model="form.dataStore.sliceTime"
                              auto-complete="off"
                              :disabled="form.useSystemStore"></el-input>
                </el-form-item>

                <el-form-item label="使用默认存储配置" :label-width="formLabelWidth">
                    <el-switch name="bm-ch-col-dataStore-useSystemStore-switch"
                               v-model="form.useSystemStore">
                    </el-switch>
                </el-form-item>

            </el-form>
            <div slot="footer">
                <el-button name="bm-ch-col-dataStore-submitDatasetPara-button" type="primary"
                           @click="submitDatasetPara">同步
                </el-button>
                <el-button name="bm-ch-col-dataStore-useSystemStore-button" @click="dialogsetVisible = false">取消
                </el-button>
            </div>
        </el-dialog>
        <!-- 数据集路径保存 -->
        <el-dialog
                :visible.sync="dialogDataSetTreeVisible"
                :close-on-click-modal="false"
                :before-close="closeProgress"
                :modal-append-to-body="false"
                name="bm-ch-col-dataStore-dataset-tree-dialog"
                title="DataSet Tree 查询">
            <div class="diContent">
                <el-form id="bm-schematree1-form" class="elForm" label-width="80px">
                    <dataset-tree class="elFormSelect" ref="datasettree"></dataset-tree>
                </el-form>
            </div>
            <div slot="footer" class="diFooter">
                <el-button type="primary" @click="submitDataSetTree" name="sure">确定</el-button>
                <el-button @click="dialogDataSetTreeVisible = false" name="cancel">取消</el-button>
            </div>
        </el-dialog>
        <!-- schame 路径保存 -->
        <el-dialog
                :visible.sync="dialogSchemaTreeVisible"
                :close-on-click-modal="false"
                :before-close="closeProgress"
                :modal-append-to-body="false"
                name="bm-ch-col-dataStore-schema-tree-dialog"
                title="DataSet Tree 查询">
            <div class="diContent">
                <el-form id="bm-schematree2-form" class="elForm" label-width="80px">
                    <schema-tree class="elFormSelect" ref="schematree"></schema-tree>
                </el-form>
            </div>
            <div slot="footer" class="diFooter">
                <el-button type="primary" @click="submitschemaTree" name="schemaTree-sure">确定</el-button>
                <el-button @click="dialogSchemaTreeVisible = false" name="schemaTree-cancel">取消</el-button>
            </div>
        </el-dialog>
        <!--进度日志 dialog-->
        <el-dialog
                :visible.sync="dialogProgressVisible"
                :close-on-click-modal="false"
                :before-close="closeProgress"
                :modal-append-to-body="false"
                width="60%"
                name="bm-ch-col-dataStore-log-dialog"
                title="同步进度展示">
            <div>
                <!--日志页面-->
                <div class="meta-task-log">
                    <div v-for="log in logs">
                        <div v-html="log" class="log-style"></div>
                    </div>
                </div>
                <!--进度条-->
                <div>
                    <el-progress name="bm-ch-col-dataStore-log-progress" :text-inside="true" :stroke-width="18"
                                 :percentage="progressValue"></el-progress>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  import {DBLinkTest, metaFeth, getMateDataSynLog, getMateDataSynProgress} from '@api'
  import {clusterAll} from '@/api/cluster/index.js'
  import datasetTree from '@components/datasetTree/datasetTree.vue';
  import schemaTree from '@components/schemaTree/schemaTree.vue';
  export default {
    props: ['collectorId'],
    name: 'setMateData',
    components: {
      datasetTree,
      schemaTree,
    },
    data() {
      return {
        dialogDataSetTreeVisible: false,
        dialogSchemaTreeVisible: false,
        taskId: '',
        logs: [],
        progressValue: 0,
        dialogsetVisible: false,
        dialogProgressVisible: false,
        formLabelWidth: "200px",
        selectCluster:[],
        form: {
          dataStore: {
            path: '',
            format: 'csv',
            separator: ',',
            type: 'HDFS',
            dataResource: '',
            datasetResourceId: '',
            schemaResource: '',
            schemaResourceId: '',
            sliceTime: '',
            clusterId:''
          }
        }
      }
    },
    methods: {
      creat(){
        clusterAll().then(res=>{
          this.selectCluster = res.data
          this.selectCluster.push({name:'',id:''})
        })
      },
      //选择dataset tree
      submitDataSetTree() {
        this.dialogDataSetTreeVisible = false
        //获取schema的node
        var datasetNode = this.$refs.datasettree.selectedNode;
        var that = this;
        if (datasetNode === '') {
          that.$message({
            message: '请选择一个目录！',
            type: 'error'
          });
          return false;
        } else {
          that.form.dataStore.dataResource = datasetNode.path
          that.form.dataStore.datasetResourceId = datasetNode.id
          that.dialogSchemaTreeVisible = false;
        }
      },
      //选择schema tree
      submitschemaTree() {
        this.dialogSchemaTreeVisible = false
        //获取schema的node
        var schemaNode = this.$refs.schematree.selectedNode;
        var that = this;
        if (schemaNode === '') {
          that.$message({
            message: '请选择一个目录！',
            type: 'error'
          });
          return false;
        } else {
          that.form.dataStore.schemaResource = schemaNode.path
          that.form.dataStore.schemaResourceId = schemaNode.id
          that.dialogSchemaTreeVisible = false;
        }
      },
      //打开弹框
      formDialog: function (form) {
        this.creat()
        this.form = form;
        this.form.dataStore = form.dataStore;
        this.form.dataSource = form.dataSource;
        this.dialogsetVisible = true
      },
      //关闭进度和日志打印请求
      closeProgress: function () {
        this.$confirm('确认关闭', '提示', {}).then(() => {
          //关闭进度和日志打印框
          this.dialogProgressVisible = false;
          //删除请求
          clearInterval(this.referenceProgress);
          //刷新资源列表页面
          this.$router.go(0)
        }).catch(() => {
        });
      },
      //更新进度条和日志
      getProgressAndLog: function () {
        var that = this;
        //如果生成taskId,发送球球获取日志和进度条数据
        if (that.taskId) {
          //获取日志信息
          getMateDataSynLog(that.taskId).then((res) => {
            for (var i = 0; i < res.length; i++) {
              that.logs.push(res[i])
            }
          }, error => {
            var _this = this;
            if (error.response.status == 500) {
              _this.$message({
                message: error.response.data.err,
                type: 'warning'
              })
            }
          })
          //获取进度信息
          getMateDataSynProgress(that.taskId).then((res) => {
            //返回值换算成整数
            var val = Math.round(res.value);
            if (val == 100 || val == -1) {
              //停止请求,删除taskId
              delete that.taskId
            }
            //更新进度条数据
            that.progressValue = val
          }, error => {
            var _this = this;
            if (error.response.status == 500) {
              _this.$message({
                message: error.response.data.err,
                type: 'warning'
              })
            }
          })
        } else {
          return;
        }
      },
      //确定按钮
      submitDatasetPara: function () {
        var that = this;
        //检查对应的数据源是否可以连接
        metaFeth(that.collectorId, this.form).then(function (rest) {
          if (rest) {
            that.taskId = rest;
            that.$message({
              message: '元数据同步任务已提交！',
              type: 'success'
            })
            that.getProgressAndLog();
            //关闭数据集配置页面，打开进度日志弹框
            that.dialogsetVisible = false
            that.dialogProgressVisible = true
          }
        }, error => {
          var _this = this;
          if (error.response.status == 500) {
            _this.$message({
              message: error.response.data.err,
              type: 'warning'
            })
          }
        })

      }
    },
    mounted() {
      //每隔2000ms执行一次进度条查询请求
      this.referenceProgress = setInterval(this.getProgressAndLog, 2000);
      
    },
    beforeDestroy() {
      //切换页面时停止定时更新任务
      clearInterval(this.referenceProgress);
    },
  }
</script>

<style lang="scss" scoped>
    #bm-ch-col-metaDataSyn-set-form {
        .el-select {
            width: 100%;
        }
    }

    .meta-task-log {
        height: 500px;
        overflow-y: auto;
        margin-bottom: 20px;

        .log-style {
            font-size: 15px;
            line-height: 28px;
        }
    }
</style>
