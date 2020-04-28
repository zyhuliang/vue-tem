<template>
    <div class="dt-content" id="ch-components-dataSourceInq-dataSourceInquire-temp"  v-loading = "loading">
        <!--引入查询组件-->
        <div class="dtTableUp">
            <!--<el-button type="primary" @click="showTableList = false">创建</el-button>-->
            <search-date-data  name="ch-components-dataSourceInq-dataSourceInquire-search-date-data" ref="refSearchDate" @searchDate="searchListTable" :pagesize = "pagesize" :searchInput="searchInput"></search-date-data>
            <search-table-data name="ch-components-dataSourceInq-dataSourceInquire-search-table-data" ref="refSearchTable" @searchKey = "searchListTable" :pagesize = "pagesize" :startTime="startTime" :endTime="endTime"></search-table-data>
        </div>
        <!--左侧树结构-->
        <div class="dtTableLeft" id="ch-components-dataSourceInq-dataSourceInquire-tree">
            <data-tree  ref="dataTree" @transferNavId="listTable" :rootName=rootName></data-tree>
        </div>

        <div class="dtTableRight" v-if="showTableList">
            <el-table
                    :data="table.content"
                    tooltip-effect="dark"
                    style="width: 100%"
                    ref="multipleTable"
                    height="calc(100% - 60px)"
                    id="ch-components-dataSourceInq-dataSourceInquire-table"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection"
                        width="40">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="主键"
                        v-if="showId"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="名称"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        v-if="showType"
                        prop="type"
                        label="类型"
                        show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.type| cn}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        v-if="showStorage"
                        prop="storage"
                        label="类型"
                        show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.storage| cn}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="version"
                        label="版本"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="创建时间"
                        width="180"
                        :formatter="dateFormat"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="creator"
                        label="创建人"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="lastModifier"
                        label="修改人"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="lastModifiedTime"
                        label="修改时间"
                        width="180"
                        :formatter="dateFormat"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column width="80" key= '1' v-if="showStorage" label="操作" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                size="small"
                                @click="dataPreview(scope.row)"
                        >
                            预览
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[8, 16, 50, 100]"
                    :page-size="pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    name="ch-components-dataSourceInq-dataSourceInquire-pagination"
                    :total="table.totalElements">
            </el-pagination>

        </div>
        <preview-data-set ref="dataset" @hiedeDialog="hiedeDialog"></preview-data-set>
    </div>
</template>

<script>
    //引入查询组件
    import searchDateData from '../collectorSearch/searchDateData.vue'
    import searchTableData from '../collectorSearch/searchTableData.vue'
    //预览
    import previewDataSet from '@components/collector/taskDialog/datasetDialog.vue'

    //导入树组件
    import dataTree from './dataSourceInqTree.vue'
    import daInCom from './dataSourceInq.js'
    //api接口
    import { listData, listData2, querySchema } from '@api'
    import {queryObject,createParameter} from '@function/queryParameter.js';


    export default {
        props:['rootName','filterType'],
        components: {
            previewDataSet,
            dataTree,
            searchDateData,
            searchTableData,
        },
        data() {
            return {
                table:[],
                multipleSelection: [],
                dateValue: '',
                mlSelVal:{
                    name:'',
                    id:'',
                },
                showType: false,
                showStorage:false,
                showId:false,
                showTableList:true,
                owner:'',
                currentPage:1,
                pagesize:8,
                startTime:'',
                endTime:'',
                searchInput:'',
                selectedNode:{},
                disabledAddSchema:false,
                loading: false,
                type:["HDFS","KAFKA"]
            }
        },
        methods: {
            hiedeDialog(val){
                this.$emit('hideParentDialog',val)

            },
            handleSizeChange: function (size) {
                this.pagesize = size;
                this.parameter = createParameter().Build(this.buildParameters(this.pagesize,this.currentPage,this.startTime,this.endTime,this.searchInput))
                this.listTable(this.parameter,this.resType)
            },
            handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
                this.parameter = this.buildParameters(this.pagesize,this.currentPage,this.startTime,this.endTime,this.searchInput)
                this.listTable(this.parameter,this.resType)
            },
            //选中某条数据
            handleSelectionChange: function handleSelectionChange(val) {
                this.multipleSelection = val;
                
                if(val.length === 1){
                    if(this.rootName == 'datasource_dir'){
                        this.$emit('thisSelectDateSourceVal', val[0]);
                    }else if(this.rootName == 'dataset_dir'){
                        this.mlSelVal = val[0]
                        this.mlSelVal.datasetName = val[0].name;
                        this.mlSelVal.id = val[0].id;
                        this.mlSelVal.name = val[0].name;
                        this.mlSelVal.schemaId =val[0].schemaId;
                            this.mlSelVal.type = val[0].storage
                        this.mlSelVal.brokers = val[0].storageConfigurations.brokers;
                        this.mlSelVal.topic = val[0].storageConfigurations.topic
                        this.mlSelVal.format = val[0].storageConfigurations.format
                        sessionStorage.setItem("schemaId",this.mlSelVal.schemaId)
                        querySchema(val[0].schemaId).then(data => {
                            let schemaData = data;
                            this.mlSelVal.schemaName = data.name;
                            this.mlSelVal.fields = data.fields;
                            this.$emit('thisSelectDatasetVal',this.mlSelVal);
                        }, err => {
                            this.$message({
                                message: err.response.message,
                                type: 'error',
                                duration: 1500
                            });
                        })
                    }

                }else if(val.length != 0){
                    this.$message({
                        message: '请选择一条数据！',
                        type: 'error'
                    });
                    this.$refs.multipleTable.toggleRowSelection(val[0]);
                    return false;
                }

            },
            // 清空选中行
            clearSelectionRow (){
                if(this.$refs.multipleTable){
                    this.$refs.multipleTable.clearSelection();
                }

                this.$refs.refSearchTable.searchInput="";
                this.$refs.refSearchDate.dateValue="";
                let parameter = this.buildParameters(this.pagesize,1, this.startTime,this.endTime,this.searchInput)
                this.searchListTable(parameter,'', "","","",8);
            },
            //数据预览
            dataPreview: function (row) {
                this.$refs.dataset.dataPreview(row.id, row.tenantId, row.schemaId)
            },
            //table查询的列表
            searchListTable: function (parameter, type, startTime,endTime, searchInput,pagesize) {
                var that = this;
                that.currentPage = 1
                if(pagesize)that.pagesize = pagesize;
                that.startTime = startTime;
                that.endTime = endTime;
                if(searchInput!=undefined)that.searchInput = searchInput;
                this.listTable(parameter, type)
            },
            //table list
            listTable:function listTable(parameter, type, node){
                var that = this;
                this.selectedNode = node? node : this.selectedNode
                this.owner = node? node.owner : this.owner
                that.parameter = that.buildParameters(that.pagesize,that.currentPage,that.startTime,that.endTime,that.searchInput);
                that.parameter = that.selectedNode.id?createParameter('parentId',that.selectedNode.id,'EQUAL').Build(that.parameter):that.parameter
                //将owner的equal换成like
                if(!type){

                    if(that.rootName == 'datasource_dir'){
                        type = 'datasource'
                    }else if(that.rootName == 'dataset_dir'){
                        type = 'dataset'
                    }
                }
                // 根据filterType过滤字段
                if(that.filterType != '' && typeof that.filterType != 'undefined'){
                    that.parameter = createParameter('storage',this.type,"IN").Build(that.parameter);
                }
                //根据不同的type发送不同的请求
                if(that.selectedNode.id){
                    this.loading = true;
                    if(type == 'dataset' ) {
                        var typeTmp = type+"s"
                        listData2(that.parameter, typeTmp).then(data => {
                            this.loading = false
                            this.table = data;
                        }, err => {
                            this.loading = false
                            this.$message({
                                message: err.response.message,
                                type: 'error',
                                duration: 1500
                            });
                        })
                    }else {
                        type = type == 'standard'?'standardbd':type
                        listData(that.parameter,type).then(data => {
                            this.loading = false
                            this.table = data;
                        }, err => {
                            this.loading = false
                            this.$message({
                                message: err.response.message,
                                type: 'error',
                                duration: 1500
                            });
                        })
                    }
                }
            },
        },
        beforeRouteLeave: function (to, from, next) {
            daInCom.$off();
            this.filterType = []
            next();
        },
        mounted() {
            //如果是dataset的要添加类型
            if((this.rootName).indexOf('dataset')>-1 ){
                this.showStorage = true;
            }else{
                this.showStorage = false;
            }
            if((this.rootName).indexOf('datasource')>-1){
                this.showType = true;
            }else this.showType = false;
            // 用$on事件来接收参数
            daInCom.$on('childMethod', (data) => {
                var that = this;
                //清除table和date的查询条件
                that.startTime=''
                that.endTime=''
                that.searchInput=''
                that.currentPage=1
                that.pagesize=8
                if(data){
                    that.disabledAddSchema = true;
                }
                that.selectedNode = data;
                if(data.resType)
                    var type = data.resType.substring(0,data.resType.indexOf('_dir'))
                else type = 'dataSource'
                if(!data.id){
                    that.table = [];
                }else{
                    that.owner = data.owner;
                    that.listTable();
                }
                that.noData = false;
                that.beData = true;
                if(that.$refs.refSearchDate)
                    that.$refs.refSearchDate.initParameter()
                if(that.$refs.refSearchTable)
                    that.$refs.refSearchTable.initParameter()
            })
        }
    }

</script>

<style lang="scss" scoped>

    .tpAddrl{
        color: #FFFFFF;
        margin-right: 0px;
        text-decoration: none;
    }

    .dt-content{
        float: left;
        width: 100%;
        height: 80%;

        .dtTableUp{
            float: left;
            width: 100%;
            margin: 0px 0px 10px 0px;

            .diSearch{
                float: left;
            }
        }

        .dtTableLeft{
            float: left;
            width: 20%;
            height: calc(100% - 60px);
            border: 1px solid #eeeeee;
            background-color: #f2f3f9;
        }
        .dtTableRight{
            float: left;
            width: 79%;
            height: 100%;
            overflow: auto;
            background-color: #ffffff;
        }
        .addForm{
            padding-left: 0px;
        }
    }
</style>