<template>
    <div class="dt-content">
        <!--引入查询组件-->
        <div class="dtTableUp">
            <search-table-data name="ch-components-schemaInq-schemaInquire-search-date-data" ref="refSearchTable" @searchKey = "searchListTable" :pagesize = "pagesize" :startTime="startTime" :endTime="endTime"></search-table-data>
            <search-date-data  name="ch-components-schemaInq-schemaInquire-search-table-data" ref="refSearchDate" @searchDate="searchListTable" :pagesize = "pagesize" :searchInput="searchInput"></search-date-data>
        </div>
        <div class="content">
            <!--左侧树结构-->
            <div class="dtTableLeft">
                <schema-tree  ref="schemaTree" @transferSchemaNavId="getNavId" ></schema-tree>
            </div>
            <!--右侧表结构-->
            <schema-add v-if="!showTableList" :parentId="selectedNode.id" id="new" isClose="true" class = " dtTableRight addForm"></schema-add>

            <div class="dtTableRight" v-if="showTableList">
                <el-table
                        v-loading = "loading"
                        id="bm-com-schemaInq-schemainq-dialog-table"
                        :data="table.content"
                        tooltip-effect="dark"
                        style="width: 100%"
                        height="calc(100% - 60px)"
                        ref="multipleTable"
                        @sort-change="getOrder"
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
                    >
                    </el-table-column>
                    <!--<el-table-column-->
                    <!--prop="version"-->
                    <!--label="版本"-->
                    <!-->-->
                    <!--</el-table-column>-->
                    <el-table-column
                            prop="createTime"
                            label="创建时间"
                            width="180"

                            :formatter="dateFormat">
                    </el-table-column>
                    <!--<el-table-column-->
                    <!--prop="creator"-->
                    <!--label="创建人"-->
                    <!---->
                    <!--show-overflow-tooltip>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column-->
                    <!--prop="lastModifier"-->
                    <!--label="修改人"-->
                    <!---->
                    <!--show-overflow-tooltip>-->
                    <!--</el-table-column>-->
                    <el-table-column
                            prop="lastModifiedTime"
                            label="修改时间"
                            sortable="custom"
                            :formatter="dateFormat">
                    </el-table-column>
                    <el-table-column
                            prop="lastModifier"
                            :key="Math.random()"
                            align="left"
                            label="版本">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.version" @visible-change="changeSchemaVersion($event, scope.row, scope.$index)">
                                <el-option
                                        v-for="(item) in historySchemaEntity"
                                        :label="item.version"
                                        :name="item.version"
                                        :key="item.version"
                                        :value="item.version"
                                >
                                </el-option>
                            </el-select>
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
                        :total="table.totalElements">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    //引入查询组件
    import searchDateData from '../collectorSearch/searchDateData.vue'
    import searchTableData from '../collectorSearch/searchTableData.vue'
    //导入树组件
    import schemaTree from './schemaInqTree.vue'
    import schemaIn from './schemaInq.js'
    //    新建schema
    import schemaAdd from './schemaAdd.vue'
    import {listData2 ,
        getHistorySchema, //获取不同版本号的schema
    } from '@api'
    //构建查询参数
    import {queryObject,createParameter} from '@function/queryParameter.js';
    export default {
        props: {
            multipleTable: {
                type: Boolean,
                default: false
            }
        },
        components: {
            schemaTree,
            searchDateData,
            searchTableData,
            schemaAdd,
        },
        data() {
            return {
                table:[],
                dateValue: '',
                mlSelVal:{
                    name:'',
                    id:'',
                },
                showId:false,
                showTableList:true,
                owner:'',
                currentPage:1,
                pagesize:8,
                startTime:'',
                endTime:'',
                searchInput:'',
                selectedNode:{id:''},
                disabledAddSchema:false,
                loading: true,
                orderDirection: 'DESC',
                field: 'lastModifiedTime',
                historySchemaEntity: [], //存储schema的历史版本信息
                objectHistory:{},////存储schema的历史版本对象信息
                schemaEntity: {}, // schema 的版本显示的弹框
            }
        },
        methods: {
            //修改schema的版本号调用的方法
            changeSchemaVersion(callback, row, rowIndex){
                var that = this;
                // 列表下拉，发送请求查看history
                if (callback == true) {
                    that.objectHistory = {}
                    that.loading = true
                    var oid = row.oid ? row.oid : row.id
                    getHistorySchema(oid).then(res => {
                        that.loading = false;
                        that.historySchemaEntity = res
                        res.forEach(item=>{
                            that.objectHistory[item.version] = item
                        })
                    })
                }else{
                    //收回下拉菜单弹出文本框
                    that.schemaEntity = that.objectHistory[row.version]
                    that.$set(that.table.content, rowIndex, that.objectHistory[row.version])
                    this.handleSelectionChange()
                }
            },
            getNavId(naId,navLoading, owner){
                let _this =this;
                this.loading = navLoading;
                if(this.loading == false){
                    _this.showTableList = true;
                }
                _this.selectedNode.id = naId;
                _this.owner = owner;
                let parameter=queryObject();
                this.listTable(parameter);

            },
            handleSizeChange: function (size) {
                this.pagesize = size;
                // this.parameter = createParameter().Build(this.buildParameters(this.pagesize,this.currentPage,this.startTime,this.endTime,this.searchInput))
                this.listTable()
            },
            handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
                //this.parameter = this.buildParameters(this.pagesize,this.currentPage,this.startTime,this.endTime,this.searchInput)
                this.listTable()
            },
            //选中某条数据
            handleSelectionChange: function handleSelectionChange(val) {
                var selection = val? val: this.$refs.multipleTable.selection;
                selection ? this.$emit('thisSelectSchemaVal', selection[0], this.selectedNode.id): ''
                if(selection.length === 0){
                    this.mlSelVal.name = '';
                    this.$emit('thisSelectSchemaVal',this.mlSelVal);
                }else if(selection.length === 1){
                    this.mlSelVal.datasetName = selection[0].name;
                    this.mlSelVal.id = selection[0].id;
                    sessionStorage.setItem("schemaId",this.mlSelVal.id)
                }else {
                    if (!this.multipleTable) {
                        this.$message({
                            message: '请选择一条数据！',
                            type: 'error'
                        });
                        this.$refs.multipleTable.toggleRowSelection(selection[0]);
                    }else{
                        this.$emit('thisSelectSchemaVal', selection, this.selectedNode.id);
                    }
                    return false;
                }
            },
            //table查询的列表
            searchListTable: function (parameter, type, startTime,endTime, searchInput,pagesize) {
                var that = this;
                that.currentPage = 1
                if(pagesize)that.pagesize = pagesize;
                that.startTime = startTime;
                that.endTime = endTime;
                if(searchInput!=undefined)that.searchInput = searchInput;
                var len = that.parameter.fieldList.length
                var tmpField = that.parameter.fieldList.slice(0)
                this.listTable()
            },
            //table list
            listTable:function (){
                var that = this
                that.parameter = that.buildParameters(that.pagesize,that.currentPage,that.startTime,that.endTime,that.searchInput);
                that.parameter = that.selectedNode.id?createParameter('parentId',that.selectedNode.id,'EQUAL').Build(that.parameter):that.parameter
                // that.parameter = that.selectedNode.id?createParameter('owner',that.owner,'EQUAL').Build(that.parameter):that.parameter ;
                this.parameter.sortObject.field = this.field
                this.parameter.sortObject.orderDirection = this.orderDirection
                if(this.startTime==''){
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
                //获取列表请求
                if(that.selectedNode.id){
                    listData2(that.parameter, 'schemas').then(data => {
                        // console.log(data);
                        this.loading = false
                        this.table = data;
                    }, err => {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    })
                }
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
                this.currentPage = 1
                // this.parameter = that.buildParameters(that.pagesize,that.currentPage,that.startTime,that.endTime,that.searchInput, this.parameter.fieldList);
                // this.parameter = createParameter().Sort(this.field,this.orderDirection).Build(this.parameter,false)
                // this.parameter = createParameter().Limit(this.pagesize).Sort(that.field,that.orderDirection).Build();
                this.listTable();
            },
        },
        beforeRouteLeave: function (to, from, next) {
            schemaIn.$off();
            next();
        },
        mounted() {
            var that = this;
            //  刷新列表
            schemaIn.$on('refreshList',(parameter, type) => {
                that.parameter =createParameter('parentId',that.parentId,'EQUAL').Build();
                that.listTable(that.parameter, type);
                that.showTableList = true
            });
            // 用$on事件来接收参数
            schemaIn.$on('selectSchemaLabel', (data) => {
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
                that.owner = data.owner;
                if(!data.id){
                    that.table = [];
                }else{
                    that.listTable();
                }
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
        /*padding-top: 10px;*/
        width: 100%;
        height: calc(100% - 20px);

        .dtTableUp{
            float: left;
            width: 100%;
            margin: 0px 0px 10px 0px;

            .diSearch{
                float: left;
            }
        }
        .content {
            float: left;
            width: 100%;
            height: 90%;
            margin-bottom: 10px;

            .dtTableLeft {
                float: left;
                width: 20%;
                height: calc(100% - 60px);
                background-color: #f2f3f9;
                border: 1px solid #eeeeee;
            }

            .dtTableRight {
                float: left;
                width: 79%;
                height: 100%;
                background-color: #ffffff;
            }

        }
        .addForm{
            padding-left: 0px;
        }
    }
    .el-table{
        border-right: none;
        border-top: none;
        border-left: none;
        box-shadow: 0px 0px 3px 0 rgba(0, 0, 0, 0.1);
    }
</style>
