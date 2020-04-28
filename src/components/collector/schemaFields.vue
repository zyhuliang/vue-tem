<template>
    <section>
        <el-dialog
                :visible.sync="dialogSchemaFieldsVisible"
                :close-on-click-modal="false"
                :modal-append-to-body="false"
                title="分析字段选择"
        >
            <!--schemaFileds -->
            <div>
                <el-select v-model="selectTypes"
                           multiple
                           placeholder="请选择字段类型"
                           class="select-width"
                           @change="(value) => selectType(value)">
                    <el-option
                            v-for="item in allTypes"
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>

                <el-table id="bm-ch-resourceMan-analysisFields-table"
                          :data="fields.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                          @selection-change="handleSelectionChange"
                          ref="multipleTable"
                          :row-key="getRowKeys"
                          height="calc(100vh - 405px)"
                          class="datasetPreview">
                    <el-table-column type="selection"
                                     :reserve-selection="true"
                                     width="40"
                                     align="center">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="name"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="type"
                            label="type"
                            show-overflow-tooltip>
                    </el-table-column>
                </el-table>
                <el-pagination @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               :current-page="currentPage"
                               :page-sizes="[8, 16, 50, 100]"
                               :page-size="pagesize"
                               layout="total, sizes, prev, pager, next, jumper"
                               class="pagination"
                               :total="fields.length">
                </el-pagination>
            </div>

            <div slot="footer" class="dialog-footer">

                <el-button type="primary"
                           :disabled="multipleSelection.length == 0"
                           @click="executeAnalysis()"
                           name="bm-ch-resourceMan-dataAnalysis-ok">确定
                </el-button>
                <el-button @click="dialogSchemaFieldsVisible=false" name="bm-ch-resourceMan-dataAnalysis-cancel">取消
                </el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>
    import {previewObject,previewObjectCollector,getCollectorDetialLog } from '@api'

    export default {
        name: 'schemaFileds',
        data() {
            return {
                currentPage: 1,
                pagesize: 8,
                multipleSelection:[],//选中行数数据数组
                selectTypes:[],//筛选类型条件
                fields:[],//存储返回的schema字段
                allFields:[],//存储返回的schema全部字段
                dialogSchemaFieldsVisible:false,//是否显示字段选择页面
                allTypes :['string', 'byte', 'short', 'bigint', 'int', 'float', 'double', 'boolean', 'date', 'timestamp', 'binary', 'decimal'],//所有类型
            }
        },
        methods: {
            //筛选功能
            selectType (types) {
                let result = []
                // 防止连续输入 执行，如果 半秒之后不输入在执行
                clearTimeout(this.timer)
                this.fields = [];
                this.timer = setTimeout(() => {
                    //如果是没有选择字段类型默认显示全部字段
                    if(types.length ==0){
                        this.fields = this.allFields
                        this.currentPage = 1
                    }else{
                        for(var i =0;i<types.length;i++){
                            var type = types[i]
                            // 定义匹配正则
                            let reg = new RegExp(type, 'gim')
                            for (let index in this.allFields) {
                                let str = this.allFields[index].type
                                // 如果包含 true
                                if (str.match(reg)) {
                                    // 赋值给 总数据
                                    result.push(this.allFields[index])
                                }
                                this.timer = null
                            }
                        }
                        this.fields = result
                        this.currentPage = 1
                    }
                }, 500)
            },
            //多行选中保存值
            getRowKeys(row){
                return row.name;
            },
            //选中事件
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //改变当前页大小
            handleSizeChange(val) {
                this.pagesize = val;
            },
            //改变页数码
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            //显示字段配置页面
            showDialog(isShow, fields){
                this.dialogSchemaFieldsVisible = isShow;
                this.multipleSelection = [];
                this.selectTypes = []
                this.fields = fields
                this.allFields = fields
                //如果有数据被选中就清空
                if(this.$refs.multipleTable){
                    this.$refs.multipleTable.clearSelection()
                }
            },
            //执行分析
            executeAnalysis: function () {
                //拼接成name的数组
                var names = [];
                for(var i  = 0;i<this.multipleSelection.length;i++){
                    names.push(this.multipleSelection[i].name)
                }
                this.dialogSchemaFieldsVisible = false;
                this.$emit('executeAnalysis',names)
            },
        },
        mounted() {

        }
    }
</script>


<style lang="scss" scoped>
    .pagination{
        float: left;
    }
    .select-width{
        width: 100%;
        margin-bottom: 10px;
    }
</style>