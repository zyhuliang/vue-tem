<template>
    <section>
        <div class="synchronizationsBox">

            <el-row class="btnClass">
                <div class="btn-right">
                    <el-dropdown>
						  <span class="el-dropdown-link" style="cursor:pointer">
						    创建作业<i class="el-icon-arrow-down el-icon--right"></i>
						  </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="add">
                                <i class="icon iconfont icon-ir-text-add"></i>&nbsp;流式处理
                            </el-dropdown-item>
                            <!--<el-dropdown-item @click.native="addCep">-->
                                <!--<i class="icon iconfont icon-ir-text-add"></i>&nbsp;事件处理-->
                            <!--</el-dropdown-item>-->
                        </el-dropdown-menu>
                    </el-dropdown>

                    <el-button type="info" @click="getList(saveCurrentData.offset,saveCurrentData.limit)">
                        <i class="icon iconfont icon-ir-operation"></i>刷新
                    </el-button>
                </div>
            </el-row>
            <!--内容显示列表页面-->
            <template>
                <div class="rf-swap dn-data">
                    <el-table :data="tableData.list"
                              tooltip-effect="dark"
                              v-loading="loading"
                              id="bm-stream-jobManage-jobmanage-form"
                              height="calc(100vh - 175px)"
                              style="width: 100%" >

                        <el-table-column  label="名称" prop="name"  width="300">
                            <template slot-scope="scope">
                                <span class="editName" @click="editName(scope.row)">{{scope.row.name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="描述" prop="note"  >
                        </el-table-column>
                        <el-table-column label="类型" prop="type" width="150">
                            <template slot-scope="scope">
                                <div  v-if="scope.row.type == 1" >ETL</div >
                                <div  v-else-if="scope.row.type == 2">CEP</div >
                                <div  v-else-if="scope.row.type == 3">Kafka</div >
                            </template>
                        </el-table-column>
                        <el-table-column label="创建时间" prop="createTime" width="160" align="center" :formatter="dateFormat" >
                        </el-table-column>
                        <el-table-column label="修改时间" prop="lastModifyTime" width="160" align="center" :formatter="dateFormat" >
                        </el-table-column>
                        <el-table-column label="部署时间" prop="lastDeployTime" width="160" align="center" :formatter="dateFormat" >
                        </el-table-column>
                        <el-table-column label="操作" align="center" fixed="right">
                            <template slot-scope="scope" >
                                <el-button
                                        v-if="scope.row.status != '2' "
                                        size="mini"
                                        type="primary"
                                        @click="deployDialog(scope.row)"
                                >
                                    发布
                                </el-button>
                                <el-button
                                        type="danger"
                                        size="mini"
                                        @click="deleteJob(scope.row)"
                                >
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <pagination
                        :totalNumber="tableData.total"
                        @changeTableData="changeTableData"
                    />
                </div>
            </template>
        </div>
        <router-view></router-view>
        <deploy-job-config ref="deployDialogCon" @getList="getList" :start="start" :limit="limit"></deploy-job-config>
    </section>
</template>

<script>
    import deployJobConfig from './deploy/deploy.vue'
    import {getJobList, deleteJob, stopJob} from '@api'
    import Pagination from "@components/pagination/pagination";
    export default {
          computed: {
                saveCurrentData () {
                return this.$store.state.saveCurrentData.saveCurrentData
                },
            },
          components: {
            deployJobConfig,
            Pagination
        },
        data() {
            return {
                tableData:{},
                currentPage:1,
                limit:8,
                start: 0,
                loading: true
            }
        },
        methods: {
            //新建job
            add: function () {
                var entity = {
                    "name": "",
                    "note": "",
                    "type":1,
                    "jobDesc": {
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
                            tableName: '',
                            tableType: 'source',
                            tableConfig: {
                                "partitionKey": [],
                                "timeColumn": "",
                                "timeFormat":"",
                            },
                            datasetConfig:  [{"name":"","value":""}],
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
                            'streaming.flink.checkpoint.mode': "AT_LEAST_ONCE",
                            'streaming.flink.restartAttempts.enabled': true,
                            'streaming.flink.restartAttempts.delayInterval.sec': '30',
                            'streaming.flink.restartAttempts.num': "1",
                            'streaming.flink.state.backend.enabled': true,
                            'streaming.flink.state.backend.mode': 'memory',
                            "streaming.flink.latency.tracking.enabled": false,
                            "streaming.flink.latency.tracking.interval.ms": "10000",
                            "streaming.flink.maxOutOfOrderness.enabled": true,
                            "streaming.flink.maxOutOfOrderness.ms": "0",
                        }
                    }
                }
                sessionStorage.setItem("streamJobEntity", JSON.stringify(entity));
                //点击创建
                //跳转到新建页面的路由
                this.$router.push({name:'作业描述',params:{typeFlag:'ETL'}});
            },

            addCep(){
            	var entity = {
                    "name": "",
                    "note": "",
                    "type": 2,
                    "jobDesc": {
                        "ruleProfiles": [{
                            "input": {
                                "dataset": {
                                    "id": "",
                                    "name": "",
                                    "storage": "",
                                    "storageConfigurations": {
                                    }
                                },
                                "schema": {
                                    "id": "",
                                    "name": "",
                                    "fields": []
                                },
                                "partitionKey": []
                            },
                            "rules": [
                                {
                                    "id": "",
                                    "afterMatchSkipStrategy": "",
                                    "connector": "",
                                    "filters": [{
                                        "lang": "jexl",
                                        "type": "where",
                                        "code": ""
                                    }]
                                    ,
                                    "quantifier": ""
                                }
                            ],
                            "outputs": [{
                                "mode": "ALL",
                                "schema": {
                                    "fields": []
                                },
                                "dataset": {
                                    "id": "",
                                    "name": "",
                                    "storageConfigurations": {}
                                }
                            }]
                        }],
                        "settings": {
                            "streaming.flink.checkpoint.enabled": true,
                            "streaming.flink.checkpoint.interval.ms": "5000",
                            "streaming.flink.checkpoint.mode": "",
                            "streaming.flink.restartAttempts.enabled": true,
                            "streaming.flink.restartAttempts.delayInterval.sec": "30",
                            "streaming.flink.restartAttempts.num": "1",
                            "streaming.flink.state.backend.enabled": true,
                            "streaming.flink.state.backend.mode": "memory",
                            "streaming.flink.latency.tracking.enabled": false,
                            "streaming.flink.latency.tracking.interval.ms": "10000",
                            "streaming.flink.maxOutOfOrderness.enabled": true,
                            "streaming.flink.maxOutOfOrderness.ms": "0",
                        }
                    }
                }
                sessionStorage.setItem("streamJobEntity", JSON.stringify(entity));
                this.$router.push({name: 'cep作业描述', params: {typeFlag: 'CEP'}});
            },
            //删除
            deleteJob: function (row) {
                //添加询问
                this.$confirm('真的要删除?', '提示', {
                }).then(() => {
                    deleteJob(row.id).then(res =>{
                        //刷新列表
                        this.getList(this.start, this.limit);
                    },error =>{
                        var err = error.response.data.message
                        this.$message({
                            message: err,
                            type: 'error',
                            duration: 1500
                        });
                    })
                }).catch(() => {
                });
            },

            // 停止时打开弹出框
            deployDialog: function (row) {
                this.$refs.deployDialogCon.init(row)
            },

            //停止
            stop: function (row) {
                stopJob(row.id).then(res =>{
                    //刷新列表
                    this.getList(this.start, this.limit);
                },error =>{
                    var err = error.response.data.err
                    this.$message({
                        message: err,
                        type: 'error',
                        duration: 1500
                    });
                })
            },

            // 监控
            monitor:function (row) {
                //跳转到新的监控信息显示页面
                this.$router.push({path:'/jobOperation/streamMonitor/board', query: {row: row}})
            },

            // 列表
            getList: function (start, limit) {
                // 更新当前页
                this.$store.commit('updateParameter', {
                    data: {
                        offset: start,
                        limit: limit
                    }
                })
                this.loading = true;
                getJobList(start, limit).then(res =>{
                    //更新数据
                    this.tableData = res;
                    this.loading = false;
                },error =>{
                    var err = error.response.data.error
                    this.$message({
                        message: err,
                        type: 'error',
                        duration: 1500
                    });
                })
            },

            //修改当前页显示多少条数据
            handleSizeChange: function (size) {
                // this.limit = size;
                // this.start = (this.currentPage-1) * this.limit;
                // this.getList(this.start,this.limit)
            },
            //切换当前页
            handleCurrentChange: function(currentPage){
                // this.currentPage = currentPage
                // this.start = (this.currentPage-1) * this.limit;
                // this.getList(this.start,this.limit)
            },
            // 分页请求数据的回调
            changeTableData (data) {
                console.log('changeTableData (data) {',data);
                this.getList(data.offset?data.offset:0,data.limit?data.limit:8)
            },
            //编辑当前任务
            editName: function (row) {
                sessionStorage.setItem("streamJobEntity", JSON.stringify(row));
                if(row.type==2){
                	this.$router.push({name:'cep作业描述',params:{typeFlag:'CEP'}});
                }else if(row.type==1){
                	this.$router.push({ name: '作业描述'});
                }
            }
        },

        mounted() {
            this.loading = false
            //获取列表数据
            this.getList(this.start, this.limit);
        }
    };

</script>

<style lang="scss" scoped>
    .synchronizationsBox{
        .btn-right{
            float: right;
        }
    }
    .dn-data{
        position: relative;
        .el-table{
            .editName{
                color: #2182e4;
                cursor: pointer
            }
            .editName:hover{
                text-decoration: underline;
            }
        }
    }
</style>