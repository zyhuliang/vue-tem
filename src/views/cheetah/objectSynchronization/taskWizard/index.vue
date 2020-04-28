<template>
  <!--向导的头部-->
  <div class="clearBx activePublic" id='bm-ch-objectsys-index-tmp'>
    <el-steps :active="step-1" class="step" finish-status="success" align-center>
      <el-step title="数据来源" description=""></el-step>
      <el-step title="字段配置" description=""></el-step>
      <el-step title="任务设置" description=""></el-step>
      <el-step title="保存预览" description=""></el-step>
    </el-steps>
    <!--向导的内容区-->
    <transition name="fade" class="contentBorder">
      <router-view class="view"></router-view>
    </transition>
    <!--向导的底部按钮-->
    <!--<div class="but-group">-->
    <div align="center" class="cb-footer">
      <el-button @click.native.prevent="handlePreStep" :disabled=!preStep type="primary">上一步</el-button>
      <el-button @click.native.prevent="handleNextStep" :disabled=!nextStep type="primary">下一步</el-button>
      <el-button @click.native.prevent="handlePublish" :disabled=!publish>完成</el-button>
      <el-button @click.native.prevent="handleCancel" :disabled=!cancel>取消</el-button>
    </div>
  </div>
</template>

<script>
  import task from '@jsTask/taskStep.js';
  import {postSynchronizationTask, getTaskJson, editSynchronizationTask} from '@api';
  //taskEntity
  var entity = {
    id: "",
    name: "",
    dataStore:{},
    dataSource: {
      id: "",
      name: "",
      DBType: "",
      driver: "",
      url: "",
      sql: "",
      table: "",
      username: "",
      password: "",
      host: "",
      port: 3306,
      database: "",
      type: "",
      dbType: "",
      tableExt: "",
      schema:"", //oracle专门用的字段
      condition:"",//数据过滤
    },
    fields: {sf:[],sft:[]},
    masterKeys:[],
    needCollectKeys:[],
    namespace:"",
    type: 'SyncObjectTask',
    opts: '-Xss256k -Xms1G -Xmx1G -Xmn512M',
    //并行度
    parallelism:1,
    //触发器
    trigger:"",
    //增量字段
    cursorCol:"",
    //错误记录上限
    errorNumber:0,
    //缓冲区大小
    bufferSize: 5000,
    //延时刷出时间
    flushPaddingTime:30000
  }
  var defaultEntity = entity;
  export default {
    name: 'taskWizard',
    data: function () {
      return {
        loading:false,
        isRouter: false,
        cancel: true,
        preStep: false,
        nextStep: false,
        publish: false,
        step: 1
      }
    },
    methods: {
//            上一步
      handlePreStep: function () {
        if (this.step > 1) {
          this.$router.go(-1);
          this.step--;
          this.goStep(this.step);
        }

      },
//            下一步
      handleNextStep: function () {
        this.$router.push('/objectTaskWizard/step' + (this.step + 1));
      },
      //整理数据
      formatData: function () {
        if (localStorage.taskEntity) {
          //获取全局的entity,并且变成json
          var entity = JSON.parse(localStorage.taskEntity);
        }
        if (entity.dataSource.type == 'DB') entity.dataSource.type = 'JDBC'
        //console.log(JSON.stringify(entity))
        //将不需要提交的数据去掉
        delete entity.fields
        if(entity.isCopy == true){
          delete entity.id
        }
        delete entity.isCopy
        entity.type = "SyncObjectTask"
        this.jobId = entity.jobId
        delete entity.jobId

        console.log(entity);
        //判断是不是编辑任务，不是再区分采集器任务，调用采集器任务api接口
        var postTask = this.jobId ? editSynchronizationTask(this.jobId, entity) : postSynchronizationTask(entity)
        //调用提交接口
        var _this = this
        postTask.then(res => {
          _this.$router.push('/objectSynchronization');
          task.$emit('refreshObjectSynchronizationList')
          _this.$message({
            message: '提交成功！',
            type: 'success'
          })
        }, err => {
          if (err.response) {
            if (err.response.data.err.indexOf("Duplicate")) {
              _this.$message({
                message: "任务名已存在",
                type: 'error'
              });
            }
          }
        }).catch(function (error) {
          if (error.response) {
            if (error.response.data.err.indexOf("Duplicate")) {
              _this.$message({
                message: "任务名已存在",
                type: 'error'
              });
            }
          }
        });
      },
//            完成
      handlePublish: function () {
        //提交前的数据整理
        this.formatData();
      },
//            取消
      handleCancel: function () {
        this.$router.push('/objectSynchronization');
        console.log('取消');
      },
//            跳转时按钮的状态
      goStep: function (n) {
        switch (n) {
          case 1 :
            this.preStep = false;
            this.nextStep = true;
            this.publish = false;
            this.cancel = true;
            break;
          case 2 :
            this.preStep = true;
            this.nextStep = true;
            this.publish = false;
            this.cancel = true;
            break;
          case 3 :
            this.preStep = true;
            this.nextStep = true;
            this.publish = false;
            this.cancel = true;
            break;
          case 4 :
            this.preStep = true;
            this.nextStep = false;
            this.publish = true;
            this.cancel = true;
            break;
        }
      }
    },
    beforeCreate() {
      if (localStorage.taskEntity && !JSON.parse(localStorage.taskEntity).isCopy) {
        localStorage.taskEntity = JSON.stringify(defaultEntity);
      }
    },
    mounted() {
      var that = this;
      //如果是复制，就要获取entity
      if (localStorage.taskEntity && JSON.parse(localStorage.taskEntity)['isCopy']) {
        var id = JSON.parse(localStorage.taskEntity).id
        //在编辑一条任务时候获取该任务id发送器请求获取数据
        that.jobId = JSON.parse(localStorage.taskEntity).jobId;
        that.loading = true;
        getTaskJson(id).then(data => {
          that.loading = false;
          if (data) {
            entity = data;
            entity.id = id;
            //添加数据源和数据集的数组字段
            entity.mappingTarget = []
            entity.mappingSource = []
            //更改name，防止重名
            if (that.jobId == undefined && entity.name !== '') {
              entity.name = entity.name + '_copy' + new Date().toISOString()
            } else if (that.jobId != undefined) {
              entity.jobId = that.jobId
            }
            // 设置字段
            entity.fields = {};
            entity.fields.sf = [];
            entity.fields.sft = [];
            entity.isCopy = true
            //将类型改变
            entity.type = 'SyncObjectTask'
            localStorage.taskEntity = JSON.stringify(entity);
            that.$router.push('/objectTaskWizard/step1');
          }
        }, error => {
          that.message({
            message: "获取数据失败" + error,
            type: 'error'
          })
        })
      } else {
        entity.isCopy = false
        //初始化entity放入缓存
        localStorage.taskEntity = JSON.stringify(defaultEntity);
        that.$router.push('/objectTaskWizard/step1');
      }
      //校验name是否存在的方法
      task.$on('objectTaskNameNextStep', (step) => {
        that.goStep(1)
      })
      //在下一步时候如果验证没通过还在此页面
      task.$on('objectTaskNextStep', (step) => {
        that.step = step * 1
        that.goStep(that.step)
        that.$router.push('/objectTaskWizard/step' + (that.step));
      })
    },
    watch: {
      '$route': function (to, from) {
        this.step = window.location.hash.charAt(window.location.hash.indexOf('objectTaskWizard/step') + 21) * 1
        this.goStep(this.step);
      }
    }
  }

</script>
<style lang="scss" scoped>
  .clearBx {
    position: absolute;
    background-color: #fff;
    width: 100%;
    height: 100%;
    padding: 20px 10px 10px 10px;
    top: 0px;
    box-sizing: border-box;
    z-index: 100;
    .cb-header {
      top: 10px;
    }
    .activePublic .router-link {
      color: #fff;
    }
    .activePublic .contentBorder {
      border: 1px solid #eee;
      min-height: 540px;
      text-align: center;
      font-size: 16px;
      background-color: #B3C0D1;
      color: #333;
      line-height: 60px;
    }
    .activePublic .but-group .el-button {
      margin-right: 20px;
    }
    .cb-footer {
      margin: 10px 0 0 0;
    }

  }
</style>
