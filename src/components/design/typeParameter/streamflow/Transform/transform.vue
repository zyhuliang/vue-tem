<!-- steps参数 dataFlow Transform transform -->
<template>
        <div>
                <el-form id="bm-nodeset-transform-form" ref="nodeSetData" :model="nodeSetData" label-width="150px">
                        <el-form-item :label="editorLabel| cn">
                                <el-tooltip  class="item" effect="dark" content="处理字段的表达式" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                               <!-- <el-tooltip v-else class="item" effect="dark" :content="key| cn" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>-->
                                {{' 使用 Ctrl-Shift-Alt-I 插入字段      Ctrl-Shift-Alt-F 格式化'}}
                                <el-table :data="expressionsArr.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width: 100%"
                                          max-height="500" id="bm-nodeset-transform-table">
                                    <el-table-column
                                            fixed
                                            type="index"
                                            width="60"
                                            :index="indexMethod">
                                    </el-table-column>
                                    <el-table-column label="字段">
                                        <template slot-scope="scope">
                                            <ace-editor @getValue="(value) => expressionsVal(value,(currentPage-1)*pagesize + scope.$index,expressionsArr)" :isUseTableName="false" :dictionaries="schemas"  :defaultsql="expressionsArr[(currentPage-1)*pagesize + scope.$index]"/>
                                        </template>
                                    </el-table-column>
                                    <el-table-column fixed="right" label="操作" width="80">
                                        <template slot-scope="scope">
                                            <div class="removeExpressions(scope.$index)">
                                                <i @click="removeExpressions(scope.$index,expressionsArr)" title="删除当前表达式" class="i remove el-icon-remove-outline"></i>
                                            </div>
                                            <div class="addExpressions">
                                                <i @click="addExpressions(scope.$index)" title="当前行下方新增表达式" class="i add el-icon-circle-plus-outline"></i>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <div class="addExpressions">
                                    <i @click="addExpressions()" title="新增表达式" class="i add el-icon-circle-plus-outline"></i>
                                </div>
                                <div class="uploadExpressions">
                                    <i @click="uploadExpressions" title="批量导入表达式" class="i upload fa fa-upload"></i>
                                </div>
                                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                                               :page-sizes="[8, 16, 50, 100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="expressionsArr.length">
                                </el-pagination>
                                <i class="sign"  v-if="bOk">{{'expressions'| cn}} 不能为空</i>
                        </el-form-item>
                </el-form>

                <!-- expressions批量导入 -->
                <div v-if="dialogUploadVisible == true" class="nodeDialog">
                    <div class="diHeader">
                        <h3><i class="i titleIcon fa fa-upload"></i>&nbsp;批量导入</h3>
                        <span @click="dialogUploadVisible = false" class="el-icon-close"></span>
                    </div>
                    <div class="diContent">
                        <div class="rf-swap">
                            <el-input type="textarea" class="areaSize" v-model="upLoadVal" placeholder="请输入表达式(多个以'回车'作为分隔符)" @input="(value) => upLoadArea(value)" name="upLoadVal"></el-input>
                        </div>
                    </div>
                    <div slot="footer" class="diFooter">
                        <el-button type="primary" @click="submitUpload" name="uploadSure">确定</el-button>
                        <el-button @click="dialogUploadVisible = false" name="uploadCancel">取消</el-button>
                    </div>
                </div>
        </div>
</template>

<script>
    // 编写 语句
    import AceEditor from '@components/aceEditor/aceEditor'
    export default {
        components: {
            AceEditor
        },
        data() {
            return {
                nodeData:{},  //存放节点参数信息
                bOk: false,
                dialogUploadVisible : false,
                upLoadVal:"",
                editorLabel:'',
                currentPage: 1,
                pagesize: 8,
                expressionsArr:[]
            }
        },
        props:["nodeSetData", 'schemas'],
        watch: {
            nodeSetData: {
                handler(newValue, oldValue) {
                    this.currentPage= 1,
                    this.expressionsArr =this.expressionsArr.slice((this.currentPage-1)*this.pagesize,this.currentPage*this.pagesize)
                    this.nodeData = newValue;
                    this.expressionsArr = newValue.expressions;
                    if(this.nodeData.expressions == ""){
                        // 默认值必须有空格 ace 的 bug
                        this.nodeData.expressions = [" "];
                    }else {
                        this.nodeData.expressions =newValue.expressions;
                    }
                    this.blurData()
                },
                immediate: true
            },
            expressionsArr: {
                handler(newValue,oldValue){
                    this.nodeData.expressions = newValue
                },
                deep: true
            }
        },
        filters:{

        },
        methods: {
            handleSizeChange(val) {
                this.pagesize = val;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            indexMethod(index){
                return (this.pagesize * (this.currentPage - 1)) + index + 1;
            },
            /**
             * expressionsVal textarea数组 绑定动态获取值
             * ------------------------------------------------------------------
             */
            expressionsVal:function (val, index, row) {
                if (!val) {
                    this.bOk = true
                } 
                this.nodeData.expressions[index]=val;
                this.$set(this.nodeData.expressions,index, this.nodeData.expressions[index])
                // this.$emit('nodeExpression',val,index)
                this.blurData()
            },
            /**
             * 添加 expressionsVal
             * ------------------------------------------------------------------
             */
            addExpressions:function (index) {
                /*
                * 获取选中行的index
                * 有index，在寻中行下方添加数据
                * （因为是下方所以索引值+1）
                * 没有index，在数组末尾添加数据
                * */

                var i = index == undefined ? this.expressionsArr.length : ((this.currentPage - 1 ) * this.pagesize) + index
                this.expressionsArr.splice( i+1, 0, '')
                this.blurData()
            },
            /**
             * 移除 expressionsVal
             * ------------------------------------------------------------------
             */
            removeExpressions:function (index, rows) {
                rows.splice(((this.currentPage - 1 ) * this.pagesize) + index, 1);
                this.blurData()
                console.log(this.currentPage)
                if (rows.length % this.pagesize === 0 && this.currentPage !== 1) {
                    this.currentPage = this.currentPage - 1
                }
            },
            /**
             * 批量导入 expressionsVal
             * ------------------------------------------------------------------
             */
            uploadExpressions : function () {
                this.dialogUploadVisible = true;
                this.upLoadVal = "";
            },
            /**
             * 监听值 批量导入 expressionsVal
             * ------------------------------------------------------------------
             */
            upLoadArea : function (val) {
                this.upLoadVal = val.replace("\r\n","；");
            },
            /**
             * 确认 批量导入 expressionsVal
             * ------------------------------------------------------------------
             */
            submitUpload :function () {
                var _this = this;
                var upArr= new Array(); //定义一数组
                if(_this.upLoadVal == ""){
                    this.dialogUploadVisible = false;
                }else{
                    upArr = _this.upLoadVal.split("\n"); //字符分割
                    for (var i=0;i<upArr.length ;i++ ){
                        _this.expressionsArr.push(upArr[i]);
                    }
                    this.dialogUploadVisible = false;
                }
            },
            blurData: function() {
                this.nodeSetData = this.nodeData
                var _this = this;
                var arr = []
                for(var i=0; i<this.nodeData.expressions.length; i++){
                    if(_this.nodeData.expressions[i] == "" || _this.nodeData.expressions[i] == " "){
                        arr.push(true)
                    }else {
                        arr.push(false)
                    }
                }
                if(arr.indexOf('true') == '-1'){
                    _this.bOk = false
                }
                for(var k=0;k<arr.length; k++){
                    if(arr[k] ==true){
                        _this.bOk = true;
                    }
                }
            }
        },
        mounted() {
            this.nodeData = this.nodeSetData;
            this.expressionsArr =this.nodeSetData.expressions;
            this.blurData()
            console.log(this.nodeData);
            
            for(var i in this.nodeData){
            	if(i!=='interceptor' && i!=='sessionCache'){
            		this.editorLabel=i;
            		console.log(this.editorLabel);
            	}
            }
            
            
            if(this.nodeData.expressions == ""){
                this.nodeData.expressions = [""];
            }else {
                this.nodeData.expressions =this.nodeSetData.expressions;
            }
        }
    }

</script>

<style scoped>
        .addExpressions{
            float: left;
            right: 0px;
            top: 0px;
        }
        .uploadExpressions{
            float: left;
            margin-left: 10px;
        }
        .removeExpressions{
            float: left;
            margin-left: 10px;
        }
        .i{
            color: #3e98fe;
        }
        .remove{
            color: #ff4949;
            cursor: pointer;
        }
        .add{
            cursor: pointer;
        }
        .upload{
            cursor: pointer;
            color: #67C23A;
        }
        .titleIcon{
            color: #ffffff;
        }
        .sign{ 
            color: red;
            padding:0px;
            font-size:8px;
            margin-left: 10px;
            font-style:normal;
        }
</style>