<!-- steps参数 dataFlow Join join -->
<template>
    <div class="stepTable">
        <el-form id="bm-nodeset-join-form" ref="nodeSetData" :model="nodeSetData" label-width="150px">
            <el-form-item label="joinType">
                <el-tooltip class="item" effect="dark" content="join类型" placement="top">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-select class="selectClass" v-model="nodeData.joinType" placeholder="请选择" @change="joinTypeSelect">
                    <el-option value="inner"></el-option>
                    <el-option value="outer"></el-option>
                    <el-option value="left_outer"></el-option>
                    <el-option value="right_outer"></el-option>
                    <el-option value="leftsemi"></el-option>
                </el-select>
                <i class="sign" v-if="nodeData.joinType==''">{{'joinType'| cn}} 不能为空</i>
            </el-form-item>
            <el-form-item label="joinConditions">
                <el-tooltip class="item" effect="dark" content="左边为左输入字段，右边为右输入字段" placement="top">
                    <i class="parIcon el-icon-warning"></i>
                </el-tooltip>
                <el-table :data="joinConditionsArr.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width: 100%"
                          max-height="500" id="bm-join-form">
                    <el-table-column fixed type="index" width="60" :index="indexMethod">
                    </el-table-column>
                    <el-table-column prop="leftColumn" label="左(字段)">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content="scope.row.leftColumn == ''?'请点击选择字段':scope.row.leftColumn" placement="top">
                                <el-input placeholder="字段（必填）" v-model="scope.row.leftColumn" readonly @focus="(value) => leftColumn(value,scope.$index,joinConditionsArr)"></el-input>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="op" label="运算符">
                        <template slot-scope="scope">
                            <el-select class="selectClass" v-model="scope.row.op" placeholder="函数（必填）" @change="(value) => op(value,scope.$index,joinConditionsArr)">
                                <el-option value="="></el-option>
                                <el-option value=">"></el-option>
                                <el-option value=">="></el-option>
                                <el-option value="<"></el-option>
                                <el-option value="<="></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="rightColumn" label="右(字段)">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content="scope.row.rightColumn == ''?'请点击选择字段':scope.row.rightColumn" placement="top">
                                <el-input placeholder="字段（必填）" v-model="scope.row.rightColumn" readonly @focus="(value) => rightColumn(value,scope.$index,joinConditionsArr)"></el-input>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="80">
                        <template slot-scope="scope">
                            <div class="removeCondition">
                                <i title="移除当前对象" @click="removeCondition(scope.$index,joinConditionsArr)" class="i remove el-icon-remove-outline"></i>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                               :page-sizes="[8, 16, 50, 100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="joinConditionsArr.length">
                </el-pagination>
                <div class="adCondition">
                    <i @click="addCondition" class="i el-icon-circle-plus-outline"></i>
                </div>
            </el-form-item>
        </el-form>


        <el-dialog
                v-dialog-drag
                title="字段"
                :visible.sync="getFieldsDialogVisible"
                custom-class="gettFieldsDialog"
                :modal="false"
                :before-close="handleClose">
                <div class="dialog-content">
                    <getFields :getFields = "getFields" @selFieldsVal = "selFieldsVal"></getFields>
                </div>
        </el-dialog>

    </div>
</template>



<script>

    import getFields from '@components/design/designDraw/getFields.vue';

    export default {
        components: {
            getFields
        },
        data() {
            return {
                nodeData: {}, //节点参数信息
                currentPage: 1,
                pagesize: 8,
                getFieldsDialogVisible:false,
                joinConditionsArr: [],
                tableIndex:"",
                tablePosition:"",
                getFields:[]
            }
        },
        props: ["nodeSetData", "getSelFields"],
        watch: {
            nodeSetData(newValue, oldValue) {
                this.nodeData = newValue;
                this.joinConditionsArr = newValue.joinConditions;
            },
        },
        filters: {

        },
        methods: {
            handleSizeChange(val) {
                this.pagesize = val;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            indexMethod(index) {
                return (this.pagesize * (this.currentPage - 1)) + index + 1;
            },
            /**
             * joinTypeSelect 下拉框 绑定获取值
             * ------------------------------------------------------------------
             */
            joinTypeSelect: function(val) {
                this.nodeData.joinType = val;
            },
            handleClose:function(){
                this.getFieldsDialogVisible = false;
            },
            /**
             * joinConditions table 新增数据
             * ------------------------------------------------------------------
             */
            addCondition: function() {
                this.nodeData.joinConditions.push({
                    "leftColumn": "",
                    "op": "",
                    "rightColumn": ""
                })
            },
            /**
             * 移除 joinConditionsVal
             * ------------------------------------------------------------------
             */
            removeCondition: function(index, rows) {
                rows.splice(((this.currentPage - 1) * this.pagesize) + index, 1);
            },
            /**
             * joinConditions leftColumn 左（字段）绑定值
             * ------------------------------------------------------------------
             */
            leftColumn: function(val, index, rows) {
                this.getFieldsDialogVisible = true;
                this.tableIndex = (this.pagesize * (this.currentPage - 1)) + index;
                this.tablePosition = "left"
                // rows[(this.pagesize * (this.currentPage - 1)) + index].leftColumn = val;
                this.getFields = this.getSelFields[0].fields;
            },
            selFieldsVal: function (val) {
                // childValue就是子组件传过来的值
                if(this.tablePosition == "left"){
                    this.nodeData.joinConditions[this.tableIndex].leftColumn = val;
                }else if(this.tablePosition == "right"){
                    this.nodeData.joinConditions[this.tableIndex].rightColumn = val;
                }
                this.getFieldsDialogVisible = false;
            },
            /**
             * joinConditions op 运算符 绑定值
             * ------------------------------------------------------------------
             */
            op: function(val, index, rows) {
                rows[(this.pagesize * (this.currentPage - 1)) + index].op = val;
            },
            /**
             * joinConditions rightColumn 右（字段）绑定值
             * ------------------------------------------------------------------
             */
            rightColumn: function(val, index, rows) {
                this.getFieldsDialogVisible = true;
                // rows[(this.pagesize * (this.currentPage - 1)) + index].rightColumn = val;
                this.tableIndex = (this.pagesize * (this.currentPage - 1)) + index;
                this.tablePosition = "right"
                this.getFields = this.getSelFields[1].fields;
            },
        },
        mounted() {
            this.nodeData = this.nodeSetData;
            this.joinConditionsArr = this.nodeSetData.joinConditions;
        }
    }
</script>

<style scoped>
    .selectClass {
        width: 100%;
    }

    .adCondition {
        float: left;
        margin-top: 5px;

    }

    .adCondition i {
        color: #3e98fe;
    }

    .removeCondition i {
        color: #ff4949;
    }

    .sign {
        color: red;
        padding: 0px;
        font-size: 8px;
        font-style: normal;
    }

    .stepTable .el-form-item {
        margin-bottom: 0px !important;
        margin-top: 10px;
    }
</style>
