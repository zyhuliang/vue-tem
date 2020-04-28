<template>
    <section>
        <!-- content -->
        <div class="qa-content">
            <!--内容列表-->
            <el-table :data="tableData.content"
                      tooltip-effect="dark"
                      class="class-table"
                      border
                      height="80vh"
                      v-loading="loading"
            >
                <el-table-column label="属性名" prop="name" sortable>
                </el-table-column>
                <el-table-column label="属性值" prop="value" sortable>
                    <template slot-scope="scope">
                        <a @click="restEndpoint(scope.row.value)" v-if="scope.row.value == 'start-time'"
                        >
                            {{moment(scope.row.value).format("YYYY-MM-DD HH:mm:ss")}}
                        </a>
                        <el-button
                                v-else-if="scope.row.value == 'CheckPoints'"
                                type="text"
                                @click="CheckPointsHistory(scope.row)"
                        >
                            Check Points 历史
                        </el-button>
                        <el-button
                                v-else-if="scope.row.value == 'JobManager'"
                                type="text"
                                @click="JobManager(scope.row)"
                        >
                            Job Manager 详情
                        </el-button>

                        <el-button
                                v-else-if="scope.row.value == 'TaskManager'"
                                type="text"
                                @click="TaskManager(scope.row)"
                        >
                            Task Manager 详情
                        </el-button>
                        <span v-else> {{scope.row.value}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <!--points dialog-->
            <el-dialog
                    :visible.sync="dialogCheckPointsHistoryVisible"
                    :close-on-click-modal="false"
                    :modal-append-to-body="false"
                    title="Check Points History"
                    custom-class="dialogClass"
            >
                <el-table :data="CheckpointsHistory" height="calc(100vh - 313px)">
                    <el-table-column
                            prop="id"
                            label="ID"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="num_acknowledged_subtasks"
                            label="Acknowledged"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="latest_ack_timestamp"
                            label="Latest Acknowledgment"
                            show-overflow-tooltip
                            :formatter="dateFormat">
                    </el-table-column>
                    <el-table-column
                            prop="end_to_end_duration"
                            label="End to End Duration"
                            show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.end_to_end_duration}} ms
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="state_size"
                            label="State Size"
                            show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{Math.round(scope.row.state_size )}} B</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="alignment_buffered"
                            label="Buffered During Alignment"
                            show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{Math.round(scope.row.alignment_buffered )}} B</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="详情"
                            show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-button type="text" @click="CheckPoints(scope.row.id)">详情</el-button>
                        </template>
                    </el-table-column>

                </el-table>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialogManagerClose('history')"
                               name="bm-ch-resourceMan-showSchema-ok">确定
                    </el-button>
                    <el-button @click="dialogManagerClose('history')" name="bm-ch-resourceMan-showSchema-cancel">取消
                    </el-button>
                </div>
            </el-dialog>
            <!--point dialog-->
            <el-dialog
                    :visible.sync="dialogCheckPointsManagerVisible"
                    :close-on-click-modal="false"
                    :modal-append-to-body="false"
                    title="Points Detail"
                    custom-class="dialogClass"
            >
                <el-table :data="SavePointtFields.SavePointtFieldsOperators" height="calc(100vh - 313px)">
                    <el-table-column type="expand">
                        <template slot-scope="props" class="TaskManagerDetail">
                            <el-card class="box-card">
                                <div slot="header">
                                    <span>Details</span>
                                </div>
                                <el-table :data="props.row.itemOperatorsDetail.details" height="72px;">

                                    <el-table-column
                                            prop="id"
                                            label="ID"
                                            show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column
                                            prop="status"
                                            label="Status"
                                            show-overflow-tooltip>
                                    </el-table-column>
                                    <!--                                    <el-table-column-->
                                    <!--                                            prop="acknowledged"-->
                                    <!--                                            label="Acknowledged"-->
                                    <!--                                            show-overflow-tooltip>-->
                                    <!--                                    </el-table-column>-->
                                    <el-table-column
                                            prop="trigger_timestamp"
                                            label="Trigger Time"
                                            show-overflow-tooltip
                                            :formatter="dateFormat">
                                    </el-table-column>
                                    <el-table-column
                                            prop="latest_ack_timestamp"
                                            label="Latest Acknowledgement"
                                            show-overflow-tooltip
                                            :formatter="dateFormat">
                                    </el-table-column>
                                    <el-table-column
                                            prop="end_to_end_duration"
                                            label="End to End Duration"
                                            show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <span>{{scope.row['end_to_end_duration']}} ms</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="state_size"
                                            label="State Size"
                                            show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <span>{{Math.round(scope.row.state_size / 1024)}} KB</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="alignment_buffered"
                                            label="Buffered During Alignment"
                                            show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <span>{{scope.row.alignment_buffered}} B</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="discarded"
                                            label="Discarded"
                                            show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <span>{{scope.row.discarded? 'Yes': 'No'}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="external_path"
                                            label="Path"
                                            show-overflow-tooltip>
                                    </el-table-column>
                                </el-table>
                            </el-card>
                            <el-card class="box-card">
                                <div slot="header">
                                    <span>Operators</span>
                                </div>
                                <div class="card_title">
                                    <span>Summary</span>
                                </div>
                                <el-table :data="props.row.itemOperatorsDetail.summary" height="72px;">
                                    <el-table-column
                                            prop="type"
                                            label="Type"
                                            show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column
                                            prop="end_to_end_duration"
                                            label="End to End Duration"
                                            show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column
                                            prop="state_size"
                                            label="State Size"
                                            show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column
                                            prop="checkpoint_duration.sync"
                                            label="Checkpoint Duration (Sync)"
                                            show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <span>{{scope.row['checkpoint_duration.sync']}} ms</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="checkpoint_duration.async"
                                            label="Checkpoint Duration (Async)"
                                            show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <span>{{scope.row['checkpoint_duration.async']}} ms</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="alignment.buffered"
                                            label="Alignment Buffered"
                                            show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <span>{{Math.round(scope.row['alignment.buffered'])}} B</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="alignment.duration"
                                            label="Alignment Duration"
                                            show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <span>{{scope.row['alignment.duration']}} ms</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <div class="card_title">
                                    <span>Subtask</span>
                                </div>
                                <el-table :data="props.row.itemOperatorsDetail.subtasks" height="72px;">
                                    <el-table-column
                                            prop="index"
                                            label=" #"
                                            show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            {{scope.row.index+1}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="ack_timestamp"
                                            label="Acknowledgement Time"
                                            show-overflow-tooltip
                                            :formatter="dateFormat">
                                    </el-table-column>
                                    <el-table-column
                                            prop="end_to_end_duration"
                                            label="End to End Duration"
                                            show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column
                                            prop="state_size"
                                            label="State Size"
                                            show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column
                                            prop="checkpoint.sync"
                                            label="Checkpoint Duration (Sync)"
                                            show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <span>{{scope.row.checkpoint.sync}} ms</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="checkpoint.async"
                                            label="Checkpoint Duration (Async)"
                                            show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <span>{{scope.row.checkpoint.async}} ms</span>
                                        </template>
                                    </el-table-column>

                                    <el-table-column
                                            prop="alignment.buffered"
                                            label="Alignment Buffered"
                                            show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <span>{{Math.round(scope.row.alignment.buffered)}} B</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="alignment.duration"
                                            label="Alignment Duration"
                                            show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <span>{{scope.row.alignment.duration}} ms</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-card>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="ID"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="num_acknowledged_subtasks"
                            label="Acknowledged"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="latest_ack_timestamp"
                            label="Latest Acknowledgment"
                            show-overflow-tooltip
                            :formatter="dateFormat">
                    </el-table-column>
                    <el-table-column
                            prop="end_to_end_duration"
                            label="End to End Duration"
                            show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.end_to_end_duration}} ms
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="state_size"
                            label="State Size"
                            show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{Math.round(scope.row.state_size )}} B</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="alignment_buffered"
                            label="Buffered During Alignment"
                            show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{Math.round(scope.row.alignment_buffered )}} B</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialogManagerClose('point')"
                               name="bm-ch-resourceMan-showSchema-ok">确定
                    </el-button>
                    <el-button @click="dialogManagerClose('point')" name="bm-ch-resourceMan-showSchema-cancel">取消
                    </el-button>
                </div>
            </el-dialog>
            <!--job dialog-->
            <el-dialog v-dialog-drag
                       :visible.sync="dialogJobManagerVisible"
                       :close-on-click-modal="false"
                       :modal-append-to-body="false"
                       title="Job Manager"
            >
                <el-table id="bm-ch-resourceMan-schema-table" height="calc(100vh - 313px)" :data="JobManagerFields">
                    <el-table-column
                            prop="key"
                            label="Key"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="value"
                            label="Value"
                            show-overflow-tooltip>
                    </el-table-column>
                </el-table>

                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialogManagerClose('job')"
                               name="bm-ch-resourceMan-showSchema-ok">确定
                    </el-button>
                    <el-button @click="dialogManagerClose('job')" name="bm-ch-resourceMan-showSchema-cancel">取消
                    </el-button>
                </div>
            </el-dialog>
            <!--task dialog-->
            <el-dialog
                    :visible.sync="dialogTaskManagerVisible"
                    :close-on-click-modal="false"
                    :modal-append-to-body="false"
                    title="Task Manager"
                    custom-class="dialogClass"
            >
                <el-table :data="taskManagerTabs" height="calc(100vh - 313px)">
                    <el-table-column type="expand">
                        <template slot-scope="props" class="TaskManagerDetail">
                            <el-card class="box-card">
                                <div slot="header">
                                    <span>Overview</span>
                                </div>
                                <el-table :data="props.row.taskManagerOverview" height="72px;">
                                    <el-table-column
                                            prop="dataPort"
                                            label="Data Port"
                                            show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column
                                            prop="slotsNumber"
                                            label="All Slots"
                                            show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column
                                            prop="freeSlots"
                                            label="Free Slots"
                                            show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column
                                            prop="cpuCores"
                                            label="CPU Cores"
                                            show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column
                                            prop="physicalMemory"
                                            label="Physical Memory"
                                            show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <span>{{Math.round(scope.row.physicalMemory / 1024/ 1024/ 1024)}} GB</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="freeMemory"
                                            label="JVM Heap Size"
                                            show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <span>{{(scope.row.freeMemory / 1024/ 1024/ 1024).toFixed(2)}} GB</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="managedMemory"
                                            label="Flink Managed Memory"
                                            show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <span>{{Math.round(scope.row.managedMemory / 1024/ 1024)}} MB</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-card>
                            <el-card class="box-card">
                                <div slot="header">
                                    <span>Memory</span>
                                </div>
                                <div class="card_title">
                                    JVM (Heap/Non-Heap)
                                </div>
                                <el-table :data="props.row.taskManagerJVM" height="72px;">
                                    <el-table-column
                                            prop="Type"
                                            label="Type"
                                            show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column
                                            prop="Committed"
                                            label="Committed"
                                            show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <span>{{Math.round(scope.row.Committed / 1024)}} KB</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="Used"
                                            label="Used"
                                            show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <span>{{(scope.row.Used / 1024).toFixed(2)}} KB</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="Maximum"
                                            label="Maximum"
                                            show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <span>{{Math.round(scope.row.Maximum / 1024/ 1024)}} MB</span>
                                        </template>
                                    </el-table-column>
                                </el-table>

                                <div class="card_title">
                                    Outside JVM
                                </div>
                                <el-table :data="props.row.taskManagerOutsideJVM" height="72px;">
                                    <el-table-column
                                            prop="Type"
                                            label="Type"
                                            show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column
                                            prop="Count"
                                            label="Count"
                                            show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column
                                            prop="Used"
                                            label="Used"
                                            show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <span>{{(scope.row.Used / 1024).toFixed(2)}} KB</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="Capacity"
                                            label="Capacity"
                                            show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <span>{{Math.round(scope.row.Capacity / 1024/ 1024)}} MB</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-card>
                            <el-card class="box-card">
                                <div slot="header">
                                    <span>Network</span>
                                </div>
                                <div class="card_title">
                                    Memory Segments
                                </div>
                                <el-table :data="props.row.taskManagerMemorySegments" height="72px;">
                                    <el-table-column
                                            prop="Type"
                                            label="Type"
                                            show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column
                                            prop="Count"
                                            label="Count"
                                            show-overflow-tooltip>
                                    </el-table-column>
                                </el-table>
                                <div class="card_title">
                                    Garbage Collection
                                </div>
                                <el-table :data="props.row.taskManagerGarbageCollection" height="72px;">
                                    <el-table-column
                                            prop="name"
                                            label="Collector"
                                            show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column
                                            prop="count"
                                            label="Count"
                                            show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column
                                            prop="time"
                                            label="Time"
                                            show-overflow-tooltip>
                                    </el-table-column>
                                </el-table>
                            </el-card>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="id"
                            label="ID"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="path"
                            label="Path"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="dataPort"
                            label="Data Port"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="timeSinceLastHeartbeat"
                            label="Last Heartbeat"
                            show-overflow-tooltip
                            :formatter="dateFormat">
                    </el-table-column>
                    <el-table-column
                            prop="slotsNumber"
                            label="All Slots"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="freeSlots"
                            label="Free Slots"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="hardware.cpuCores"
                            label="CPU Cores"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="hardware.physicalMemory"
                            label="Physical Memory"
                            show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{Math.round(scope.row.hardware.physicalMemory / 1024/ 1024/ 1024)}} GB</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="hardware.freeMemory"
                            label="JVM Heap Size"
                            show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{(scope.row.hardware.freeMemory / 1024/ 1024/ 1024).toFixed(2)}} GB</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="hardware.managedMemory"
                            label="Flink Managed Memory"
                            show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{Math.round(scope.row.hardware.managedMemory / 1024/ 1024)}} MB</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialogManagerClose('task')"
                               name="bm-ch-resourceMan-showSchema-ok">确定
                    </el-button>
                    <el-button @click="dialogManagerClose('task')" name="bm-ch-resourceMan-showSchema-cancel">取消
                    </el-button>
                </div>
            </el-dialog>
        </div>
    </section>
</template>
<script>
    import moment from "moment"
    //时间格式化
    import {
        getCheckpoints,
        getCheckpointsDetails,
        getCheckpointsDetailssubtasks,
        getJobManagerFields,
        getTaskManager,
        getTaskManagerFieldsDetail,
    } from '@api'
    import Template from "../../../qualityAnalysis/analysisTemplate/template";

    export default {
        components: {Template},
        data() {
            return {
                CheckpointsHistory: [],
                editableTabsValue: '',
                tabIndex: 2,
                SavePointtFields: {
                    SavePointtFieldsOperators: [
                        {
                            name: '',
                            num_acknowledged_subtasks: '',
                            latest_ack_timestamp: '',
                            end_to_end_duration: '',
                            state_size: '',
                            alignment_buffered: '',
                            itemOperatorsDetail: []
                        }
                    ]
                },//Save Pointt弹框的列表显示字段
                JobManagerFields: [{
                    taskManagerOverview:
                        [{
                            dataPort: '',
                            slotsNumber: '',
                            freeSlots: '',
                            cpuCores: '',
                            physicalMemory: '',
                            freeMemory: '',
                            managedMemory: '',
                        }],
                    taskManagerJVM: [{
                        Type: '',
                        Committed: '',
                        Used: '',
                        Maximum: '',
                    }],
                    taskManagerOutsideJVM: [{
                        dataPort: '',
                        slotsNumber: '',
                        freeSlots: '',
                        cpuCores: '',
                        physicalMemory: '',
                        freeMemory: '',
                        managedMemory: '',
                    }],
                    taskManagerMemorySegments: [{
                        dataPort: '',
                        slotsNumber: '',
                        freeSlots: '',
                        cpuCores: '',
                        physicalMemory: '',
                        freeMemory: '',
                        managedMemory: '',
                    }],
                    taskManagerGarbageCollection: [{
                        dataPort: '',
                        slotsNumber: '',
                        freeSlots: '',
                        cpuCores: '',
                        physicalMemory: '',
                        freeMemory: '',
                        managedMemory: '',
                    }],
                }],//job manager弹框的列表显示字段
                taskManagerTabs: [],//task tabs manager弹框的tabs列表显示字段
                dialogCheckPointsManagerVisible: false,//CheckPoints的弹框的控制字段
                dialogCheckPointsHistoryVisible: false,//CheckPoints历史的弹框的控制字段
                dialogJobManagerVisible: false,//jobmanager的弹框的控制字段
                dialogTaskManagerVisible: false,//Taskmanager的弹框的控制字段
                tableData: {
                    content: [],//列表显示字段
                },
                row: {},
                loading: false,
            }
        },
        methods: {
            //获取check points的粒是列表
            CheckPointsHistory(){
                var appId = this.row.appInfo.appId
                var jobId = this.row.appInfo.jobId
                this.loading = true
                getCheckpoints(appId, jobId).then(res => {
                    this.dialogCheckPointsHistoryVisible = true
                    this.CheckpointsHistory = res.history
                    this.loading = false
                }, err => {
                    this.loading = false
                    this.$message({
                        type: "error",
                        message: err.response.message
                    })
                })
            },
            //获取check的字段值
            CheckPoints(pointId) {
                var appId = this.row.appInfo.appId
                var jobId = this.row.appInfo.jobId
                this.loading = true
                this.dialogCheckPointsManagerVisible = true
                //根据pointId，获取想要展示的数据字段
                getCheckpointsDetails(appId, jobId, pointId).then(data => {
                    // 完成point数据结构
                    var taskKeys = Object.keys(data.tasks)
                    this.SavePointtFields.SavePointtFieldsOperators = []
                    taskKeys.forEach(item => {
                        var subtasksId = item
                        //根据subtasksId获取详情的数据
                        getCheckpointsDetailssubtasks(appId, jobId, pointId, subtasksId).then(subTaskRes => {
                            //拼凑详情数据结构
                            var itemOperatorsDetail = {
                                details: [{
                                    id: data.id,
                                    status: data.status,
                                    acknowledged: data.acknowledged,
                                    trigger_timestamp: data.trigger_timestamp,
                                    latest_ack_timestamp: data.latest_ack_timestamp,
                                    end_to_end_duration: data.end_to_end_duration,
                                    state_size: data.state_size,
                                    alignment_buffered: data.alignment_buffered,
                                    discarded: data.discarded,
                                    external_path: data.external_path,
                                }],
                                subtasks: subTaskRes.subtasks,
                                summary: [{
                                    type: 'min',
                                    state_size: subTaskRes.summary.state_size.min,
                                    end_to_end_duration: subTaskRes.summary.end_to_end_duration.min,
                                    "checkpoint_duration.sync": subTaskRes.summary.checkpoint_duration.sync.min,
                                    'checkpoint_duration.async': subTaskRes.summary.checkpoint_duration.async.min,
                                    'alignment.buffered': subTaskRes.summary.alignment.buffered.min,
                                    'alignment.duration': subTaskRes.summary.alignment.duration.min,
                                }, {
                                    type: 'max',
                                    state_size: subTaskRes.summary.state_size.max,
                                    end_to_end_duration: subTaskRes.summary.end_to_end_duration.max,
                                    "checkpoint_duration.sync": subTaskRes.summary.checkpoint_duration.sync.max,
                                    'checkpoint_duration.async': subTaskRes.summary.checkpoint_duration.async.max,
                                    'alignment.buffered': subTaskRes.summary.alignment.buffered.max,
                                    'alignment.duration': subTaskRes.summary.alignment.duration.max,
                                }, {
                                    type: 'avg',
                                    state_size: subTaskRes.summary.state_size.avg,
                                    end_to_end_duration: subTaskRes.summary.end_to_end_duration.avg,
                                    "checkpoint_duration.sync": subTaskRes.summary.checkpoint_duration.sync.avg,
                                    'checkpoint_duration.async': subTaskRes.summary.checkpoint_duration.async.avg,
                                    'alignment.buffered': subTaskRes.summary.alignment.buffered.avg,
                                    'alignment.duration': subTaskRes.summary.alignment.duration.avg,
                                }]
                            }
                            var itemOperators = {
                                name: subtasksId,
                                num_acknowledged_subtasks: data.tasks[item].num_acknowledged_subtasks,
                                latest_ack_timestamp: data.tasks[item].latest_ack_timestamp,
                                end_to_end_duration: data.tasks[item].end_to_end_duration,
                                state_size: data.tasks[item].state_size,
                                alignment_buffered: data.tasks[item].alignment_buffered,
                                itemOperatorsDetail: itemOperatorsDetail,
                            }
                            this.SavePointtFields.SavePointtFieldsOperators.push(itemOperators)
                        })
                    })
                    this.loading = false
                }, error => {
                    this.loading = false
                    this.$message({
                        type: "error",
                        message: error.response.message
                    })
                })
            },
            //关闭jobmanager弹框
            dialogManagerClose: function (type) {
                if (type == 'job') {
                    this.dialogJobManagerVisible = false
                } else if (type == 'task') {
                    this.dialogTaskManagerVisible = false
                } else if (type == 'point') {
                    this.dialogCheckPointsManagerVisible = false
                } else if (type == 'history') {
                    this.dialogCheckPointsHistoryVisible = false
                }
            },
            //JobManager 弹出新的框展示信息
            JobManager: function () {
                this.dialogJobManagerVisible = true;
                var appId = this.row.appInfo.appId
                this.loading = true
                getJobManagerFields(appId).then(res => {
                    this.JobManagerFields = res
                    this.loading = false
                }, err => {
                    this.loading = false
                    this.$message({
                        type: "error",
                        message: "获取数据失败"
                    })
                })
            },
            //TaskManager 弹出新的框展示信息
            TaskManager: function (row) {
                this.dialogTaskManagerVisible = true;
                var appId = this.row.appInfo.appId
                this.loading = true
                getTaskManager(appId).then(res => {
                    this.taskManagerTabs = []
                    //获取task的数据，是个数组，弹出相对的tab table数据
                    res.taskmanagers.forEach(item => {
                        var taskId = item.id;
                        getTaskManagerFieldsDetail(appId, taskId).then(data => {
                            //获取到taskManagerOverview的页面的数据
                            item.taskManagerOverview =
                                [{
                                    dataPort: data.dataPort,
                                    slotsNumber: data.slotsNumber,
                                    freeSlots: data.freeSlots,
                                    cpuCores: data.hardware.cpuCores,
                                    physicalMemory: data.hardware.physicalMemory,
                                    freeMemory: data.hardware.freeMemory,
                                    managedMemory: data.hardware.managedMemory,
                                }]

                            //获取到JVM (Heap/Non-Heap)的页面的数据
                            item.taskManagerJVM =
                                [{
                                    Type: 'Heap',
                                    Committed: data.metrics.heapCommitted,
                                    Used: data.metrics.heapUsed,
                                    Maximum: data.metrics.heapMax,
                                }, {
                                    Type: 'Non-Heap',
                                    Committed: data.metrics.nonHeapCommitted,
                                    Used: data.metrics.nonHeapUsed,
                                    Maximum: data.metrics.nonHeapMax,
                                }, {
                                    Type: 'Total',
                                    Committed: data.metrics.heapCommitted + data.metrics.nonHeapCommitted,
                                    Used: data.metrics.heapUsed + data.metrics.nonHeapUsed,
                                    Maximum: data.metrics.heapMax + data.metrics.nonHeapMax,
                                }]

                            //获取到Outside JVM的页面的数据
                            item.taskManagerOutsideJVM =
                                [{
                                    Type: 'Direct',
                                    Count: data.metrics.directCount,
                                    Used: data.metrics.directUsed,
                                    Capacity: data.metrics.directMax,
                                }, {
                                    Type: 'Mapped',
                                    Count: data.metrics.mappedCount,
                                    Used: data.metrics.mappedUsed,
                                    Capacity: data.metrics.mappedMax,
                                }]

                            //获取到Memory Segments的页面的数据
                            item.taskManagerMemorySegments =
                                [{
                                    Type: 'Available',
                                    Count: data.metrics.memorySegmentsAvailable,
                                }, {
                                    Type: 'Total',
                                    Count: data.metrics.memorySegmentsTotal,
                                }]

                            //获取到Garbage Collection的页面的数据
                            item.taskManagerGarbageCollection = data.metrics.garbageCollectors
                            this.taskManagerTabs.push(item)
                        })
                    })
                    this.loading = false
                }, err => {
                    this.loading = false
                    this.$message({
                        type: "error",
                        message: "获取数据失败"
                    })
                })
            },
            //构成table所要展示的数据
            getTableData: function () {
                var appInfo = this.row.appInfo;
                if (!appInfo.jobMetrics) {
                    return;
                }
                var tmp = []
                tmp.push({name: '任务Id', value: this.row.id},
                    {name: '名称', value: this.row.name},
                    {name: '运行时长(秒)', value: appInfo.jobMetrics.duration / 1000},
                    {name: '运行状态', value: appInfo.state? appInfo.state: appInfo.jobMetrics.jobStatus},
                    {name: '启动时间', value: moment(appInfo.jobMetrics['startTime']).format("YYYY-MM-DD HH:mm:ss")},
                )
                //计算读入写出的数据数目及大小
                var writeRecords = 0;
                var writeBytes = 0;
                var readRecords = 0;
                var readBytes = 0;
                var vertices = appInfo.jobMetrics.jobVertexInfos;
                for (var i = 0; i < vertices.length; i++) {
                    if (vertices[i].name.indexOf('Source') > -1) {
                        writeBytes += vertices[i].jobVertexMetrics['bytesWritten'];
                        writeRecords += vertices[i].jobVertexMetrics['recordsWritten'];
                    }
                    if (vertices[i].name.indexOf('Sink') > -1) {
                        readBytes += vertices[i].jobVertexMetrics['bytesRead'];
                        readRecords += vertices[i].jobVertexMetrics['recordsRead'];
                    }
                }
                tmp.push(
                    {name: '读入条数', value: writeRecords},
                    {name: '读入数据量(byte)', value: writeBytes},
                    {name: '写出条数', value: readRecords},
                    {name: '写出数据量(byte)', value: readBytes},
                    {name: 'applicationId', value: appInfo.appId},
                    {name: 'flinkJobId', value: appInfo.jobId},
                    {name: 'lastSavepointPath', value: appInfo.lastSavepointPath},
                    {name: 'state', value: appInfo.state}
                );
                //如果这两个参数值大于0，就不显示
                appInfo.cpuCore > 0 ? tmp.push({name: 'cpuCore', value: appInfo.cpuCore}) : ''
                appInfo.memory > 0 ? tmp.push({name: 'memory', value: appInfo.memory}) : ''
                tmp.push({name: 'CheckPoints', value: 'CheckPoints'})
                tmp.push({name: 'JobManager', value: 'JobManager'})
                tmp.push({name: 'TaskManager', value: 'TaskManager'})
                //根据row构建所需数据
                this.tableData.content = tmp;
            },
        },
        created() {
            this.row = JSON.parse(sessionStorage.getItem('streamProgressRow'))
            this.getTableData();
        },
    }
</script>

<style scoped lang="scss">
    .qa-content {
        .class-table {
            width: calc(100vw - 20px);
            height: calc(100vh - 160px);
            margin: 10px;
        }
    }

    .card_title {
        font-size: 16px;
        color: #000000;
        margin: 10px;
    }

</style>
