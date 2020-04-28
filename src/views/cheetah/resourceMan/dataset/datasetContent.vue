<template>
    <div>
        <el-dialog v-dialog-drag
                   :visible.sync="dialogContentQueryVisible"
                   :close-on-click-modal="false" 
                   :modal-append-to-body="false"
                   :title="'内容查询'"
                   custom-class="dialogClass"
        >
            <div>
                <el-table 
                    :data="queryData"
                    style="width: 100%"
                    height="210">
                    <el-table-column
                        fixed
                        type="index"
                        width="60">
                    </el-table-column>
                    <el-table-column prop="type" label="字段名">
                        <template slot-scope="scope">
                            <el-select class="selectClass" :value="scope.row.name" placeholder=""
                                        @change="(value) => fieldsType(value,scope.$index,queryData)">
                                <el-option 
                                    v-for=" (item,index) in schemaOption" 
                                    :value="item.name" 
                                    :label="item.name"
                                    :key="index">
                                    </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="description" label="字段值">
                        <template slot-scope="scope">
                            <el-input :value="scope.row.value" placeholder="描述"
                                        @input="(value) => fieldsDescription(value,scope.$index,queryData)"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column  label="操  作" width="200">
                        <template slot-scope="scope">
                            <i :name="'bm-ch-resourceMan-schema-field-delete-icon'+scope.$index" title="移除当前对象"
                                @click="removeField(scope.$index,scope.row)"
                                v-if="queryData.length > 1 || (queryData.length == 1 )"
                                class="el-icon-delete"></i>
                            <i :name="'bm-ch-resourceMan-schema-field-plus-input-row-icon-add'"
                                @click="addField(scope.$index)"
                                class="el-icon-circle-plus-outline data-add">
                            </i>
                            <el-button @click="queryList()" v-if="scope.$index==0">
                                查询
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table> 
                <el-table 
                    v-loading="loading"
                    :data="tableData"
                    style="width: 100%"
                    height="420">
                    <el-table-column
                      v-for="(item,key) in tableData[0]" 
                      :key="key"
                      :prop="key" 
                      :label="key">
                    </el-table-column>
                </el-table> 
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitContent()"
                           name="bm-ch-resMan-dbdataset-submitSchemaTree-schema-ok">确定
                </el-button>
                <el-button @click="submitContent()"
                           name="bm-ch-resMan-dbdataset-submitSchemaTree-schema-cancel">取消
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {backendQuery} from '@api';
export default {
    data(){
        return {
            dialogContentQueryVisible:false,
            queryData:[
                {
                    name:'',
                    value: ''
                }
            ],
            tableData: [{}],
            schemaOption:[],
            name: '',
            loading: false
        }
    },
    watch:{
        queryData:{
            handler(val){
                console.log(val)
            },
            deep: true
        }
    },
    methods:{
        showdialog(status, data){
            this.dialogContentQueryVisible = status 
            this.schemaOption = data.schema.fields
            this.name = data.name
            console.log('status data',data)
        },
        fieldsType(val, index, row){
            this.queryData[index].name = val;
        },
        fieldsDescription: function (val, index, row) {
            this.queryData[index].value = val;
        },
        //添加字段
        addField(index) {
            /*
            * 如果有指定索引
            * 在索引行下方添加数据
            * 没有索引默认在数组最后添加数据
            * 新添加数据默认值是数组长度+1
            * */
            var i = index != undefined ? index + 1 : (this.queryData.length + 1)
            var addField = {
                name: '',
                value: '',
            }
            this.queryData.splice(i, 0, addField)
        },
        //删除字段
        removeField(index, row) {
            // 删除视图的数据
            this.queryData.splice(index, 1);
        },
        queryList(){
            let resData = {}
            this.queryData.forEach((item,index)=>{
                
                resData[item.name] = item.value;
            })
            this.loading = true
            backendQuery(resData,this.name).then(res=>{
                this.loading = false
                this.tableData = res
            },err=>{
                this.$message({
                    message:err.message,
                    type: 'error'
                    
                })
                this.loading = false
            })
            console.log(resData)
        },
        submitContent(){
            this.dialogContentQueryVisible = false;
            this.queryData = [
                {
                    name:'',
                    value: ''
                }
            ]
        }
    }
}
</script>
<style >

</style>