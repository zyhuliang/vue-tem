<!-- steps参数 dataFlow Process shell -->
<template>
    <div>
        <el-form id="bm-nodeset-shell-form" ref="nodeSetData" :model="nodeSetData" label-width="150px">
                <el-form-item :label="'服务类型'">
                        <el-tooltip  class="item" effect="dark" :content="'serviceType'| cn" placement="top">
                                <i class="parIcon el-icon-warning"></i>
                        </el-tooltip>
                        <el-select v-model="nodeData.serviceType" placeholder="请选择" @change="changeSercice">
                            <el-option
                            v-for="item in ['collect','count','index','quality']"
                            :key="item"
                            :label="item"
                            :value="item">
                            </el-option>
                        </el-select>
                        <!-- <el-input :value="nodeData.serviceType" placeholder="（必填）"  name="workingDiretoryVal"></el-input> -->
                </el-form-item>
                <el-form-item :label="'clusterId'">
                        <el-tooltip  class="item" effect="dark" :content="'serviceType'" placement="top">
                                <i class="parIcon el-icon-warning"></i>
                        </el-tooltip>
                        <el-select v-model="nodeData.clusterId" placeholder="请选择" >
                            <el-option
                            v-for="item in clusterIdArr"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        <!-- <el-input :value="nodeData.serviceType" placeholder="（必填）"  name="workingDiretoryVal"></el-input> -->
                </el-form-item>
                <div v-if="nodeData.serviceType=='collect'">
                    <el-form-item :label="'数据导入'">
                        <el-tooltip lass="item" effect="dark" content="1.数据集名称,从资源目录选择或编辑创建 2.格式为字符串：字符/数字/下划线/-/的组合"
                                    placement="top">
                            <i class="parIcon el-icon-warning"></i>
                        </el-tooltip>
                        <el-input placeholder="请选择内容" v-model="nodeData.collect_name"  :disabled="true"
                                name="collect_name">
                            <el-button slot="append" icon="icon iconfont icon-ir-search" @click="dataImportInq"
                                    name="dataSetInq"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item v-show="false"  :label="'collect_id'| cn">
                        <el-tooltip  class="item" effect="dark" :content="'collect_id'| cn" placement="top">
                                <i class="parIcon el-icon-warning"></i>
                        </el-tooltip>
                        <el-input v-model="nodeData.collect_id" placeholder="（必填）"  name="commandVal"></el-input>
                    </el-form-item>
                </div>
                <div v-if="nodeData.serviceType=='count'">
                    <el-form-item :label="'类型'">
                        <el-tooltip  class="item" effect="dark" :content="'count_type'| cn" placement="top">
                                <i class="parIcon el-icon-warning"></i>
                        </el-tooltip>
                        <el-select v-model="nodeData.count_type" placeholder="请选择" @change="changeDataset">
                            <el-option
                            v-for="item in ['Dataset','ResourceDesc']"
                            :key="item"
                            :label="item"
                            :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="'数据集'" v-if="nodeData.serviceType=='count'&&nodeData.count_type=='Dataset'">
                        <el-tooltip lass="item" effect="dark" content="1.数据集名称,从资源目录选择或编辑创建 2.格式为字符串：字符/数字/下划线/-/的组合"
                                    placement="top">
                            <i class="parIcon el-icon-warning"></i>
                        </el-tooltip>
                        <el-input placeholder="请选择内容" v-model="nodeData.dataset"  :disabled="true"
                                name="dataset">
                                <el-button slot="append" icon="icon iconfont icon-ir-search" @click="dataSetInq"
                                    name="dataSetInq">
                            </el-button>
                        </el-input>
                            
                    </el-form-item>
                    <el-form-item  :label="'ResourceDesc存放位置'" v-if="nodeData.count_type=='ResourceDesc'">
                            <el-input placeholder="默认路径为根目录" v-model="nodeData.count_obj_name" name="ResourceDesc存放位置" :disabled="true"
                                    class="input-form-width">
                                <el-button slot="append" icon="icon iconfont icon-ir-search"
                                        @click="dialogDataSetTreeVisible=true" name="datasetTree"></el-button>
                            </el-input>
                    </el-form-item>
                    <div >
                        <el-form-item  :label="'对象id'">
                            <el-tooltip  class="item" effect="dark" :content="'count_obj_id'| cn" placement="top">
                                    <i class="parIcon el-icon-warning"></i>
                            </el-tooltip>
                            <el-input v-model="nodeData.count_obj_id" placeholder="（必填）" disabled name="count_obj_id"></el-input>
                        </el-form-item>
                        <el-form-item :label="'对象名称'">
                                <el-tooltip  class="item" effect="dark" :content="'count_obj_name'| cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input v-model="nodeData.count_obj_name" placeholder="（必填）" disabled name="count_obj_name"></el-input>
                        </el-form-item>
                    </div>
                    <div >
                        <el-form-item  :label="'Es_dataset_d'">
                            <el-tooltip  class="item" effect="dark" :content="'count_store_id'| cn" placement="top">
                                    <i class="parIcon el-icon-warning"></i>
                            </el-tooltip>
                            <el-input v-model="nodeData.count_store_id" placeholder="（必填）"  name="count_obj_id">
                                <el-button slot="append" icon="icon iconfont icon-ir-search" @click="dataSetInqEs"
                                    name="dataSetInq">
                            </el-button>
                        </el-input>
                        </el-form-item>
                        <el-form-item :label="'存储引擎'">
                                <el-tooltip  class="item" effect="dark" :content="'count_store_name'| cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input v-model="nodeData.count_store_name" placeholder="（必填）"  name="count_store_name"></el-input>
                        </el-form-item>
                        <el-form-item :label="'count_metric'" v-if="nodeData.count_type=='ResourceDesc'">
                                <el-tooltip  class="item" effect="dark" :content="'count_metric'| cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                    <el-select
                                    v-model="nodeData.count_metric"
                                    multiple
                                    filterable
                                    allow-create
                                    default-first-option
                                    placeholder="请选择文章标签">
                                    <el-option
                                    v-for="item in ['num','record','size']"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                                    </el-option>
                                </el-select>
                        </el-form-item>
                    </div> 
                </div>
                <div v-if="nodeData.serviceType=='index'">
                    <el-form-item :label="'类型'">
                        <el-tooltip  class="item" effect="dark" :content="'index_type'| cn" placement="top">
                                <i class="parIcon el-icon-warning"></i>
                        </el-tooltip>
                        <el-select v-model="nodeData.index_type" placeholder="请选择" @change="changeIndexType">
                            <el-option
                            v-for="item in ['Dataset','ResourceDesc']"
                            :key="item"
                            :label="item"
                            :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    
                    <div>
                        <el-form-item :label="'dataset'" v-if="nodeData.index_type=='Dataset'">
                            <el-tooltip lass="item" effect="dark" content="1.数据集名称,从资源目录选择或编辑创建 2.格式为字符串：字符/数字/下划线/-/的组合"
                                        placement="top">
                                <i class="parIcon el-icon-warning"></i>
                            </el-tooltip>
                            <el-input placeholder="请选择内容" v-model="nodeData.dataset" :model="nodeData.index_obj_name" :disabled="true"
                                    name="dataset">
                                <el-button slot="append" icon="icon iconfont icon-ir-search" @click="dataSetInq"
                                        name="dataSetInq"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item  :label="'ResourceDesc存放位置'" v-if="nodeData.index_type=='ResourceDesc'">
                            <el-input placeholder="默认路径为根目录" v-model="nodeData.index_obj_name" name="dataset存放位置" :disabled="true"
                                    class="input-form-width">
                                <el-button slot="append" icon="icon iconfont icon-ir-search"
                                        @click="dialogDataSetTreeVisible=true" name="datasetTree"></el-button>
                            </el-input>
                    </el-form-item>
                        <el-form-item :label="'数据资源名称'| cn">
                                <el-tooltip  class="item" effect="dark" :content="' '" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input v-model="nodeData.index_obj_name" placeholder="（必填）"  name="index_obj_name"></el-input>
                        </el-form-item>
                        <el-form-item  :label="'数据资源id'| cn">
                            <el-tooltip  class="item" effect="dark" :content="'index_obj_id'| cn" placement="top">
                                    <i class="parIcon el-icon-warning"></i>
                            </el-tooltip>
                            <el-input v-model="nodeData.index_obj_id" placeholder="（必填）"  name="index_obj_id"></el-input>
                        </el-form-item>
                        <el-form-item :label="'ES存储名称'| cn">
                                <el-tooltip  class="item" effect="dark" :content="'index_store_name'" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input v-model="nodeData.index_store_name" placeholder="（必填）"  name="index_store_name">
                                    <el-button slot="append" icon="icon iconfont icon-ir-search" @click="dataSetInqEs"
                                        name="dataSetInq">
                                    </el-button>
                                </el-input>
                        </el-form-item>
                        <el-form-item  :label="'存储引擎id'| cn">
                            <el-tooltip  class="item" effect="dark" :content="'index_store_id'| cn" placement="top">
                                    <i class="parIcon el-icon-warning"></i>
                            </el-tooltip>
                            <el-input v-model="nodeData.index_store_id" placeholder="（必填）"  name="index_store_id"></el-input>
                        </el-form-item>
                        <!-- <el-form-item :label="'索引字段'">
                            <el-tooltip  class="item" effect="dark" :content="'index_columns'| cn" placement="top">
                                    <i class="parIcon el-icon-warning"></i>
                            </el-tooltip>
                                <el-select
                                v-model="nodeData.index_columns"
                                multiple
                                filterable
                                allow-create
                                default-first-option
                                placeholder="请选择文章标签">
                                <el-option
                                v-for="item in indexOption"
                                :key="item.name"
                                :label="item.name"
                                :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item> -->
                    </div>
                    
                </div>
                <div v-if="nodeData.serviceType=='quality'">
                    <el-form-item :label="'数据集'">
                        <el-tooltip lass="item" effect="dark" content="1.数据集名称,从资源目录选择或编辑创建 2.格式为字符串：字符/数字/下划线/-/的组合"
                                    placement="top">
                            <i class="parIcon el-icon-warning"></i>
                        </el-tooltip>
                        <el-input placeholder="请选择内容" v-model="nodeData.dataset" :model="nodeData.dataset" :disabled="true"
                                name="dataset">
                            <el-button slot="append" icon="icon iconfont icon-ir-search" @click="dataSetInq"
                                    name="dataSetInq"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item :label="'质量分析模板'">
                        <el-tooltip lass="item" effect="dark" content="1.数据集名称,从资源目录选择或编辑创建 2.格式为字符串：字符/数字/下划线/-/的组合"
                                    placement="top">
                            <i class="parIcon el-icon-warning"></i>
                        </el-tooltip>
                        <el-input placeholder="请选择内容" v-model="nodeData.analy"  :disabled="true"
                                name="dataset">
                            <el-button slot="append" icon="icon iconfont icon-ir-search" @click="analyInq"
                                    name="dataSetInq"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item  :label="'质量分析模板id'">
                        <el-tooltip  class="item" effect="dark" :content="'quality_zmod_id'" placement="top">
                                <i class="parIcon el-icon-warning"></i>
                        </el-tooltip>
                        <el-input v-model="nodeData.quality_zmod_id" placeholder="（必填）"  name="quality_zmod_id"></el-input>
                    </el-form-item>
                    <el-form-item :label="'质量分析模板名称'">
                            <el-tooltip  class="item" effect="dark" :content="'quality_zmod_name'" placement="top">
                                    <i class="parIcon el-icon-warning"></i>
                            </el-tooltip>
                            <el-input v-model="nodeData.quality_zmod_name" placeholder="（必填）"  name="quality_zmod_name"></el-input>
                    </el-form-item>
                    <el-form-item  :label="'存储引擎id'">
                        <el-tooltip  class="item" effect="dark" :content="'quality_store_id'" placement="top">
                                <i class="parIcon el-icon-warning"></i>
                        </el-tooltip>
                        <el-input v-model="nodeData.quality_store_id" placeholder="（必填）"  name="quality_store_id"></el-input>
                    </el-form-item>
                    <el-form-item :label="'存储引擎名称'">
                            <el-tooltip  class="item" effect="dark" :content="'quality_store_name'" placement="top">
                                    <i class="parIcon el-icon-warning"></i>
                            </el-tooltip>
                            <el-input v-model="nodeData.quality_store_name" placeholder="（必填）"  name="quality_store_name"></el-input>
                    </el-form-item>
                </div>
                
        </el-form>
        <!-- 数据集查询 dialog-->
        <el-dialog title="数据集查询" :visible.sync="dialogDataSetVisible" :close-on-click-modal="false"
                   :before-close="cancelDatasetDialog" :modal-append-to-body="false" custom-class="dialogClass"
                   append-to-body>
            <el-form>
                <data-source-inquire ref="dataSourceInquire" @thisSelectDatasetVal="getSelectDateVal"
                                     rootName="dataset_dir"></data-source-inquire>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" v-if="datasetStatus" @click="cancelDatasetDialog" name="bm-ch-step2Form-dataset-ok">确定</el-button>
                <el-button @click="cancelDatasetDialog" name="bm-ch-step2Form-dataset-cancel">取消</el-button>
            </div>
        </el-dialog>
        <!-- 数据集路径保存 -->
        <div v-if="dialogDataSetTreeVisible == true" class="nodeDialog">
            <div class="diHeader">
                <h3>DataSet Tree 查询</h3>
                <span @click="dialogDataSetTreeVisible = false" class="el-icon-close"></span>
            </div>
            <div class="diContent">
                <el-form id="bm-schematree1-form" class="elForm" label-width="80px">
                    <dataset-tree class="elFormSelect" ref="datasettree"></dataset-tree>
                </el-form>
            </div>
            <div slot="footer" class="diFooter">
                <el-button type="primary" @click="submitDataSetTree" name="sure">确定</el-button>
                <el-button @click="dialogDataSetTreeVisible = false" name="cancel">取消</el-button>
            </div>
        </div>
        <!-- 质量分析 dialog-->
        <el-dialog title="质量分析" :visible.sync="dialogZhiLiangVisible" :close-on-click-modal="false"
                    :modal-append-to-body="false" custom-class="dialogClass"
                   append-to-body>
            <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                type="selection"
                width="55">
                </el-table-column>
                <el-table-column
                label="分析模板"
                >
                <template slot-scope="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <el-table-column
                prop="processDataId"
                label="数据集"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="creator"
                label="创建人"
                show-overflow-tooltip>
                </el-table-column>
                 <el-table-column
                      prop="lastModifiedTime"
                      label="修改时间"
                      :formatter="dateFormat"
                      sortable="custom"
                      >
              </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="cancelZhiLiangDialog" name="bm-ch-step2Form-dataset-ok">确定</el-button>
                <el-button @click="cancelZhiLiangDialog" name="bm-ch-step2Form-dataset-cancel">取消</el-button>
            </div>
        </el-dialog>
        <!-- 数据导入 dialog-->
        <el-dialog title="数据导入" :visible.sync="dialogDataImportVisible" :close-on-click-modal="false"
                    :modal-append-to-body="false" custom-class="dialogClass"
                   append-to-body>
            <el-table
                ref="multipleTableDataImport"
                :data="tableDataImport"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChangeImport">
                <el-table-column
                type="selection"
                width="55">
                </el-table-column>
                <el-table-column
                label="名称"
                >
                <template slot-scope="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <el-table-column
                prop="dataSource"
                label="数据源"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="object"
                label="同步对象"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="dataStore"
                    label="数据集"
                ></el-table-column>
                 <el-table-column
                      prop="createTime"
                      label="创建时间"
                      :formatter="dateFormat"
                      sortable="custom"
                      >
              </el-table-column>
                 <el-table-column
                      prop="lastModifiedTime"
                      label="修改时间"
                      :formatter="dateFormat"
                      sortable="custom"
                      >
              </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="canceldataImportDialog" name="bm-ch-step2Form-dataset-ok">确定</el-button>
                <el-button @click="canceldataImportDialog" name="bm-ch-step2Form-dataset-cancel">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {clusterinfo} from "@/api/cluster/index.js";
    import {atgetDate,getSynchronizationTaskList} from '@api'
    import dataSourceInquire from '@dataSourceInq/dataSourceInquire.vue';
    import datasetTree from '@components/datasetTree/datasetTree.vue';
    // import dataAnalyInquire from '@analysisInq/analysisInq.vue';
    export default {
        components: {
            dataSourceInquire,
            datasetTree,
            // dataAnalyInquire
        },
        data() {
            return {
                nodeData:{
                    serviceType:'collect'
                },  //存放节点参数
                DatasetEs:false,
                dialogDataSetVisible: false,
                dialogDataSetTreeVisible: false,
                indexOption:[],
                dialogZhiLiangVisible:false,
                tableData:[],
                multipleSelection: [],
                datasetStatus: false,
                dialogDataImportVisible:false,//数据导入dialog
                tableDataImport:[],
                currentType:'',
                backendConfig:{
                    "dataflowId$": "backend",
                    "serviceType":"",
                    "collect_id": "",
                    "collect_name": "",
                    "count_type":"",
                    "count_obj_id":"",
                    "count_obj_name":"",
                    "count_store_name":"",
                    "count_store_id":"",
                    "count_metric":"",
                    "index_columns":"",
                    "index_store_id":"",
                    "index_store_name":"",
                    "quality_zmod_id":"",
                    "quality_zmod_name":"",
                    "quality_store_name":"",
                    "quality_store_id":"",
                    "dataset":"",
                    "clusterId":'',
                },
                clusterIdArr:[]

            }
        },
        props:["nodeSetData"],
        watch: {
            nodeSetData(newValue, oldValue) {
                this.nodeData = newValue;
            },
        },
        filters:{

        },
        methods: {
            changeSercice(val){
                this.currentType = val
                // this.nodeData.collect_id = ""
                // // this.nodeData.collect_name = ""
                // let data = {
                //     ...this.backendConfig,
                //     serviceType:this.currentType
                // }
                    this.nodeData.serviceType = val,
                    this.nodeData.collect_id = "",
                    this.nodeData.collect_name=  "",
                     this.nodeData.count_type= "",
                     this.nodeData.count_obj_id = "",
                     this.nodeData.count_obj_name= "",
                    this.nodeData.count_store_name="",
                     this.nodeData.count_store_id="",
                     this.nodeData.count_metric="",
                     this.nodeData.index_columns = "",
                     this.nodeData.index_store_id = "",
                     this.nodeData.index_store_name = "",
                     this.nodeData.quality_zmod_id = "",
                     this.nodeData.quality_zmod_name = "",
                     this.nodeData.quality_store_name = "",
                     this.nodeData.quality_store_id = "",
                     this.nodeData.dataset = ""
                // this.$set(this.nodeData,data)
                // console.log(this.nodeData)
            },
             /**
             * dataSet 查询
             * ------------------------------------------------------------------
             */
            dataSetInq: function () {
                 this.datasetStatus = false;
                this.dialogDataSetVisible = true;
            },
            dataSetInqEs(){
                this.DatasetEs = true
                this.datasetStatus = false;
                this.dialogDataSetVisible = true;
            },
            cancelDatasetDialog() {
                //关闭dialog
                this.dialogDataSetVisible = false
                //调用子组件的方法清空子组件的值
                this.$refs.dataSourceInquire.clearSelectionRow();
            },
            submitDataSet(){

            },
            changeDataset(val){
                    this.nodeData.dataset = ''
                    this.nodeData.count_store_id = ''
                    this.nodeData.count_store_name = ''
                    this.nodeData.count_obj_id = '';
                    this.nodeData.count_obj_name = ''; 
                
            },
            changeIndexType(val){
                this.nodeData.index_obj_id = ''    //hdfs数据集
                this.nodeData.index_obj_name = ''
            },
            /**
             * 获取子组件的dataSet
             * ------------------------------------------------------------------
             */
            getSelectDateVal(data) {
                this.datasetStatus = true
                if(this.currentType=='count'){
                        if(this.nodeData.count_type=='Dataset'){     
                            if(this.DatasetEs==true){
                                    this.nodeData.count_store_id = data.id
                                    this.nodeData.count_store_name = data.name
                                    this.DatasetEs=false
                            }else {
                                    this.nodeData.count_obj_id = data.id;
                                    this.nodeData.count_obj_name = data.name; 
                            } 
                                this.nodeData.dataset = data.name
                            }else if(this.nodeData.count_type=='ResourceDesc'){
                                this.nodeData.count_store_id = data.id
                                this.nodeData.count_store_name = data.name
                                this.nodeData.dataset = data.name
                        }
                }else if(this.currentType=='index'){
                    if(this.DatasetEs==true){
                        this.nodeData.index_store_name = data.name  //es数据集
                        this.nodeData.index_store_id = data.id
                        this.DatasetEs=false
                    }else {
                        this.nodeData.index_obj_id = data.id     //hdfs数据集
                        this.nodeData.index_obj_name = data.name
                        this.nodeData.dataset = data.name
                        this.nodeData.datasets = data
                    }
                    this.indexOption = data.fields.filter(item=>{
                        return item.type='string'
                    })
                }else if(this.currentType=='quality'){
                    this.nodeData.quality_store_name = data.name  //es数据集
                    this.nodeData.quality_store_id = data.id
                    this.nodeData.dataset = data.name
                }
                
            },
            getSelectZhiLiangVal(data){

            },
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
                    if(that.nodeData.serviceType=='index'){
                        that.nodeData.index_obj_name = datasetNode.path
                        that.nodeData.index_obj_id = datasetNode.id
                    }else if(that.nodeData.serviceType=='count') {
                        that.nodeData.count_obj_name = datasetNode.path
                        that.nodeData.count_obj_id = datasetNode.id
                    }
                    
                    that.dialogSchemaTreeVisible = false;
                }
            },
            handleSelectionChange(val){
                this.multipleSelection = val;
                if(val.length === 1){
                    this.nodeData.quality_zmod_name = this.multipleSelection[0].name
                    this.nodeData.quality_zmod_id = this.multipleSelection[0].id
                    this.nodeData.analy = this.multipleSelection[0].name
                }else if(val.length != 0){
                    this.$message({
                        message: '请选择一条数据！',
                        type: 'error'
                    });
                    this.$refs.multipleTable.toggleRowSelection(val[0]);
                    return false;
                }
            },
            analyInq(){
                this.dialogZhiLiangVisible = true;
                this.loading = true;
                let parameter = this.createParameter();
                atgetDate(parameter).then(data => {
                    this.loading = false;
                    //console.log(data.content[0].createTime);
                    this.tableData = data.content;
                }, err => {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    }
                )
            },
            cancelZhiLiangDialog(){
                //关闭dialog
                this.dialogZhiLiangVisible = false
                //调用子组件的方法清空子组件的值
                // this.$refs.zhiLiangInquire.clearSelectionRow();
            },
            buildParameters:function(){
                // var limit=this.pagesize;
                // var offset = (this.currentPage-1)*this.pagesize;
                // var query =this.searchInput.length>0?'%'+this.searchInput+'%':'%';
                // var parameter = createParameter().Limit(limit).Offset(offset).Build();
                // if(query != '%'){
                //     parameter = createParameter('name',query,"LIKE").Build(parameter);
                // }
                // if(this.dateValue){
                //     if(this.dateValue!= '' && this.dateValue.length != 0 ){
                //         parameter = createParameter('lastModifiedTime',Number(this.dateValue[0]),'GREATER_THAN').
                //         And('lastModifiedTime',Number(this.dateValue[1]),'LESS_THAN').
                //         Build(parameter);
                //     }
                // }    
                // parameter.sortObject.field = this.prop
                // parameter.sortObject.orderDirection = this.orderDirection
                return parameter;
            },
            handleSelectionChangeImport(val){
                this.multipleSelectionDataImport = val;
                if(val.length === 1){
                    this.nodeData.collect_name = this.multipleSelectionDataImport[0].name
                    this.nodeData.collect_id = this.multipleSelectionDataImport[0].id
                }else if(val.length != 0){
                    this.$message({
                        message: '请选择一条数据！',
                        type: 'error'
                    });
                    this.$refs.multipleTableDataImport.toggleRowSelection(val[0]);
                    return false;
                }
            },
            canceldataImportDialog(){
                this.dialogDataImportVisible = false;
                
            },
            dataImportInq(){
                
                this.dialogDataImportVisible = true;
                let parameter = this.createParameter();
                getSynchronizationTaskList(parameter).then(data => {
                    this.loading = false;
                    //console.log(data.content[0].createTime);
                    this.tableDataImport = data.content;
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
        mounted() {
            this.nodeData = this.nodeSetData;
            clusterinfo().then(res => {
                this.clusterIdArr = _.map(res.data, val => {
                    return {
                    label: val,
                    value: val
                    };
                });
            });
            console.log(this.nodeData);
        }
    }

</script>

<style scoped>

</style>