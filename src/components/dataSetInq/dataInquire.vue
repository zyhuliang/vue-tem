<template>
    <div class="dt-content" id="ch-components-dataSetInq-dataInquire-temp">
        <div class="dtTableUp" name="bm-components-dataSetInq-dataInquire-search-data">
            <el-input placeholder="请输入名称" v-model="searchInput"  @keyup.enter.native="searchKeyup" class="input-with-search diSearch">
                <el-button  name="bm-components-dataSetInq-dataInquire-search-table-data" slot="append" @click="searchTable" icon="icon iconfont icon-ir-search"></el-button>
            </el-input>
            <el-date-picker
                    name="bm-components-dataSetInq-dataInquire-search-date-data"
                    v-model="dateValue"
                    type="daterange"
                    @change="handledateValue"
                    value-format="timestamp"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
            </el-date-picker>
        </div>

        <div class="content" v-loading="requestLoading" id="bm-com-datasetInq-datasetInq-dialog-table">
            <div class="dtTableLeft" id="ch-components-dataSetInq-dataInquire-tree">
                <data-tree ref="dataTree" @transferNavId="getNavId"></data-tree>
            </div>
            <div class="dtTableRight" v-if="navShow">
                <el-table
                        :data="table.content"
                        tooltip-effect="dark"
                        v-loading="loading"
                        class="datasetTable"
                        height="calc(100% - 60px)"
                        @sort-change="getOrder"
                        id="ch-components-dataSetInq-dataInquire-table"
                        @selection-change="handleSelectionChange">
                    <el-table-column
                            type="selection"
                            width="40">
                    </el-table-column>
                    <el-table-column
                            prop="id"
                            label="主键"
                            v-if="show"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="名称"
                            >
                    </el-table-column>
                    <el-table-column

                            label="类型"

                            show-overflow-tooltip
                            width="90"
                            :key="Math.random()"
                            :formatter="typeFormatter">
                        <template slot-scope="scope">
                            <span >{{scope.row.storage| cn}}</span>
                        </template>
                    </el-table-column>
<!--                    <el-table-column-->
<!--                            prop="tenant.name"-->
<!--                            label="租户"-->
<!--                            width="80"-->
<!--                            show-overflow-tooltip>-->
<!--                    </el-table-column>-->
                    <el-table-column
                            prop="createTime"
                            label="创建时间"

                            :formatter="dateFormat">
                    </el-table-column>
                    <el-table-column
                            prop="lastModifiedTime"
                            label="修改时间"
                            sortable="custom"

                            :formatter="dateFormat">
                    </el-table-column>
                    <el-table-column
                            prop="expiredPeriod"
                            label="过期时间"
                            :formatter="expiredPeriodFormat">
                    </el-table-column>
                    <el-table-column width="80" key= '1' label="操作" fixed="right">
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
                        name="ch-components-dataSetInq-dataInquire-pagination"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="table.totalElements">
                </el-pagination>
            </div>
            <preview-data-set ref="dataset" @hiedeDialog="hiedeDialog"></preview-data-set>
        </div>


    </div>
</template>

<script>
    import dataTree from './dataInqTree.vue'
    import daIn from './dataInq.js'
    import { listData2 ,querySchema} from '@api'
    import moment from "moment"//时间格式化
    import {queryObject, createParameter} from "@function/queryParameter"
    import previewDataSet from '@components/collector/taskDialog/datasetDialog.vue'
    export default {
        props: ['multipleTable','filterType'],
        components: {
            previewDataSet,
            dataTree
        },
        data() {
            return {
                table:[],
                multipleSelection: [],
                dateValue: '',
                startTime:'',
                endTime:'',
                navId:'',
                navOwer:'',
                newFilter:'resType=dataset_db|dataset_spool&owner=admin',
                searchInput:'',
                mlSelVal:{
                    name:'',
                    id:'',
                    datasetName:'',
                    type:''
                },
                show:false,
                loading:false,
                requestLoading:true,
                navShow:false,
                selectedNode:{},
                currentPage:1,
                pagesize:8,
                resType:"",
                outputName:"",
                orderDirection: 'DESC',
				field: 'lastModifiedTime'
            }
        },
        methods: {
            hiedeDialog(val){
                 this.$emit('hideParentDialog',val)

            },
            getNavId(naId,navLoading, owner){
                let _this =this;
                this.requestLoading = navLoading;
                if(this.requestLoading == false){
                    _this.navShow = true;
                }
                this.navId = naId;
                this.navOwer = owner;
                let parameter=queryObject();
                this.listTable();

            },
            handleSizeChange: function (size) {
                this.pagesize = size;
                this.listTable()

            },
            handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
                let limit=this.pagesize;
                let offset = (currentPage-1)*this.pagesize;
                this.listTable()

            },
            handleSelectionChange: function(val) {
                this.multipleSelection = val;
                if (this.multipleTable) {
                    this.$emit('thisSelectDateVal', val);
                    return
                }
                if(val.length === 0){
                    // this.mlSelVal.name = '';
                    this.$emit('thisSelectDateVal','');
                }else if(val.length === 1){
                    this.mlSelVal = val[0]
                    this.mlSelVal.datasetName = val[0].name;
                    this.mlSelVal.id = val[0].id;
                    this.mlSelVal.name = val[0].name;
                    this.mlSelVal.schemaId =val[0].schemaId || val[0].schema.id,
                    this.mlSelVal.type = val[0].storage
                    this.mlSelVal.brokers = val[0].storageConfigurations.brokers;
                    this.mlSelVal.topic = val[0].storageConfigurations.topic
                    sessionStorage.setItem("schemaId",this.mlSelVal.schemaId)
                    querySchema(val[0].schemaId || val[0].schema.id).then(data => {
                        let schemaData = data;
                        this.mlSelVal.schemaName = data.name;
                        this.mlSelVal.fields = data.fields;
                        this.$emit('thisSelectDateVal',this.mlSelVal);
                    }, err => {
                            this.$message({
                                message: err.response.message,
                                type: 'error',
                                duration: 1500
                            });
                        }
                    )

                }else {
                    if(!this.multipleTable){
                        this.$message({
                            message: '请选择一条数据！',
                            type: 'error'
                        });
                    }
                    return false;
                }

            },
            //数据预览
            dataPreview: function (row) {
                this.$refs.dataset.dataPreview(row.id, row.tenantId, row.schemaId);
                this.$emit('hideParentDialog',false)

            },
            //根据类型过滤结果
            typeFormatter:function(row, column){
                let typeName = row.storage;
                if (typeName === undefined){
                    return "数据源"
                }else {
                    return row.storage;
                }
            },
            //根据过期时间过滤结果
            expiredPeriodFormat:function(row, column){
                let exPerName = row.expiredPeriod;
                if(exPerName == 0 || exPerName> 200000000000){
                    return "永不过期";
                }else {
                    return moment(row.createTime + exPerName*1000).format("YYYY-MM-DD HH:mm:ss");
                }

            },
            handledateValue:function (val) {
                if(val == null){
                    this.dateValue = [];
                }else{
                    this.dateValue = [val[0],val[1]+86399000];
                }

                this.listTable();
            },
            //table list
            listTable:function listTable(){
                this.loading = true;
                //-----------------------------
                var that = this
                let query =this.searchInput.length>0?'%'+this.searchInput+'%':'%';
                if(this.dateValue){
                    this.startTime = this.dateValue[0]
                    this.endTime = this.dateValue[1]
                     that.parameter = that.buildParameters(that.pagesize,that.currentPage,that.searchInput);
                    if(this.resType == "output_dataset_dir"){
                        //that.parameter = that.selectedNode.id?createParameter('parentId',that.selectedNode.id,'EQUAL').Build(that.parameter):that.parameter
                        //将owner的equal换成like
                        that.parameter = createParameter('name',query,"LIKE")
                            .And('source',this.outputName,'EQUAL')
                            .And('lastModifiedTime',Number(this.dateValue[0]),'GREATER_THAN')
                            .And('lastModifiedTime',Number(this.dateValue[1]),'LESS_THAN')
                            .Build(that.parameter);
                    }else{
                        //将owner的equal换成like
                        that.parameter = createParameter('name',query,"LIKE")
                            .And('parentId',this.navId,'EQUAL')
                            .And('lastModifiedTime',Number(this.dateValue[0]),'GREATER_THAN')
                            .And('lastModifiedTime',Number(this.dateValue[1]),'LESS_THAN')
                            .Build(that.parameter);
                    }
                }else {
                    this.startTime = ''
                    this.endTime = ''
                     that.parameter = that.buildParameters(that.pagesize,that.currentPage,that.searchInput);
                    if(this.resType == "output_dataset_dir"){
                        //将owner的equal换成like
                        //that.parameter = that.selectedNode.id?createParameter('parentId',that.selectedNode.id,'EQUAL').Build(that.parameter):that.parameter
                        that.parameter = createParameter('name',query,"LIKE")
                            .And('source',this.outputName,'EQUAL')
                            .Build(that.parameter);
                    }else{
                        //将owner的equal换成like
                        that.parameter = createParameter('name',query,"LIKE")
                            .And('parentId',this.navId,'EQUAL')
                            .Build(that.parameter);
                    }
                }

                this.parameter.sortObject.field = this.field
                this.parameter.sortObject.orderDirection = this.orderDirection
                if(this.startTime===''||this.startTime==='undefined'){
                        var len = that.parameter.fieldList.length
                        var tmpField = that.parameter.fieldList.slice(0)
                    for(var i=0;i<len;i++){
                        if(that.startTime !== 'undefined' && tmpField[i].fieldName === 'lastModifiedTime'&& (tmpField[i].comparatorOperator== "GREATER_THAN" || tmpField[i].comparatorOperator == "LESS_THAN")){
                            var l = that.parameter.fieldList.indexOf(tmpField[i])
                            if(l >- 1){
                                that.parameter.fieldList.splice(l,1)
                            }
                        }
                        if(that.searchInput==''){
                            if(tmpField[i].fieldName === 'name'){
                                    var l = that.parameter.fieldList.indexOf(tmpField[i])
                                    if(l >- 1){
                                        that.parameter.fieldList.splice(l,1)
                                    }
                                }
                        }
                    }

                }
                // 根据filterType过滤字段
                if(that.filterType != '' && typeof that.filterType != 'undefined'){
                    that.parameter = createParameter('storage',this.type,"IN").Build(that.parameter);
                }
                //-----------------------------
                // GET /someUrl
                listData2(that.parameter, 'datasets').then(data => {
                    this.table = data;
                    this.loading= false;
                }, err => {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    }
                )

            },
            //查询
            searchTable:function searchTable(){

                this.listTable();
            },
            //监听查询回车事件
            searchKeyup:function () {
                this.searchTable();
            },
            //列表排序
			getOrder: function(column) {
                var that = this
				if (column.order === 'ascending') {
					this.orderDirection = 'ASC'
				} else {
					this.orderDirection = 'DESC'
                }
                this.field = column.prop
                if (column.prop === null) {
                    this.field = 'lastModifiedTime'
                    return false
                }
                if(column.column.label=='类型'){
                    this.field = 'storage'
                }
                this.currentPage = 1
                // this.parameter = that.buildParameters(that.pagesize,that.currentPage,that.startTime,that.endTime,that.searchInput, this.parameter.fieldList);
                // this.parameter = createParameter().Sort(this.field,this.orderDirection).Build(this.parameter,false)
				// this.parameter = createParameter().Limit(this.pagesize).Sort(that.field,that.orderDirection).Build();
               this.listTable();
            },
        },
        beforeRouteLeave: function (to, from, next) {
            daIn.$off()
            next();
        },
        mounted() {
            // 用$on事件来接收参数
            daIn.$on('childMethod', (data) => {
                this.resType = data.resType
                this.outputName = data.name
                this.navId = data.id;
                this.navOwer = data.owner;
                this.listTable();
                if(data.id==null || data.id==undefined){

                }else {

                }
            })
        }
    }

</script>

<style lang="scss" scoped>
    .dt-content{
        float: left;
        width: 100%;
        height:calc(100% - 20px);

        .dtTableUp{
            float: left;
            width: 100%;
            padding: 0px 0px 10px 0px;
            box-sizing: border-box;

            .diSearch{
                float: left;
            }
        }

        .content{
            float: left;
            width: 100%;
            height: 90%;
            margin-bottom:10px;
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

                .datasetTable{
                    float: left;
                    width: 100%;
                }
            }
        }

    }
    .el-table{
        border-right: none;
        border-top: none;
        box-shadow: 0px 0px 3px 0 rgba(0, 0, 0, 0.1);
    }
</style>
