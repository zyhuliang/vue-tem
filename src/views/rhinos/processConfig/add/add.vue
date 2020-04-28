<template>
    <section class="clearBox2">
        <div class="processContent" id="bm-rhinos-processconfig-add">
            <el-form id="bm-rhinos-processconfig-add-form"  :label-position="labelPosition" status-icon  label-width="200px" class="demo-ruleForm">
                <el-upload
                        id="bm-rhinos-processconfig-add-upload"
                        class="upload-demo"
                        :action="uploadUrl()"
                        :headers="{'X-AUTH-TOKEN':xToken}"
                        :on-change="handleChange"
                        :on-success="fileSucceed"
                        :on-error="fileError"
                        :file-list="fileList">
                    <el-button id="bm-rhinos-processconfig-add-upload-btn" size="small" v-if="false" type="primary">点击上传</el-button>
                </el-upload>
                <el-row>
                    <el-form-item label="fileName" class="hasTop">
                        <el-input placeholder="选择列表" v-model="fileName" :disabled="true" class="input-with-select">
                            <el-button slot="append" @click="queryJar" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-form-item>
                    
                    <!-- <el-button type="primary" @click="queryJar" >选择列表</el-button> -->
                </el-row>
                <el-form-item label="流程配置类型" class="hasTop" v-show="processConfigTypeCn != '批处理选择器'&&processConfigType !== 'step define'">
                    <el-input type="text" id="bm-rhinos-processconfig-add-processConfigTypeCn"  v-model="processConfigTypeCn" auto-complete="off"  disabled></el-input>
                </el-form-item>
                <div class="item-data" v-for="(item1,key1) in  selectArr" v-show="processConfigType == 'dataflow udf' || processConfigType == 'workflow selector' || processConfigType == 'dataflow selector' || processConfigType == 'filter class'" >
                    <el-form-item label="完整类名">
                        <el-select  v-model="item1.className" placeholder="完整类名"  @change="selectClass(key1,item1.className)" >
                            <el-option
                                    v-for="item in returnObj"
                                    :key="item.fullClazzName"
                                    :name="item.fullClazzName"
                                    :label="item.fullClazzName"
                                    :value="item.fullClazzName">
                            </el-option>
                        </el-select>
                        <!-- <div class="tip" v-if="item1.fullClazzName == ''">完整类名不可为空</div> -->
                    </el-form-item>
                    <el-form-item label="名称">
                        <el-input class="name-btn" v-model="item1.name" name="name-btn"></el-input>
                        <div class="tip" v-if="item1.name == ''">名称不可为空</div>
                    </el-form-item>
                    <el-form-item label="别名">
                        <el-select v-model="aliasNameArr[key1].name" placeholder="别名" @change="selectName(key1,aliasNameArr[key1].name)">
                            <el-option
                                    v-for="(item,index) in aliasNameArr[key1].nameList"
                                    :key="index"
                                    :label="item.methodName"
                                    :name="item.methodName"
                                    :value="item.methodName">
                            </el-option>
                        </el-select>
                        <div class="tip" v-if="item1.aliasName == ''">别名不可为空</div>
                    </el-form-item>
                    <el-form-item label="参数个数" >
                        <el-input v-model="item1.parameterlist"  disabled name="parameterlist"></el-input>
                    </el-form-item>
                    <el-form-item v-show="processConfigType == 'dataflow udf'" label="返回类型">
                        <el-select v-model="returnType[key1]" placeholder="请选择返回类型" @change="changeReturnType($event,key1)">
                            <el-option label="string" value="string" name="string"></el-option>
                            <el-option label="float" value="float" name="float"></el-option>
                            <el-option label="int" value="int" name="int"></el-option>
                            <el-option label="integer" value="integer" name="integer"></el-option>
                            <el-option label="tinyint" value="tinyint" name="tinyint"></el-option>
                            <el-option label="smallint" value="smallint" name="smallint"></el-option>
                            <el-option label="bigint" value="bigint" name="bigint"></el-option>
                            <el-option label="double" value="double" name="double"></el-option>
                            <el-option label="decimal" value="decimal" name="decimal"></el-option>
                            <el-option label="binary" value="binary" name="binary"></el-option>
                            <el-option label="boolean" value="boolean" name="boolean"></el-option>
                            <el-option label="date" value="date" name="date"></el-option>
                            <el-option label="timestamp" value="timestamp" name="timestamp"></el-option>
                        </el-select>
                        <div class="tip" v-if="item1.returnType == ''">返回类型不可为空</div>
                    </el-form-item>
                    <div @click="removeParam(key1)" class="removeItem" v-show="selectArr.length > 1">
                        <i class="i remove el-icon-remove-outline"></i>
                    </div>
                </div>
                <div @click="addParam()" class="addItem"  v-if="selectArr.length >0 && isNew &&   processConfigType !== 'jdbc driver'&& processConfigType !== 'step define' ">
                    <i class="i el-icon-circle-plus-outline"></i>
                </div>
                <div v-show="processConfigType == 'jdbc driver'">
                    <el-form-item label="name">
                        <el-input type="text" v-model="jdbcInfo.name" auto-complete="off" name="text"></el-input>
                        <div class="tip" v-if="jdbcInfo.name == ''">name不可为空</div>
                    </el-form-item>
                    <el-form-item label="数据库类型" >
                        <el-select
                                v-model="jdbcInfo.DBType"
                                @change="changeJdbcType($event)"
                                placeholder="请选择数据库类型">
                            <el-option
                                    v-for="item in DBTypes"
                                    :key="item"
                                    :name="item"
                                    :label="item| cn"
                                    :value="item">
                            </el-option>
                        </el-select>
                        <div class="tip" v-if="jdbcInfo.DBType == ''">数据库类型不可为空</div>
                    </el-form-item>
                    <el-form-item label="JDBC Driver" >
                        <el-select v-model="jdbcInfo.driver" auto-complete="off" placeholder="请先上传文件" @change="onDriverTypeChanged(jdbcInfo.driver)">
                            <el-option
                                    v-for="(item,index) in returnObj"
                                    :key="item.fullClazzName"
                                    :name="item.fullClazzName"
                                    :label="item.fullClazzName"
                                    :value="item.fullClazzName">
                            </el-option>
                        </el-select>
                        <div class="tip" v-if="jdbcInfo.driver == ''">不可为空</div>
                    </el-form-item>
                    <el-form-item label="端口">
                        <el-input type="text" v-model="jdbcParameterlist.defaultPort" auto-complete="off" name="defaultPort"></el-input>
                    </el-form-item>
                    <el-form-item label="url">
                        <el-input type="text" v-model="jdbcParameterlist.url" auto-complete="off" name="url"></el-input>
                    </el-form-item>
                    <el-form-item label="参数前缀">
                        <el-input type="text" v-model="jdbcParameterlist.paraPrefix" auto-complete="off" name="paraPrefix"></el-input>
                    </el-form-item>
                    <el-form-item label="参数分隔符">
                        <el-input type="text" v-model="jdbcParameterlist.paraSep" auto-complete="off" name="paraSep"></el-input>
                    </el-form-item>
                </div>
                <div class="item-data" v-for="(item1,key1) in  defineArr" v-show="processConfigType == 'step define'" >
                    <el-form-item label="完整类名">
                        <el-select  v-model="item1.stepClassName" placeholder="完整类名"  @change="(value) => selectDefineClass(value,key1)" >
                            <el-option
                                    v-for="item in returnObj"
                                    :key="item.stepClassName"
                                    :value="item.stepClassName">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="名称">
                        <el-input class="name-btn" v-model="item1.name" name="name-btn"></el-input>
                        <div class="tip" v-if="item1.name == ''">名称不可为空</div>
                    </el-form-item>
                    <el-form-item label="ID">
                        <el-input class="name-btn" disabled v-model="item1.id" name="name-btn"></el-input>
                    </el-form-item>
                    <el-form-item label="type">
                        <el-input class="name-btn" disabled v-model="item1.type" name="name-btn"></el-input>
                    </el-form-item>
                    <el-form-item label="stepSettingClass">
                        <el-input class="name-btn" disabled v-model="item1.stepSettingClass" name="name-btn"></el-input>
                    </el-form-item>
                    <div @click="removeDefineParam(key1)" class="removeItem" v-show="defineArr.length > 1">
                        <i class="i remove el-icon-remove-outline"></i>
                    </div>
                </div>
                <div @click="addDefineParam()" class="removeItem" v-show="defineArr.length >0 && processConfigType == 'step define'&&isNew">
                        <i class="i el-icon-circle-plus-outline"></i>
                    </div>
                <div class="btn-center">
                    <el-form-item>
                        <el-button id="bm-rhinos-processconfig-add-register" type="primary" @click="submitForm('addForm')" name="register-sure">注册</el-button>
                        <el-button id="bm-rhinos-processconfig-add-cancel" @click="returnForm()" name="register-cancel">取消</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <dialogData :jarData = "dialogData" @changeRowData="resRows"></dialogData>
        <!-- <el-dialog
			title="注册"
			:visible.sync="dialogVisibleExport"
			class="el-body-padding">

            <el-table
					id="bm-rhinos-processconfig-list-table"
					:data="tableData"
					tooltip-effect="dark"
					v-loading = "loading"
                     @selection-change="setSelection"
					style="width: 100%"  height="calc(100vh - 475px)" >
				<el-table-column
						type="selection"
						width="45">
				</el-table-column>
				<el-table-column
						label="名称"
						prop="name"
						sortable="custom"
						>
				</el-table-column>
				<el-table-column
						key="id"
						prop="id"
						label="ID"
						sortable="custom"
						align="center">
				</el-table-column>
				<el-table-column
						prop="version"
						label="版本"
						sortable="custom"
						align="center">
				</el-table-column>
				<el-table-column
						prop="createTime"
						label="创建时间"
						sortable="custom"
						align="center"
						width="160"
						:formatter="dateFormat"
						show-overflow-tooltip>
				</el-table-column>
				<el-table-column
						prop="creator"
						label="创建人"
						align="center"
						sortable="custom"
						width="90">
				</el-table-column>
				<el-table-column
						prop="lastModifier"
						label="修改人"
						align="center"
						sortable="custom"
						min-width="90">
				</el-table-column>
				<el-table-column
						prop="lastModifiedTime"
						label="修改时间"
						sortable="custom"
						align="center"
						width="160"
						:formatter="dateFormat"
						show-overflow-tooltip>
				</el-table-column>
			</el-table>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisibleExport = false">取 消</el-button>
				<el-button type="primary" @click="subJar()">确 定</el-button>
			</span>
		</el-dialog> -->
    </section>
</template>

<script>
    import {progressConfDetail,
            addProgressConf,
            registerFlowConfig,
            jarInfo,
            defineConfDetail,
            defineConfig,
            updateDefine,
            cancelDefine,
            externalQuery,
            getJar} from '@api';
    import {createParameter} from '@function/queryParameter.js';
    import dialogData from '../dialog.vue'
    export default {
        components: {dialogData},
        data() {
            var addName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('名称必填'));
                }
                callback();
            };
            var addClassName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('完整类名必填'));
                }
                callback();
            };
            var addParameterlist = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('参数个数必填'));
                }
                callback();
            };
            var addReturnType = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('返回类型必填'));
                }
                callback();
            };


            return {
                returnType:[],
                test:"",
                DBTypeList:[
                    {
                        "name": "Mysql",
                        "url": "jdbc:mysql://[HOST]:[PORT]/[DB]",
                        "driver": "com.mysql.jdbc.Driver",
                        "defaultPort": 3306,
                        "paraPrefix": "?",
                        "paraSep": "&",
                        "example": "jdbc:mysql://localhost:3306/test?user=root&password=&useUnicode=true&characterEncoding=gbk&autoReconnect=true&failOverReadOnly=false",
                        "comment": "DriverManager.getConnection(url);"
                    }, {
                        "name": "Teradata",
                        "url": "jdbc:teradata://[HOST]/DBS_PORT=[PORT],DATABASE=[DB]",
                        "driver": "com.teradata.jdbc.TeraDriver",
                        "paraPrefix": ",",
                        "paraSep": ",",
                        "defaultPort": 1025,
                        "example": "jdbc:teradata://127.0.0.1/CLIENT_CHARSET=EUC_CN,TMODE=TERA,CHARSET=ASCII,LOB_SUPPORT=o"
                    }, {
                        "name": "JDBC-ODBC Bridge",
                        "url": "jdbc:odbc:[DB]",
                        "driver": "sun.jdbc.odbc.JdbcOdbcDriver"
                    }, {
                        "name": "Oracle Thin",
                        "url": "jdbc:oracle:thin:@[HOST]:[PORT]:[DB]",
                        "defaultPort": 1521,
                        "paraPrefix": ":",
                        "paraSep": ";",
                        "propertiesFormat": "map",
                        "driver": "oracle.jdbc.driver.OracleDriver"
                    }, {
                        "name": "Microsoft SQL Server (Microsoft Driver)",
                        "url": "jdbc:sqlserver://[HOST]:[PORT];databaseName=[DB]",
                        "driver": "com.microsoft.sqlserver.jdbc.SQLServerDriver",
                        "defaultPort": 1433,
                        "paraPrefix": ";",
                        "paraSep": ";"
                    }, {
                        "name": "Microsoft SQL Server(JTDS)",
                        "url": "jdbc:jtds:sqlserver://[HOST]:[PORT]/[DB]",
                        "driver": "net.sourceforge.jtds.jdbc.Driver",
                        "id": "net.sourceforge.jtds.jdbc.Driver@SqlServer",
                        "paraPrefix": ";",
                        "paraSep": ";",
                        "defaultPort": 7100
                    }, {
                        "name": "Sybase",
                        "url": "jdbc:jtds:sybase://[HOST]:[PORT]/[DB]",
                        "driver": "net.sourceforge.jtds.jdbc.Driver",
                        "paraPrefix": ";",
                        "paraSep": ";",
                        "comment": "jdbc:jtds:sybase://[HOST]:[PORT]/[DB];instance=SQLEXPRESS;user=sa;password=s3cr3t",
                        "defaultPort": 7100
                    }, {
                        "name": "PostgreSQL",
                        "url": "jdbc:postgresql://[HOST]:[PORT]/[DB]",
                        "driver": "org.postgresql.Driver",
                        "paraPrefix": "?",
                        "paraSep": "&",
                        "comment": "jdbc:postgresql://[HOST]:[PORT]/[DB]?user=xxx&password=yyy",
                        "defaultPort": 5432
                    }, {
                        "name": "HSQLDB",
                        "url": "jdbc:hsqldb:hsql://[host]:[PORT]/[DB]",
                        "driver": "org.hsqldb.jdbcDriver",
                        "defaultPort": 9001,
                        "paraPrefix": ";",
                        "paraSep": ";",
                    }, {
                        "name": "Greenplum",
                        "url": "jdbc:pivotal:greenplum://[HOST]:[PORT];DatabaseName=[DB]",
                        "driver": "com.pivotal.jdbc.GreenplumDriver",
                        "defaultPort": 5432,
                        "paraPrefix": ";",
                        "paraSep": ";",
                    }, {
                        "name": "GBase",
                        "url": "jdbc:gbase://[HOST]:[PORT]/[DB]",
                        "driver": "com.gbase.jdbc.Driver",
                        "defaultPort": 5258,
                        "paraPrefix": ";",
                        "paraSep": ";",
                    }, {
                        "name": "Generic DB",
                        "url": "",
                        "driver": "",
                        "driverEditable": true,
                        "defaultPort": 5432,
                        "id": "GenericDriver"
                    }, {
                        "name": "DB2",
                        "url": "jdbc:db2://[HOST]:[PORT]/[DB]",
                        "driver": "com.ibm.db2.jcc.DB2Driver",
                        "defaultPort": 50000,
                        "paraPrefix": ";",
                        "paraSep": ";"
                    }, {
                        //添加DBONE类型的数据库
                        "name": "DBONE",
                        "url": "jdbc:dbone://[HOST]:[PORT]/[DB]",
                        "driver": "com.intple.dbone.Driver",
                        "defaultPort": 9001,
                        "paraPrefix": ";",
                        "paraSep": ";"
                    }, {
                        //添加snowball类型的数据库
                        "name": "SnowBall",
                        "url": "jdbc:snowball://[HOST]:[PORT]/[DB]",
                        "driver": "com.inforefiner.snowball.SnowballDriver",
                        "defaultPort": 8123,
                        "paraPrefix": ";",
                        "paraSep": ";"
                    }, {
                        "name": "Kingbase",
                        "url": "jdbc:kingbase://[HOST]:[PORT]/[DB]",
                        "driver": "com.kingbase.Driver",
                        "defaultPort": 54321,
                        "paraPrefix": "?",
                        "paraSep": "&",
                        "example": "jdbc:kingbase://localhost:54321/TEST",
                        "comment": "DriverManager.getConnection(url);"
                    }, {
                        "name": "HIVE",
                        "url": "jdbc:hive2://[HOST]:[PORT]/[DB]",
                        "driver": "org.apache.hive.jdbc.HiveDriver",
                        "defaultPort": 10000,
                        "paraPrefix": ";",
                        "paraSep": ";"
                    }],
                //添加其他类型类型的数据库
                defaultDBType: {
                    "url": "jdbc:[protocol]://[HOST]:[PORT]/[DB]",
                    "defaultPort": 8080,
                    "paraPrefix": ";",
                    "paraSep": ";"
                },
                xToken:sessionStorage['x-auth-token'],
                labelPosition: 'top',
                enabled:0,              // 查看修改为1，创建为0
                isNew:true,               // true 创建 false更新
                show:true,              // true显示  false不显示 控制参数个数、返回类型是否显示
                processConfigType:"",
                processConfigTypeCn:"",
                addForm: {
                    name: '',
                    processConfigType:'',
                    className:'',
                    parameterlist:'',
                    returnType:''
                },
                addRule: {
                    name: [
                        {  validator: addName, trigger: 'blur'}
                    ],
                    className:[
                        {  validator: addClassName, trigger: 'blur' }
                    ],
                    parameterlist:[
                        {  validator: addParameterlist, trigger: 'change' }
                    ],
                    returnType:[
                        {  validator: addReturnType, trigger: 'change' }
                    ],
                },
                jdbcInfo:{
                    DBType:"",
                    driver:"",
                    name:""
                },
                returnObj:[],
                nameList:[],
                uploadFile:"",
                fileName:"",
                selectArr:[],
                fileList:[],
                DBTypes: ["Mysql", "Teradata", "IBM DB2", "JDBC-ODBC Bridge", "Oracle Thin", "Microsoft SQL Server (Microsoft Driver)", "Microsoft SQL Server(JTDS)", "Sybase", "PostgreSQL", "HSQLDB", "Greenplum", "GBase", "Generic DB", "DB2", "DBONE", "SnowBall", "Kingbase", "HIVE",],
                jdbcParameterlist:{
                    defaultPort:"",
                    url:"",
                    paraPrefix:"",
                    paraSep:""
                },
                aliasName:"",
                aliasNameArr:[],
                defineArr:[{}],
                definesteps:[],
                dialogVisibleExport:false,
                loading:false,
                tableData:[],
                rows:{},
                currentPage: 4,
                dialogData:{
                    dialogVisibleExport:false, 
                }
            };
        },
        watch:{
            $route:function(to,from){
            }
        },
        methods: {
            //查询jar包列表
            queryJar(){
                this.dialogData.dialogVisibleExport = true
            },
            
            changeReturnType:function (event,index) {
                this.$set(this.selectArr[index],"returnType",event)
                console.log(this.selectArr)
            },
            resRows(val){
                getJar( this.processConfigType,val.id).then(response=>{
                    this.dialogData.dialogVisibleExport = false
                    this.fileName = response.fileName
                    this.returnObj = response.returnObj
                    this.selectArr = []
                    this.aliasName = ""
                    this.selectArr.push({
                        className:"",
                        name:"",
                        parameterlist:"",
                        returnType:"",
                        aliasName:""
                    })
                    this.aliasNameArr = [{
                        name:"",
                        nameList:[]
                    }]
                    this.returnType[0] = ""
                    this.jdbcInfo ={
                        DBType:"",
                        driver:"",
                        name:""
                    }
                    this.defineArr = [
                        {fullClazzName:'',id:'',name:'',returnObj:[]}
                    ]
                })
                 
            },
            onDriverTypeChanged: function (driver) {
                //是否是常见的集中数据库类型
                var commDBType = false;
                for (var i = 0; i < this.DBTypeList.length; i++) {
                    if (this.DBTypeList[i].driver == driver) {
                        commDBType = true;
                        this.jdbcParameterlist = {
                            defaultPort: this.DBTypeList[i].defaultPort,
                            url: this.DBTypeList[i].url,
                            paraPrefix: this.DBTypeList[i].paraPrefix,
                            paraSep: this.DBTypeList[i].paraSep
                        }
                        break;
                    }
                }
                for(let i=0; i<this.DBTypes.length;i++){
                    if(this.DBTypes[i].dirver == driver){
                        commDBType = true;
                        this.jdbcParameterList = {
                            ...this.DBTypes[i]
                        }
                    }
                }
                if (!commDBType) {
                    this.jdbcParameterlist = {
                        defaultPort: this.defaultDBType.defaultPort,
                        url: this.defaultDBType.url,
                        paraPrefix: this.defaultDBType.paraPrefix,
                        paraSep: this.defaultDBType.paraSep
                    }
                }
                this.jdbcInfo.driver = driver
            },
            fileError:function (err, file, fileList) {
                if(err.message == "jar not match!"){
                    this.$message({
                        message: "选择的类型和上传的文件不匹配",
                        type: 'error',
                        duration: 1500
                    });
                }
                this.selectArr = []
                this.aliasNameArr = []
                this.jdbcInfo = []
            },
            fileSucceed:function (response, file, fileList) {
                this.$message({
                    message: "上传成功",
                    type: 'success',
                    duration: 1500
                });
                this.fileName = response.fileName
                this.returnObj = response.returnObj
                this.selectArr = []
                this.aliasName = ""
                this.selectArr.push({
                    className:"",
                    name:"",
                    parameterlist:"",
                    returnType:"",
                    aliasName:""
                })
                this.aliasNameArr = [{
                    name:"",
                    nameList:[]
                }]
                this.returnType[0] = ""
                this.jdbcInfo ={
                    DBType:"",
                    driver:"",
                    name:""
                }
                this.defineArr = [
                    {fullClazzName:'',id:'',name:'',returnObj:[]}
                ]
            },
            addParam:function () {
                this.selectArr.push({})
                this.aliasNameArr.push({
                    name:"",
                    nameList:[]
                })
            },
            removeParam:function (index) {
                this.selectArr.splice(index,1)
            },
            uploadUrl:function () {
                this.uploadFile = "api/processconfigs/uploadjar/" + this.processConfigType.replace('-',' ')
                return this.uploadFile
            },
            selectClass:function (index,name) {
                this.$set(this.selectArr,this.selectArr[index].className,name)
                for(var i = 0;i<this.returnObj.length;i++){
                    // if(this.selectArr[index].className == this.returnObj[i].fullClazzName){
                    //     this.aliasNameArr[index].nameList = this.returnObj[i].methodList
                    // }
                    this.selectArr[index].className = name
                    if(name == this.returnObj[i].fullClazzName){
                        this.aliasNameArr[index].nameList = this.returnObj[i].methodList
                    }
                }
                console.log(this.nameList)
            },
            selectDefineClass(val,key){
                for(var i = 0;i<this.returnObj.length;i++){
                    if(val== this.returnObj[i].stepClassName){
                        this.defineArr[key] = JSON.parse(JSON.stringify(this.returnObj[i]))
                        this.$set(this.defineArr,key,JSON.parse(JSON.stringify(this.returnObj[i])))
                    }
                }
            },
            addDefineParam(){
                this.defineArr.push({})
            },
            removeDefineParam(key){
                this.defineArr.splice(key,1)
            },
            selectName:function (index,value) {
                this.$set(this.selectArr[index],"aliasName",value)
                for(var i = 0 ;i<this.returnObj.length;i++){
                    if(this.selectArr[index].className == this.returnObj[i].fullClazzName){
                        for(var j=0;j<this.returnObj[i].methodList.length;j++){
                            if(this.selectArr[index].aliasName == this.returnObj[i].methodList[j].methodName){
                                this.selectArr[index].parameterlist = this.returnObj[i].methodList[j].paramCount
                                this.selectArr[index].returnJavaType = this.returnObj[i].methodList[j].retunType
                                this.selectArr[index].processConfigType = this.processConfigType
                            }
                        }
                    }
                }
            },
            handleChange(file, fileList) {
                if(fileList.length >=2){
                    fileList.splice(0,1)
                }
            },
            submitForm(formName) {
                /*this.$refs[formName].validate((valid) => {
                    if (valid) {*/
                var _this = this
                if(!_this.$route.params.id){
                    if(_this.fileName == ""){
                        _this.$message({
                            message: '请先上传文件',
                            type: 'error'
                        });
                        return false
                    }
                    var param = {
                        fileName:_this.fileName,
                        fileType:_this.processConfigType,
                        params:_this.selectArr
                    }
                    if(_this.processConfigType == "jdbc driver"){
                        //param.params[0].name = _this.jdbcInfo.DBType
                        param.params[0].dbType = _this.jdbcInfo.DBType
                        param.params[0].name = _this.jdbcInfo.name
                        param.params[0].className = _this.jdbcInfo.driver
                        param.params[0].parameterlist = JSON.stringify(_this.jdbcParameterlist)
                        param.params[0].processConfigType = _this.processConfigType
                    }
                    if(_this.processConfigType == "step define"){
                        param.params = _this.defineArr
                        defineConfig(param).then(data =>{
                           _this.$message({
                            message: '恭喜你，操作已成功！',
                            type: 'success'
                        });
                        var route = _this.$route.path
                        _this.$router.push({ path: route.replace("/new","")}); 
                        },err =>{
                            _this.$message({
                                            message: err.response.data.detailMsg,
                                            type: 'error',
                                            duration: 1500
                                        });
                        })
                    } else {
                        registerFlowConfig(param).then(data => {
                            _this.$message({
                                message: '恭喜你，操作已成功！',
                                type: 'success'
                                });
                                var route = _this.$route.path
                                return _this.$router.push({ path: route.replace("/new","")});
                            }, err => {
                                if (err.response) {
                                    if(err.response.data.detailMsg.indexOf("Name Duplicated") != -1){
                                        _this.$message.error('创建失败，配置名称已存在');
                                    }else if(err.response.data.detailMsg.indexOf("file is not exist") != -1){
                                        _this.$message({
                                            message: "文件不存在，请重新上传",
                                            type: 'error',
                                            duration: 1500
                                        });
                                    }else if(err.response.data.detailMsg.indexOf("NULL") != -1){
                                        _this.$message({
                                            message: "返回类型不可为空,并重新上传文件",
                                            type: 'error',
                                            duration: 1500
                                        });
                                    }else if(err.response.data.detailMsg.indexOf("process config  returnType is not match") != -1){
                                        _this.$message({
                                            message: "选择的别名返回信息跟手动选择的返回类型不匹配",
                                            type: 'error',
                                            duration: 1500
                                        });
                                    }else if(err.response.data.detailMsg.indexOf("JavareturnType is null") != -1){
                                        _this.$message({
                                            message: "返回类型不可为空",
                                            type: 'error',
                                            duration: 1500
                                        });
                                    }else{
                                        _this.$message({
                                            message: err.response.message,
                                            type: 'error',
                                            duration: 1500
                                        });
                                    }
                                }
                            }).catch(function (error) {
                                if (error.response) {
                                    if(error.response.data.detailMsg.indexOf("Name Duplicated")){
                                        _this.$message.error('创建失败，名称已存在');
                                    }
                                }
                            })
                    }
                    
                }else{
                    var param = _this.selectArr[0]
                    if(_this.processConfigType == "jdbc driver"){
                        param.dbType = _this.jdbcInfo.DBType
                        param.name = _this.jdbcInfo.name
                        param.className = _this.jdbcInfo.driver
                        param.parameterlist = JSON.stringify(_this.jdbcParameterlist)
                        param.processConfigType = _this.processConfigType
                    }
                    if(_this.processConfigType == 'step define'){
                        //=====
                       updateDefine(this.defineArr[0]).then(data => {
                            console.log('addProgress')
                            _this.$message({
                                message: '恭喜你，操作已成功！',
                                type: 'success'
                            });
                            var path = "/processconfig/"+_this.processConfigType.replace(" ","-")
                            return _this.$router.push({ path: path});
                        }, err => {
                            if(err.response.data.detailMsg.indexOf("Name Duplicated") || err.response.data.err.indexOf("Name Duplicated")){
                                _this.$message.error('创建失败，配置已存在');
                            }else{
                                this.$message({
                                    message: err.response.message,
                                    type: 'error',
                                    duration: 1500
                                });
                            }
                        }).catch(function (error) {
                            if (error.response) {
                                if(error.response.data.detailMsg.indexOf("Name Duplicated")){
                                    _this.$message.error('创建失败，配置已存在');
                                }
                                registerFlowConfig(param).then(data => {
                                    console.log('registerFlowConfig')
                                    
                                    _this.$message({
                                        message: '恭喜你，操作已成功！',
                                        type: 'success'
                                    });
                                    var route = _this.$route.path
                                    return _this.$router.push({ path: route.replace("/new","")});
                                }, err => {
                                    if (err.response) {
                                        if(err.response.data.detailMsg.indexOf("Name Duplicated") != -1){
                                            _this.$message.error('创建失败，配置名称已存在');
                                        }else if(err.response.data.detailMsg.indexOf("file is not exist") != -1){
                                            _this.$message({
                                                message: "文件不存在，请重新上传",
                                                type: 'error',
                                                duration: 1500
                                            });
                                        }else if(err.response.data.detailMsg.indexOf("NULL") != -1){
                                            _this.$message({
                                                message: "返回类型不可为空,并重新上传文件",
                                                type: 'error',
                                                duration: 1500
                                            });
                                        }else if(err.response.data.detailMsg.indexOf("process config  returnType is not match") != -1){
                                            _this.$message({
                                                message: "选择的别名返回信息跟手动选择的返回类型不匹配",
                                                type: 'error',
                                                duration: 1500
                                            });
                                        }else if(err.response.data.detailMsg.indexOf("JavareturnType is null") != -1){
                                            _this.$message({
                                                message: "返回类型不可为空",
                                                type: 'error',
                                                duration: 1500
                                            });
                                        }else{
                                            _this.$message({
                                                message: err.response.message,
                                                type: 'error',
                                                duration: 1500
                                            });
                                        }
                                    }
                                }).catch(function (error) {
                                    if (error.response) {
                                        if(error.response.data.detailMsg.indexOf("Name Duplicated")){
                                            _this.$message.error('创建失败，名称已存在');
                                        }
                                    }
                                })
                            }else{
                                var param = _this.selectArr[0]
                                if(_this.processConfigType == "jdbc driver"){
                                    param.name = _this.jdbcInfo.name
                                    param.dbType = _this.jdbcInfo.DBType
                                    param.className = _this.jdbcInfo.driver
                                    param.parameterlist = JSON.stringify(_this.jdbcParameterlist)
                                    param.processConfigType = _this.processConfigType
                                }
                                addProgressConf(param).then(data => {
                                _this.$message({
                                    message: '恭喜你，操作已成功！',
                                    type: 'success'
                                });
                                    var path = "/processconfig/"+_this.processConfigType
                                    return _this.$router.push({ path: path});
                            }, err => {
                                this.$message({
                                    message: err.response.message,
                                    type: 'error',
                                    duration: 1500
                                });
                            }).catch(function (error) {
                                if (error.response) {
                                    if(error.response.data.detailMsg.indexOf("Name Duplicated")){
                                        _this.$message.error('创建失败，配置已存在');
                                    }
                                }
                            });
                            }
                        });
                        //=====
                    }else {
                        addProgressConf(param).then(data => {
                            console.log('addProgress')
                            _this.$message({
                                message: '恭喜你，操作已成功！',
                                type: 'success'
                            });
                            var path = "/processconfig/"+_this.processConfigType.replace(" ","-")
                            return _this.$router.push({ path: path});
                        }, err => {
                            if(err.response.data.detailMsg.indexOf("Name Duplicated") || err.response.data.err.indexOf("Name Duplicated")){
                                _this.$message.error('创建失败，配置已存在');
                            }else{
                                this.$message({
                                    message: err.response.message,
                                    type: 'error',
                                    duration: 1500
                                });
                            }
                        }).catch(function (error) {
                            if (error.response) {
                                if(error.response.data.detailMsg.indexOf("Name Duplicated")){
                                    _this.$message.error('创建失败，配置已存在');
                                }
                                registerFlowConfig(param).then(data => {
                                    console.log('registerFlowConfig')
                                    
                                    _this.$message({
                                        message: '恭喜你，操作已成功！',
                                        type: 'success'
                                    });
                                    var route = _this.$route.path
                                    return _this.$router.push({ path: route.replace("/new","")});
                                }, err => {
                                    if (err.response) {
                                        if(err.response.data.detailMsg.indexOf("Name Duplicated") != -1){
                                            _this.$message.error('创建失败，配置名称已存在');
                                        }else if(err.response.data.detailMsg.indexOf("file is not exist") != -1){
                                            _this.$message({
                                                message: "文件不存在，请重新上传",
                                                type: 'error',
                                                duration: 1500
                                            });
                                        }else if(err.response.data.detailMsg.indexOf("NULL") != -1){
                                            _this.$message({
                                                message: "返回类型不可为空,并重新上传文件",
                                                type: 'error',
                                                duration: 1500
                                            });
                                        }else if(err.response.data.detailMsg.indexOf("process config  returnType is not match") != -1){
                                            _this.$message({
                                                message: "选择的别名返回信息跟手动选择的返回类型不匹配",
                                                type: 'error',
                                                duration: 1500
                                            });
                                        }else if(err.response.data.detailMsg.indexOf("JavareturnType is null") != -1){
                                            _this.$message({
                                                message: "返回类型不可为空",
                                                type: 'error',
                                                duration: 1500
                                            });
                                        }else{
                                            _this.$message({
                                                message: err.response.message,
                                                type: 'error',
                                                duration: 1500
                                            });
                                        }
                                    }
                                }).catch(function (error) {
                                    if (error.response) {
                                        if(error.response.data.detailMsg.indexOf("Name Duplicated")){
                                            _this.$message.error('创建失败，名称已存在');
                                        }
                                    }
                                })
                            }else{
                                var param = _this.selectArr[0]
                                if(_this.processConfigType == "jdbc driver"){
                                    param.name = _this.jdbcInfo.name
                                    param.dbType = _this.jdbcInfo.DBType
                                    param.className = _this.jdbcInfo.driver
                                    param.parameterlist = JSON.stringify(_this.jdbcParameterlist)
                                    param.processConfigType = _this.processConfigType
                                }
                                addProgressConf(param).then(data => {
                                _this.$message({
                                    message: '恭喜你，操作已成功！',
                                    type: 'success'
                                });
                                    var path = "/processconfig/"+_this.processConfigType
                                    return _this.$router.push({ path: path});
                            }, err => {
                                this.$message({
                                    message: err.response.message,
                                    type: 'error',
                                    duration: 1500
                                });
                            }).catch(function (error) {
                                if (error.response) {
                                    if(error.response.data.detailMsg.indexOf("Name Duplicated")){
                                        _this.$message.error('创建失败，配置已存在');
                                    }
                                }
                            });
                            }
                        });
                    }
                    
                }
            },
            // 查看配置详情
            getProcessconfigDetail(){
                if(this.$route.params.id){
                    this.isNew = false
                    var that = this;
                    if(this.processConfigType == "step define"){
                         defineConfDetail(that.$route.params.id).then(data => {
                            this.processConfigTypeCn = "自定义节点"
                            this.defineArr[0] = data
                            this.returnObj[0] = data   //returnObj 为完整类名的备选字段
                            this.$set(this.defineArr,0,data)
                            this.isNew = false
                        }, err => {
                            that.$message({
                                message: err.response.message,
                                type: 'error',
                                duration: 1500
                            });
                        });
                    }else {
                        progressConfDetail(this.$route.params.id).then(data => {
                            //this.addForm= data;
                            if(typeof data.processConfigType=='undefined'){
                                that.processConfigType = "step define"
                            }else {
                                that.processConfigType = data.processConfigType
                            }
                            if(that.processConfigType == "dataflow selector"){
                                that.processConfigTypeCn = "批处理选择器"
                            }else if(that.processConfigType == "workflow selector"){
                                that.processConfigTypeCn = "工作流选择器"
                            }else if(that.processConfigType == "dataflow udf"){
                                that.processConfigTypeCn = "自定义函数"
                            }else if(that.processConfigType == "filter class"){
                                this.processConfigTypeCn = "批处理选择器"
                            }else if(that.processConfigType == "jdbc driver"){
                                that.processConfigTypeCn = "批处理选择器"
                            }else if(that.processConfigType == "step define"){
                                that.processConfigTypeCn = "自定义节点"
                            }
                            //that.returnType = data.returnType
                            that.aliasNameArr.push({
                                name:"",
                                nameList:[]
                            })
                            that.aliasNameArr[0].name = data.aliasName
                            that.returnType[0] = data.returnType
                            // 获取jar包详细信息
                            // var index = data.jarpath.lastIndexOf("/")
                            // var fname = data.jarpath.substring(index+1,data.jarpath.length)
                            jarInfo(data.jarName).then(res=>{
                                that.fileName = res.fileName
                                that.returnObj = res.returnObj
                                // 获取当前class的别名列表
                                for(var i = 0;i<res.returnObj.length;i++){
                                    if(res.returnObj[i].fullClazzName == that.selectArr[0].className){
                                        that.aliasNameArr[0].nameList = res.returnObj[i].methodList
                                    }
                                }
                            },err=>{
                                if(err.response.data.detailMsg.indexOf("jarName is not exists") != -1){
                                    this.$message({
                                        message: "该jar包数据库不存在，请重新上传",
                                        type: 'error',
                                        duration: 1500
                                    });
                                }
                            })

                            // 控制参数个数、返回类型是否显示
                            if(that.processConfigType == "workflow selector" || that.processConfigType == "dataflow selector" || that.processConfigType == "dataflow udf"){
                                that.show = true;
                            }else {
                                that.show = false;
                            }
                            //jdbc添加详情
                            if(that.processConfigType == "jdbc driver"){
                                that.jdbcInfo.name = data.name
                                that.jdbcInfo.DBType = data.dbType
                                that.jdbcInfo.driver = data.className
                                that.jdbcParameterlist = JSON.parse(data.parameterlist)
                            }
                            that.selectArr[0] = data
                            // var index = data.jarpath.lastIndexOf('/')
                            // var fileName = data.jarpath.slice(index+1,data.jarpath.length)
                            var fileInfo = {
                                name:data.jarName,
                                url:data.jarpath
                            }
                            that.fileList.push(fileInfo)
                        }, err => {
                            that.$message({
                                message: err.response.message,
                                type: 'error',
                                duration: 1500
                            });
                        });
                    }
                    
                };
                if(this.$route.params.type){
                    this.isNew = false
                    this.processConfigType = this.$route.params.type.replace('-',' ');
                    // 控制参数个数、返回类型是否显示
                    if(this.processConfigType == "workflow selector" || this.processConfigType == "dataflow selector" || this.processConfigType == "dataflow udf"|| this.processConfigType == "step define"){
                        this.show = true;
                        this.isNew = true
                    }else {
                        this.show = false;
                    }
                }
            },
            returnForm:function () {
                // 新建和查看点击取消后不同的跳转
                var route = this.$route.path
                if(route.indexOf("/new") == -1){
                    this.$router.push({ path: "/processconfig/"+ this.processConfigType.replace(' ','-')});
                }else {
                    cancelDefine(this.fileName).then(data=>{
                        console.log(data)
                    },err =>{
                        this.$message({
                                message: err.response.message,
                                type: 'error',
                                duration: 1500
                            });
                    })
                    this.$router.push({ path: route.replace("/new","")});
                    
                }
            },
            buildParameters(){
                var limit=this.pagesize;
                var offset = (this.currentPage-1)*this.pagesize;
                var query =this.searchInput.length>0?'%'+this.searchInput+'%':'%';
                var parameter = createParameter().Limit(limit).Offset(offset).Build();
                if(query != '%'){
                    parameter = createParameter('name',query,"LIKE").Build(parameter);
				}
				parameter = createParameter().Build(parameter)
				if(this.dateValue){
					if(this.dateValue !='' && this.dateValue.length != 0){
						parameter = createParameter('lastModifiedTime',Number(this.dateValue[0]),'GREATER_THAN').
						And('lastModifiedTime',Number(this.dateValue[1]),'LESS_THAN').
						Build(parameter);
					}
				}
                // parameter.sortObject.field = this.field
                // parameter.sortObject.orderDirection = this.orderDirection
                return parameter;
			},
        },
        mounted(){
           this.processConfigType = sessionStorage.getItem('processconfigType')
            this.getProcessconfigDetail();
            if(this.processConfigType == "dataflow selector"){
                this.processConfigTypeCn = "批处理选择器"
            }else if(this.processConfigType == "workflow selector"){
                this.processConfigTypeCn = "工作流选择器"
            }else if(this.processConfigType == "dataflow udf"){
                this.processConfigTypeCn = "自定义函数"
            }else if(this.processConfigType == "filter class"){
                this.processConfigTypeCn = "批处理选择器"
            }else if(this.processConfigType == "jdbc driver"){
                this.processConfigTypeCn = "批处理选择器"
            }else if(this.processConfigType == "step define"){
                this.processConfigTypeCn = "自定义节点"
            }
        },
    }
</script>
<style lang="scss">
    .clearBox2{
        .hasTop{
            margin-top: 10px;
        }
        .el-select{
            position: relative;
            font-size: 14px;
            display: inline-block;
            width: 100%;
        }
        .el-form-item{
            margin-bottom: 15px;
        }
        .el-form-item__content{
            float: left;
        }
        .el-form--label-top .el-form-item__label{
            float: left;
            min-width: 130px;
        }
        .el-upload-list{
            max-width: 500px;
        }
        .el-input.is-disabled .el-input__inner{
            min-width: 400px;
        }
        .name-btn{
            width: 213px;
        }
        .el-input__inner{
            min-width: 400px;
        }
    }
</style>
<style lang="scss" scoped>
    .removeItem{
        margin-left: 500px;
        margin-bottom: 10px;
        height: 0px;
    }
    .addItem{
        //float: left;
        //margin-top: 180px;
        margin-left: 550px;
        margin-top: -35px;
        margin-bottom: 10px;
    }
    .item-data{
        border: 1px solid #ccc!important;
        padding: 14px;
        border-radius: 0.25rem!important;
        width: 570px;
        margin-bottom: 10px;
        //float: left;
    }
    .tip{
        color: #f56c6c;
        font-size: 12px;
        line-height: 1;
        padding-top: 4px;
        position: absolute;
        top: 100%;
        left: 0;
    }
    .processContent{
        padding: 20px;
        margin: 0px;
    }
    .demo-ruleForm{
        width: 50%;
    }
</style>