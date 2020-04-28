<!-- steps参数 dataFlow IO sink -->
<template>
        <div class="stepTable">
                <el-form id="bm-nodeset-sink-form" ref="nodeSetData" :model="nodeSetData" label-width="150px">
                        <el-form-item :label="nodeData.dataset | dataSetNameFilter| cn">
                                <el-tooltip class="item"  effect="dark" content="1.数据集名称,从资源目录选择或编辑创建 2.格式为字符串：字符/数字/下划线/-/的组合" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input placeholder="（必填）" :name="nodeData.dataset | dataSetNameFilter" :value="nodeData.dataset" @input="dataSetVal">
                                        <el-button slot="append" icon="icon iconfont icon-ir-search" @click="dataSetInq"></el-button>
                                </el-input>
                        </el-form-item>
                        <i class="sign" v-if="nodeData.dataset==''">数据集不能为空</i>
                        <el-form-item v-if="pathInput"  :label="'dataset存放位置'| cn"  >
                                <el-input placeholder="默认路径为根目录" :value="nodeData.dataResource" name="dataset存放位置" :disabled = "true" class="input-form-width">
                                        <el-button slot="append" icon="icon iconfont icon-ir-search" @click="dialogDataSetTreeVisible=true"></el-button>
                                </el-input>
                        </el-form-item>
                        <el-form-item :label="'schema'| cn">
                                <el-tooltip class="item" effect="dark" content="1.Schema名称,从资源目录选择 2.格式为字符串：字符/数字/下划线/-的组合" placement="top">
                                        <i class="parIcon el-icon-wrning"></i>
                                </el-tooltip>
                                <el-input placeholder="（必填）" name="schema" :value="nodeData.schema" :disabled = "dataSelValDis" @input="schemaVal">
                                        <el-button slot="append" icon="icon iconfont icon-ir-search" :disabled = "dataSelValDis" @click="schemaInq"></el-button>
                                </el-input>
                        </el-form-item>
                        <i class="sign" v-if="nodeData.schema==''">{{'schema'| cn}}不能为空</i>
                        <el-form-item v-if="pathInput" :label="'schema存放位置'| cn" >
                                <el-input placeholder="默认路径为根目录" name="schema存放位置" :value="nodeData.schemaResource" :disabled = "true" class="input-form-width">
                                        <el-button slot="append" icon="icon iconfont icon-ir-search" @click="dialogSchemaTreeVisible=true"></el-button>
                                </el-input>
                        </el-form-item>
                        <el-form-item :label="'type'| cn">
                                <el-tooltip class="item" effect="dark" content="数据源格式，包括HDFS和HIVE" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-select class="selectClass" :value="nodeData.type" :disabled = "dataSelValDis" placeholder="请选择" @change="typeSelect">
                                        <el-option
                                                v-for="item in ['HDFS','HIVE','JDBC','KAFKA','HBASE','ElasticSearch']"
                                                :key="item"
                                                :name="item"
                                                :label="item| cn"
                                                :value="item">
                                        </el-option>
                                </el-select>
                        </el-form-item>
                        <i class="sign-class" v-if="nodeData.type==''">类型不能为空</i>
                        <!-- type HDFS -->
                        <el-form-item v-if="nodeData.type=='HDFS'" :label="'format'| cn">
                                <el-tooltip class="item" effect="dark" content="数据格式，包括CSV和Parquet" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-select class="selectClass" name="format" :value="nodeData.format" :disabled = "dataSelValDis" placeholder="请选择" @change="formatSelect">
                                        <el-option
                                                v-for="item in ['csv','parquet','orc', 'avro']"
                                                :key="item"
                                                :name="item"
                                                :label="item| cn"
                                                :value="item">
                                        </el-option>
                                </el-select>
                        </el-form-item>
                        <i class="sign" v-if="nodeData.format==''">{{'format'| cn}}不能为空</i>
                        <el-form-item v-if="nodeData.type=='HDFS' && nodeData.format == 'csv'" :label="'separator'| cn">
                                <el-tooltip class="item" effect="dark" content="输出的文件中字段之间的分隔符" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input name="separator" :value="nodeData.separator" placeholder="(必填)" :disabled = "dataSelValDis" @input="separatorVal"></el-input>
                                <slot><i class="sign-class" v-if="nodeData.separator==''">{{'separator'| cn}}不能为空</i></slot>
                        </el-form-item>

                        <el-form-item v-if="nodeData.type=='HDFS' && nodeData.format == 'csv'" :label="'quoteChar'| cn">
                                <el-tooltip class="item" effect="dark" content="引号字符" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input name="quoteChar" :value="nodeData.quoteChar" placeholder="(必填)" :disabled = "dataSelValDis" @input="quoteCharVal"></el-input>
                                <slot><i class="sign-class" v-if="nodeData.quoteChar==''">{{'quoteChar'| cn}}  不能为空</i></slot>
                        </el-form-item>

                        <el-form-item v-if="nodeData.type=='HDFS' && nodeData.format == 'csv'" :label="'escapeChar'| cn">
                                <el-tooltip class="item" effect="dark" content="转义字符" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input name="escapeChar" :value="nodeData.escapeChar" placeholder="(必填)" :disabled = "dataSelValDis" @input="escapeCharVal"></el-input>
                                <slot><i class="sign-class" v-if="nodeData.escapeChar==''">{{'escapeChar'| cn}}  不能为空</i></slot>
                        </el-form-item>

                        <el-form-item v-if="nodeData.type=='HDFS'" :label="'path'| cn">
                                <el-tooltip class="item" effect="dark" content="输出文件路径" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input name="path" :value="nodeData.path" placeholder="(必填)" :disabled = "dataSelValDis" @input="pathVal"></el-input>
                                <i class="sign-class" v-if="nodeData.path==''">{{'path'| cn}}  不能为空</i>
                        </el-form-item>
                        <!-- type JDBC -->
                        <el-form-item v-if="nodeData.type=='JDBC'" :label="'DBType'| cn">
                            <el-tooltip class="item" effect="dark" content="JDBC DBType" placement="top">
                                <i class="parIcon el-icon-warning"></i>
                            </el-tooltip>
                            <el-select class="selectClass" :value="nodeData.name" placeholder="(必填) 请选择" :disabled="dataSelValDis"
                                       @change="DBTypeSelect" >
                                <el-option
                                        v-for="item in DBTypes"
                                        :key="item.name"
                                        :label="item.name"
                                        :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="nodeData.type=='JDBC'" :label="'driver'| cn">
                                <el-tooltip class="item" effect="dark" content="JDBC driver" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-select class="selectClass" :value="nodeData.driver" placeholder="(必填) 请选择" :disabled = "dataSelValDis" @change="driverSelect">
                                        <el-option value="com.mysql.jdbc.Driver"></el-option>
                                        <el-option value="oracle.jdbc.driver.OracleDriver"></el-option>
                                        <el-option value="com.teradata.jdbc.TeraDriver"></el-option>
                                        <el-option value="org.postgresql.Driver"></el-option>
                                        <el-option value="com.microsoft.sqlserver.jdbc.SQLServerDriver"></el-option>
                                        <el-option value="com.ibm.db2.jdbc.app.DB2Driver"></el-option>
                                        <el-option value="com.gbase.jdbc.Driver"></el-option>
                                        <el-option value="weblogic.jdbc.mssqlserver4.Driver"></el-option>
                                        <el-option value="com.inet.tds.TdsDriver"></el-option>
                                        <el-option value="com.ashna.jturbo.driver.Driver"></el-option>
                                        <el-option value="com.inet.pool.PoolDriver"></el-option>
                                        <el-option value="ncom.sybase.jdbc2.jdbc.SybDriver"></el-option>
                                        <el-option value="com.pointbase.jdbc.jdbcUniversalDriver"></el-option>
                                        <el-option value="com.cloudscape.core.JDBCDriver"></el-option>
                                        <el-option value="rmiJdbc.RJDriver"></el-option>
                                        <el-option value="org.firebirdsql.jdbc.FBDriver"></el-option>
                                        <el-option value="ids.sql.IDSDriver"></el-option>
                                        <el-option value="com.informix.jdbc.IfxDriver"></el-option>
                                        <el-option value="org.enhydra.instantdb.jdbc.idbDriver"></el-option>
                                        <el-option value="interbase.interclient.Driver"></el-option>
                                        <el-option value="org.hsql.jdbcDriver"></el-option>
                                        <el-option value="com.pivotal.jdbc.GreenplumDriver"></el-option>
                                        <el-option value="com.inforefiner.snowball.SnowballDriver"></el-option>
                                </el-select>
                                <slot><i class="sign-class" v-if="nodeData.driver==''">{{'driver'| cn}} 不能为空</i> </slot>
                        </el-form-item>
                        <el-form-item v-if="nodeData.type=='JDBC' || nodeData.type=='FTP'" :label="'url'| cn">
                                <el-tooltip class="item" effect="dark" content="JDBC url" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :disabled = "dataSelValDis" v-if="nodeData.driver=='com.mysql.jdbc.Driver'" placeholder="nodeData.url='jdbc:mysql://[HOST]:[PORT]/[DB]'" :value="nodeData.url" @input="urlVal"></el-input>
                                <el-input :disabled = "dataSelValDis" v-else-if="nodeData.driver=='oracle.jdbc.driver.OracleDriver'" placeholder="nodeData.url='jdbc:oracle:thin:@[HOST]:[PORT]:<SID>'" :value="nodeData.url" @input="urlVal"></el-input>
                                <el-input :disabled = "dataSelValDis" v-else-if="nodeData.driver=='com.teradata.jdbc.TeraDriver'" placeholder="nodeData.url='jdbc:teradata://[HOST]/DBS_PORT=[PORT]'" :value="nodeData.url" @input="urlVal"></el-input>
                                <el-input :disabled = "dataSelValDis" v-else-if="nodeData.driver=='org.postgresql.Driver'" placeholder="nodeData.url='jdbc:postgresql://[HOST]:[PORT]/[DB]'" :value="nodeData.url" @input="urlVal"></el-input>
                                <el-input :disabled = "dataSelValDis" v-else-if="nodeData.driver=='com.microsoft.sqlserver.jdbc.SQLServerDriver'" placeholder="nodeData.url='jdbc:microsoft:sqlserver://[HOST]:[PORT][;DatabaseName=[DB]]'" :value="nodeData.url" @input="urlVal"></el-input>
                                <el-input :disabled = "dataSelValDis" v-else-if="nodeData.driver=='com.ibm.db2.jdbc.app.DB2Driver'" placeholder="nodeData.url='jdbc:db2://[HOST]:[PORT]/[DB]'" :value="nodeData.url" @input="urlVal"></el-input>
                                <el-input :disabled = "dataSelValDis" v-else-if="nodeData.driver=='com.gbase.jdbc.Driver'" placeholder="nodeData.url='jdbc:gbase://[HOST]:[PORT]/[DB]'" :value="nodeData.url" @input="urlVal"></el-input>
                                <el-input :disabled = "dataSelValDis" v-else-if="nodeData.driver=='weblogic.jdbc.mssqlserver4.Driver'" placeholder="nodeData.url='jdbc:weblogic:mssqlserver4:[DB]@[HOST]:[PORT]'" :value="nodeData.url" @input="urlVal"></el-input>
                                <el-input :disabled = "dataSelValDis" v-else-if="nodeData.driver=='com.inet.tds.TdsDriver'" placeholder="nodeData.url='jdbc:inetdae:[HOST]:[PORT]?database=[DB]'" :value="nodeData.url" @input="urlVal"></el-input>
                                <el-input :disabled = "dataSelValDis" v-else-if="nodeData.driver=='com.ashna.jturbo.driver.Driver'" placeholder="nodeData.url='jdbc:JTurbo://[HOST]:[PORT]/[DB]'" :value="nodeData.url" @input="urlVal"></el-input>
                                <el-input :disabled = "dataSelValDis" v-else-if="nodeData.driver=='com.inet.pool.PoolDriver'" placeholder="nodeData.url='jdbc:inetpool:inetora:[HOST]'" :value="nodeData.url" @input="urlVal"></el-input>
                                <el-input :disabled = "dataSelValDis" v-else-if="nodeData.driver=='com.sybase.jdbc2.jdbc.SybDriver'" placeholder="nodeData.url='jdbc:sybase:Tds:[HOST]:[PORT]'" :value="nodeData.url" @input="urlVal"></el-input>
                                <el-input :disabled = "dataSelValDis" v-else-if="nodeData.driver=='com.pointbase.jdbc.jdbcUniversalDriver'" placeholder="nodeData.url='jdbc:pointbase://embedded[:[PORT]]/[DB]'" :value="nodeData.url" @input="urlVal"></el-input>
                                <el-input :disabled = "dataSelValDis" v-else-if="nodeData.driver=='com.cloudscape.core.JDBCDriver'" placeholder="nodeData.url='jdbc:cloudscape:[DB]'" :value="nodeData.url" @input="urlVal"></el-input>
                                <el-input :disabled = "dataSelValDis" v-else-if="nodeData.driver=='rmiJdbc.RJDriver'" placeholder="nodeData.url='jdbc:rmi://[HOST]:[PORT]/jdbc:cloudscape:[DB]'" :value="nodeData.url" @input="urlVal"></el-input>
                                <el-input :disabled = "dataSelValDis" v-else-if="nodeData.driver=='org.firebirdsql.jdbc.FBDriver'" placeholder="nodeData.url='jdbc:firebirdsql:[//[HOST][:[PORT]]/][DB]'" :value="nodeData.url" @input="urlVal"></el-input>
                                <el-input :disabled = "dataSelValDis" v-else-if="nodeData.driver=='ids.sql.IDSDriver'" placeholder="nodeData.url='jdbc:ids://[HOST]:[PORT]/conn?dsn=<ODBC_DSN_NAME>'" :value="nodeData.url" @input="urlVal"></el-input>
                                <el-input :disabled = "dataSelValDis" v-else-if="nodeData.driver=='com.informix.jdbc.IfxDriver'" placeholder="nodeData.url='jdbc:informix-sqli://[HOST]:[PORT]/[DB]:INFORMIXSERVER=<SERVER_NAME>'" :value="nodeData.url" @input="urlVal"></el-input>
                                <el-input :disabled = "dataSelValDis" v-else-if="nodeData.driver=='org.enhydra.instantdb.jdbc.idbDriver'" placeholder="nodeData.url='jdbc:idb:[DB]'" :value="nodeData.url" @input="urlVal"></el-input>
                                <el-input :disabled = "dataSelValDis" v-else-if="nodeData.driver=='interbase.interclient.Driver'" placeholder="nodeData.url='jdbc:interbase://[HOST]/[DB]'" :value="nodeData.url" @input="urlVal"></el-input>
                                <el-input :disabled = "dataSelValDis" v-else-if="nodeData.driver=='org.hsql.jdbcDriver'" placeholder="nodeData.url='jdbc:HypersonicSQL:[DB]'" :value="nodeData.url" @input="urlVal"></el-input>
                                <el-input :disabled = "dataSelValDis" v-else-if="nodeData.driver=='com.pivotal.jdbc.GreenplumDriver'" placeholder="nodeData.url='jdbc:pivotal:greenplum://[HOST]:[PORT];DatabaseName=[DB]'" :value="nodeData.url" @input="urlVal"></el-input>
                                <el-input :disabled = "dataSelValDis" v-else-if="nodeData.driver=='com.pivotal.jdbc.GreenplumDriver'" placeholder="nodeData.url='jdbc:snowball://[HOST]:[PORT]/[DB]'" :value="nodeData.url" @input="urlVal"></el-input>

                                <el-input :disabled = "dataSelValDis" v-else :value="nodeData.url" placeholder="(必填)" @input="urlVal"></el-input>
                                <slot><i class="sign-class" v-if="nodeData.url==''">{{'url'| cn}} 不能为空</i></slot>
                        </el-form-item>
                        <el-form-item v-if="nodeData.type=='JDBC' || nodeData.type=='FTP'" :label="'user'| cn">
                                <el-tooltip class="item" effect="dark" content="用户名" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.user" name="user" placeholder="(必填)" :disabled = "dataSelValDis" @input="userVal"></el-input>
                                <slot><i class="sign-class" v-if="nodeData.user==''">{{'user'| cn}}  不能为空</i></slot>
                        </el-form-item>
                        <el-form-item v-if="nodeData.type=='JDBC' || nodeData.type=='FTP'" :label="'password'| cn">
                                <el-tooltip class="item" effect="dark" content="密码" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.password" name="password" placeholder="(必填)" :disabled = "dataSelValDis" @input="passwordVal"></el-input>
                                <slot><i class="sign-class" v-if="nodeData.password==''">{{'password'| cn}}  不能为空</i></slot>
                        </el-form-item>


                        <!-- type HIVE -->
                        <el-form-item v-if="nodeData.type=='HIVE' || nodeData.type=='JDBC' || nodeData.type=='HBASE'" :label="'table'| cn">
                                <el-tooltip class="item" effect="dark" content="表名" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.table" name="table" placeholder="(必填)" :disabled = "dataSelValDis" @input="tableVal"></el-input>
                                <slot><i class="sign-class" v-if="nodeData.table==''">{{'table'| cn}}  不能为空</i></slot>
                        </el-form-item>
                        <el-form-item label="batchsize"    v-if="nodeData.type =='JDBC'">
                                <el-tooltip class="item" effect="dark" content="batchsize" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-select v-model="nodeData.batchsize" placeholder="请选择" >
                                        <el-option
                                                v-for="item in batchsizeoptions"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                </el-select>
                        </el-form-item>
                        <el-form-item v-if="nodeData.type=='HIVE' || nodeData.type=='JDBC'" :label="'partitionColumns'| cn">
                                <el-tooltip class="item" effect="dark" content="HIVE 表分区" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.partitionColumns" name="partitionColumns" placeholder="partitionColumns" :disabled = "dataSelValDis" @input="partitionColumnsVal"></el-input>
                                <!-- <slot><i class="sign-class" v-if="nodeData.partitionColumns==''">partitionColumns 不能为空</i></slot> -->
                        </el-form-item>
                        <!-- type JDBC specifiedStringColumnTypes -->
                        <el-form-item v-if="nodeData.type=='JDBC'" :label="'specifiedStringColumnTypes'| cn">
                                <el-tooltip class="item" effect="dark" content="指定任意字段在保存到数据库时所使用的数据类型。该参数仅在创建新表时生效" placement="top">
                                        <i style="left: 30px;" class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <div>
                                        <ul class="tableTitle">
                                                <li>name<i v-if="nameBok" class="sign-class">({{'name'| cn}}值不能为空)</i></li>
                                                <li>dataType<i v-if="dataTypeBok" class="sign-class">({{'dataType'| cn}} 不能为空)</i></li>
                                                <li>length<i v-if="lengthBok" class="sign-class">({{'length'| cn}} 不能为空)</i></li>
                                        </ul>
                                        <ul class="tableTitle" v-for="(sct,key1,index) in nodeData.specifiedStringColumnTypes" :key="key1">
                                                <li>
                                                        <el-select class="selectClass" :value="sct.name" placeholder="请选择" @change="(value) => sctName(value, key1)">
                                                                <el-option v-for="(la,inputLa,index) in getSelFields[0].fields" :key="inputLa" :value="la.alias"></el-option>
                                                        </el-select>
                                                </li>
                                                <li>
                                                        <el-select class="selectClass" :value="sct.dataType" placeholder="请选择" @change="(value) => sctDataType(value, key1)">
                                                                <el-option value="char"></el-option>
                                                                <el-option value="varchar"></el-option>
                                                        </el-select>
                                                </li>
                                                <li>
                                                        <el-input :value="sct.length" placeholder="必填" @input="(value) => sctLength(value, key1)"></el-input>
                                                </li>
                                                <div class="removeSct">
                                                        <i @click="removeSct(key1)" class="i remove el-icon-remove-outline"></i>
                                                </div>
                                        </ul>
                                        <div class="adSct">
                                                <i @click="addSct" class="i el-icon-circle-plus-outline"></i>
                                        </div>
                                </div>
                        </el-form-item>

                        <!-- type KAFKA -->
                        <el-form-item v-if="nodeData.type=='KAFKA'" :label="'brokers'| cn">
                                <el-tooltip class="item" effect="dark" content="kafka brokers" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.brokers" name="brokers" placeholder="（必填）" :disabled = "dataSelValDis" @input="brokersVal"></el-input>
                                <i class="sign-class" v-if="nodeData.brokers==''">{{'brokers'| cn}}  不能为空</i>
                        </el-form-item>
                        <el-form-item v-if="nodeData.type=='KAFKA'" :label="'topic'| cn">
                                <el-tooltip class="item" effect="dark" content="kafka topic" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.topic" name="topic" placeholder="（必填）" :disabled = "dataSelValDis" @input="topicVal"></el-input>
                                <i class="sign-class" v-if="nodeData.topic==''">{{'topic'| cn}}  不能为空</i>
                        </el-form-item>
                        <el-form-item v-if="nodeData.type=='KAFKA'" :label="'groupId'| cn">
                                <el-tooltip class="item" effect="dark" content="kafka groupId" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.groupId" name="groupId" placeholder="（必填）" :disabled = "dataSelValDis" @input="groupIdVal"></el-input>
                                <i class="sign-class" v-if="nodeData.groupId==''">{{'groupId'| cn}}  不能为空</i>
                        </el-form-item>

                        <!-- type HBASE -->
                        <el-form-item v-if="nodeData.type=='HBASE'" :label="'namespace'| cn">
                                <el-tooltip class="item" effect="dark" content="hbase namespace" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.namespace" name="namespace" placeholder="（必填）" :disabled = "dataSelValDis" @input="namespaceVal"></el-input>
                                <i class="sign-class" v-if="nodeData.namespace==''">{{'namespace'| cn}}  不能为空</i>
                        </el-form-item>
                        <el-form-item v-if="nodeData.type=='HBASE'" :label="'columns配置'| cn">
                                <el-tooltip class="item" effect="dark" content="根据key值和columns配置，自动生成columns字段" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input v-model="nodeData.columnsKey" auto-complete="off" class="input-form-width" :disabled = "dataSelValDis" :placeholder="'key'"></el-input>
                                <el-input v-model="nodeData.columnsColumns" auto-complete="off" class="input-form-width" :disabled = "dataSelValDis" ></el-input>
                                <div class="input-form-width">
                                        <el-button size="mini"
                                                   :disabled = "dataSelValDis"
                                                   type="primary"
                                                   @click="createColumns"
                                                   class="button-create-columns"
                                                   auto-complete="off">
                                                生成columns
                                        </el-button>
                                </div>
                        </el-form-item>
                        <el-form-item v-if="nodeData.type=='HBASE'" :label="'columns'| cn">
                                <el-tooltip class="item" effect="dark" content="hbase columns" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.columns" placeholder="（必填）" :disabled = "dataSelValDis" @input="columnsVal"></el-input>
                                <i class="sign-class" v-if="nodeData.columns==''">{{'columns'| cn}} 不能为空</i>
                        </el-form-item>

                        <!-- type All -->
                        <el-form-item :label="'description'| cn">
                                <el-tooltip class="item" effect="dark" content="描述信息" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-input :value="nodeData.description" name="description" placeholder="description" @input="descriptionVal"></el-input>
                        </el-form-item>
                        <el-form-item :label="'mode'| cn" v-show="false">
                                <el-tooltip class="item" effect="dark" content="写入模式" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-select class="selectClass" :value="nodeData.mode | modeFilter" placeholder="（必填）" @change="modeSelect">
                                        <el-option value="追加"></el-option>
                                        <el-option value="覆盖"></el-option>
                                        <el-option value="新建（存在则报错）"></el-option>
                                        <el-option value="覆盖（存在则忽略）"></el-option>
                                </el-select>
                        </el-form-item>
                        <i class="sign" v-if="nodeData.mode==''" hidden>{{'mode'| cn}} 不能为空</i>
                        <el-form-item :label="'outputMode'| cn">
                                <el-select class="selectClass" :value="nodeData.outputMode " placeholder="（必填）" @change="outputModeSelect">
                                        <el-option value="update"></el-option>
                                        <el-option value="append"></el-option>
                                        <el-option value="complete"></el-option>
                                </el-select>
                        </el-form-item>
                        <el-form-item :label="'checkpointLocation'">
                                <el-input class="selectClass"  v-model="nodeData.checkpointLocation"  @input="changeCheckpointLocation" ></el-input>
                        </el-form-item>
                        <el-form-item :label="'trigger'| cn">
                                <el-tooltip class="item" effect="dark" content="写入模式" placement="top">
                                        <i class="parIcon el-icon-warning"></i>
                                </el-tooltip>
                                <el-select class="selectClass" :value="nodeData.trigger" placeholder="（必填）" @change="triggerSelect">
                                        <!-- <el-option value="Once"></el-option>
                                        <el-option value="0"></el-option> -->
                                        <el-option value="Schedule"></el-option>
                                </el-select>
                        </el-form-item>

                        <el-form-item v-show="nodeData.trigger == 'Schedule'">
                                <el-input class="selectClass w48"  v-model="num" placeholder="（只可输入整数）"  @input="changeNum" ></el-input>
                                <el-select class="selectClass w48"  :value="name"   @change="changeName">
                                        <el-option v-for="(lb,inputLb) in ['SECONDS','MINUTES','HOURS','DAYS']" :key="lb" :value="lb"></el-option>
                                </el-select>
                        </el-form-item>
                        <i class="sign" v-if="num==''">{{'time'}}不能为空</i>
                </el-form>
                <!-- 数据集查询 dialog-->
                <el-dialog title="数据集查询" :visible.sync="dialogDataSetVisible" :close-on-click-modal="false"
                           :before-close="cancelDatasetDialog" :modal-append-to-body="false" custom-class="dialogClass" append-to-body>
                        <el-form>
                                <data-source-inquire ref="dataSourceInquire" @thisSelectDatasetVal="getSelectDateVal"
                                                     rootName="dataset_dir"></data-source-inquire>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                                <el-button type="primary" @click="submitDataSet" name="bm-ch-step2Form-dataset-ok">确定</el-button>
                                <el-button @click="cancelDatasetDialog" name="bm-ch-step2Form-dataset-cancel">取消</el-button>
                        </div>
                </el-dialog>
                <!-- 数据集路径保存 -->
                <div v-if="dialogDataSetTreeVisible == true" class="nodeDialog">
                        <div class="diHeader">
                                <h3>DataSet Tree 查询</h3>
                                <span @click="dialogDataSetTreeVisible = false" class="el-icon-close"></span>
                        </div>
                        <div class="diContent">
                                <el-form id="bm-schematree1-form" class="elForm" label-width="80px">
                                        <dataset-tree class="elFormSelect" ref="datasettree"></dataset-tree>
                                </el-form>
                        </div>
                        <div slot="footer" class="diFooter">
                                <el-button type="primary" @click="submitDataSetTree">确定</el-button>
                                <el-button @click="dialogDataSetTreeVisible = false">取消</el-button>
                        </div>
                </div>
                <!-- schema 查询 -->
                <div v-if="dialogSchemaVisible == true" class="nodeDialog">
                        <div class="diHeader">
                                <h3>元数据查询</h3>
                                <span @click="dialogSchemaVisible = false" class="el-icon-close"></span>
                        </div>
                        <div class="diContent">
                                <el-form class="elForm" ref="form" label-width="80px" :label-position="labelPosition">
                                        <schema-inquire @thisSelectSchemaVal="getSelectSchemaVal"></schema-inquire>
                                </el-form>
                        </div>
                        <div slot="footer" class="diFooter">
                                <el-button type="primary" @click="submitSchema">确定</el-button>
                                <el-button @click="dialogSchemaVisible = false">取消</el-button>
                        </div>
                </div>
                <!-- schame 路径保存 -->
                <div v-if="dialogSchemaTreeVisible == true" class="nodeDialog">
                        <div class="diHeader">
                                <h3>{{'schema'| cn}} {{'tree'| cn}} 查询</h3>
                                <span @click="dialogSchemaTreeVisible = false" class="el-icon-close"></span>
                        </div>
                        <div class="diContent">
                                <el-form id="bm-schematree2-form" class="elForm" label-width="80px">
                                        <schema-tree class="elFormSelect" ref="schematree"></schema-tree>
                                </el-form>
                        </div>
                        <div slot="footer" class="diFooter">
                                <el-button type="primary" @click="submitschemaTree">确定</el-button>
                                <el-button @click="dialogSchemaTreeVisible = false">取消</el-button>
                        </div>
                </div>
        </div>
</template>

<script>
    import dataSourceInquire from '@dataSourceInq/dataSourceInquire.vue';
    import schemaInquire from '@schemaInq/schemaInquire.vue';
    import {nodeDataSet, getSchema,getResourcePath,confList} from '@api';
    import {queryObject,createParameter} from '@function/queryParameter.js';
    import {RandomUuid} from '@function/comFunction'
    import datasetTree  from '@components/datasetTree/datasetTree.vue';
    import schemaTree  from '@components/schemaTree/schemaTree.vue';

    export default {
        components: {
            dataSourceInquire,
            schemaInquire,
            datasetTree,
            schemaTree
        },
        data() {
            return {
                batchsizeoptions:[{
                    value: 0,
                    label: '0'
                    },{
                    value: 500,
                    label: '500'
                    },{
                    value: 1000,
                    label: '1000'
                    },{
                    value: 3000,
                    label: '3000'
                    },{
                    value: 10000,
                    label: '10000'
                    },{
                    value: 50000,
                    label: '50000'
                    },{
                    value: 100000,
                    label: '100000'
                    }],
                isShowbatchsize:false,
                nodeData:{
                   dataResource: '',
                   schemaResource: '',
                   driver: '',
                   batchsize:""

                },
                dialogDataSetVisible:false,
                dialogSchemaVisible:false,
                labelPosition: 'left',
                dataSelValDis:false,
                dataSetIfVal:'',
                sliceTimeColumnFields:[],
                nameBok: false,
                dataTypeBok: false,
                lengthBok: false,
                getSelvalData:{},
                formLabelWidth: "100px",
                schemaResource: '',
                dialogDataSetTreeVisible:false,
                dialogSchemaTreeVisible: false,
                pathInput: false,
                schemaValDis: false,
                num: '',
                name: '',
                DBTypes:[],//数据库类型,
            }
        },
        props:["nodeSetData","getSelFields"],
        watch: {
            nodeSetData(newValue, oldValue) {
                this.nodeData = newValue;
                var _this = this;
                var parameter = createParameter('name',_this.nodeData.dataset,'EQUAL').And("id",_this.nodeData.datasetId,'EQUAL').Build();
                this.schedule()
                this.nodeData.mode = "append"
                nodeDataSet(parameter).then(data => {
                    if(data.content.length == 0){

                    }else{
                        _this.dataSetIfVal = data.content[0].name;
                    }

                    if(this.nodeData.dataset != this.dataSetIfVal){
                        this.dataSelValDis = false;
                    }else{
                        this.dataSelValDis = true;
                    }
                }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                })
            },
            nodeData:{
                handler: function(val){
                  this.nodeData = val
                  this.parameterVali()
                },
                deep: true
            }
        },
        filters:{
            dataSetNameFilter : function () {
                return "数据集";
            },
            nameFilter:function (val) {

            },
            modeFilter :function (val) {
                if(val == "append"){
                    return "追加"
                }else if(val == "overwrite"){
                    return "覆盖"
                }else if(val == "error"){
                    return "新建（存在则报错）"
                }else if(val == "ignore"){
                    return "覆盖（存在则忽略）"
                }
            }
        },
        methods: {
            //取消dataset的组件按钮
            cancelDatasetDialog(){
                //关闭dialog
                this.dialogDataSetVisible = false
                //调用子组件的方法清空子组件的值
                this.$refs.dataSourceInquire.clearSelectionRow();
            },
            /**
             * dataSet 查询
             * ------------------------------------------------------------------
             */
            dataSetInq : function () {
                this.dialogDataSetVisible = true;
            },
            /**
             * schema 查询
             * ------------------------------------------------------------------
             */
            schemaInq : function () {
                this.dialogSchemaVisible = true;
            },
            /**
             * 获取子组件的dataSet
             * ------------------------------------------------------------------
             */
            getSelectDateVal(data){
                if(data.name=='') return false
                this.getSelvalDataId = data.id;
                this.getSelvalDataName = data.name;
                this.getSelvalSchemaName = data.schemaName;
                this.getSelvalSchemaId = data.schemaId;
                this.getSelvalData = data;
                this.nodeData.dataResource = ''
                this.nodeData.datasetResourceId = ''
                this.nodeData.schemaResource = ''
                this.nodeData.schemaResourceId = ''
                this.sliceTimeColumnFields = this.getSelvalData.fields;
            },
            /**
             * 获取type=JDBC name 下拉框 绑定获取值
             * ------------------------------------------------------------------
             */
            DBTypeSelect: function (val) {
                this.nodeData.name = val;
                //将driver和url,还有jarPath赋值
                this.$set(this.nodeData, 'DBType', this.DBTypesObj[val].DBType)
                this.$set(this.nodeData, 'driver', this.DBTypesObj[val].driver)
                this.$set(this.nodeData, 'url', this.DBTypesObj[val].url)
                this.$set(this.nodeData, 'jarPath', this.DBTypesObj[val].jarPath)
            },
            //changeCheckpointLocation
            changeCheckpointLocation(val){
                    this.nodeData.checkpointLocation = val
            },
            //获取时间数值
            changeNum: function(val){
                this.num = val.replace(/[^\d]/g,'')
                this.nodeData.scheduler =  this.num +" "+ this.name
            },
            //获取时间值的时分秒
            changeName: function(val){
                this.name = val
                this.nodeData.scheduler = this.num +" "+ val
            },
            /**
             * dataSet input 值
             * ------------------------------------------------------------------
             */
            dataSetVal:function (val) {
                var _this = this;
                _this.pathInput = true
                this.nodeData.dataset = val;
                var parameter = createParameter('name',val,'EQUAL').Build();
                nodeDataSet(parameter).then(data => {
                    this.dataSelValDis = true;
                        _this.pathInput = false
                        _this.nodeData.dataResource = ''
                        _this.nodeData.datasetResourceId = ''
                        _this.nodeData.schemaResource = ''
                        _this.nodeData.schemaResourceId = ''
                        _this.nodeData.datasetId = this.getSelvalDataId;
                        _this.nodeData.schemaId = this.getSelvalSchemaId;
                        if(data.content.length!=0){
                                _this.nodeData.type = data.content[0].storage;
                                _this.nodeData.format = data.content[0].storageConfigurations.format;
                                _this.nodeData.separator = data.content[0].storageConfigurations.separator;
                                _this.nodeData.quoteChar = data.content[0].storageConfigurations.quoteChar;
                                _this.nodeData.escapeChar = data.content[0].storageConfigurations.escapeChar;
                                _this.nodeData.path = data.content[0].storageConfigurations.path;
                                _this.nodeData.sliceType = data.content[0].sliceType;
                                _this.nodeData.table = data.content[0].storageConfigurations.table;
                                _this.nodeData.columns = data.content[0].storageConfigurations.columns;
                                _this.nodeData.columnsColumns = data.content[0].storageConfigurations.columnsColumns;
                                _this.nodeData.columnsKey = data.content[0].storageConfigurations.columnsKey;
                                _this.nodeData.namespace = data.content[0].storageConfigurations.namespace;
                                _this.nodeData.driver = data.content[0].storageConfigurations.driver;
                                _this.nodeData.url = data.content[0].storageConfigurations.url;
                                _this.nodeData.user = data.content[0].storageConfigurations.user;
                                _this.nodeData.password = data.content[0].storageConfigurations.password;
                                _this.nodeData.brokers = data.content[0].storageConfigurations.brokers;
                                _this.nodeData.topic = data.content[0].storageConfigurations.topic;
                                _this.nodeData.groupId = data.content[0].storageConfigurations.groupId;
                                _this.nodeData.partitionColumns = data.content[0].storageConfigurations.partitionColumns;
                                _this.nodeData.schema = data.content[0].schema.name;
                                _this.nodeData.schemaId = data.content[0].schema.id;
                                _this.nodeData.mode = "append"
                        }else{
                             _this.dataSelValDis = false;
                             _this.pathInput = true
                             _this.nodeData.type = "HDFS";
                             _this.nodeData.format = "csv";
                             _this.nodeData.separator = ",";
                             _this.nodeData.quoteChar = "\"";
                             _this.nodeData.escapeChar = "\\";
                             _this.nodeData.mode = "append"
                        //      _this.nodeData.path = "";
                        //      _this.nodeData.sliceType = "";
                        //      _this.nodeData.table = "";
                        //      _this.nodeData.columns = "";
                        //      _this.nodeData.namespace = "";
                        //      _this.nodeData.driver = "";
                        //      _this.nodeData.url = "";
                        //      _this.nodeData.user = "";
                        //      _this.nodeData.password = "";
                        //      _this.nodeData.brokers = "";
                        //      _this.nodeData.topic = "";
                        //      _this.nodeData.groupId = "";
                        //      _this.nodeData.partitionColumns = ""
                        }
                    })
                if(val != this.dataSetIfVal){
                    this.dataSelValDis = false;
                    this.nodeData.datasetId = RandomUuid();
                    this.nodeData.schema = "";
                    this.nodeData.schemaId = RandomUuid();
                    sessionStorage.setItem("schemaId",'')
                }else{
                    this.dataSelValDis = true;
                    var parameter = createParameter('name',val,'EQUAL').And("id",_this.nodeData.datasetId,'EQUAL').Build();
                    nodeDataSet(parameter).then(data => {
                        this.dataSelValDis = true;
                        _this.pathInput = false
                        _this.nodeData.dataResource = ''
                        _this.nodeData.datasetResourceId = ''
                        _this.nodeData.schemaResource = ''
                        _this.nodeData.schemaResourceId = ''
                        _this.nodeData.datasetId = this.getSelvalDataId;
                        _this.nodeData.schema = this.getSelvalSchemaName;
                        _this.nodeData.schemaId = this.getSelvalSchemaId;
                        if(data.content.length!=0){
                                _this.nodeData.type = data.content[0].storage;
                                _this.nodeData.format = data.content[0].storageConfigurations.format;
                                _this.nodeData.separator = data.content[0].storageConfigurations.separator;
                                _this.nodeData.quoteChar = data.content[0].storageConfigurations.quoteChar;
                                _this.nodeData.escapeChar = data.content[0].storageConfigurations.escapeChar;
                                _this.nodeData.path = data.content[0].storageConfigurations.path;
                                _this.nodeData.sliceType = data.content[0].sliceType;
                                _this.nodeData.table = data.content[0].storageConfigurations.table;
                                _this.nodeData.columns = data.content[0].storageConfigurations.columns;
                                _this.nodeData.columnsColumns = data.content[0].storageConfigurations.columnsColumns;
                                _this.nodeData.columnsKey = data.content[0].storageConfigurations.columnsKey;
                                _this.nodeData.namespace = data.content[0].storageConfigurations.namespace;
                                _this.nodeData.driver = data.content[0].storageConfigurations.driver;
                                _this.nodeData.url = data.content[0].storageConfigurations.url;
                                _this.nodeData.user = data.content[0].storageConfigurations.user;
                                _this.nodeData.password = data.content[0].storageConfigurations.password;
                                _this.nodeData.brokers = data.content[0].storageConfigurations.brokers;
                                _this.nodeData.topic = data.content[0].storageConfigurations.topic;
                                _this.nodeData.groupId = data.content[0].storageConfigurations.groupId;
                                _this.nodeData.partitionColumns = data.content[0].storageConfigurations.partitionColumns;
                        }
                    })
                }
            },
            /**
             * 获取dataSet 弹出框 绑定获取值（确认按钮事件）
             * ------------------------------------------------------------------
             */
            submitDataSet : function () {
                var _this = this;
                this.cancelDatasetDialog();
                this.nodeData.dataset = this.getSelvalDataName;
                this.nodeData.datasetId = this.getSelvalDataId;
                this.nodeData.schema = this.getSelvalSchemaName;
                this.nodeData.schemaId = this.getSelvalSchemaId;
                this.dataSetIfVal = this.nodeData.dataset;
                //根据name请求获取dataSet
                var parameter = createParameter('name',_this.nodeData.dataset,'EQUAL').And("id",_this.nodeData.datasetId,'EQUAL').Build();
                nodeDataSet(parameter).then(data => {
                    this.dataSelValDis = true;
                    this.pathInput = false
                    this.datasetResourceId = ''
                    _this.nodeData.type = data.content[0].storage;
                    _this.nodeData.format = data.content[0].storageConfigurations.format;
                    _this.nodeData.separator = data.content[0].storageConfigurations.separator;
                    _this.nodeData.quoteChar = data.content[0].storageConfigurations.quoteChar;
                    _this.nodeData.escapeChar = data.content[0].storageConfigurations.escapeChar;
                    _this.nodeData.path = data.content[0].storageConfigurations.path;
                    _this.nodeData.sliceType = data.content[0].sliceType;
                    _this.nodeData.table = data.content[0].storageConfigurations.table;
                    _this.nodeData.columns = data.content[0].storageConfigurations.columns;
                    _this.nodeData.columnsColumns = data.content[0].storageConfigurations.columnsColumns;
                    _this.nodeData.columnsKey = data.content[0].storageConfigurations.columnsKey;
                    _this.nodeData.namespace = data.content[0].storageConfigurations.namespace;
                    _this.nodeData.driver = data.content[0].storageConfigurations.driver;
                    _this.nodeData.url = data.content[0].storageConfigurations.url;
                    _this.nodeData.user = data.content[0].storageConfigurations.user;
                    _this.nodeData.password = data.content[0].storageConfigurations.password;
                    _this.nodeData.brokers = data.content[0].storageConfigurations.brokers;
                    _this.nodeData.topic = data.content[0].storageConfigurations.topic;
                    _this.nodeData.groupId = data.content[0].storageConfigurations.groupId;
                    _this.nodeData.partitionColumns = data.content[0].storageConfigurations.partitionColumns;
                    console.log(data.content[0].storageConfigurations.batchsize);
                     if(data.content[0].storageConfigurations.batchsize){
                        //console.log("if",data.content[0].storageConfigurations.batchsize);

                        _this.isShowbatchsize=true;
                        _this.nodeData.batchsize=parseInt(data.content[0].storageConfigurations.batchsize);
                    }else{
                        _this.isShowbatchsize=false;
                    }
                })
            },
            /**
             * 获取子组件的schema
             * ------------------------------------------------------------------
             */
            getSelectSchemaVal(data){
                this.getSchema = data.name;
                this.getSchemaId = data.id;
                this.sliceTimeColumnFields = data.fields;
            },
            /**
             * 获取schema input 值
             * ------------------------------------------------------------------
             */
            schemaVal:function (val) {
                this.nodeData.schema = val;
                if(val != this.getSchema){
                    this.nodeData.schemaId = "";
                }else {
                    this.nodeData.schema = this.getSchema;
                    this.nodeData.schemaId = this.getSchemaId;
                }
            },
            /**
             * 获取schema 弹出框 绑定获取值（确认按钮事件）
             * ------------------------------------------------------------------
             */
            submitSchema : function () {
                this.dialogSchemaVisible = false;
                this.nodeData.schema = this.getSchema;
                this.nodeData.schemaId = this.getSchemaId;
            },
            /**
             * 获取type 下拉框 绑定获取值
             * ------------------------------------------------------------------
             */
            typeSelect : function (val) {
                this.nodeData.type = val;
                if(this.nodeData.type == "HBASE"){
                    //如果是hbase类型初始化三个字段
                    this.$set(this.nodeData,'columns','')
                    this.$set(this.nodeData,'columnsKey','')
                    this.$set(this.nodeData,'columnsColumns','columns')
                }else if(this.nodeData.type == "JDBC"){
                    //如果是jdbc,调用接口，获取数据库类型数据
                    this.loading = true;
                    var parameter = createParameter('processConfigType',"jdbc driver",'EQUAL').Limit(1000).Offset(0).Build();
                    this.nodeData.mode = "append"
                    confList(parameter).then(data => {
                        this.loading = false;
                        var content = []
                        this.DBTypesObj = {}
                        for(var i=0;i<data.content.length;i++){
                            var par = JSON.parse(data.content[i].parameterlist);
                            content.push({
                                "name": data.content[i].name,
                                "DBType": data.content[i].dbType,
                                "driver": data.content[i].className,
                                "url": par.url,
                                "defaultPort": par.defaultPort,
                                "paraPrefix": par.paraPrefix,
                                "paraSep": par.paraSep,
                                "jarPath": data.content[i].jarpath
                            })
                            this.DBTypesObj[data.content[i].name] = content[i]
                        }
                        this.DBTypes= content;
                    }, err => {
                        this.loading = false;
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    })
                }
                this.nodeData.mode = "append"
            },
            /**
             * 获取type=HDFS format 下拉框 绑定获取值
             * ------------------------------------------------------------------
             */
            formatSelect : function (val) {
                this.nodeData.format = val;
            },
            /**
             * 获取type=HDFS separator input 绑定获取值
             * ------------------------------------------------------------------
             */
            separatorVal : function (val) {
                this.nodeData.separator = val;
            },
            /**
             * 获取type=HDFS separator input 绑定获取值
             * ------------------------------------------------------------------
             */
            quoteCharVal : function (val) {
                this.nodeData.quoteChar = val;
            },
            /**
             * 获取type=HDFS escapeChar input 绑定获取值
             * ------------------------------------------------------------------
             */
            escapeCharVal : function (val) {
                    this.$set(this.nodeData,'escapeChar')
                this.nodeData.escapeChar = val;
            },
            /**
             * 获取type=HDFS path input 绑定获取值
             * ------------------------------------------------------------------
             */
            pathVal : function (val) {
                    this.$set(this.nodeData,'path')
                this.nodeData.path = val;
            },
            /**
             * 获取type=HIVE table input 绑定获取值
             * ------------------------------------------------------------------
             */
            tableVal : function (val) {
                this.$set(this.nodeData,'table')
                this.nodeData.table = val;
            },
            /**
             * 获取type=HIVE partitionColumns input 绑定获取值
             * ------------------------------------------------------------------
             */
            partitionColumnsVal : function (val) {
                this.$set(this.nodeData,'partitionColumns')
                this.nodeData.partitionColumns = val;
            },
            /**
             * 获取type=JDBC driver select 下拉框 绑定获取值
             * ------------------------------------------------------------------
             */
            driverSelect : function (val) {
                this.$set(this.nodeData,'driver')
                this.nodeData.driver = val;


            },
            /**
             * 获取type=JDBC/FTP url input 绑定获取值
             * ------------------------------------------------------------------
             */
            urlVal : function (val) {
                    
                this.$set(this.nodeData,'url')
                this.nodeData.url = val;
            },
            /**
             * 获取type=JDBC/FTP user input 绑定获取值
             * ------------------------------------------------------------------
             */
            userVal : function (val) {
                    this.$set(this.nodeData,'user')
                this.nodeData.user = val;
            },
            /**
             * 获取type=JDBC/FTP password input 绑定获取值
             * ------------------------------------------------------------------
             */
            passwordVal : function (val) {
                this.$set(this.nodeData,'password')
                this.nodeData.password = val;
            },
            /**
             * 获取type=JDBC specifiedStringColumnTypes 数组对象 name 绑定获取值
             * ------------------------------------------------------------------
             */
            sctName:function (val,index) {
                this.nodeData.specifiedStringColumnTypes[index].name=val;
            },
            /**
             * 获取type=JDBC specifiedStringColumnTypes 数组对象 dataType 绑定获取值
             * ------------------------------------------------------------------
             */
            sctDataType:function (val,index) {
                this.nodeData.specifiedStringColumnTypes[index].dataType=val;
            },
            /**
             * 获取type=JDBC specifiedStringColumnTypes 数组对象 length 绑定获取值
             * ------------------------------------------------------------------
             */
            sctLength:function (val,index) {
                this.nodeData.specifiedStringColumnTypes[index].length=val;
            },
            /**
             * 获取type=JDBC specifiedStringColumnTypes 数组 新增对象
             * ------------------------------------------------------------------
             */
            addSct:function () {
                this.nodeData.specifiedStringColumnTypes.push({ "name": "", "dataType": "", "length": "" })
            },
            /**
             * 获取type=JDBC specifiedStringColumnTypes 数组 移除对象
             * ------------------------------------------------------------------
             */
            removeSct:function (index) {
                this.nodeData.specifiedStringColumnTypes.splice(index,1);
            },
            /**
             * 获取type=KAFKA brokers input 绑定获取值
             * ------------------------------------------------------------------
             */
            brokersVal : function (val) {
                this.nodeData.brokers = val;
            },
            /**
             * 获取type=KAFKA topic input 绑定获取值
             * ------------------------------------------------------------------
             */
            topicVal : function (val) {
                this.nodeData.topic = val;
            },
            /**
             * 获取type=KAFKA groupId input 绑定获取值
             * ------------------------------------------------------------------
             */
            groupIdVal : function (val) {
                this.nodeData.groupId = val;
            },
            /**
             * 获取type=HBASE namespace input 绑定获取值
             * ------------------------------------------------------------------
             */
            namespaceVal : function (val) {
                this.nodeData.namespace = val;
            },
            /**
             * 获取type=HBASE columns input 绑定获取值
             * ------------------------------------------------------------------
             */
            columnsVal : function (val) {
                this.nodeData.columns = val;
            },

            /**
             * 获取type=All description input 绑定获取值
             * ------------------------------------------------------------------
             */
            descriptionVal : function (val) {
                this.nodeData.description = val;
            },
            /**
             * 获取type=All mode select 绑定获取值
             * ------------------------------------------------------------------
             */
            modeSelect : function (val) {
                if(val == "追加"){
                    this.nodeData.mode = "append";
                }else if(val == "覆盖"){
                    this.nodeData.mode = "overwrite";
                }else if(val == "新建（存在则报错）"){
                    this.nodeData.mode = "error";
                }else if(val == "覆盖（存在则忽略）"){
                    this.nodeData.mode = "ignore";
                }
            },
            outputModeSelect(val){
                this.nodeData.outputMode = val
            },
            //trigger下拉切换
            triggerSelect(val){
                this.nodeData.trigger = val
                // if(val != 'Schedule'){
                //     this.nodeData.scheduler = ''
                //     this.num = ''
                //     this.name = ''
                // }
            },
            //nodeSet中Type类型为‘JDBC’的参数验证方法
            parameterVali:function(){
                    var typeData = this.nodeData.specifiedStringColumnTypes
                        if(typeof typeData !=='undefined'){
                              if(this.nodeData.type=='JDBC' && typeData.length>0){
                                        var bokArr = [];
                                        var dataTypeArr = [];
                                        var lengthArr = [];
                                        for(var i=0; i<typeData.length; i++){
                                                        if(typeData[i].name==''){
                                                                bokArr.push(true)
                                                        } else{
                                                                bokArr.push(false)
                                                        }
                                                        if(typeData[i].dataType==''){
                                                                dataTypeArr.push(true)
                                                        } else{
                                                                dataTypeArr.push(false)
                                                        }
                                                        if(typeData[i].length==''){
                                                                lengthArr.push(true)
                                                        } else{
                                                                lengthArr.push(false)
                                                        }
                                                }
                                        if(bokArr.indexOf(true)=='-1'){
                                                this.nameBok = false
                                        } else if(bokArr.indexOf(true)!=='-1'){
                                                this.nameBok = true
                                        }
                                        if(dataTypeArr.indexOf(true)=='-1'){
                                                this.dataTypeBok = false
                                        } else if(dataTypeArr.indexOf(true)!=='-1'){
                                                this.dataTypeBok = true
                                        }
                                        if(lengthArr.indexOf(true)=='-1'){
                                                this.lengthBok = false
                                        } else if(lengthArr.indexOf(true)!=='-1'){
                                                this.lengthBok = true
                                        }

                                }else {
                                        this.nameBok = false
                                        this.dataTypeBok = false
                                        this.lengthBok = false
                                        }
                        }
            },
            submitDataSetTree(){
                this.dialogDataSetTreeVisible = false
                //获取schema的node
                var datasetNode = this.$refs.datasettree.selectedNode;
                var that = this;
                if(datasetNode === ''){
                    that.$message({
                        message: '请选择一个目录！',
                        type: 'error'
                    });
                    return false;
                }else {
                     that.nodeData.dataResource = datasetNode.path
                     that.nodeData.datasetResourceId = datasetNode.id
                    that.dialogSchemaTreeVisible = false;
                }
            },
            submitschemaTree(){
                this.dialogSchemaTreeVisible = false
                //获取schema的node
                var schemaNode = this.$refs.schematree.selectedNode;
                var that = this;
                if(schemaNode === ''){
                    that.$message({
                        message: '请选择一个目录！',
                        type: 'error'
                    });
                    return false;
                }else {
                    that.nodeData.schemaResource = schemaNode.path
                     that.nodeData.schemaResourceId = schemaNode.id
                    that.dialogSchemaTreeVisible = false;
                }
            },
            //拼接成Columns想要的串
            connetColumns: function (fieldsArr, key) {
                var len = fieldsArr.length;
                //清空columns文本框内容
                this.nodeData.columns = "";
                //拼出带有字段的columns
                var fields = []
                for(var i= 0; i < len; i++){
                    fields.push(fieldsArr[i].alias != '' ?fieldsArr[i].alias:fieldsArr[i].name)
                    if(i === 0){
                        this.nodeData.columns += this.nodeData.columnsColumns + ':' + (fieldsArr[i].alias != '' ?fieldsArr[i].alias:fieldsArr[i].name);
                    }else{
                        this.nodeData.columns += ',' + this.nodeData.columnsColumns + ':' + (fieldsArr[i].alias != '' ?fieldsArr[i].alias:fieldsArr[i].name);
                    }
                }
                //替换掉key值
                if(key){
                    //判断schema字段中是否含有key
                    if(key && fields.indexOf(key) == -1 ){
                        this.$message({
                            message: 'schema字段中不存在key值！',
                            type: 'error',
                            duration: 1500
                        });
                    }
                    this.nodeData.columns = this.nodeData.columns.replace(new RegExp(this.nodeData.columnsColumns + ':' + key,'g'), 'rowKey:key')
                }
            },
            //生成columns
            createColumns: function(){
                //无论是否有key都可以生成coloumns
                if(!this.nodeData.columnsKey){
                    this.$message({
                        message: 'key值未填写',
                        type: 'error',
                        duration: 1500
                    });
                }
                //保证schema的id存在
                if(this.nodeData.schemaId){
                    getSchema(this.nodeData.schemaId).then((schemaEntity) => {
                        this.loading = false;
                        var fieldsTmp = schemaEntity.fields
                        this.connetColumns(fieldsTmp, this.nodeData.columnsKey)
                    }, error => {
                        this.loading = false;
                        var _this = this;
                        if(error.response.status == 500) {
                            _this.$message({
                                message: error.response.data.err,
                                type: 'error',
                                duration: 1500
                            });
                        }
                    })
                }else{
                    //没有schema的id时候就要从输出里面获取这个字段数组
                    this.connetColumns(this.getSelFields[0].fields, this.nodeData.columnsKey)
                }
            },
            //加载trigger
            schedule(){
                if(this.nodeData.outputMode){

                } else {
                        this.nodeData.outputMode = 'update'
                }
                if(this.nodeData.trigger){

                }else {
                        this.nodeData.trigger = 'Schedule'
                }

                if(this.nodeData.trigger == 'Schedule'&&this.nodeData.scheduler){
                        this.num =((this.nodeData.scheduler).split(" "))[0]
                        this.name =  ((this.nodeData.scheduler).split(" "))[1]
                } else {
                        this.num = ''
                        this.name = ''
                }
            }
        },
        mounted() {
            this.nodeData = this.nodeSetData;
            this.nodeData.mode = "append"
            this.schedule()
            var _this = this;
            var parameter = createParameter('name',_this.nodeData.dataset,'EQUAL').And("id",_this.nodeData.datasetId,'EQUAL').Build();
            this.modeSelect('追加')
            nodeDataSet(parameter).then(data => {
                if(data.content.length == 0){

                }else{
                    _this.dataSetIfVal = data.content[0].name;
                }

                if(this.nodeData.dataset != this.dataSetIfVal){
                    this.dataSelValDis = false;
                }else{
                    this.dataSelValDis = true;
                }
            })
            this.nodeData.mode = "append"
        }
    }

</script>

<style scoped>
        .selectClass{
                width: 100%;
        }
        .tableTitle{
                float: left;
                width: 100%;
                height: 30px;
                margin: 10px 0px 0px 0px;
                padding:0px;
        }
        .tableTitle li{
                float: left;
                width: 31%;
                margin-right: 1%;
                text-align: center;
        }
        .adSct{
                float: left;
        }
        .adSct i{
                color: #3e98fe;
        }
        .removeSct i{
                color: #ff4949;
        }
        .sign{
                margin-left:150px;
                color: red;
                padding:0px;
                font-size:8px;
                font-style:normal;
        }
        .sign-class{
                color: red;
                padding:0px;
                font-size:8px;
                font-style:normal;
        }
        .stepTable .el-form-item{
                margin-bottom: 0px !important;
                margin-top: 10px;
        }
        .stepTable .w100 {
                width: 100%;
        }
        .stepTable .w48 {
                width: 48%;
        }
        .button-create-columns{
                float: right;
        }
</style>
