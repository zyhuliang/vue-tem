<template>
    <section class="job-description">
        <!-- content -->
        <div class="stream-buttons-job-des">
            <el-row class="rightWidth">
                <!--<el-button icon="el-icon-caret-right" type="primary" plain @click="checkSQL">检测</el-button>-->
                <div class="btn-left">
                    <el-dropdown class="sel_down" trigger="click" >
                        <span class="el-dropdown-link" id='bm-str-jobMan-jobdes-edit-button'>
                            编辑<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown" >
                            <el-dropdown-item @click.native="sqlFormatter"><i class="icon iconfont icon-ir-text-add"></i>格式化</el-dropdown-item>
                            <el-dropdown-item @click.native="checkSQL"><i class="icon iconfont icon-ir-text-add"></i>语法检测</el-dropdown-item>
                            <el-dropdown-item @click.native="dialog"><i class="icon iconfont icon-ir-text-add"></i>字段导入</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-dropdown class="sel_down" trigger="click"  >
                        <span class="el-dropdown-link" id='bm-str-jobMan-jobdes-temp-button'>
                            模板<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown" >
                            <el-dropdown-item @click.native="selectTemplate(0, 8)"><i class="icon iconfont icon-ir-text-add"></i>从模板导入</el-dropdown-item>
                            <el-dropdown-item @click.native="createTemplate"><i class="icon iconfont icon-ir-text-add"></i>保存为模板</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-row>
        </div>
        <div class="descriptionContent">
            <ace-editor @getValue="getValue" @methods="methods" :dictionaries="dictionaries"  :isUseTableName="true"  :defaultsql="querySql" :sqlConfig="sqlConfig" />
            <div class="rightContent">
                <description-profile :entity="entity" @changeTableName="changeTableName"></description-profile>
            </div>
        </div>

        <div :class="draw?'clearfixDraw':'clearfix'">
            <el-tooltip class="run_stop_clear" effect="dark" content="debug" placement="top-end">
                <div v-if="!debugStatus"  @click="debugChange(!debugStatus)"><img class="imgDebug" src="../../../../assets//images/streamJob/run.png"/></div>
                <div v-if="debugStatus"  @click="debugChange(debugStatus)"><img class="imgDebug" src="../../../../assets//images/streamJob/stop.png"/></div>
            </el-tooltip>
            <el-tooltip class="run_stop_clear" effect="dark" content="clear" placement="top-end">
                <div @click="clearLog"><img class="imgClear" src="../../../../assets/images/streamJob/delete.png"/></div>
            </el-tooltip>
        </div>

        <el-collapse accordion v-model="drawActiveName" :class="draw?'collapse-height-draw':'collapse-height'" @change="changeLogDraw()">
            <template slot="title" class="collapse-header">

            </template>
            <el-collapse-item name="draw">
                <div class="log" v-if="isLog">
                    <div v-for="(log,i) in logs" :key="i"><pre>{{log}}</pre></div>
                </div>
                <div class="log" v-if="!isLog" >
                    <div><pre v-text="text"></pre></div>
                </div>
            </el-collapse-item>
        </el-collapse>

        <!--select template dialog-->
        <el-dialog
                :visible.sync="selectTemplateVisible"
                :close-on-click-modal="false"
                :modal-append-to-body="false"
                title="选择模板"
        >

            <div class="rf-swap dn-data">
                <el-table :data="tableData.list"
                          tooltip-effect="dark"
                          v-loading="loading"
                          id="bm-stream-jobManage-job-desc-table"
                          height="calc(100vh - 343px)"
                          @selection-change="handleSelectionChange"
                          style="width: 100%">
                    <el-table-column
                            type="selection"
                            width="40">
                    </el-table-column>
                    <el-table-column  label="名称" prop="name"  width="300">
                    </el-table-column>
                    <el-table-column label="内容" prop="content">
                    </el-table-column>
                </el-table>
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[8, 16, 50, 100]"
                        :page-size="pagesize"
                        class="paginationLeft"
                        layout="total, sizes, prev, pager, next, jumper"
                        name="ch-components-dataSourceInq-dataSourceInquire-pagination"
                        :total="tableData.total">
                </el-pagination>
            </div>

            <span slot="footer" class="dialog-footer">
			<el-button type="primary" @click="selectedRow">确定</el-button>
			<el-button @click="selectTemplateVisible = false">取消</el-button>
		</span>
        </el-dialog>
        <add-temp-name ref="addTempName" @addTempName="addTempName"></add-temp-name>
    </section>
</template>
<script>
// 编写 语句
import AceEditor from '@components/aceEditor/aceEditor'
import DescriptionProfile from './descriptionProfile/descriptionProfile'
import addTempName from '@views/stream/jobTemplate/addTmplateName.vue'
import { sqlSelectFields, debugJobLog, debugStopJob, debugJob, postJob, getTemplateList,postTemplate} from '@api'

export default {
    components: {AceEditor, DescriptionProfile,addTempName},
    data() {
        return {
            //日志信息的收缩状态
            draw: true,
            drawActiveName: [],
            sqlConfig: {
                height: '100%'
            },
            loading: false,
            logs: [],
            isLog: false,
            text: '',
            dictionaries: {},
            querySql:"",//sql的语句
            entity:{
                "jobDesc":{
                    "tableProfiles": [{
                        "schema": {
                            "id": "",
                            "name": "",
                            "fields": []
                        },
                        "dataset": {
                            "id": "",
                            "name": "",
                            "schemaId": "",
                            "schemaName": "",
                            "storage": "",
                            "storageConfigurations": {},
                            "dataformatConfiguration": {}
                        },
                        tableName:'',
                        tableType:'',
                        tableConfig:{},
                        datasetConfig:[],
                    }],
                    "querySql": [],
                    "udfs": [{
                        "type": "scalar",
                        "name": "",
                        "clazz": "",
                        "method":'',
                        "args": '',
                        "jarPath":'',
                        "returns":''
                    }],
                    settings: {
                        'streaming.flink.checkpoint.enabled': true,
                        'streaming.flink.checkpoint.interval.ms': '5000',
                        'streaming.flink.checkpoint.mode': "",
                        'streaming.flink.restartAttempts.enabled': true,
                        'streaming.flink.restartAttempts.delayInterval.sec': '30',
                        'streaming.flink.restartAttempts.num': "1",
                        'streaming.flink.state.backend.enabled': true,
                        'streaming.flink.state.backend.mode': 'memory',
                    }
                }
            },
            debugStatus: false,
            progressId: '',
            selectTemplateVisible: false,
            multipleSelection: [],
            tableData:{},
            sqlFormatter: null,
            dialog: null,
            pagesize:8,
            currentPage:1

        }
    },
    methods: {
        //改变当前页显示数据条数
        handleSizeChange: function (size) {
            this.pagesize = size;
            this.selectTemplate((this.currentPage-1)*size,size)
        },
        //改变当前页数
        handleCurrentChange: function(currentPage){
            this.currentPage = currentPage;
            this.selectTemplate((currentPage -1)*this.pagesize,this.pagesize)
        },
        //切换日志收缩状态的方法
        changeLogDraw(val){
            this.draw = val?false:!this.draw;
        },
        changeTableName (val) {
            this.buildEadiotData()
        },
        // 加载子页面的 格式化 和 显示弹框的方法
        methods (sqlFormatter, dialog) {
            this.sqlFormatter = sqlFormatter
            this.dialog = dialog
        },
        getValue (val) {
            this.querySql = val
        },
        //table选择复选框数据后调用的方法
        handleSelectionChange: function handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //选择模板
        selectTemplate: function (start,limit) {
            getTemplateList(start, limit).then(res =>{
                //更新数据
                this.tableData = res;
                this.loading = false;
                //弹出模板列表页的dialog框
                this.selectTemplateVisible = true;
            },error =>{
                var err = error.response.data.err
                this.$message({
                    message: err,
                    type: 'error',
                    duration: 1500
                });
            })
        },
        //确定选择的模板
        selectedRow: function () {
            //如果sql语句以分号结尾就不管，不是以分号结尾就添加分号
            var endingSemicolon = function (str) {
                if(str.length>0){
                    return (str.charAt(str.length-1) == ';') ? str:(str + ';');
                }else return '';
            }
            //将原有的sql保留并且添加分号
            this.querySql = endingSemicolon(this.querySql)
            //将多个模板内容拼接
            for(var i = 0;i <this.multipleSelection.length;i++){
                this.querySql += endingSemicolon(this.multipleSelection[i].content)
            }
            this.selectTemplateVisible = false;
        },
        //生成模板
        createTemplate:function () {
            //弹出生成模板的name框
            this.$refs.addTempName.dialogAddTemp ()
        },
        //添加模板名称的框的确定按钮
        addTempName:function (name) {
            var entity = {
                "name": name,
                "id": "",
                "desc": "",
                "content": this.querySql? this.querySql: []
            }
            postTemplate(entity).then(data => {
                //提示提交成功
                this.$message({
                    message: '模板添加成功！',
                    type: 'success',
                    duration: 1500
                });
            },error =>{
                var err = error.response.data.message
                if(err.indexOf('duplicate ') >-1)
                    err = '保存失败，此名称已存在'
                this.$message({
                    message: err,
                    type: 'error',
                    duration: 1500
                });
            })
        },
        //清除日志按钮方法
        clearLog: function () {
            this.text = '';
            this.logs = [];
        },

        //切换debugger按钮状态
        debugChange: function () {
            //点击按钮日志显示出来
            this.drawActiveName = 'draw'
            this.changeLogDraw('notDraw')
            this.debugStatus = !this.debugStatus
            //如果是开启debug
            if(this.debugStatus){
                //调用启动debugger的方法
                debugJob(this.entity).then((res) => {
                        this.progressId = res
                        // 调用成功天出提示信息
                        this.$message({
                            message: '恭喜你，调试状态已打开！',
                            type: 'success'
                        });
                    }, err => {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    }
                )
            } else{
                var tmpProgressId = this.progressId
                //停止debug的时候就删除progressId，不用再发log请求
                this.progressId = ''
                //调用停止debugger的方法
                debugStopJob(tmpProgressId).then((res) => {
                    // 停止之前要将滚动条放到最后位置
                    $('.log')[0].scrollTop = $('.log')[0].scrollHeight;
                    // 调用成功天出提示信息
                    this.$message({
                        message: '恭喜你，调试状态已关闭！',
                        type: 'success'
                    });
                }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                })
            }
        },
        //获取debug日志方法
        getDebugLog: function () {
            let height = $('.log-content').height()
            $('.log-content').css({
                marginTop: -height + 'px'
            });
            if (this.progressId) {
                var that = this;
                debugJobLog(this.progressId).then((res) => {
                    for (var i = 0; i < res.length; i++) {
                        that.logs.push(res[i]);
                        this.isLog = true;
                    }
                    if(res.length > 0){
                        $('.log')[0].scrollTop = $('.log')[0].scrollHeight;
                    }
                })
            }
        },
        checkSQL () {
            //点击按钮日志显示出来
            this.drawActiveName = 'draw'
            this.changeLogDraw('notDraw')
            this.loading = true;
            sqlSelectFields({
                querySql: this.entity.jobDesc.querySql
            }).then( (res) => {
                this.loading = false;
                this.text = res
                this.isLog = false
            }).catch( (err) => {
                this.loading = false;
                console.log(err)
            })
        },
        // 拼 ace editor 需要的 数据
        buildEadiotData() {
            this.entity = JSON.parse(sessionStorage.getItem('streamJobEntity'));
            //初始化表描述为默认选中值
            this.$emit('selectTableConfigActive',this.entity.jobDesc.tableProfiles.length)
            //将sql同步到页面用的样式
            this.querySql = this.entity.jobDesc.querySql ? this.entity.jobDesc.querySql.join(';') : ''
            /*
            * 在进入此页面时拼出一个想要的结构
            * dictionaries={
            *    table1:{
            *        schemas:['id','name']
            *    },
            *    table2:{
            *       schemas:['age','sex']
            *    }
            * }
            * */
            //如果有dataset
            if (!this.entity.jobDesc.tableProfiles[0].dataset.id ||!this.entity.jobDesc.tableProfiles) {
                return;
            }
            this.dictionaries = {}
            for (var i = 0; i < this.entity.jobDesc.tableProfiles.length; i++) {
                //表类型不是结果表，兵器选择数据集之后才能添加到提示里面去
                if (this.entity.jobDesc.tableProfiles[i].tableType != 'result' && this.entity.jobDesc.tableProfiles[i].dataset.id) {
                    //字段名称的数组
                    var fieldsName = []
                    for (var j = 0; j < this.entity.jobDesc.tableProfiles[i].schema.fields.length; j++) {
                        fieldsName.push(this.entity.jobDesc.tableProfiles[i].schema.fields[j].name)
                    }
                    //如果表类型不是结果表就要将其添加到字段提示上
//                    !this.dictionaries[this.entity.jobDesc.tableProfiles[i].tableName] && (this.dictionaries[this.entity.jobDesc.tableProfiles[i].tableName] = {})
                    this.$set(this.dictionaries,[this.entity.jobDesc.tableProfiles[i].tableName],{})
                    this.$set(this.dictionaries[this.entity.jobDesc.tableProfiles[i].tableName],'schemas',fieldsName)
                }
            }
        }
    },
    watch: {
        querySql:{
            handler:function(newValue, oldValue){
                //去掉最后一个分号
                newValue = (newValue.substring(newValue.length - 1) == ';') ? newValue.substring(0, newValue.length - 1) : newValue;
                this.entity.jobDesc.querySql = newValue.split(';');
            }
        },
    },
    beforeDestroy () {
        //在切换之前将此次修改同步到session中
        sessionStorage.setItem("streamJobEntity", JSON.stringify(this.entity));
        //切换页面时停止定时更新任务
        clearInterval(this.referenceProgress);
    },
    created(){
        this.buildEadiotData()
        //每隔2000ms执行一次查看日志方法
        this.referenceProgress = setInterval(this.getDebugLog, 2000);
    }

}

</script>

<style scoped lang="scss">
    .btn-left{
        float: left;
        .el-dropdown-link{
            margin: 8px 5px 8px 5px;
        }
        font-size: 20px;
    }
    .job-description{
        height: calc(100vh - 100px);
        .stream-buttons-job-des{
            width:100%;
            .rightWidth{
                min-width: calc( 100% - 816px);
                width: 40%;
            }
        }
        > .el-button{
            margin: 5px 10px;
        }
        .descriptionContent{
            height: calc(100vh - 180px);
            display: flex;
            margin-bottom: 10px;
            .rightContent{
                width: 60%;
                border: 1px solid #ccc;
            }
        }
        .clearfix{
            z-index: 10;/*z-index的值谁大谁在上面*/
            opacity:1;/*透明度*/
            position: fixed;
            bottom:180px;

            .imgClear{
                background-color: #fff;
                width: 20px;
                margin-left: 10px;
            }
            .imgDebug{
                background-color: #fff;
                width: 28px;
                margin-top: -5px;
            }
            .run_stop_clear{
                float: left;
            }
        }

        .clearfixDraw{
            z-index: 10;/*z-index的值谁大谁在上面*/
            opacity:1;/*透明度*/
            position: fixed;
            bottom:6px;

            .imgClear{
                background-color: #fff;
                width: 20px;
                margin-left: 10px;
            }
            .imgDebug{
                background-color: #fff;
                width: 28px;
                margin-top: -5px;
            }
            .run_stop_clear{
                float: left;
            }
        }
        .collapse-height{
            z-index: 9;/*z-index的值谁大谁在上面*/
            opacity:1;/*透明度*/
            position: fixed;
            bottom:0px;
            right: 0px;
            width: 100%;
            height: 220px;
            .log{
                overflow-y: auto;
                height: 170px;
            }
            .button-color{
                float: right;
                color: #fff;
            }
        }
        .collapse-header{
            background-color: #f5f7fa;
        }
        .collapse-height-draw{
            z-index: 9;/*z-index的值谁大谁在上面*/
            opacity:1;/*透明度*/
            position: fixed;
            bottom:0px;
            right: 0px;
            width: 100%;
        }
        .paginationLeft{
            float: left;
        }
    }
</style>