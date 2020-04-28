<template>
    <!--name dialog-->
    <el-dialog
      :visible.sync="dialogNameVisible"
      width="80%"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      title="同步任务信息"
      custom-class="redialogClass"
    >
        <el-carousel :interval="5000" height="calc(80vh - 78px)" arrow="always" :autoplay=false type="card"
                     class="boxEl">
            <el-carousel-item>
                <div class="name_div">
                    <h3>任务详情</h3>
                    <el-form id="bm-collectorname-form" class="form-border" :model="taskEntity">
                        <el-form-item label="任务名称" prop="name" :label-width="formLabelWidth">
                            <el-input v-model="taskEntity.name" auto-complete="off" disabled></el-input>
                        </el-form-item>

                        <el-form-item label="周期" :label-width="formLabelWidth"
                                      v-if="taskEntity.dataSource && taskEntity.dataSource.type != 'SOCKET'">
                            <el-input v-model="trigger" auto-complete="off" name="trigger"
                                      id="trigger" :readonly=true disabled></el-input>
                        </el-form-item>

                        <el-form-item label="增量字段" prop="cursorCol" :label-width="formLabelWidth"
                                      v-if="taskEntity.trigger && taskEntity.dataSource.type != 'SOCKET'">
                            <el-input v-model="taskEntity.cursorCol" auto-complete="off" name="cursorCol" id="cursorCol"
                                      :readonly=true disabled></el-input>
                        </el-form-item>
                        <div v-if="isNotObject">
                            <el-form-item label="分区键" prop="partitionKey" :label-width="formLabelWidth">
                                <el-input v-model="taskEntity.partitionKey" auto-complete="off" id="partitionKey"
                                          name="partitionKey" :readonly=true disabled></el-input>
                            </el-form-item>

                            <el-form-item label="分区键格式" prop="partitionPattern" :label-width="formLabelWidth" v-if="isDate">
                                <el-input v-model="taskEntity.partitionPattern" auto-complete="off" name="errorNumber"
                                          :readonly=true disabled placeholder="yyyy-mm-dd"></el-input>
                            </el-form-item>

                            <el-form-item label="并行度" prop="parallelism" :label-width="formLabelWidth">
                                <el-input v-model="taskEntity.parallelism" auto-complete="off" id="parallelism"
                                          name="parallelism" :readonly=true disabled></el-input>
                            </el-form-item>

                            <el-form-item label="错误记录上限数" prop="errorNumber" :label-width="formLabelWidth">
                                <el-input v-model="taskEntity.errorNumber" auto-complete="off" id="errorNumber"
                                          name="errorNumber" :readonly=true disabled></el-input>
                            </el-form-item>
                            <el-form-item label="Schema变动" prop="stopOnSchemaChanged" :label-width="formLabelWidth"
                                          v-if="!CollectorID">
                                <el-input v-model="taskEntity.stopOnSchemaChanged" auto-complete="off"
                                          id="stopOnSchemaChanged" name="stopOnSchemaChanged" :readonly=true
                                          disabled></el-input>
                            </el-form-item>

                            <el-form-item label="执行参数" prop="opts" :label-width="formLabelWidth">
                                <el-input v-model="taskEntity.opts" auto-complete="off" id="opts" name="opts" :readonly=true
                                          disabled></el-input>
                            </el-form-item>

                            <el-form-item label="缓冲区大小" prop="bufferSize" :label-width="formLabelWidth">
                                <el-input v-model="taskEntity.bufferSize" auto-complete="off" id="bufferSize"
                                          name="bufferSize" :readonly=true disabled></el-input>
                            </el-form-item>

                            <el-form-item label="延时刷出时间" prop="flushPaddingTime" :label-width="formLabelWidth">
                                <el-input v-model="taskEntity.flushPaddingTime" auto-complete="off" id="flushPaddingTime"
                                          name="flushPaddingTime" :readonly=true disabled></el-input>
                            </el-form-item>
                        </div>


                    </el-form>
                </div>
            </el-carousel-item>
            <el-carousel-item v-if="fieldMapping">
                <div class="name_div">
                    <h3>字段映射</h3>
                    <el-table :data="fieldMapping"
                              tooltip-effect="dark"
                              class="table-border">

                        <el-table-column label="数据源表" prop="sourceField">
                        </el-table-column>
                        <!--<el-table-column   >-->
                        <!--<span style="font-size:30px;color:#00BFFF ;text-align:center" >&harr;</span>-->
                        <!--</el-table-column>-->

                        <el-table-column label="数据集表" prop="targetField">
                        </el-table-column>

                        <el-table-column label="脱敏规则" prop="encrypt">
                        </el-table-column>
                    </el-table>
                </div>
            </el-carousel-item>
            <el-carousel-item>
                <div class="name_div">
                    <h3>数据源</h3>
                    <el-form class="form-border" id="bm-collectorname-datasol-form">
                        <el-form-item
                          :label-width="formLabelWidth"
                          v-for="(item, index) in dataSource"
                          :key="item.name"
                          :label="item.name | res"
                          v-if="item.value!==''"
                          :prop="'dataSource.' + index + '.value'">
                            <el-input v-model="item.value" auto-complete="off" id="'dataSource.' + index + '.value'"
                                      name="item.name" :readonly=true disabled></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </el-carousel-item>
            <el-carousel-item v-if="isNotObject">
                <div class="name_div">
                    <h3>数据集</h3>
                    <el-form class="form-border" id="bm-collectorname-dataset-form">
                        <el-form-item
                          :label-width="formLabelWidth"
                          v-for="(item, index) in dataStore"
                          :key="item.name"
                          :label="item.name | res"
                          v-if="item.value"
                          :prop="'dataStore.' + index + '.value'">
                            <el-input v-model="item.value" auto-complete="off" id="'dataStore.' + index + '.value'"
                                      name="item.name" :readonly=true disabled></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </el-carousel-item>
        </el-carousel>
    </el-dialog>
</template>

<script>
    import {getTaskJson} from '@api'
    import cronstrue from 'cronstrue';

    export default {
        name: 'previewTaskName',
        component:{
            cronstrue
        },
        data() {
            return {
                trigger: '',
                dialogNameVisible: false,
                taskEntity: {},
                formLabelWidth: "",
                isDate: "",
                CollectorID: "false",
                dataSource: [],
                dataStore: [],
                fieldMapping: [],
                statusType: "",
                isSeparator: "",
                isNotObject:false
            }
        },
        methods: {
//			数据预览 taskName
            nameDialog: function (id, collectorId) {
//				获取task的entity
                getTaskJson(id).then((res) => {
                      this.taskEntity = {};
                      this.taskEntity = res
//					datasource部分赋值
                      this.dataSource = [];
                      var objSource = this.taskEntity.dataSource;
                      if (objSource.operateType == 0) {
                          delete objSource.regex;
                      }
                      for (var key in objSource) {
                          if (key != 'properties' && key != 'operateType')
                              this.dataSource.push({name: key, value: objSource[key]})

                          if (key == 'operateType') {
                              var operateType = objSource[key] == 0 ? '原样' : objSource[key] == 1 ? '抽取' : objSource[key] == 2 ? '分割' : '过滤'
                              this.dataSource.push({name: "operateType", value: operateType})
                          }
                      }
//					datastore部分赋值
                      this.dataStore = [];
                      var objStore = this.taskEntity.dataStore;
                      this.isNotObject = this.taskEntity.type == "ObjectSyncTask" ? false : true
                      for (var key in objStore) {
                          if (key == 'mode') objStore.mode = objStore.mode == 'append' ? '追加' : '覆盖';
                          this.dataStore.push({name: key, value: objStore[key]})
                      }
//                    fieldMapping部分赋值
                      this.fieldMapping = this.taskEntity.fieldMapping
                      for (var j = 0; j < this.fieldMapping && this.fieldMapping.length; j++) {
                          if (this.fieldMapping[j].encrypt === "MIX") {
                              this.fieldMapping[j].encrypt = "用*隐藏"
                          } else if (this.fieldMapping[j].encrypt === "BLANK") {
                              this.fieldMapping[j].encrypt = "去除数据"
                          }
                      }
//					特殊字段显示赋值
                      if (this.taskEntity.partitionPattern != "")
                          this.isDate = true;
                      this.statusType = (objSource.type == 'JDBC') ? 'DB' : objSource.type;
                      if (this.taskEntity.stopOnSchemaChanged === false) {
                          this.taskEntity.stopOnSchemaChanged = "任务继续"
                      } else this.taskEntity.stopOnSchemaChanged = "任务停止"
                      this.isSeparator = objStore.format == "csv" ? true : false;
                      this.trigger = this.taskEntity.trigger ?cronstrue.toString(this.taskEntity.trigger):'单次执行'
                      this.CollectorID = !(collectorId && collectorId != 'CHEETAH-SERVER')
                      this.dialogNameVisible = true
                  }, err => {
                      this.$message({
                          message: err.response.message,
                          type: 'error',
                          duration: 1500
                      });
                  }
                )

            },
        },
        mounted() {
        }
    }
</script>

<style lang="scss" scoped>
    .boxEl {
        padding: 0px 0px 15px 15px;
        height: calc(80vh - 50px);
        overflow: hidden;
        overflow-y: auto;
    }

    .boxEl h3 {
        font-size: 16px;
        height: 35px;
        line-height: 35px;
    }

    .el-carousel__item h3 {
        color: #475669;
        font-size: 18px;
        opacity: 0.75;
        line-height: 40px;
        margin: 0;
    }

    .el-carousel__item:nth-child(n) {
        background-color: #ffffff;
        border: 1px solid #ccc;
        .name_div{
            height: 100%;
            overflow-y: auto;
            margin: 10px 10px 10px 10px;
        }
    }

</style>