<template>
  <div>
    <!-- content -->
    <div class="qa-content">
      <!--展示图形-->
      <iframe
        class="iframe-style"
        name="stream_job_execution_plan_test"
        id="show-iframe"
      ></iframe>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import _ from "lodash";
export default {
  watch: {
    // flowData(val) {
    // }
  },
  props: {
    data: {
      type: Object,
      default: false
    }
  },
  components: {},
  data: function() {
    return {
      row: {}
    };
  },
  computed: {
    //...mapState([""])
  },
  mounted() {
    // console.log("type", this.data.type);
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed: function() {},
  methods: {
    //...mapActions([""]),
    // 加载图片
    showDraw: function(row,oIframe) {
      var draw = function(json) {
        setTimeout(function() {
          const oIframe = document.getElementById("show-iframe");
          // oIframe.window.draw(json);
          // console.log("oIframe", oIframe);
          // console.log("window", oIframe.contentWindow);
          //如果没有准备好ifream就等待100ms递归调用
          var isReady = oIframe.contentWindow.isReady;
          if (isReady) {
            oIframe.contentWindow.draw(json);
          } else {
            draw(json);
          }
        }, 100);
      };
      // console.log(' showDraw: function(row,oIframe) {',row);
      // console.log('row.metrics.jsonPlan',row.metrics.jsonPlan);
      let jsonData = {
        id: "402881d56e441b57016e44eda9680000",
        jobId: "402881d26df78984016df78f1a830000",
        jobType: 1,
        name: "ZYJK_CASE_01#2019-11-07 16:14:16 367",
        deployTime: 1573114456378,
        status: 10,
        executionEngine: "flink",
        jobDesc: {
          querySql: [
            "insert into\n  ZYJK_CASE_01_SINK\nselect\n  s1.id,\n  s1.timestampColumn,\n  s1.userID,\n  s1.code,\n  s1.consumption,\n  s2.userPosition,\n  s1.start_time,\n  RTC_CURRENT_TIME(s1.userID) as end_time,\n  RTC_CURRENT_TIME(s1.userID) - start_time as proc_time\nfrom\n  (\n    select\n      id,\n      timestampColumn,\n      userID,\n      code,\n      consumption,\n      RTC_CURRENT_TIME(userID) as start_time\n    from\n      NOKIA_KAFKA_SOURCE\n  ) s1,\n  LATERAL TABLE(lookup(userID)) as s2(userID_lookup, userPosition, timeCol)"
          ],
          settings: {
            "streaming.flink.checkpoint.enabled": true,
            "streaming.flink.checkpoint.interval.ms": "5000",
            "streaming.flink.checkpoint.mode": "EXACTLY_ONCE",
            "streaming.flink.restartAttempts.enabled": true,
            "streaming.flink.restartAttempts.delayInterval.sec": "30",
            "streaming.flink.restartAttempts.num": "1",
            "streaming.flink.state.backend.enabled": true,
            "streaming.flink.state.backend.mode": "fs",
            "streaming.flink.latency.tracking.enabled": false,
            "streaming.flink.latency.tracking.interval.ms": "10000",
            "streaming.flink.maxOutOfOrderness.enabled": true,
            "streaming.flink.maxOutOfOrderness.ms": "0"
          },
          udfs: [
            {
              type: "scalar",
              name: "",
              clazz: "",
              method: "",
              args: "",
              jarPath: "",
              returns: ""
            }
          ],
          tableProfiles: [
            {
              schema: {
                id: "e1d72290-748b-4611-b4d6-28e6326065c5",
                name: "积分消费数据",
                creator: "admin",
                createTime: 1569481243000,
                lastModifier: "admin",
                lastModifiedTime: 1569549147000,
                owner: "edb7f090-5238-4642-a393-43ba19337d5e",
                version: 6,
                tenantId: "db31d4a1-9a22-4b7e-9d73-22b5137ceb69",
                tableName: "merce_schema",
                fields: [
                  { name: "id", type: "int", alias: "", description: "自增ID" },
                  {
                    name: "timestampColumn",
                    type: "bigint",
                    alias: "",
                    description: "posix时间戳"
                  },
                  {
                    name: "userID",
                    type: "string",
                    alias: "",
                    description: "用户ID"
                  },
                  {
                    name: "code",
                    type: "string",
                    alias: "",
                    description: "产品厂家编号"
                  },
                  {
                    name: "consumption",
                    type: "bigint",
                    alias: "",
                    description: "消费金额单位分"
                  }
                ],
                expiredPeriod: 0
              },
              dataset: {
                id: "e482e2b6-ad32-4993-8a8b-ec10b25c08ce",
                name: "积分数据导入",
                creator: "admin",
                createTime: 1569482148000,
                lastModifier: "admin",
                lastModifiedTime: 1569549164000,
                owner: "edb7f090-5238-4642-a393-43ba19337d5e",
                version: 5,
                tenantId: "db31d4a1-9a22-4b7e-9d73-22b5137ceb69",
                tableName: "merce_dataset",
                expiredPeriod: 0,
                schemaId: "e1d72290-748b-4611-b4d6-28e6326065c5",
                schema: {
                  id: "e1d72290-748b-4611-b4d6-28e6326065c5",
                  name: "积分消费数据",
                  creator: "admin",
                  createTime: 1569481243000,
                  lastModifier: "admin",
                  lastModifiedTime: 1569549147000,
                  owner: "edb7f090-5238-4642-a393-43ba19337d5e",
                  version: 6,
                  tenantId: "db31d4a1-9a22-4b7e-9d73-22b5137ceb69",
                  tableName: "merce_schema",
                  fields: [
                    {
                      name: "id",
                      type: "int",
                      alias: "",
                      description: "自增ID"
                    },
                    {
                      name: "timestampColumn",
                      type: "bigint",
                      alias: "",
                      description: "posix时间戳"
                    },
                    {
                      name: "userID",
                      type: "string",
                      alias: "",
                      description: "用户ID"
                    },
                    {
                      name: "code",
                      type: "string",
                      alias: "",
                      description: "产品厂家编号"
                    },
                    {
                      name: "consumption",
                      type: "bigint",
                      alias: "",
                      description: "消费金额单位分"
                    }
                  ],
                  expiredPeriod: 0
                },
                recordNumber: 0,
                byteSize: 0,
                storage: "KAFKA",
                sliceType: "H",
                analysisTime: 0,
                storageConfigurations: {
                  quoteChar: '"',
                  escapeChar: "\\",
                  brokers: "info3:9093",
                  encryptColumns: "",
                  zookeeper:
                    "info1:2181,info2:2181,info3:2181/europa/app/kafka",
                  reader: "",
                  groupId: "PointsConsume",
                  format: "csv",
                  encryptKey: "",
                  version: "0.10",
                  separator: ",",
                  pathMode: "exact",
                  topic: "PointsConsume",
                  header: "false"
                },
                formatConfigurations: {},
                datasetName: "积分数据导入",
                type: "KAFKA",
                brokers: "info3:9093",
                topic: "PointsConsume",
                format: "csv",
                schemaName: "积分消费数据",
                fields: [
                  { name: "id", type: "int", alias: "", description: "自增ID" },
                  {
                    name: "timestampColumn",
                    type: "bigint",
                    alias: "",
                    description: "posix时间戳"
                  },
                  {
                    name: "userID",
                    type: "string",
                    alias: "",
                    description: "用户ID"
                  },
                  {
                    name: "code",
                    type: "string",
                    alias: "",
                    description: "产品厂家编号"
                  },
                  {
                    name: "consumption",
                    type: "bigint",
                    alias: "",
                    description: "消费金额单位分"
                  }
                ]
              },
              tableName: "NOKIA_KAFKA_SOURCE",
              tableType: "source",
              tableConfig: {
                partitionKey: [],
                timeColumn: "timestampColumn",
                timeFormat: ""
              },
              datasetConfig: [{ name: "", value: "" }],
              name: "积分数据导入",
              id: "e482e2b6-ad32-4993-8a8b-ec10b25c08ce"
            },
            {
              tableName: "lookup",
              tableType: "lateral",
              datasetConfig: [{ name: "", value: "" }],
              schema: {
                id: "af528e28-3355-4071-956e-5ee12102aa93",
                name: "NOKIA用户信息表",
                creator: "admin",
                createTime: 1569503601000,
                lastModifier: "admin",
                lastModifiedTime: 1569504541000,
                owner: "edb7f090-5238-4642-a393-43ba19337d5e",
                version: 3,
                tenantId: "db31d4a1-9a22-4b7e-9d73-22b5137ceb69",
                tableName: "merce_schema",
                fields: [
                  {
                    name: "userID",
                    type: "string",
                    alias: "",
                    description: ""
                  },
                  {
                    name: "userPosition",
                    type: "string",
                    alias: "",
                    description: ""
                  },
                  {
                    name: "timeCol",
                    type: "bigint",
                    alias: "",
                    description: ""
                  }
                ],
                expiredPeriod: 0
              },
              dataset: {
                id: "251b0169-b57d-4fae-b8cf-a97ef7f513fc",
                name: "NOKIA用户信息_维度表",
                creator: "admin",
                createTime: 1569503877000,
                lastModifier: "admin",
                lastModifiedTime: 1571822958000,
                owner: "edb7f090-5238-4642-a393-43ba19337d5e",
                version: 4,
                tenantId: "db31d4a1-9a22-4b7e-9d73-22b5137ceb69",
                tableName: "merce_dataset",
                expiredPeriod: 0,
                schemaId: "af528e28-3355-4071-956e-5ee12102aa93",
                schema: {
                  id: "af528e28-3355-4071-956e-5ee12102aa93",
                  name: "NOKIA用户信息表",
                  creator: "admin",
                  createTime: 1569503601000,
                  lastModifier: "admin",
                  lastModifiedTime: 1569504541000,
                  owner: "edb7f090-5238-4642-a393-43ba19337d5e",
                  version: 3,
                  tenantId: "db31d4a1-9a22-4b7e-9d73-22b5137ceb69",
                  tableName: "merce_schema",
                  fields: [
                    {
                      name: "userID",
                      type: "string",
                      alias: "",
                      description: ""
                    },
                    {
                      name: "userPosition",
                      type: "string",
                      alias: "",
                      description: ""
                    },
                    {
                      name: "timeCol",
                      type: "bigint",
                      alias: "",
                      description: ""
                    }
                  ],
                  expiredPeriod: 0
                },
                recordNumber: 0,
                byteSize: 0,
                storage: "REDIS",
                sliceType: "H",
                analysisTime: 0,
                storageConfigurations: {
                  password: "",
                  keyColumn: "userID",
                  encryptColumns: "",
                  pathMode: "exact",
                  encryptKey: "",
                  url: "192.168.1.83:6379",
                  table: "NOKIA_USER_INFO"
                },
                formatConfigurations: {},
                datasetName: "NOKIA用户信息_维度表",
                type: "REDIS",
                schemaName: "NOKIA用户信息表",
                fields: [
                  {
                    name: "userID",
                    type: "string",
                    alias: "",
                    description: ""
                  },
                  {
                    name: "userPosition",
                    type: "string",
                    alias: "",
                    description: ""
                  },
                  {
                    name: "timeCol",
                    type: "bigint",
                    alias: "",
                    description: ""
                  }
                ]
              },
              name: "NOKIA用户信息_维度表",
              id: "251b0169-b57d-4fae-b8cf-a97ef7f513fc",
              tableConfig: {}
            },
            {
              tableName: "ZYJK_CASE_01_SINK",
              tableType: "result",
              datasetConfig: [{ name: "expireTime", value: "100000" }],
              schema: {
                id: "17a12e65-15ab-4f6f-9b2a-a398cb6f8c35",
                name: "ZYJK_CASE_01_SINK_SCHEMA",
                creator: "admin",
                createTime: 1571820795000,
                lastModifier: "admin",
                lastModifiedTime: 1571824705000,
                owner: "edb7f090-5238-4642-a393-43ba19337d5e",
                version: 4,
                description: "实时数据转发场景测试 sink schema",
                tenantId: "db31d4a1-9a22-4b7e-9d73-22b5137ceb69",
                tableName: "merce_schema",
                fields: [
                  { name: "id", type: "int", alias: "", description: "自增ID" },
                  {
                    name: "timestampColumn",
                    type: "timestamp",
                    alias: "",
                    description: "posix时间戳"
                  },
                  {
                    name: "userID",
                    type: "string",
                    alias: "",
                    description: "用户ID"
                  },
                  {
                    name: "code",
                    type: "string",
                    alias: "",
                    description: "产品厂家编号"
                  },
                  {
                    name: "consumption",
                    type: "bigint",
                    alias: "",
                    description: "消费金额单位分"
                  },
                  {
                    name: "userPosition",
                    type: "string",
                    alias: "",
                    description: ""
                  },
                  {
                    name: "start_time",
                    type: "bigint",
                    alias: "",
                    description: ""
                  },
                  {
                    name: "end_time",
                    type: "bigint",
                    alias: "",
                    description: ""
                  },
                  {
                    name: "proc_time",
                    type: "bigint",
                    alias: "",
                    description: ""
                  }
                ],
                expiredPeriod: 0
              },
              dataset: {
                id: "7618990f-a05b-43bb-b9e4-8e9dec764004",
                name: "ZYJK_CASE_01_结果表",
                creator: "admin",
                createTime: 1571816661000,
                lastModifier: "admin",
                lastModifiedTime: 1571820939000,
                owner: "edb7f090-5238-4642-a393-43ba19337d5e",
                version: 2,
                description: "实时数据转发场景测试结果表",
                tenantId: "db31d4a1-9a22-4b7e-9d73-22b5137ceb69",
                tableName: "merce_dataset",
                expiredPeriod: 0,
                schemaId: "17a12e65-15ab-4f6f-9b2a-a398cb6f8c35",
                schema: {
                  id: "17a12e65-15ab-4f6f-9b2a-a398cb6f8c35",
                  name: "ZYJK_CASE_01_SINK_SCHEMA",
                  creator: "admin",
                  createTime: 1571820795000,
                  lastModifier: "admin",
                  lastModifiedTime: 1571824705000,
                  owner: "edb7f090-5238-4642-a393-43ba19337d5e",
                  version: 4,
                  description: "实时数据转发场景测试 sink schema",
                  tenantId: "db31d4a1-9a22-4b7e-9d73-22b5137ceb69",
                  tableName: "merce_schema",
                  fields: [
                    {
                      name: "id",
                      type: "int",
                      alias: "",
                      description: "自增ID"
                    },
                    {
                      name: "timestampColumn",
                      type: "timestamp",
                      alias: "",
                      description: "posix时间戳"
                    },
                    {
                      name: "userID",
                      type: "string",
                      alias: "",
                      description: "用户ID"
                    },
                    {
                      name: "code",
                      type: "string",
                      alias: "",
                      description: "产品厂家编号"
                    },
                    {
                      name: "consumption",
                      type: "bigint",
                      alias: "",
                      description: "消费金额单位分"
                    },
                    {
                      name: "userPosition",
                      type: "string",
                      alias: "",
                      description: ""
                    },
                    {
                      name: "start_time",
                      type: "bigint",
                      alias: "",
                      description: ""
                    },
                    {
                      name: "end_time",
                      type: "bigint",
                      alias: "",
                      description: ""
                    },
                    {
                      name: "proc_time",
                      type: "bigint",
                      alias: "",
                      description: ""
                    }
                  ],
                  expiredPeriod: 0
                },
                recordNumber: 0,
                byteSize: 0,
                storage: "HDFS",
                sliceType: "H",
                analysisTime: 0,
                storageConfigurations: {
                  path: "/tmp/shiy/zyjk/case01/20191023",
                  quoteChar: '"',
                  escapeChar: "\\",
                  encryptColumns: "",
                  relativePath: "/tmp/shiy/zyjk/case01/20191023",
                  format: "csv",
                  pathMode: "exact",
                  header: "false",
                  encryptKey: "",
                  separator: ","
                },
                formatConfigurations: {},
                datasetName: "ZYJK_CASE_01_结果表",
                type: "HDFS",
                format: "csv",
                schemaName: "ZYJK_CASE_01_SINK_SCHEMA",
                fields: [
                  { name: "id", type: "int", alias: "", description: "自增ID" },
                  {
                    name: "timestampColumn",
                    type: "timestamp",
                    alias: "",
                    description: "posix时间戳"
                  },
                  {
                    name: "userID",
                    type: "string",
                    alias: "",
                    description: "用户ID"
                  },
                  {
                    name: "code",
                    type: "string",
                    alias: "",
                    description: "产品厂家编号"
                  },
                  {
                    name: "consumption",
                    type: "bigint",
                    alias: "",
                    description: "消费金额单位分"
                  },
                  {
                    name: "userPosition",
                    type: "string",
                    alias: "",
                    description: ""
                  },
                  {
                    name: "start_time",
                    type: "bigint",
                    alias: "",
                    description: ""
                  },
                  {
                    name: "end_time",
                    type: "bigint",
                    alias: "",
                    description: ""
                  },
                  {
                    name: "proc_time",
                    type: "bigint",
                    alias: "",
                    description: ""
                  }
                ]
              },
              name: "ZYJK_CASE_01_结果表",
              id: "7618990f-a05b-43bb-b9e4-8e9dec764004",
              tableConfig: { writeMode: "append" }
            }
          ]
        },
        jobEnv: {
          "driver-memory": 1024,
          parallelism: 1,
          executors: 2,
          "executor-cores": 4,
          "use-last-state": "false",
          "executor-memory": 2048,
          "last-savepoint-path": "",
          queue: "default"
        },
        appInfo: {
          jobId: "3fc03c966ad357a2645dff834c0c8fd6",
          executionPlan:
            '{"nodes":[{"id":1,"type":"Source: NOKIA_KAFKA_SOURCE","pact":"Data Source","contents":"Source: NOKIA_KAFKA_SOURCE","parallelism":1},{"id":2,"type":"Flat Map","pact":"Operator","contents":"Flat Map","parallelism":1,"predecessors":[{"id":1,"ship_strategy":"FORWARD","side":"second"}]},{"id":3,"type":"Timestamps/Watermarks","pact":"Operator","contents":"Timestamps/Watermarks","parallelism":1,"predecessors":[{"id":2,"ship_strategy":"FORWARD","side":"second"}]},{"id":4,"type":"from: (id, timestampColumn, userID, code, consumption)","pact":"Operator","contents":"from: (id, timestampColumn, userID, code, consumption)","parallelism":1,"predecessors":[{"id":3,"ship_strategy":"FORWARD","side":"second"}]},{"id":5,"type":"select: (id, timestampColumn, userID, code, consumption, RTC_CURRENT_TIME(userID) AS start_time)","pact":"Operator","contents":"select: (id, timestampColumn, userID, code, consumption, RTC_CURRENT_TIME(userID) AS start_time)","parallelism":1,"predecessors":[{"id":4,"ship_strategy":"FORWARD","side":"second"}]},{"id":6,"type":"correlate: table(lookup($cor0.userID)), select: id, timestampColumn, userID, code, consumption, start_time, userID0, userPosition, timeCol","pact":"Operator","contents":"correlate: table(lookup($cor0.userID)), select: id, timestampColumn, userID, code, consumption, start_time, userID0, userPosition, timeCol","parallelism":1,"predecessors":[{"id":5,"ship_strategy":"FORWARD","side":"second"}]},{"id":7,"type":"select: (id, timestampColumn, userID, code, consumption, userPosition, start_time, RTC_CURRENT_TIME(userID) AS end_time, -(RTC_CURRENT_TIME(userID), start_time) AS proc_time)","pact":"Operator","contents":"select: (id, timestampColumn, userID, code, consumption, userPosition, start_time, RTC_CURRENT_TIME(userID) AS end_time, -(RTC_CURRENT_TIME(userID), start_time) AS proc_time)","parallelism":1,"predecessors":[{"id":6,"ship_strategy":"FORWARD","side":"second"}]},{"id":8,"type":"to: Row","pact":"Operator","contents":"to: Row","parallelism":1,"predecessors":[{"id":7,"ship_strategy":"FORWARD","side":"second"}]},{"id":9,"type":"Sink: Unnamed","pact":"Data Sink","contents":"Sink: Unnamed","parallelism":1,"predecessors":[{"id":8,"ship_strategy":"FORWARD","side":"second"}]}]}',
          appState: "KILLED",
          trackingUrl:
            "http://info2:8088/proxy/application_1570914203143_11884/",
          appId: "application_1570914203143_11884",
          lastSavepointPath:
            "hdfs://info1:8020/tmp/savepoints/flink/402881d56e441b57016e44eda9680000/savepoint-3fc03c-df7c51ec3ad1",
          jobMetrics: {
            jobId: {
              upperPart: 7232217516008575000,
              lowerPart: 4593738236652902400,
              bytes: "P8A8lmrTV6JkXf+DTAyP1g=="
            },
            name: "ZYJK_CASE_01#2019-11-07 16:14:16 367",
            jobStatus: "RUNNING",
            startTime: 1573114483244,
            endTime: -1,
            duration: 239874669,
            now: 1573354357913,
            timestamps: {
              RUNNING: 1573114483892,
              CANCELED: 0,
              FINISHED: 0,
              SUSPENDING: 0,
              CREATED: 1573114483244,
              FAILED: 0,
              RESTARTING: 0,
              CANCELLING: 0,
              SUSPENDED: 0,
              RECONCILING: 0,
              FAILING: 0
            },
            jobVertexInfos: [
              {
                jobVertexID: {
                  upperPart: 5980473287941903000,
                  lowerPart: -3764068326789882000,
                  bytes: "y8NXzLdj3yhS/ujE/H1V8g=="
                },
                name:
                  "Source: NOKIA_KAFKA_SOURCE -> Flat Map -> Timestamps/Watermarks -> from: (id, timestampColumn, userID, code, consumption) -> select: (id, timestampColumn, userID, code, consumption, RTC_CURRENT_TIME(userID) AS start_time) -> correlate: table(lookup($cor0.userID)), select: id, timestampColumn, userID, code, consumption, start_time, userID0, userPosition, timeCol -> select: (id, timestampColumn, userID, code, consumption, userPosition, start_time, RTC_CURRENT_TIME(userID) AS end_time, -(RTC_CURRENT_TIME(userID), start_time) AS proc_time) -> to: Row -> Sink: Unnamed",
                parallelism: 1,
                executionState: "RUNNING",
                startTime: 1573114496713,
                endTime: -1,
                duration: 239861200,
                tasksPerState: {
                  CANCELING: 0,
                  DEPLOYING: 0,
                  RECONCILING: 0,
                  FAILED: 0,
                  FINISHED: 0,
                  RUNNING: 1,
                  CREATED: 0,
                  SCHEDULED: 0,
                  CANCELED: 0
                },
                jobVertexMetrics: {
                  bytesRead: 0,
                  bytesReadComplete: true,
                  bytesWritten: 0,
                  bytesWrittenComplete: true,
                  recordsRead: 0,
                  recordsReadComplete: true,
                  recordsWritten: 0,
                  recordsWrittenComplete: true
                }
              }
            ],
            jobVerticesPerState: {
              CANCELING: 0,
              DEPLOYING: 0,
              RECONCILING: 0,
              FAILED: 0,
              FINISHED: 0,
              RUNNING: 1,
              CREATED: 0,
              SCHEDULED: 0,
              CANCELED: 0
            },
            jsonPlan:
              '{"jid":"3fc03c966ad357a2645dff834c0c8fd6","name":"ZYJK_CASE_01#2019-11-07 16:14:16 367","nodes":[{"id":"cbc357ccb763df2852fee8c4fc7d55f2","parallelism":1,"operator":"","operator_strategy":"","description":"Source: NOKIA_KAFKA_SOURCE -&gt; Flat Map -&gt; Timestamps/Watermarks -&gt; from: (id, timestampColumn, userID, code, consumption) -&gt; select: (id, timestampColumn, userID, code, consumption, RTC_CURRENT_TIME(userID) AS start_time) -&gt; correlate: table(lookup($cor0.userID)), select: id, timestampColumn, userID, code, consumption, start_time, userID0, userPosition, timeCol -&gt; select: (id, timestampColumn, userID, code, consumption, userPosition, start_time, RTC_CURRENT_TIME(userID) AS end_time, -(RTC_CURRENT_TIME(userID), start_time) AS proc_time) -&gt; to: Row -&gt; Sink: Unnamed","optimizer_properties":{}}]}',
            stoppable: false
          },
          state: "KILLED"
        }
      };
        draw(JSON.parse(jsonData.appInfo.executionPlan));
        //draw(JSON.parse(row.metrics.jsonPlan));


      //构建要展示的数据
      // var json = JSON.parse(row.metrics.jsonPlan);
      // if (json != undefined) {
      //   draw(jsonData);
      // }
    },

    drawSvg() {
      const oIframe = document.getElementById("show-iframe");
      oIframe.src = "/static/jsLibrary/visualizer/index.html";

       oIframe.onload = ()=> {
            //iframe加载完成后你需要进行的操作
           this.showDraw(this.data.row,oIframe);
        };
     
    }
  }
};
</script>

<style lang="scss">
.iframe-style {
  min-height: 750px;
  width: 100%;
}
</style>
