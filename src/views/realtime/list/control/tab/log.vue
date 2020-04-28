<template>
  <section>
    <!-- content -->
    <div class="qa-content">
      <el-row class="btnClass">
        <!-- <div class="btn-right">
          <el-button type="info" @click="changeLogType()"
            ><i class="icon iconfont icon-ir-operation"></i>刷新</el-button
          >
        </div> -->
        <div class="btn-left">
          <el-select v-model="logTag" @change="changeLogType(logTag)">
            <!--                        获取flink的job和task的id-->
            <!--                        v-for="item in logTags"-->
            <el-option
              v-for="item in ['launcher', 'jobmanager.log', 'taskmanager.log']"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
      </el-row>

      <div class="div-log">
        <div v-for="log in logs" v-show="logs.length != 0">
          <pre>{{ log }}</pre>
        </div>

        <!-- <el-button v-show="logsData.length != 0" @click="logsData = prelogsData"
          >返回</el-button
        > -->
        <el-table
          :data="logsData"
          style="width: 100%"
          v-show="logsData.length != 0"
        >
          <el-table-column prop="name" label="name" fit="true">
            <template slot-scope="scope">
              <a href="javascript:void(0)" @click="getLogList(scope.row)">{{
                scope.row.name
              }}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="lastModifyTime"
            label="lastModifyTime"
            fit="true"
          >
          </el-table-column>
        </el-table>
        <!-- <pre v-if="hasLogs">{{ logs }}</pre> -->
        <!--                <div v-if="hasLogs" v-model="logs"  v-for="(log) in logs " > <pre>{{log}}</pre> </div>-->
        <!-- <div v-if="!hasLogs" class="log-content">
          <div class="log-content-error">{{ errorlogs }}</div>
        </div> -->
      </div>
    </div>
  </section>
</template>
<script>
import { map } from "lodash";
import moment from "moment"; //时间格式化
import {
  logProgress,
  getTaskManager,
  getTaskManagerLog,
  getJobManagerLog
} from "@api";
import {
  getLogtail,
  getLogabsolutePath,
  getLoglauncher,
  getLogJob
} from "@/api/realtime/index.js";
export default {
  props: {
    data: {
      type: Object,
      default: false
    }
  },
  components: {},
  data() {
    return {
      logTags: ["launcher", "jobmanager"],
      logTag: "launcher",
      appId: "",
      jobProgressId: "",
      start: 0,
      limit: 100000,
      logs: [],
      loading: false,
      hasLogs: false,
      errorlogs: "暂无数据",
      logsData: [],
      prelogsData: []
    };
  },
  methods: {
    getLogList(val) {
      console.log("getLogList(val){", val);

      if (!val.isFile) {
        getLogabsolutePath({
          id: this.data.row.id,
          absolutePath: val.path
        }).then(res => {
          //this.prelogsData = this.logsData;
          this.logsData = map(res.data, item => {
            return {
              ...item,
              lastModifyTime: moment(item.lastModifyTime).format(
                "YYYY-MM-DD h:mm:ss"
              )
            };
          });
        });
      } else {
        getLogtail({
          id: this.data.row.id,
          absolutePath: val.path
        }).then(res => {
          this.logsData = [];
          this.logs = res.data;
        });
      }

      // if(val.)
    },
    //点击类型切换日志
    changeLogType(val) {
      this.logs = [];
      if (this.logTag == "launcher") {
        getLoglauncher(this.data.row.id).then(
          res => {
            this.logs = res.data;
          },
          err => {
            this.$message({
              type: "error",
              message: "获取数据失败"
            });
          }
        );
      }

      if (this.logTag == "jobmanager.log" || this.logTag == "taskmanager.log") {
        if (!this.data.row.appId) {
          return;
        }
        getLogJob({
          id: this.data.row.id,
          logType: this.logTag,
          applicationId: this.data.row.appId
        }).then(
          res => {
            //this.prelogsData = this.logsData;
            this.logsData = map(res.data, item => {
              return {
                ...item,
                lastModifyTime: moment(item.lastModifyTime).format(
                  "YYYY-MM-DD h:mm:ss"
                )
              };
            });
          },
          err => {
            this.$message({
              type: "error",
              message: "获取数据失败"
            });
          }
        );
      }
    }
  },
  created() {}
};
</script>

<style scoped lang="scss">
.div-log {
  border: 1px solid #c2c9ca;
  height: calc(100vh - 167px);
  overflow-y: auto;
  margin: 10px;
  .log-content {
    .log-content-error {
      color: #cccccc;
      text-align: center;
      margin-top: calc((100vh - 400px) / 2);
    }
  }
}
</style>
