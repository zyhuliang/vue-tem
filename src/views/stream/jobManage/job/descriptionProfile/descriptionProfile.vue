<template>
    <div class="description-profile">
        <el-tabs v-model="activeName">
            <el-tab-pane label="数据表描述" name="first">
                <el-table :data="entity.jobDesc.tableProfiles"
                          style="width: 100%"
                          id="bm-noteset-transform-table"
                          height="calc(100vh - 221px)">
                    <el-table-column align="center">
                        <template slot-scope="scope">
                            <el-card class="box-card">
                                <el-form :id="'bm-stream-tableProfiles-form'+scope.$index" class="table-profilesForm"
                                         :model="entity.jobDesc.tableProfiles[scope.$index].datase"
                                         status-icon
                                         ref="tableProfile"
                                         :inline="true"
                                         label-position="right">
                                    <el-form-item :label="'数据集' | cn" :label-width="formLabelWidth" :rules="[{ required: true, message: '请输入表名', trigger:  ['blur', 'change'] }]">
                                        <el-input placeholder="请选择内容"
                                                  class="input-form-width el-dataset-input-group" @input="dataSourceInquire(scope.$index)"
                                                  disabled v-model="entity.jobDesc.tableProfiles[scope.$index].dataset.name">
                                            <el-button slot="append" icon="icon iconfont icon-ir-search"
                                                       @click="dataSourceInquire(scope.$index)"></el-button>
                                        </el-input>
                                    </el-form-item>

                                    <el-form-item label="元数据" :label-width="formLabelWidth">
                                        <el-input name="bm-ch-tableProfiles-name-input" type="text"
                                                  v-model="entity.jobDesc.tableProfiles[scope.$index].schema.name"
                                                  disabled
                                                  class="input-form-width el-dataset-input-group"
                                                  auto-complete="off"></el-input>
                                    </el-form-item>

                                    <el-form-item label="表名" :label-width="formLabelWidth" :rules="[{ required: true, message: '请输入表名', trigger:  ['blur', 'change'] }]">
                                        <el-input name="bm-ch-tableProfiles-name-input" type="text"
                                                  v-model="entity.jobDesc.tableProfiles[scope.$index].tableName"
                                                  class="input-form-width el-dataset-input-group"
                                                  @change="changeTableName()"
                                                  auto-complete="off"></el-input>
                                    </el-form-item>

                                    <el-form-item label="表类型" :label-width="formLabelWidth">
                                        <el-select
                                                v-model="entity.jobDesc.tableProfiles[scope.$index].tableType"
                                                @change="tableTypeChange(entity.jobDesc.tableProfiles[scope.$index].tableType, scope.$index)"
                                                class="el-dataset-input-group"
                                                :name="'bm-ch-resourceMan-schema-schema-wholeLength-select'">
                                            <el-option v-for="(key) in tableTypes"
                                                       :key="key.value"
                                                       :name="key.value"
                                                       :label="key.label"
                                                       :value="key.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>

                                    <el-form-item label-width="0px">
                                        <el-tabs v-model="tableConfigActive[scope.$index]">
                                            <el-tab-pane label="表配置" name="tableConfig">
                                                <el-form :id="'bm-stream-tableConfig-form'+scope.$index" status-icon ref="tableConfigForm"
                                                         v-if="entity.jobDesc.tableProfiles[scope.$index].tableType == 'source'"
                                                         class="tableConfigForm "
                                                         :inline="true"
                                                         label-position="right">
                                                    <el-form-item label="分区键" :label-width="formLabelWidth">
                                                        <el-select multiple
                                                                   v-model="entity.jobDesc.tableProfiles[scope.$index].tableConfig.partitionKey"
                                                                   class="el-dataset-input-group"
                                                                   placeholder="请选择">
                                                            <el-option
                                                                    v-for="item in entity.jobDesc.tableProfiles[scope.$index].schema.fields"
                                                                    :key="item.name"
                                                                    :label="item.name"
                                                                    :value="item.name">
                                                            </el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                    <el-form-item label="时间列" :label-width="formLabelWidth">
                                                        <el-select
                                                                v-model="entity.jobDesc.tableProfiles[scope.$index].tableConfig.timeColumn"
                                                                class="el-dataset-input-group"
                                                                placeholder="请选择">
                                                            <el-option value="" label=""></el-option>
                                                            <el-option
                                                                    v-for="item in entity.jobDesc.tableProfiles[scope.$index].schema.fields"
                                                                    :key="item.name"
                                                                    :label="item.name"
                                                                    :value="item.name">
                                                            </el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                    <el-form-item label="时间格式" :label-width="formLabelWidth">
                                                        <el-input
                                                                v-model="entity.jobDesc.tableProfiles[scope.$index].tableConfig.timeFormat"
                                                                class="el-dataset-input-group"
                                                                placeholder="yyyyMMddHH"></el-input>
                                                    </el-form-item>
                                                </el-form>
                                                <el-form :id="'bm-stream-tableConfig-form'+scope.$index" status-icon ref="tableConfigForm"
                                                         v-if="entity.jobDesc.tableProfiles[scope.$index].tableType == 'result'"
                                                         class="tableConfigForm"
                                                         :inline="true"
                                                         label-position="right">
                                                    <el-form-item label="写入模式" :label-width="formLabelWidth">
                                                        <el-select
                                                                   v-model="entity.jobDesc.tableProfiles[scope.$index].tableConfig.writeMode"
                                                                   class="el-dataset-input-group"
                                                                   placeholder="请选择">
                                                            <el-option v-for="(key) in writeModes"
                                                                       :key="key.value"
                                                                       :name="key.value"
                                                                       :label="key.label"
                                                                       :value="key.value">
                                                            </el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </el-form>
                                            </el-tab-pane>
                                            <el-tab-pane label="数据集配置" name="dataConfig">
                                                <el-form
                                                         status-icon
                                                         ref="datasetConfigForm"
                                                         :inline="true"
                                                         class="datasetConfigForm"
                                                         label-position="right">
                                                    <el-form-item>
                                                        <template
                                                                v-for="(item,index) in entity.jobDesc.tableProfiles[scope.$index].datasetConfig">
                                                            <div class="field-grope">
                                                                <el-input :name="'name'+item.name+index"
                                                                          v-model="entity.jobDesc.tableProfiles[scope.$index].datasetConfig[index].name"
                                                                          :placeholder="'键名'"
                                                                          class="el-dataset-input-group-small"></el-input>
                                                                <el-input :name="'value'+item.name+index"
                                                                          v-model="entity.jobDesc.tableProfiles[scope.$index].datasetConfig[index].value"
                                                                          :placeholder="'键值'"
                                                                          class="el-dataset-input-group-small"></el-input>
                                                                <i :name="'value-delete-icon'+item.name+index"
                                                                   @click.prevent="removeDatasetConfig(scope.$index, index)"
                                                                   class="el-icon-delete"></i>
                                                                <i :name="'value-icon-add'+item.name+index"
                                                                   @click="addDatasetConfig(scope.$index, index)"
                                                                   class="el-icon-circle-plus-outline"></i>
                                                            </div>
                                                        </template>
                                                    </el-form-item>
                                                </el-form>
                                            </el-tab-pane>
                                        </el-tabs>
                                    </el-form-item>
                                </el-form>
                            </el-card>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" width="40" align="center">
                        <template slot-scope="scope" class="addOrDeleteButton">
                            <el-button type="danger" size="small" icon="el-icon-minus" circle plain style="padding: 5px; margin: 10px 0 0 0;" @click="removeTableProfiles(scope.$index)"></el-button>
                            <el-button type="primary" size="small" icon="el-icon-plus" circle plain style="padding: 5px; margin: 10px 0 0 0;" @click="addTableProfiles(scope.$index)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="自定义函数" name="second">
                <el-table :data="entity.jobDesc.udfs"
                          style="width: 100%;overflow-y: auto"
                          height="calc(100vh - 221px)"
                          id="bm-noteset-udfs-table">
                    <el-table-column align="center">
                        <template slot-scope="scope">
                            <el-card class="box-card">
                                <el-form :id="'bm-stream-udfs-form'+scope.$index" class="table-profilesForm"
                                         :model="entity.jobDesc.udfs[scope.$index]"
                                         status-icon
                                         ref="udfs"
                                         :inline="true"
                                         label-position="right">
                                    <el-form-item :label="'类型' | cn" :label-width="formLabelWidth">
                                        <el-select
                                                v-model="entity.jobDesc.udfs[scope.$index].type"
                                                class="el-dataset-input-group"
                                                @change="udfsChange(scope.$index)"
                                                :name="'bm-ch-resourceMan-schema-schema-wholeLength-select'">
                                            <el-option v-for="(key) in udfsTypes"
                                                       :key="key.value"
                                                       :name="key.value"
                                                       :label="key.label"
                                                       :value="key.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>

                                    <el-form-item label="名称" :label-width="formLabelWidth">
                                        <el-input name="bm-ch-udfs-name-input" type="text"
                                                  v-model="entity.jobDesc.udfs[scope.$index].name"
                                                  class="input-form-width el-dataset-input-group"
                                                  auto-complete="off"></el-input>
                                    </el-form-item>

                                    <el-form-item label="路径" :label-width="formLabelWidth">
                                        <el-input name="bm-ch-udfs-name-input" type="text"
                                                  v-model="entity.jobDesc.udfs[scope.$index].jarPath"
                                                  class="input-form-width el-dataset-input-group-big"
                                                  auto-complete="off"></el-input>
                                    </el-form-item>
                                    <el-form-item label="类全名" :label-width="formLabelWidth">
                                        <el-input name="bm-ch-udfs-name-input" type="text"
                                                  v-model="entity.jobDesc.udfs[scope.$index].clazz"
                                                  class="input-form-width el-dataset-input-group-big"
                                                  auto-complete="off"></el-input>
                                    </el-form-item>
                                    <el-form-item label="方法名" :label-width="formLabelWidth">
                                        <el-input name="bm-ch-udfs-name-input" type="text"
                                                  v-model="entity.jobDesc.udfs[scope.$index].method"
                                                  class="input-form-width el-dataset-input-group"
                                                  auto-complete="off"></el-input>
                                    </el-form-item>

                                    <el-form-item label="参数列表" :label-width="formLabelWidth">
                                        <el-input name="bm-ch-udfs-name-input" type="text"
                                                  v-model="entity.jobDesc.udfs[scope.$index].args"
                                                  class="input-form-width el-dataset-input-group"
                                                  auto-complete="off"></el-input>
                                      <!--  <el-select
                                                v-model="entity.jobDesc.udfs[scope.$index].args"
                                                class="el-dataset-input-group"
                                                multiple
                                                :name="'bm-ch-resourceMan-schema-schema-wholeLength-select'">
                                            <el-option label="" value=""></el-option>
                                            <el-option v-for="(key) in udfsArgTypes"
                                                       :key="key.value"
                                                       :name="key.value"
                                                       :label="key.label"
                                                       :value="key.value">
                                            </el-option>
                                        </el-select>-->
                                    </el-form-item>

                                    <el-form-item label="返回值类型" :label-width="formLabelWidth">
                                        <el-input name="bm-ch-udfs-name-input" type="text"
                                                  v-model="entity.jobDesc.udfs[scope.$index].returns"
                                                  class="input-form-width el-dataset-input-group"
                                                  auto-complete="off"></el-input>
                                        <!--<el-select
                                                v-model="entity.jobDesc.udfs[scope.$index].returns"
                                                class="el-dataset-input-group"
                                                :name="'bm-ch-resourceMan-schema-schema-wholeLength-select'">
                                            <el-option v-for="(key) in udfsArgTypes"
                                                       :key="key.value"
                                                       :name="key.value"
                                                       :label="key.label"
                                                       :value="key.value">
                                            </el-option>
                                        </el-select>-->
                                    </el-form-item>
                                </el-form>
                            </el-card>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" width="40" align="center">
                        <template slot-scope="scope" class="addOrDeleteButton">
                            <el-button type="danger" size="small" icon="el-icon-minus" circle plain style="padding: 5px; margin: 10px 0 0 0;" @click="removeUdfs(scope.$index)"></el-button>
                            <el-button type="primary" size="small" icon="el-icon-plus" circle plain style="padding: 5px; margin: 10px 0 0 0;" @click="addUdfs(scope.$index)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
        <!-- Dataset dialog-->
        <el-dialog v-dialog-drag title="数据集查询" :visible.sync="dialogDataVisible" :close-on-click-modal="false"
                   :before-close="cancelDatasetDialog" :modal-append-to-body="false" custom-class="dialogClass">
            <el-form>
                <data-source-inquire ref="dataSourceInquire" :before-close="cancelDatasetDialog" @thisSelectDatasetVal="getSelectDatesetVal" rootName="dataset_dir">
                </data-source-inquire>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitDataset">确定</el-button>
                <el-button @click="cancelDatasetDialog">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import dataSourceInquire from '@components/dataSourceInq/dataSourceInquire.vue';

    export default {
        components: {
            dataSourceInquire,
        },
        props: ['entity'],
        data() {
            return {
                activeName: 'first',//表描述和udf描述的切换标签标识
                tableConfigActive: ["tableConfig", "tableConfig", "tableConfig", "tableConfig", "tableConfig", "tableConfig", "tableConfig", "tableConfig", "tableConfig", "tableConfig", ],//表配置，数据集配置tab切换的标识
                formLabelWidth: '100px',//label距离左侧宽度
                sources: [],//存放所有数据源和数据目标的数组，用于table的数据
                tableProfile: [],//存放当前setting的表描述数据
                tableTypes: [
                    {value: 'source', label: '源表'},
                    {value: 'result', label: '结果表'},
                    {value: 'lateral', label: '维度表'},
                ],//表描述的表类型
                udfsTypes: [
                    {value: 'scalar', label: 'scalar'},
//                    {value: 'table', label: 'table'},
//                    {value: 'aggregate', label: 'aggregate'},
                ],//表描述的表类型
                 writeModes: [
                 /*   {value: 'retract', label: '撤销'},
                    {value: 'upsert', label: '更新'},*/
                    {value: 'append', label: '追加'},
                ],//表描述的表类型
                udfsArgTypes: [
                    {value: 'string', label: 'string'},
                    {value: 'byte', label: 'byte'},
                    {value: 'short', label: 'short'},
                    {value: 'bigint', label: 'bigint'},
                    {value: 'int', label: 'int'},
                    {value: 'float', label: 'float'},
                    {value: 'double', label: 'double'},
                    {value: 'boolean', label: 'boolean'},
                    {value: 'date', label: 'date'},
                    {value: 'timestamp', label: 'timestamp'},
                    {value: 'binary', label: 'binary'},
                    {value: 'decimal', label: 'decimal'},
                ],//udf参数的表类型
                dialogDataVisible: false,
                getSelvalData: [],//存放数据集选择弹框的选中值
                sourceIndexDataset: 0,//存放数据在table的索引值
            }
        },
        methods: {
            //取消dataset的组件按钮
            cancelDatasetDialog(){
                //关闭dialog
                this.dialogDataVisible = false
                //调用子组件的方法清空子组件的值
                this.$refs.dataSourceInquire.clearSelectionRow();
            },
            //查询数据集选择的弹框
            dataSourceInquire: function (index) {
                //弹出"data查询"层
                this.dialogDataVisible = true;
                //index是当前数据所在table的行索引
                this.rowIndexDataset = index
            },
            //获取子组件的选中data
            getSelectDatesetVal(data) {
                this.getSelvalData = data;
            },
            //data查询数据点击提交的回调
            submitDataset: function () {
                if (this.getSelvalData === '') {
                    this.$message({
                        message: '请选择一条数据！',
                        type: 'error'
                    });
                    return false;
                } else {
//                    //选取的dataset不能重复
//                    if (JSON.stringify(this.entity.jobDesc.tableProfiles).indexOf(this.getSelvalData.id) !== -1) {
//                        this.$message({
//                            message: '不能选取相同的dataset！',
//                            type: 'error'
//                        });
//                        return false;
//                    } else {
                    this.arrAttribute = [];
                    // 选择dataset之后更新entity的source
                    this.entity.jobDesc.tableProfiles[this.rowIndexDataset].dataset = this.getSelvalData
                    // schema存放dateste对应的schema
                    this.entity.jobDesc.tableProfiles[this.rowIndexDataset].schema = this.getSelvalData.schema
                    // 根据dataset获取source的名称和id
                    this.entity.jobDesc.tableProfiles[this.rowIndexDataset].name =this.getSelvalData.name
                    this.entity.jobDesc.tableProfiles[this.rowIndexDataset].id =this.getSelvalData.id
                    //给table默认值
                    this.entity.jobDesc.tableProfiles[this.rowIndexDataset].tableName = this.getSelvalData.name
                    //如果是源表，每次选中数据集之后重置分区键和时间列
                    if(this.entity.jobDesc.tableProfiles[this.rowIndexDataset].tableType == 'source') {
                        this.entity.jobDesc.tableProfiles[this.rowIndexDataset].tableConfig.partitionKey = [];
                        this.entity.jobDesc.tableProfiles[this.rowIndexDataset].tableConfig.timeColumn = ''
                    }
                    sessionStorage.setItem("streamJobEntity", JSON.stringify(this.entity));
                    //选中这个数据集之后更新编辑的提示字段
                    this.changeTableName()
                    this.cancelDatasetDialog();
                }
            },
            //切换表类型更新表配置的选项
            tableTypeChange(value, rowIndex) {
                delete this.entity.jobDesc.tableProfiles[rowIndex].tableConfig
                this.$set(this.entity.jobDesc.tableProfiles[rowIndex],'tableConfig', {})
                if('result' == value){
                    //如果是结果表，添加写入模式
                    this.$set( this.entity.jobDesc.tableProfiles[rowIndex].tableConfig,"writeMode","append")
                }else if('source' == value){
                    this.$set( this.entity.jobDesc.tableProfiles[rowIndex].tableConfig,"partitionKey",[])
                    this.$set( this.entity.jobDesc.tableProfiles[rowIndex].tableConfig,"timeColumn","")
                    this.$set( this.entity.jobDesc.tableProfiles[rowIndex].tableConfig,"timeFormat","")
                }
                //更新提示字段
                this.changeTableName()
            },
            //删除一组dataset的配置项
            removeDatasetConfig(rowIndex, index) {
                //如果只有一组数据就不允许删除
                if(this.entity.jobDesc.tableProfiles[rowIndex].datasetConfig.length == 1){
                    this.$message({
                        message: '至少保留一组数据集配置',
                        type: 'error',
                        duration: 1500
                    });
                    return;
                }
                this.entity.jobDesc.tableProfiles[rowIndex].datasetConfig = this.arrayAddOrRemoreElement(this.entity.jobDesc.tableProfiles[rowIndex].datasetConfig, index)
            },
            //添加一组dataset的配置项
            addDatasetConfig(rowIndex, index) {
                //定义新添加的表描述的字段结构
                var datasetConfig = {
                    "name": "",
                    "value": ""
                }
                this.entity.jobDesc.tableProfiles[rowIndex].datasetConfig = this.arrayAddOrRemoreElement(this.entity.jobDesc.tableProfiles[rowIndex].datasetConfig, index, datasetConfig)
            },
            //添加表描述
            addTableProfiles: function (index) {
                //定义新添加的表描述的字段结构
                var tableProfiles =  {
                    "tableName": "",
                    "tableType": "source",
                    "tableConfig": {
                        "partitionKey": [],
                        "timeColumn": "",
                        "timeFormat":"",
                    },
                    "datasetConfig": [{"name":"","value":""}],
                    "schema": {
                        "id": "",
                        "name": "",
                        "fields": []
                    },
                    "dataset": {
                        "id": "",
                        "name": "",
                        "storage": "",
                        "storageConfigurations": {}
                    }
                }
                this.entity.jobDesc.tableProfiles = this.arrayAddOrRemoreElement(this.entity.jobDesc.tableProfiles, index, tableProfiles)
                //新建之后她的表配置也要是默认选中的tab
                this.tableConfigActive.splice(index+1, 0, "tableConfig");
            },
            //移除 表描述
            removeTableProfiles: function (index) {
                //如果只有一组数据就不允许删除
                if(this.entity.jobDesc.tableProfiles.length == 1){
                    this.$message({
                        message: '至少保留一组表描述',
                        type: 'error',
                        duration: 1500
                    });
                    return;
                }
                this.entity.jobDesc.tableProfiles = this.arrayAddOrRemoreElement(this.entity.jobDesc.tableProfiles, index)
                //同时删除表配置的默认值
                this.tableConfigActive.splice(index, 1);
            },
            //切换表描述和自定义函数
            changeTableName() {
                sessionStorage.setItem("streamJobEntity", JSON.stringify(this.entity));
                this.$emit('changeTableName')
            },
            //修改当前行的udf类型
            udfsChange(roeIndex){

            },
            //添加一组udf数据
            addUdfs(index) {
                var udf = {
                    "type": "scalar",
                    "name": "",
                    "clazz": "",
                    "method":'',
                    "args": '',
                    "jarPath":'',
                    "returns":''
                }
                this.entity.jobDesc.udfs = this.arrayAddOrRemoreElement(this.entity.jobDesc.udfs, index, udf)
            },
            //删除一组udf数据
            removeUdfs(index) {
                //如果只有一组数据就不允许删除
                if(this.entity.jobDesc.udfs.length == 1){
                    this.$message({
                        message: '至少保留一组自定义函数',
                        type: 'error',
                        duration: 1500
                    });
                    return;
                }
                this.entity.jobDesc.udfs = this.arrayAddOrRemoreElement(this.entity.jobDesc.udfs, index)
            },
            //初始化选择表描述
            selectTableConfigActive(tableProfilesLength){
                //表配置和数据及配置tab是，默认选中表配置
                for(let i = 0;i<tableProfilesLength; i++){
                    this.tableConfigActive[i] = "tableConfig"
                }
            }
        },
        watch: {},
        created() {
            setTimeout(() => {
                if(!this.entity.jobDesc.tableProfiles){
                    return;
                }
                //表配置和数据及配置tab是，默认选中表配置
                for(let i = 0;i<this.entity.jobDesc.tableProfiles.length; i++){
                    this.tableConfigActive[i] = "tableConfig"
                }
            }, 10)
        },
        beforeDestroy() {
            sessionStorage.setItem("streamJobEntity", JSON.stringify(this.entity));
        },
    }
</script>

<style lang="scss" scoped>
    .description-profile {
        .el-table__header{
            display:none
            }
        min-width: 814px;
        .table-header, .table-list {
            display: flex;
            padding: 0;
            margin: 0;
            width: 100%;
            align-items: center;
            border-bottom: 1px #ccc solid;
            .dataset-name {
                overflow: hidden;
                text-overflow: ellipsis;
            }
            li {
                width: 16.6%;
                height: 40px;
                line-height: 40px;
                border-right: 1px #ccc solid;
                font-size: 14px;
                color: 666;
                text-align: center;
                &:last-child {
                    border: 0;
                }
            }
        }
        .table-list {
            display: flex;
            border-bottom: 1px #ccc solid;
            /*border: 0;*/
            li {
                border-right: 1px #ccc solid;
                height: 60px;
                line-height: 60px;
                padding: 0 10px;
            }
        }
        .table-body {
            height: calc(100vh - 495px);
            overflow-y: auto;
        }
        .addOrDeleteButton{
            text-align: left;
        }
        .table-profilesForm {
            text-align: left;
            width: 100%;

            .tableConfigForm {
                margin-top: 20px;
                .el-input {
                    width: 100%;
                }
            }
            .datasetConfigForm {
                margin-top: 18px;
                .el-input {
                    width: 100%;
                }
            }
             .el-input{
                 width: 100%;
             }
             .el-form-item{
                 margin-bottom: 15px;
             }
             .el-form-item .el-select{
                 width: 100%;
             }
            .el-form-item .el-dataset-input-group {
                width: 200px;
            }
            .el-form-item .el-dataset-input-group-big {
                width: 515px;
            }
            .el-form-item .el-dataset-input-group-small {
                width: 300px;
            }
        }
    }
</style>

<style>
    .description-profile .el-tabs__header {
        margin: 0;
    }

    .description-profile .el-tabs__nav {
        margin-left: 20px;
    }
</style>


