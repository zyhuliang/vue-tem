<template>
  <div class="step1" id='bm-ch-objectsys-step1-tmp'>
    <!-- element表单组件 -->
    <el-form id="bm-ch-object-step1-form" v-loading="loading" :model="step1Form" status-icon ref="step1Form"
             :rules="rules" class="demo-step1 demo-step1Form" label-position="top">
      <!-- 表单项，prop属性表示要进行表单验证，验证规则对应为rules的属性name -->
      <el-form-item label="任务名称" :label-width="formLabelWidth" prop="name">
        <el-input name="bm-ch-object-step1Form-name-input" type="text" v-model="step1Form.name"
                  auto-complete="off"></el-input>
      </el-form-item>

      <el-form-item label="数据源" :label-width="formLabelWidth" prop="dataSource.name">
        <el-input name="bm-ch-object-step1Form-dataSource-name-input" placeholder="请选择内容"
                  v-model="step1Form.dataSource.name" class="input-with-select" :readonly=true>
          <el-button slot="append" icon="icon iconfont icon-ir-search" @click="dataSourceInquire"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="表选择" :label-width="formLabelWidth" prop="value">
        <el-select
          class="form-selet"
          v-model="value"
          filterable
          placeholder="输入表/视图名显示查询结果..."
          :filter-method="filterTable"
          prop="dataSource.table"
          @visible-change="onTableChange"
          name="bm-ch-step1Form-table-select"
        >
          <el-option
            v-for="item in tableList"
            :key="item"
            :value="item"
            :label="item"
          >
          </el-option>
          <el-button style="align-content: center;width: 100%" @click="fetchTable(value)" v-if="!isLastPage">
            加载更多......
          </el-button>
        </el-select>
      </el-form-item>
      <el-form-item label="数据过滤" :label-width="formLabelWidth" prop="dataSource.condition">
        <el-input name="bm-ch-step1Form-datasource-selectSQL-input" type="text" v-model="step1Form.dataSource.condition" auto-complete="off" placeholder="按照sql语法填写where部分，但是不需要写where关键字"></el-input>
      </el-form-item>
      <!--  <el-form-item label="扩展表" :label-width="formLabelWidth" prop="dataSource.tableExt">
            <el-input name="bm-ch-step1Form-datasource-tableExt-input" type="text" v-model="step1Form.dataSource.tableExt" auto-complete="off" placeholder="请填写扩展表的表达式！"></el-input>
            <el-tooltip content="扩展表格式,  #FUNC_NAME(ARGS)#
                1. 动态获取当前日期, 如表名为Table1, 表达式Table1_#DATE(yyyy_MM_dd)#,
                可获得Table1_ 2018_03_23" effect="dark" placement="top">
                <i class="parIcon el-icon-warning"></i>
            </el-tooltip>
        </el-form-item>
        <el-form-item label="数据过滤" :label-width="formLabelWidth" prop="dataSource.selectSQL">
            <el-input name="bm-ch-step1Form-datasource-selectSQL-input" type="text" v-model="step1Form.dataSource.selectSQL" auto-complete="off" placeholder="按照sql语法填写where部分，但是不需要写where关键字"></el-input>
        </el-form-item>
        &lt;!&ndash;预览数据&ndash;&gt;
        <el-form-item :label-width="formLabelWidth" >
            <span >
                <el-button  name="bm-ch-step1Form-datasource-refrensh-button" type="primary" @click="previewData()">刷新</el-button>
                <el-table id="bm-ch-collector-step1-table" :data="rowCollection" class="pre-tab" height="calc(100vh - 400px)">
                    <tr v-for="(col, index) in cols">
                        <el-table-column :prop="col[index]" :label="col">
                            <template slot-scope="scope">
                                {{scope.row[index]}}
                            </template>
                        </el-table-column>
                    </tr>

                </el-table>
            </span>
        </el-form-item>-->
    </el-form>

    <!-- DataSource dialog-->
    <el-dialog title="数据源查询" :visible.sync="dialogDataSourceVisible" :close-on-click-modal="false"
               :modal-append-to-body="false" custom-class="dialogClass">
      <el-form>
        <data-source-inquire @thisSelectDateSourceVal="getSelectDateSourceVal"
                             rootName="datasource_dir"></data-source-inquire>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDataSource" name='bm-ch-objectsys-step1-ok-button'>确定
        </el-button>
        <el-button @click="dialogDataSourceVisible = false" name='bm-ch-objectsys-step1-cancel-button'>取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import task from '@jsTask/taskStep.js';
  import dataSourceInquire from '@dataSourceInq/dataSourceInquire.vue';
  import {taskPreviewData, getTables, getColumns, taskNameRule} from '@api';

  export default {
    components: {
      dataSourceInquire,
    },
    name: 'step1',
    data: function () {
      var validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入内容...'));
        } else if (value) {
          task.$emit('objectTaskNameNextStep')
          //获取job的id
          var jobId = this.step1Form.jobId
          taskNameRule('WOVEN-SERVER', value, jobId).then(res => {
            if (!res.success) {
              callback(new Error('此名字已存在'));
            } else {
              callback();
            }
          })
        }
      };
      return {
        loading: false,//加载
//			    select tables 分页
        tablePage: 0,
        tablePageSize: 50,
        lastTableKeyword: "",
        isLastPage: false,
        tables: [],
        tableList: [],
        value: '',
        formLabelWidth: "200px",
        selectedSource: {},
//                数据预览的table数值
        rowCollection: [],
        cols: [],
        dialogDataSourceVisible: false,
        getSelValDataSource: {},
//                step1Form
        step1Form: {
          dataSource: {}
        },
        rules: {
          name: [
            {required: true, validator: validateName, trigger: 'change'}
          ],
          'dataSource.name': [
            {required: true, message: '请输入内容...', trigger: 'change'}
          ]
        }
      };
    },
    methods: {
      //获取子组件的dataSource entity
      getSelectDateSourceVal(data) {
        this.getSelValDataSource = data;
      },
      //弹出"dataSource查询"层
      dataSourceInquire: function () {
        this.dialogDataSourceVisible = true;
      },
      //dataSource查询数据提交
      submitDataSource: function () {
        if (this.getSelValDataSource === '') {
          this.$message({
            message: '请选择一条数据！',
            type: 'error'
          });
          return false;
        } else {
//				    //清空datasaource
//                    this.step1Form.dataSource = Object.assign({}, entity.dataSource )
//                  进行所需字段转换
          this.selectedSource = this.getSelValDataSource;
          this.getSelValDataSource.attributes.selectSQL = this.getSelValDataSource.attributes.sql;
          this.getSelValDataSource.attributes.username = this.getSelValDataSource.attributes.user;
          this.getSelValDataSource.attributes.resType = this.getSelValDataSource.type;
          this.getSelValDataSource.attributes.schema = this.getSelValDataSource.attributes.schema;
          this.tablePage = 0;
          this.tablePageSize = 50;
          this.lastTableKeyword = "";
          this.value = '';
          this.isLastPage = false;
          this.fetchTable()
//					根据所选数据源更新step1Form的数据
          this.copyObject(this.step1Form.dataSource, this.getSelValDataSource);
          if (this.getSelValDataSource.attributes && this.getSelValDataSource.attributes.name) {
            this.step1Form.dataSource.attributesName = this.getSelValDataSource.attributes.name
            delete this.getSelValDataSource.attributes.name
          }
          this.copyObject(this.step1Form.dataSource, this.getSelValDataSource.attributes);
          this.dialogDataSourceVisible = false;
        }
      },
      //选择source的table时获取字段信息
      getColumns: function () {
        var that = this;
        that.loading = true
        that.step1Form.fields.sf = [];
        that.step1Form.fields.sft = [];
        var sourceJson = {};
        if (that.selectedSource) {
          sourceJson = {
            id: that.selectedSource.id,
            name: that.selectedSource.name,
            type: "JDBC",
            driver: that.selectedSource.driver ? that.selectedSource.driver : that.selectedSource.attributes.driver,
            url: that.selectedSource.url ? that.selectedSource.url : that.selectedSource.attributes.url,
            username: that.selectedSource.username ? that.selectedSource.username : that.selectedSource.attributes.user,
            password: that.selectedSource.password ? that.selectedSource.password : that.selectedSource.attributes.password,
            schema: that.selectedSource.schema ? that.selectedSource.schema : that.selectedSource.attributes.schema,
            table: that.value,
            selectSQL: "",
            dbType: that.selectedSource.DBType ? that.selectedSource.DBType : that.selectedSource.type ? that.selectedSource.type : that.selectedSource.attributes.DBType
          }
        }
        getColumns(sourceJson.id, that.value).then((results) => {
          that.loading = false
          for (var i = 0, j = 0; i < results.length / 2, j < results.length; i += 1, j += 2) {
            that.step1Form.fields.sf.push(results[j])
            that.step1Form.fields.sft.push({sourceField: results[j], sourceType: results[j + 1]});
          }
        }, error => {
          that.loading = false
          this.$confirm(error.response.data.err, "错误", {
            type: "error"
          })
        })
      },
      //过滤table
      filterTable(val) {
        if (val) {
          this.value = val;
          this.fetchTable(val)
        } else {
          this.tableList = this.tables
        }
      },
      //更换table
      onTableChange: function () {
        this.columns = []
        if (!this.value)
          return;
        this.getColumns(this.value);
      },
      //缓存或者查询table的数组
      fetchTable: function (val) {
        var that = this;
        if (that.getSelValDataSource) {
          //如果查询条件值改变，offset归0
          if (that.lastTableKeyword != that.value) {
            that.tablePage = 0;
          }
          var getTableParams = {
            keyword: val,
            id: that.getSelValDataSource.id,
            offset: that.tablePage * that.tablePageSize,
            limit: that.tablePageSize
          }
          that.loading = true;
//                    获取tables
          getTables(getTableParams).then(results => {
            that.loading = false;
            that.isLastPage = results.last
            //如果上次查询条件的key和这次是同一个那么就将这次结果拼接到上次并将page+1
            if (that.lastTableKeyword == that.value) {
              that.tables = that.tables.concat(results.content);
              that.tablePage++;
            } else {
              //如果是新的查询条件，将以前的查询tables清空并page赋值为1
              that.lastTableKeyword = that.value;
              that.tables.splice(0, that.tables.length)
              that.tables = that.tables.concat(results.content);
              that.tablePage = 1;
            }
            that.tableList = that.tables;
          }, error => {
            that.loading = false;
            this.$confirm(error.response.data.err, "错误", {
              type: "error"
            })
          })
        }
      },
      //预览数据
      previewData: function () {
        if (this.value) {
          var id = this.selectedSource.id;
          var table = this.value;
        }
        var sql = "SELECT * FROM " + table;
        var selectedWhere = this.step1Form.dataSource.selectSQL ? " where " + this.step1Form.dataSource.selectSQL : "";
        selectedWhere = encodeURIComponent(selectedWhere);
        if (selectedWhere)
          sql = sql + " " + selectedWhere
        var par = "limit:5;offset:0;rowCount:true";
        taskPreviewData(id, sql, par).then(result => {
          this.cols = result.names;
          var obj = result.rows.toJson
          this.rowCollection = result.rows ? result.rows : [];
        }, err => {
          this.$message({
            message: err.response.message,
            type: 'error',
            duration: 1500
          });
        });
      },
    },
    created() {
      if (localStorage.taskEntity) {
        //获取全局的entity
        var that = this
        that.step1Form = JSON.parse(localStorage.taskEntity);
        //如果是选择了数据源就要获取表数组
        if (that.step1Form.dataSource.id) {
          that.getSelValDataSource = that.step1Form.dataSource
          //如果是复制就要把jdbc变成db
          that.step1Form.dataSource.type = that.step1Form.dataSource.type == 'JDBC' ? 'DB' : that.step1Form.dataSource.type
          that.fetchTable()
          //获取数据源的信息
          that.selectedSource = that.step1Form.dataSource
        }
        this.value = this.step1Form.dataSource.table;
        //如果是复制获取datasourceMapping
        if (that.step1Form.isCopy != undefined) {
          //初始化要存储datasource的变量
          that.step1Form.fields.sf.length = 0;
          that.step1Form.fields.sft.length = 0;
          //db类型的就要获取表的字段
          getColumns(that.step1Form.dataSource.id, that.step1Form.dataSource.table).then((results) => {
            for (var i = 0, j = 0; i < results.length / 2, j < results.length; i += 1, j += 2) {
              that.step1Form.fields.sf.push(results[j])
              that.step1Form.fields.sft.push({sourceField: results[j], sourceType: results[j + 1]});
            }
          }, err => {
            this.$message({
              message: err.response.message,
              type: 'error',
              duration: 1500
            });
          })
        }
      }
    },
    beforeRouteLeave: function (to, from, next) {
      var that = this;
      if (localStorage.taskEntity) {
        //将选择表的临时存储值放入entity
        that.step1Form.dataSource.table = this.value;
        //将局部的entity合并到全局的entity中
        that.step1Form = that.copyObject(JSON.parse(localStorage.taskEntity), that.step1Form)
        //保存全局的entity到storage
        localStorage.taskEntity = JSON.stringify(that.step1Form);
      }
      //如果在向导中跳转
      if (to.path.substr(0, 22) == '/objectTaskWizard/step') {
        //如果验证都通过才可以下一步
        that.$refs.step1Form.validate((valid) => {
          if (valid) {
            next();
          } else {
            //获取从第几步到第几步
            var fromStep = from.path.charAt(from.path.indexOf('objectTaskWizard/step') + 21)
            task.$emit('objectTaskNextStep', fromStep)
            return false;
          }
        })
      } else {
        localStorage.removeItem('taskEntity');
        next();
      }
    },
  }
</script>
<style lang="scss" scoped>
  .step1 {
    height: calc(100vh - 187px);
    overflow-y: auto;

    .form-selet {
      width: 100%;
    }

    .demo-step1 {
      margin-left: 25%;
      width: 50%;
      background-color: rgba(255, 255, 255, .9);
    }

    .pre-tab {
      width: 100%;
      min-height: 50px;
      margin-top: 5px;
      margin-bottom: 15px;
    }
  }
</style>
