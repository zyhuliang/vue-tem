<template>
    <div class="logAudit">
        <operationPanel>
            <div class="search" slot="left">
                <div class="selectLogsMenus">
                    <div class="" v-for="(value, key) in selectLogsMenus" :key="key">
                        <span v-if="value.length">{{key}}： </span>
                        <el-alert
                            v-for="(item) in value" :key="item"
                            :title="item"
                            @close="closeLogs(key, item)"
                            type="success">
                        </el-alert>
                    </div>
                    <div v-if="parameter.startDate">
                        <span>日期：</span>
                        <el-alert
                            :title="`${parameter.startDate} - ${parameter.endDate}`"
                            @close="closeDate()"
                            type="success">
                        </el-alert>
                    </div>
                    <div v-if="parameter.operation">
                        <span>内容：</span>
                        <el-alert
                            :title="parameter.operation"
                            @close="closeOperation()"
                            type="success">
                        </el-alert>
                    </div>
                </div>
            </div>
            <div slot="right" class="operationListBtn">
                <el-button type="text" icon="el-icon-search" @click="queryTableData">搜索</el-button>
                <a :href="`/api/logs/metrics/request/export?loginIds=${selectLogsMenus.loginIds}&clientIps= ${selectLogsMenus.ips}&startDate=${parameter.startDate}&endDate=${parameter.endDate}&x-auth-token=${token}`">
                    <el-button type="text" icon="el-icon-search" >导出</el-button>
                </a>

            </div>
        </operationPanel>
        <el-container>
            <el-aside width="400px">
                <el-scrollbar style="height: calc(100vh - 130px)">
                     <info-from  :config="config" :modelData="parameter"/>
                    <div
                        v-for="(value, key, index) in logsMenus"
                        :key="key">
                        <span class="logsMenus"  @click="unfold(index)" style="cursor:pointer">
                            <i :class="[logsMenusStatus[index] ? 'el-icon-caret-right': 'el-icon-caret-bottom']" />
                            {{key}}</span>
                        <el-checkbox-group
                            v-if="!logsMenusStatus[index]"
                            v-model="selectLogsMenus[key]"
                        >
                            <el-checkbox v-for="item in value" :label="item" :key="item">{{item}}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </el-scrollbar>
               
            </el-aside>
            <el-main>
                <div class="list">
                    <table-btn
                        :columns="columns"
                        :list="list"
                        :options="tableOption"
                    />
                </div>
                <panel title="">
                <pagination
                    :totalNumber="totalNumber"
                    :parameter="parameter"
                    @changeTableData="changeTableData"
                />
                </panel>
            </el-main>
        </el-container>
    </div>
</template>
<script>
import qs from 'qs';
import moment from "moment"//时间格式化
import operationPanel from "@components/layout/operationPanel";
import infoFrom from "@components/infoFrom/infoFrom";
import tableBtn from "@components/table/tableList-btn";
import Pagination from "@components/pagination/pagination";
import Panel from "@components/layout/panel";
import {
  queryObject,
  createParameter
} from "@components/function/queryParameter.js";
export default {
  components: {
    operationPanel,
    infoFrom,
    tableBtn,
    Pagination,
    Panel,
  },
  data () {
    return {
        logsMenusStatus: [],
        token: sessionStorage["x-auth-token"],
        tableOption: {
            height: 'calc(100vh - 210px)'
        },
        config: {
            ref: "ruleForm",
            size: "small",
            lableWidth: "80px",
            inline: true,
            rule: [
                {
                    label: "操作内容",
                    type: "infoInput",
                    model: "operation",
                    methods: val => {
                        this.parameter.operation = val
                    }
                },
                {
                    label: "时间",
                    type: "infoDatePicker",
                    valueFormat: 'yyyy-MM-dd',
                    model: 'startDate, endDate',
                    methods: val => {
                        this.parameter.startDate = val[0]
                        this.parameter.endDate = val[1]
                        this.parameter.limit = 8
                        this.parameter.offset = 0
                    }
                }
            ]
        },
        parameter: {
            clientIps: [],
            loginIds: [],
            limit: 8,
            offset:0,
            startDate: '',
            endDate: '',
            operation:''
        }, // 分页请求数据
        columns: [
            // 需要展示的列
            {
                prop: "write_time",
                label: "操作时间",
                width: 250,
                formatter: (row, column) => {
                    return moment(Number(row['write_time'])).format("YYYY-MM-DD HH:mm:ss");
                }
            },
            {
                prop: "clientIp",
                label: "IP",
                width: 150,
            },{
                prop: "loginId",
                label: "操作人",
                width: 120,
            },{
                prop: "operation",
                label: "操作动作",
                width: 300,
            },{
                prop: "params",
                label: "操作内容",
                formatter: (row, column) => {
                    return `<span style=" display: block; overflow: hidden;white-space:nowrap;" >${row.params}</span>`
                },
            }
        ],
        list: [],
        totalNumber: 0,
        logsMenus: {
            ip: [],
            操作人: []
        }, // 左边菜单
        selectLogsMenus: { // 选中项
            ip: [],
            操作人: []
        }
    }
  },
  created () {
      this.metricsQueryMenus()
  },
  methods: {
      closeOperation () { // 清空操作内容
        this.parameter.operation = ''
      },
      closeDate () {    // 清空日期
        this.parameter.startDate = '',
        this.parameter.endDate = ''
      },
      closeLogs (key,item) {
        var index = this.selectLogsMenus[key].indexOf(item);
        this.selectLogsMenus[key].splice(index, 1)
      },
      // 展开关闭
      unfold (index) {
          this.$set(this.logsMenusStatus, index, !this.logsMenusStatus[index])
      },
    // 分页请求数据的回调
    changeTableData (data) {
        this.$set(this, 'parameter', data)
        this.queryTableData()
    },
    // 请求 table 列表
    queryTableData () {
        this.parameter.clientIps = this.selectLogsMenus['ip']
        this.parameter.loginIds = this.selectLogsMenus['操作人'] 
        console.log(this.parameter)
        this.$store.commit('updateParameter', {
            data: this.parameter
        })
        this.serverApi({
            params: this.parameter,
            interface: 'logsMetrics',
            success: (response) => {
                this.list = response.content
                this.totalNumber = response.totalElements
            }
        })
    },
    metricsQueryMenus () {
         this.serverApi({
            interface: 'metricsQueryMenus',
            success: (response) => {
                this.logsMenus = {
                    ip: response.ips,
                    操作人: response.loginIds
                }
                console.log(this.logsMenus)
            },
            error: (err) => {
                console.log(err)
            }
        })
    }
  }
}
</script>
<style lang="scss" scoped>

    .logAudit {
          .el-scrollbar__wrap {
                overflow-x: hidden !important;;
            }
        .selectLogsMenus{
            padding-left: 10px;
            display: flex;
            flex-direction:row;
            div {
                display: flex;
                flex-direction:row;
                span{
                    display: block;
                    width: 102px;
                    line-height: 30px;
                    margin-right: 10px;
                }
                .el-alert{
                    margin-right: 15px;

                }
                .el-icon-close{
                    margin-left: 4px;
                }
            }
          
        }
        .el-aside {
            padding-top: 15px;
            background: #f2f3f9;
            .logsMenus{
                height: 30px;
                line-height: 30px;
                padding-left: 10px;
                margin-top: 10px;
            }
            ::v-deep .el-checkbox{
                margin-left: 30px;
                margin-top: 6px;
                display: block;
            }
        }
        .el-main{
            position: relative;
            padding: 20px 20px;
            overflow: hidden;
        }
        .list {
            height: 100%;
            width: 100%;
            .tableListBtn{
                padding: 0;
            }
        }
    }
</style>