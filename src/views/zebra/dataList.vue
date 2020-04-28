<template>

  <section class="irContent">
      <el-row>
        <div class="dl-1">
          <h4>总数据量:</h4>
          <span>{{sumData}}</span>
        </div>
        <div class="dl-1">
          <h4>对接部门数量:</h4>
          <span>{{departmentNumber}}</span>
        </div>
        <div class="dl-1">
          <h4>对接系统数量:</h4>
          <span>{{systemNumber}}</span>
        </div>
        <div class="dl-1">
          <h4>数据集数量:</h4>
          <span>{{dataNumber}}</span>
        </div>
        <el-button plain>设置</el-button>
      </el-row>

      <el-row>
        <div class="dl-content">
          <div>
            <h3>{{dockingDepartment}}</h3>
          </div>
          <div style="float: left; width: 100%; padding: 10px; box-sizing: border-box;">
            <p class="dl01" v-for="(dataPro, index) in dataPros">
              <span>{{dataPro.name}}</span>
              <span>对接系统：</span>
              <span>总数据量：{{dataPro.children.length}}</span>
              <span>数据集数：{{dataPro.moduleVersion}}</span>
            </p>
          </div>
        </div>
      </el-row>


  </section>
</template>
<script>
    import { settings,resourceChildren, resDirTree } from '@api';

    export default {
        data() {
            return {
                sumData:'0',
                departmentNumber:'4',
                systemNumber:'2',
                dataNumber:'3',
                dockingDepartment:'',
                dataPros:[]
            }
        },
        methods: {
            //settings 接口
            settings: function () {
                settings().then(data => {

                    //获取对接部门名称
                    this.dockingDepartment = data.name;

                    let resourceId = data.resourceId;
                    let tenant = data.tenant;
                    let  parameter = {id:resourceId,includes:"dir;dataset_spool;dataset_db",level:100,tenant:tenant};
                    resourceChildren(parameter).then(data => {
                        //获取数据对象
                        this.dataPros = data;
                        let  parameter = {excludes:"dataset_db|dataset_spool"};
                        resDirTree(parameter).then(data => {

                        }, err => {
                            var _this = this;
                            if(err.response.status == 500) {
                                _this.$message({
                                    message: err.response.message,
                                    type: 'error',
                                    duration: 1500
                                });
                            }
                            }
                        )


                    }, err => {
                        var _this = this;
                        if(err.response.status == 500) {
                            _this.$message({
                                message: err.response.message,
                                type: 'error',
                                duration: 1500
                            });
                        }
                        }
                    )

                }, err => {
                    var _this = this;
                    if(err.response.status == 500) {
                        _this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    }
                    }
                )
            },
        },
        mounted() {
            this.settings();
        }
    }

</script>

<style scoped>
  .el-row{
    float: left;
    width: 100%;
  }
  .el-row .el-button i{
    font-size: 13px;
  }

  .el-row div.dl-1{
    float: left;
    height: 34px;
    line-height: 34px;
    margin-right: 30px;
    font-size: 18px;
    color: #666666;
  }
  .el-row div h4{
    margin: 0;
    float: left;
  }
  .el-row div span{
    float: left;
    margin-left: 10px;
  }

  .dl-content{
    float: left;
    width: 100%;
    margin-top: 15px;
    min-height: 340px;
    max-height: 800px;
    border: 1px solid #cccccc;
  }
  .dl-content div:first-child{
    float: left;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background-color: #f0f0f9;
  }

  .dl-content div:first-child h3{
    margin: 0px 0px 0px 20px;
    font-size: 18px;
  }

  .dl-content p.dl01{
    float: left;
    margin: 10px;
    width: 250px;
    height: 250px;
    border: 1px solid #cccccc;
  }
  .dl-content p.dl01 span:first-child{
    float: left;
    width: 100%;
    margin: 20px;
    font-weight: bold;
  }
  .dl-content p.dl01 span{
    float: left;
    width: 70px;
    margin: 10px;
  }
</style>