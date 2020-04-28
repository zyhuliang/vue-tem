<template>

    <section id="bm-qa-analysisTemplate">
        <el-row class="btnClass">
            <div class="btn-left" id="bm-qa-analysisTemplate-search">
                <el-input placeholder="请输入分析模板名称" v-model="searchInput"
                          name="bm-qa-analysisTemplate-search-input"
                          @keyup.enter.native="searchTable" class="input-with-search">
                    <el-button slot="append" @click="searchTable"
                               name="bm-qa-analysisTemplate-search-btn"
                               icon="icon iconfont icon-ir-search"></el-button>
                </el-input>
                <el-date-picker
                        v-model="dateValue"
                        type="daterange"
                        @change="handledateValue"
                        value-format="timestamp"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
            </div>
            <div class="btn-right" id="bm-qa-analysisTemplate-btns">
                <el-button type="info" @click="newTemplate" name="bm-qa-analysisTemplate-btns-new"><i
                        class="icon iconfont icon-ir-add"></i>新建
                </el-button>
                <el-button type="info" @click="runRow('once')" name="bm-qa-analysisTemplate-btns-run"
                           :disabled="multipleSelection.length != 1"><i class="icon iconfont icon-ir-start"></i>运行
                </el-button>
                <el-button type="info" @click="runRow('cron')" name="bm-qa-analysisTemplate-btns-cycle"
                           :disabled="multipleSelection.length != 1"><i class="icon iconfont icon-ir-operation"></i>周期
                </el-button>
                <el-button type="info" @click="delTable" name="bm-qa-analysisTemplate-btns-del"
                           :disabled="multipleSelection.length == 0"><i
                        class="icon iconfont icon-ir-directory-delete"></i>删除
                </el-button>
            </div>
        </el-row>

        <el-row class="rf-swap">
            <el-table
                    id="bm-qa-analysisTemplate-table"
                    :data="table.content"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                    @sort-change="getOrder"
                    v-loading="loading"
                    height="calc(100vh - 200px)"
            >
                <el-table-column
                        type="selection"
                        width="40">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="主键"
                        width="50"
                        v-if="show">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="分析模板"
                        sortable="custom"
                >
                    <template slot-scope="scope">
                        <el-tooltip placement="top" effect="light">
                            <div slot="content">{{scope.row.id}}</div>
                            <i class="el-icon-info"></i>
                        </el-tooltip>
                        <span class="seeName"
                              @click="handleEdit(scope.row.id, scope.$index, scope.row)">{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="规则"
                        width="100">
                    <template slot-scope="scope">
                        <span class="editRules" @click="handEditRules(scope.row.id, scope.$index, scope.row)"
                              sortable="custom">编辑规则</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="相关任务"
                        width="100">
                    <template slot-scope="scope">
                        <span class="relatedTasks"
                              @click="handRelatedTasks(scope.row.id, scope.$index, scope.row)">任务</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="processDataId"
                        label="数据集"
                        sortable="custom"
                >
                </el-table-column>
                <el-table-column
                        prop="preProcessFlowName"
                        label="预处理流程"
                        sortable="custom"
                >
                </el-table-column>
                <el-table-column
                        prop="creator"
                        label="创建人"
                        width="100"
                        sortable="custom"
                >
                </el-table-column>
                <el-table-column
                        prop="lastModifiedTime"
                        label="修改时间"
                        width="180"
                        :formatter="dateFormat"
                        sortable="custom"
                >
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
        </el-row>
        <router-view></router-view>

        <!-- 执行计划设置 -->
        <el-dialog title="执行计划设置" :visible.sync="dialogFormVisible" :modal-append-to-body="false">
            <el-form :model="programForm" id="bm-qa-analysisTemplate-form">
                <el-form-item :label="'Flow名称'| cn" :label-width="formLabelWidth">
                    <el-input v-model="programForm.flowName" auto-complete="off"
                              name="bm-qa-analysisTemplate-flowName"></el-input>
                </el-form-item>
                <el-form-item :label="'Schedule名称'| cn" :label-width="formLabelWidth">
                    <el-input v-model="programForm.name" auto-complete="off"
                              name="bm-qa-analysisTemplate-name"></el-input>
                </el-form-item>
                <el-form-item label="开始时间" :label-width="formLabelWidth">
                    <el-date-picker
                            v-model="programForm.createTime"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            placeholder="选择开始日期">
                    </el-date-picker>
                    <el-time-picker
                            v-model="startValue"
                            value-format="HH:mm:ss"
                            format="HH:mm:ss"
                            placeholder="选择开始时间">
                    </el-time-picker>
                </el-form-item>
                <el-form-item label="结束时间" :label-width="formLabelWidth" v-if="cycleClick">
                    <el-date-picker
                            v-model="programForm.finishTime"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            placeholder="选择结束日期">
                    </el-date-picker>
                    <el-time-picker
                            v-model="endValue"
                            value-format="HH:mm:ss"
                            format="HH:mm:ss"
                            placeholder="选择结束时间">
                    </el-time-picker>
                </el-form-item>
                <el-form-item label="执行周期" :label-width="formLabelWidth" v-if="cycleClick">
                    每：
                    <el-select v-model="programForm.executionCycle" name="bm-qa-analysisTemplate-year">
                        <el-option
                                v-for="(item,index) in timeList"
                                :key="index"
                                :label="item"
                                :value="item"
                        >
                        </el-option>
                    </el-select>
                    <br/>
                    <el-select v-model="month" v-if="programForm.executionCycle=='年'"
                               name="bm-qa-analysisTemplate-month">
                        <el-option
                                v-for="(item,index) in monthList"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                        >
                        </el-option>
                    </el-select>
                    <el-select v-model="day" v-if="programForm.executionCycle=='月' || programForm.executionCycle=='年'"
                               name="bm-qa-analysisTemplate-day">
                        <el-option
                                v-for="(item,index) in dayList"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                        >

                        </el-option>
                    </el-select>
                    <el-select v-model="week" v-if="programForm.executionCycle=='周'" name="bm-qa-analysisTemplate-week">
                        <el-option
                                v-for="(item,index) in weekList"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                        >
                        </el-option>
                    </el-select>
                    <el-select v-model="hour" v-if="programForm.executionCycle=='日'|| programForm.executionCycle=='周'
	          	|| programForm.executionCycle=='月' ||programForm.executionCycle=='年'"
                               name="bm-qa-analysisTemplate-hour">
                        <el-option
                                v-for="(item,index) in hourList"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                        >
                        </el-option>
                    </el-select>
                    <el-select v-model="minute" v-if="programForm.executionCycle=='时' ||
	          	programForm.executionCycle=='日' || programForm.executionCycle=='周' || programForm.executionCycle=='月'
	          	||programForm.executionCycle=='年'" name="bm-qa-analysisTemplate-minute">
                        <el-option
                                v-for="(item,index) in minutesList"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="采样方式" :label-width="formLabelWidth">
                    <el-select v-model="programForm.sampleType" @change="selsampleType" style="width: 100%"
                               name="bm-qa-analysisTemplate-sampleType">
                        <el-option label="none" value="none"></el-option>
                        <el-option label="bernoulli" value="bernoulli"></el-option>
                        <el-option label="poisson" value="poisson"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="采样率" :label-width="formLabelWidth">
                    <el-select v-model="samSelVal" :disabled="sampleFrDisabled" style="width: 100%"
                               name="bm-qa-analysisTemplate-samSelVal">
                        <el-option v-for="(item,index) in programForm.sampleFraction"
                                   :value="item"
                                   :label="item"
                                   :key="index"
                                   @change="samCurrentSel"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文件系统" :label-width="formLabelWidth">
                    <el-input v-model="programForm.outputEngine" :disabled="outputEnDisabled" auto-complete="off"
                              name="bm-qa-analysisTemplate-outputEngine"></el-input>
                </el-form-item>
                <el-form-item label="数据格式" :label-width="formLabelWidth">
                    <el-select v-model="programForm.outputFormat" style="width: 100%"
                               name="bm-qa-analysisTemplate-outputFormat">
                        <el-option label="parquet" value="parquet"></el-option>
                        <el-option label="csv" value="csv"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="失效天数" :label-width="formLabelWidth">
                    <el-input v-model="programForm.expiredTime" auto-complete="off"
                              name="bm-qa-analysisTemplate-expiredTime"></el-input>
                </el-form-item>
                <el-form-item label="数据集路径" :label-width="formLabelWidth">
                    <el-input v-model="programForm.outputDatasetDir" auto-complete="off"
                              name="bm-qa-analysisTemplate-outputDatasetDir"></el-input>
                </el-form-item>
                <el-form-item label="输出路径" :label-width="formLabelWidth">
                    <el-input v-model="programForm.outputBaseDir" auto-complete="off"
                              name="bm-qa-analysisTemplate-outputBaseDir"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" id="bm-qa-analysisTemplate-footer">
                <el-button type="primary" @click="submitFormVisible" name="bm-qa-analysisTemplate-sure">确定</el-button>
                <el-button @click="dialogFormVisible = false" name="bm-qa-analysisTemplate-cancle">取消</el-button>
            </div>
            <implement :flowId="flowId" ref="implement"></implement>
        </el-dialog>

    </section>
</template>
<script>
    import implement from '@components/implement/implement'
    import {atgetDate, atdelTbaleDate, addflowTbaleDate, createSchedule} from '@api';
    import {createParameter} from '@components/function/queryParameter';
    import Bus from './bus.js'
    //var parameter = queryObject();
    export default {
        components: {
            implement,
        },
        data() {
            return {
                flowId: '',
                startValue: new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(),
                endValue: new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(),
                showLineageEnable: false,
                showNotifyOutput: false,
                selVal: '',
                queueSelVal: '',
                samSelVal: '',
                table: [],
                multipleSelection: [],
                dialogFormVisible: false,
                cycleClick: false,
                flag: '',
                modelId: [],
                modelName: '',
                timeList:['分','时','日','周','月','年'],
                minutesList: [],
                hourList: [],
                weekList: [
                    {
                        value: 'SUN',
                        label: '周  日'
                    },
                    {
                        value: 'MON',
                        label: '周  一'
                    },
                    {
                        value: 'TUE',
                        label: '周  二'
                    },
                    {
                        value: 'WED',
                        label: '周  三'
                    },
                    {
                        value: 'THU',
                        label: '周  四'
                    },
                    {
                        value: 'FRI',
                        label: '周  五'
                    },
                    {
                        value: 'SAT',
                        label: '周  六'
                    }
                ],
                dayList: [],
                monthList: [],
                minute: '0',
                hour: '0',
                week: 'SUN',
                day: '1',
                month: '1',
                programForm: {
                    flowId: '',
                    flowName: '',
                    flowType: '',
                    source: '',
                    schedulerId: '',
                    sTime: '',
                    //基本内容
                    name: '',
                    createTime: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
                    finishTime: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
                    executionCycle: '时',
                    sampleType: '',
                    sampleFraction: '',
                    outputEngine: '',
                    outputFormat: '',
                    expiredTime: '',
                    outputDatasetDir: '',
                    outputBaseDir: '',
                    //高级内容
                    //all
                    debug: '',
                    datasetNullable: '',
                    lineageEnable: '',
                    notifyOutput: '',
                    debugRows: '',
                    //dataflow
                    master: '',
                    deployMode: '',
                    queue: '',
                    numExecutors: '',
                    driverMemory: '',
                    executorMemory: '',
                    executorCores: '',
                    verbose: '',
                    localDirs: '',
                    concatFiles: ''
                },
                runData: {
                    source: '',
                    configurations: {
                        startTime: '',
                        arguments: [
                            {
                                name: '',
                                value: '',
                                description: '采样方式',
                                disabled: false,
                                dependOn: 'false',
                                options: ["none", "bernoulli", "poisson"],
                            },
                            {
                                name: '',
                                value: '',
                                description: '采样率',
                                disabled: false,
                                dependOn: "sampleType.value=='none'",
                                options: ["0.001", "0.01", "0.1", "10000", "100000"],
                            },
                            {
                                name: '',
                                value: '',
                                description: '文件系统',
                                disabled: true,
                                dependOn: 'false',
                                options: null
                            },
                            {
                                name: '',
                                value: '',
                                description: '数据格式',
                                disabled: false,
                                dependOn: 'false',
                                options: ["parquet", "csv"]
                            },
                            {
                                name: '',
                                value: '',
                                description: '失效天数',
                                disabled: false,
                                dependOn: 'false',
                                options: null
                            },
                            {
                                name: '',
                                value: '',
                                description: '数据集路径',
                                disabled: false,
                                dependOn: 'false',
                                options: null
                            },
                            {
                                name: '',
                                value: '',
                                description: '输出路径',
                                disabled: false,
                                dependOn: 'false',
                                options: null
                            }
                        ],
                        properties: [],
                        endTime: '',
                    },
                    schedulerId: '',
                    name: '',
                    flowId: '',
                    flowName: '',
                    flowType: ''
                },
                formLabelWidth: '125px',
                dateValue: '',
                sampleFrDisabled: true,
                outputEnDisabled: true,
                startTime: false,
                endTime: false,
                searchInput: '',
                show: false,
                currentPage: 1,
                pagesize: 8,
                parameter: '',
                orderDirection: 'DESC',
                prop: 'lastModifiedTime',
                loading: true,
                template: "",
                rule: []
            }
        },
        methods: {
            samCurrentSel(selVal) {
                this.samSelVal = selval;
            },
            currentSel(selVal) {
                this.selVal = selVal;
            },
            queCurrentSel(selVal) {
                this.queueSelVal = selVal;
            },
            handleSizeChange: function (size) {
                this.pagesize = size;
                this.parameter = createParameter().Build(this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput))
                this.parameter.sortObject.field = this.prop
                this.parameter.sortObject.orderDirection = this.orderDirection
                this.listTable(this.parameter)
            },
            handleCurrentChange: function (currentPage) {
                this.currentPage = currentPage;
                this.parameter = this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput);
                this.parameter.sortObject.field = this.prop
                this.parameter.sortObject.orderDirection = this.orderDirection
                this.listTable(this.parameter);
            },
            handleSelectionChange: function handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            buildParameters: function () {
                var limit = this.pagesize;
                var offset = (this.currentPage - 1) * this.pagesize;
                var query = this.searchInput.length > 0 ? '%' + this.searchInput + '%' : '%';
                var parameter = createParameter().Limit(limit).Offset(offset).Build();
                if (query != '%') {
                    parameter = createParameter('name', query, "LIKE").Build(parameter);
                }
                if (this.dateValue) {
                    if (this.dateValue != '' && this.dateValue.length != 0) {
                        parameter = createParameter('lastModifiedTime', Number(this.dateValue[0]), 'GREATER_THAN').And('lastModifiedTime', Number(this.dateValue[1]), 'LESS_THAN').Build(parameter);
                    }
                }
                parameter.sortObject.field = this.prop
                parameter.sortObject.orderDirection = this.orderDirection
                return parameter;
            },
            handledateValue: function (val) {
                this.currentPage = 1;
                if (val == null) {
                    this.dateValue = [];
                } else {
                    this.dateValue = [val[0], val[1] + 86399000];
                }
                var parameter = this.buildParameters();
                this.listTable(parameter);
            },
            //table list
            listTable: function listTable(parameter) {
                // GET /someUrl
                this.loading = true,
                atgetDate(parameter).then(data => {
                    this.loading = false;
                    this.table = data;
                }, err => {
                    if (err.response.status == 500) {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    }
                })
            },
            //实现查询功能
            searchTable: function searchTable() {
                this.currentPage = 1;
                var parameter = this.buildParameters();
                this.listTable(parameter);
            },
            //监听查询回车事件
            searchKeyup: function () {
                this.currentPage = 1;
                var parameter = this.buildParameters();
                this.listTable(parameter);
            },
            //表格操作：删除
            delTable: function delTable() {
                if (this.multipleSelection.length == 0) {
                    this.$confirm('请至少选择一条数据操作', '提示', {
                        type: 'warning'
                    })
                    return false;
                }
                var tableRefresh = this;
                var tbIds = [];
                this.multipleSelection.forEach(function (i, index) {
                    var tdIds = i.id;
                    tbIds.push(tdIds);
                });
                tableRefresh.$confirm('真的要删除' + tbIds.length + '个分析模板?', '提示', {}).then(() => {
                    atdelTbaleDate(tbIds).then(data => {
                        tableRefresh.listTable(this.buildParameters());
                        tableRefresh.$message({
                            message: '恭喜你，删除已成功！',
                            type: 'success'
                        });
                    }, err => {
                        if (err.response.status == 500) {
                            this.$message({
                                message: err.response.message,
                                type: 'error',
                                duration: 1500
                            });
                        }
                    })
                })
            },
            //表格操作：运行/周期运行
            runRow: function runRow(run) {
                let tdIds = this.multipleSelection.map((item) => {
                    return item.id;
                });
                if (this.multipleSelection.length == 0) {
                    this.$confirm('请至少选择一条数据操作', '提示', {
                        type: 'warning'
                    })
                    return false;
                }
                if (run === 'cron') {
                    this.cycleClick = true;
                    this.flag = 'cron';
                } else {
                    this.cycleClick = false;
                    this.flag = 'once'
                }
                var tdName = this.multipleSelection[0].name;
                this.$confirm('真的要运行分析模板"' + tdName + '"?', '提示', {
                }).then(() => {
                    //创建flow请求
                    addflowTbaleDate({url: "/zmod/createFlow/" + tdIds[0], data: []}).then(data => {
                            //获取创建后flow的ID
                            this.flowId = data.flowId;
                            //弹出"执行计划设置"层
                            this.dialogFormVisible = true;
                            //获取"执行计划设置"的基本内容
                            this.programForm.flowName = data.flowDesc.name; //待定
                            this.programForm.name = data.flowDesc.name;
                            this.programForm.sTime = data.flowDesc.createTime;
                            this.programForm.sampleType = data.flowDesc.parameters[0].defaultVal;
                            //采样率
                            for (var i = 0; i < data.flowDesc.parameters.length; i++) {
                                if (data.flowDesc.parameters[i].name == 'sampleFraction') {
                                    this.programForm.sampleFraction = data.flowDesc.parameters[i].value;
                                    this.samSelVal = data.flowDesc.parameters[i].defaultVal;
                                }
                            }
                            this.programForm.outputEngine = data.flowDesc.parameters[2].defaultVal;
                            this.programForm.outputFormat = data.flowDesc.parameters[3].defaultVal;
                            this.programForm.expiredTime = data.flowDesc.parameters[4].defaultVal;
                            this.programForm.outputDatasetDir = data.flowDesc.parameters[5].defaultVal;
                            this.programForm.outputBaseDir = data.flowDesc.parameters[6].defaultVal;
                            //定义对象新数据
                            for (var i = 0; i < data.flowDesc.parameters.length; i++) {
                                this.runData.configurations.arguments[i].name = data.flowDesc.parameters[i].name;
                                this.runData.configurations.arguments[i].value = data.flowDesc.parameters[i].defaultVal;
                            }
                            this.runData.flowId = data.flowId;
                            this.runData.flowName = data.flowDesc.name;
                            this.runData.flowType = data.flowDesc.flowType;
                            this.runData.source = data.flowDesc.source;
                            //定义运行/周期运行的 shedulerId
                            this.runData.schedulerId = run;
                            this.flowId = data.flowId
                        }, err => {
                            if (err.response.status == 500) {
                                this.$message({
                                    message: err.response.data.err,
                                    type: 'error',
                                    duration: 1500
                                });
                            }
                        }
                    ).catch(() => {
                        this.$message({
                            message: '分析规则未定义！',
                            type: 'error'
                        });
                    });
                })
            },//运行/周期运行方法结尾处
            //规则列表页的运行按钮
            runRowA(run) {
                if (run === 'cron') {
                    this.cycleClick = true;
                    this.flag = 'cron';
                } else {
                    this.cycleClick = false;
                    this.flag = 'once'
                }
                this.$confirm('真的要运行分析模板"'+this.modelName+'"?', '提示',{
                }).then(()=>{
                     addflowTbaleDate({url:"/zmod/createFlow/"+this.template,data:this.rule}).then(data => {
                        //获取创建后flow的ID
                        var flowId = data.flowId;
                        //弹出"执行计划设置"层
                        this.dialogFormVisible = true;
                        //获取"执行计划设置"的基本内容
                        this.programForm.flowName = data.flowDesc.name;//待定
                        this.programForm.name = data.flowDesc.name;
                        this.programForm.sTime = data.flowDesc.createTime
                        this.programForm.sampleType = data.flowDesc.parameters[0].defaultVal;
                        //采样率
                        for(var i=0;i<data.flowDesc.parameters.length;i++){
                        	if(data.flowDesc.parameters[i].name=='sampleFraction'){
                        		this.programForm.sampleFraction = data.flowDesc.parameters[i].value;
                        		this.samSelVal = data.flowDesc.parameters[i].defaultVal;
                        	}
                        }
                        this.programForm.outputEngine = data.flowDesc.parameters[2].defaultVal;
                        this.programForm.outputFormat = data.flowDesc.parameters[3].defaultVal;
                        this.programForm.expiredTime = data.flowDesc.parameters[4].defaultVal;
                        this.programForm.outputDatasetDir = data.flowDesc.parameters[5].defaultVal;
                        this.programForm.outputBaseDir = data.flowDesc.parameters[6].defaultVal;
                        //定义对象新数据
                        for(var i = 0; i < data.flowDesc.parameters.length; i++){
                            this.runData.configurations.arguments[i].name = data.flowDesc.parameters[i].name;
                            this.runData.configurations.arguments[i].value = data.flowDesc.parameters[i].defaultVal;
                        }
                        this.runData.flowId = data.flowId;
                        this.runData.flowName = data.flowDesc.name;
                        this.runData.flowType = data.flowDesc.flowType;
                        this.runData.source = data.flowDesc.source;
                        //定义运行/周期运行的 shedulerId
                        this.runData.schedulerId = run;
                        this.flowId = data.flowId;
                    }, err => {
                            if (err.response.status == 500) {
                                this.$message({
                                    message: err.response.data.err,
                                    type: 'error',
                                    duration: 1500
                                });
                            }
                        }
                    ).catch(() => {
                        this.$message({
                            message: '分析规则未定义！',
                            type: 'error'
                        });
                    });
                })
            },
            //运行 判断采集方式不为"none" 文件系统可选
            selsampleType: function (val) {
                if (this.programForm.sampleType === 'none') {
                    this.sampleFrDisabled = true;
                } else {
                    this.sampleFrDisabled = false;
                }
            },
            //按每时
            useMinute(minute) {
                return '0' + ' ' + minute + ' ' + '* * * ?';
            },
            //按每日
            useHour(hour) {
                return '0' + ' ' + this.minute + ' ' + hour + ' ' + '* * ?';
            },

            //按每周
            useWeek(week) {
                return '0 ' + this.minute + ' ' + this.hour + ' ? * ' + week;
            },
            //按每月
            useDay(day) {
                return '0 ' + this.minute + ' ' + this.hour + ' ' + this.day + ' * ?';
            },

            //按每年
            useYear(month) {
                return '0 ' + this.minute + ' ' + this.hour + ' ' + this.day + ' ' + month + ' ?';
            },
            //运行 提交数据
            submitFormVisible: function submitFormVisible() {
                //接收新数据值
                this.runData.configurations.arguments[0].value = this.programForm.sampleType;
                this.runData.configurations.arguments[1].value = this.samSelVal;
                this.runData.configurations.arguments[2].value = this.programForm.outputEngine;
                this.runData.configurations.arguments[3].value = this.programForm.outputFormat;
                this.runData.configurations.arguments[4].value = this.programForm.expiredTime;
                this.runData.configurations.arguments[5].value = this.programForm.outputDatasetDir;
                this.runData.configurations.arguments[6].value = this.programForm.outputBaseDir;
                this.runData.configurations.properties = this.$refs.implement.getRuntimeProperties()
                this.runData.configurations.startTime = new Date(this.programForm.createTime + ' ' + this.startValue).getTime();
                this.runData.configurations.endTime = this.programForm.sTime + this.programForm.expiredTime * 86400000;
                this.runData.name = this.programForm.name;
                this.runData.flowName = this.programForm.flowName; //待定
                //周期执行加入两个字段  cron、 cronType
                if (this.flag === 'cron') {
                    this.runData.configurations.cronType = 'simple';
                    //根据选择传入cron表达式
                    if (this.programForm.executionCycle == '分') {
                        this.runData.configurations.cron = '0 * * * * ?';
                    }
                    if (this.programForm.executionCycle == '时') {
                        this.runData.configurations.cron = this.useMinute(this.minute);
                    }
                    if (this.programForm.executionCycle == '日') {
                        this.runData.configurations.cron = this.useHour(this.hour);
                    }
                    if (this.programForm.executionCycle == '周') {

                        this.runData.configurations.cron = this.useWeek(this.week);
                    }
                    if (this.programForm.executionCycle == '月') {
                        this.runData.configurations.cron = this.useDay(this.day);
                    }
                    if (this.programForm.executionCycle == '年') {
                        this.runData.configurations.cron = this.useYear(this.month);
                    }
                }
                //submit run
                createSchedule(this.runData).then(data => {
                    this.$message({
                        message: '恭喜你，运行成功！',
                        type: 'success'
                    });
                    this.$router.push({name: "任务执行信息"});
                }, err => {
                    var error = err.response.data.err ? err.response.data.err : err.response.message
                    var _this = this;
                    if (err.response.status == 500) {
                        _this.$message({
                            message: error,
                            type: 'error',
                            duration: 1500
                        });
                    }
                }).catch(() => {
                    this.$message({
                        message: '提交失败！',
                        type: 'error'
                    });
                });
            },
            //查看分析模板
            handleEdit: function (id, index, row) {
                console.log(row);
                this.$router.push({
                    name: "查看分析模板",
                    params: {row: row},
                    query: {id: id, processDataId: row.processDataId}
                });
            },
            //查看编辑规则
            handEditRules: function (id, index, row) {
                //在此处可以获取到每一项的createTime值，将其传给编辑规则下的增加模板中的默认名称
                this.$router.push({
                    name: "规则模板",
                    params: {row: row},
                    query: {id: id, processDataId: row.processDataId}
                });
            },
            //查看相关任务
            handRelatedTasks: function (id, index, row) {
                let routeData = this.$router.resolve({
                    name: "任务执行信息",
                    query: {queryWord: 'modelId=' + id, modelName: row.name}
                });
                window.open(routeData.href, '_blank', routeData.query);
                /*跳转到任务执行信息页面，为了改变下拉菜单的值*/
                Bus.$emit('menuSet', '任务执行信息')
            },
            //新建分析模板
            newTemplate: function () {
                this.$router.push({name: "创建分析模板"});
            },
            //列表排序
            getOrder: function (column) {
                var that = this
                if (column.order === 'ascending') {
                    this.orderDirection = 'ASC'
                } else {
                    this.orderDirection = 'DESC'
                }
                this.prop = column.prop
                if (column.prop === null) {
                    this.prop = 'lastModifiedTime'
                    return false
                }
                this.currentPage = 1
                var parameter = this.buildParameters();
                that.listTable(parameter);
            }
        },
        mounted() {
            if (JSON.parse(localStorage.getItem("parameter"))) {
                this.parameter = JSON.parse(localStorage.getItem("parameter"));
                this.currentPage = (this.parameter.offset / this.parameter.limit) + 1;
                this.pagesize = this.parameter.limit;
            } else {
                this.parameter = this.buildParameters(this.pagesize, this.currentPage, this.startTime, this.endTime, this.searchInput);
            }
            this.listTable(this.parameter);
            //分钟列表循环
            for (var i = 0; i <= 59; i++) {
                var obj = {};
                obj.value = i + '';
                obj.label = i + '  分';
                this.minutesList.push(obj);
            }
            //按小时列表循环
            for (var i = 0; i <= 23; i++) {
                var obj = {};
                obj.value = i + '';
                obj.label = i + '  点';
                this.hourList.push(obj);
            }
            //按月
            for (var i = 1; i <= 31; i++) {
                var obj = {};
                obj.value = i + '';
                obj.label = i + '  日';
                this.dayList.push(obj);
            }
            //按每年
            for (var i = 1; i <= 12; i++) {
                var obj = {};
                obj.value = i + '';
                obj.label = i + '  月';
                this.monthList.push(obj);
            }
            Bus.$on('handleRow', (data, aa, item, id) => {
                this.rule = item.map((item) => {
                    return item.id;
                });
                this.template=data;
            	this.modelId[0]=data;
            	this.modelName=aa;
            	this.runRowA('once');

            })
            Bus.$on('handleCycleRow', (data, aa) => {
                this.modelId[0] = data;
                this.modelName = aa;
                this.template = data;
                this.runRowA('cron');
            })
        },
        beforeDestroy() {
            Bus.$off('handleRow');
            Bus.$off('handleCycleRow');
        },
        watch: {
            "$route": function () {
                //路由发生改变时，保留原有搜索状态
                var parameter = this.buildParameters();
                this.listTable(parameter)
            },
            parameter() {
                localStorage.setItem("parameter", JSON.stringify(this.parameter));
            }
        },
    };
</script>

<style scoped>
    .con-module .el-row {
        float: left;
        width: 100%;
    }

    .con-module .el-row .el-button i {
        font-size: 13px;
    }

    .seeName {
        margin-left: 5px;
        color: #2182e4;
        cursor: pointer
    }

    .editRules, .relatedTasks {
        color: #2182e4;
        cursor: pointer
    }

    .seeName:hover {
        text-decoration: underline;
    }

    .btn-left {
        padding-left: 125px;
    }

</style>
