<template>
    <!--name dialog-->
    <el-dialog
            :visible.sync="dialogNameVisible"
            width="80%"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            title="同步任务信息"
            custom-class="redialogClass"
    >
        <el-carousel :interval="5000" height="calc(80vh - 95px)" arrow="always" autoplay="false" type="card"
                     class="boxEl">
            <el-carousel-item>
                <div class="name_div">
                    <h3>任务详情</h3>
                    <el-form class="form-border" :model="taskEntity">
                        <el-form-item label="任务名称" prop="name" :label-width="formLabelWidth" >
                            <el-input v-model="taskEntity.name" auto-complete="off" :readonly=true ></el-input>
                        </el-form-item>

                        <el-form-item :label="'path'|cn" prop="path" :label-width="formLabelWidth">
                            <el-input v-model="taskEntity.path" auto-complete="off" id="path" name="path" :readonly=true ></el-input>
                        </el-form-item>

                        <el-form-item :label="'overwrite'|cn" :label-width="formLabelWidth">
                            <el-input v-model="taskEntity.overwrite" auto-complete="off" id="overwrite" name="overwrite" :readonly=true ></el-input>
                        </el-form-item>

                        <el-form-item label="周期" prop="trigger" :label-width="formLabelWidth" v-if="taskEntity.trigger && taskEntity.dataSource.type != 'SOCKET'">
                            <el-input v-model="taskEntity.trigger" auto-complete="off" name="trigger" id="trigger" :readonly=true></el-input>
                        </el-form-item>
                        <el-form-item label="并行度" prop="parallelism" :label-width="formLabelWidth">
                            <el-input v-model="taskEntity.parallelism" auto-complete="off" id="parallelism" name="parallelism" :readonly=true ></el-input>
                        </el-form-item>

                        <el-form-item label="错误记录上限数" prop="errorNumber" :label-width="formLabelWidth">
                            <el-input v-model="taskEntity.errorNumber" auto-complete="off"  id="errorNumber"  name="errorNumber" :readonly=true></el-input>
                        </el-form-item>
                        <el-form-item label="Schema变动" prop="stopOnSchemaChanged" :label-width="formLabelWidth" v-if="!CollectorID">
                            <el-input v-model="taskEntity.stopOnSchemaChanged" auto-complete="off"  id="stopOnSchemaChanged"  name="stopOnSchemaChanged" :readonly=true></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </el-carousel-item>
            <el-carousel-item>
                <div class="name_div">
                    <h3>数据源</h3>
                    <el-form class="form-border" >
                        <el-form-item
                                :label-width="formLabelWidth"
                                v-for="(item, index) in dataSource"
                                :key ="item.name"
                                :label="item.name | cn"
                                :prop="'dataSource.' + index + '.value'">
                            <el-input v-model="item.value" auto-complete="off" id="'dataSource.' + index + '.value'" name="item.name" :readonly=true></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </el-carousel-item>
        </el-carousel>
    </el-dialog>
</template>

<script>
    import {getTaskJson } from '@api'

    export default {
        name: 'previewTaskName',
        data() {
            return {
                dialogNameVisible:false,
                taskEntity:{},
                formLabelWidth:"",
                isDate:"",
                CollectorID:"false",
                dataSource:[],
                dataStore : [],
                fieldMapping:[],
                statusType:"",
                isSeparator:"",

            }
        },
        methods: {
//			数据预览 taskName
            nameDialog: function (id, collectorId) {
//				获取task的entity
                var _this = this
                getTaskJson(id).then((res)=>{
                    _this.taskEntity ={};
                    _this.taskEntity = res
//					datasource部分赋值
                    _this.dataSource = [];
                    var objSource = _this.taskEntity.dataSource;
                    if(objSource.operateType == 0){
                        delete objSource.regex;
                    }
                    for(var key in objSource){
                        if(key != 'properties' && key != 'operateType')
                            _this.dataSource.push({name:key,value:objSource[key]})

                        if(key == 'operateType'){
                            var operateType = objSource[key] == 0? '原样' :objSource[key] == 1? '抽取' :objSource[key] == 2? '分割' : '过滤'
                            _this.dataSource.push({name:"operateType",value:operateType})
                        }
                    }
                    for(var i =0 ;i<_this.dataSource.length;i++){
                        if(_this.dataSource[i].name == "password"){
                            _this.dataSource[i].value = "******"
                        }
                        if(_this.dataSource[i].name == "filename"){
                            _this.dataSource.splice(i, 1);
                        }

                        if(_this.dataSource[i].name == "object"){
                            _this.dataSource.splice(i, 1);
                        }
                    }
//					datastore部分赋值
                    _this.dataStore = [];
                    var objStore = _this.taskEntity.dataStore;
                    for(var key in objStore){
                        if(key == 'mode') objStore.mode = objStore.mode == 'append'?'追加':'覆盖' ;
                        _this.dataStore.push({name:key,value:objStore[key]})

                        if(key == "path"){
                            _this.taskEntity.path = objStore[key]
                        }

                        if(key == "overwrite"){
                            _this.taskEntity["overwrite"] = objStore.overwrite.toString()
                        }
                    }
//					特殊字段显示赋值
                    if( _this.taskEntity.partitionPattern != "")
                        _this.isDate = true;
                    _this.statusType = (objSource.type == 'JDBC') ? 'DB' : objSource.type;
                    if(_this.taskEntity.stopOnSchemaChanged === false){
                        _this.taskEntity.stopOnSchemaChanged = "任务继续"
                    }else _this.taskEntity.stopOnSchemaChanged = "任务停止"
                    _this.isSeparator = objStore.format == "csv" ? true: false;
                    _this.CollectorID = !(collectorId && collectorId!='CHEETAH-SERVER')
                    _this.dialogNameVisible = true
                }, err => {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    }
                )
            },
        },
    }
</script>


<style lang="scss" scoped>
    .boxEl {
        padding: 0px 0px 15px 15px;
        height: calc(80vh - 50px);
        overflow: hidden;
        overflow-y: auto;
    }
    .boxEl h3 {
        font-size: 16px;
        height: 35px;
        line-height: 35px;
    }

    .el-carousel__item h3 {
        color: #475669;
        font-size: 18px;
        opacity: 0.75;
        line-height: 40px;
        margin: 0;
    }

    .el-carousel__item:nth-child(n) {
        background-color: #ffffff;
        border: 1px solid #ccc;
        .name_div{
            height: 100%;
            overflow-y: auto;
            margin: 10px 10px 10px 10px;
        }
    }
</style>