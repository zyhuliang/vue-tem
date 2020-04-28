<template>
    <section class="add-resource " id='bm-ch-resMan-storageConfigurations-tmp'>
        <div class="res-data" v-loading="loading">
            <el-row class="btnClass">
                <div class="btn-left">
                    <h4>{{isNew ? '新建 ' : '编辑 '}}数据集</h4>
                </div>
            </el-row>
            <el-form id="bm-ch-resourceMan-storageConfigurations-form" :model="entity" ref="entity" :rules="rules"
                     class="main-content data-content main-content-form">
                <div class="left-form">
                    <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
                        <el-input name="bm-ch-resourceMan-name-input" v-model="entity.name" auto-complete="off"
                                  class="input-form-width" :placeholder="'必填'"></el-input>
                    </el-form-item>

                    <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
                        <el-input name="bm-ch-resourceMan-description-input" v-model="entity.description"
                                  auto-complete="off" class="input-form-width"></el-input>
                    </el-form-item>

                    <el-form-item :label="'schema' | cn" :label-width="formLabelWidth" prop="schema.name">
                        <el-input name="bm-ch-resourceMan-schema-name-input" v-model="entity.schema.name"
                                  placeholder="请选择内容(必填)" class="input-form-width" disabled>
                            <el-button slot="append" icon="icon iconfont icon-ir-search"
                                       @click="dataSchemaInquire"></el-button>
                        </el-input>
                    </el-form-item>

                    <el-form-item :label="'schemaVersion' | cn" v-if="entity.schema.oid" :label-width="formLabelWidth"
                                  prop="storageConfigurations.schemaVersion">
                        <el-select name="bm-ch-resourceMan-storageConfigurations-HDFS-format-select"
                                   class='select-form-width' @visible-change="versionChange($event, entity)" v-model="entity.schemaVersion">
                            <el-option
                                    v-for="item in historySchemaEntity"
                                    :key="item.version"
                                    :name="item.version"
                                    :label="item.version"
                                    :value="item.version">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item :label="'type' | cn" :label-width="formLabelWidth" prop="storage">
                        <el-select name="bm-ch-resourceMan-storageConfigurations-storage-select"
                                   class='select-form-width' v-model="entity.storage" @change="initDataset()">
                            <el-option
                                    v-for="item in saveType"
                                    :key="item.name"
                                    :name="item.name"
                                    :label="item.name | cn"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <div v-if="entity.storage == 'SFTP'">
                        <el-form-item :label="'user' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.user">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-FTP-user-input"
                                      v-model="entity.storageConfigurations.user" auto-complete="off"
                                      class="input-form-width" :placeholder="'必填'"></el-input>
                        </el-form-item>

                        <el-form-item :label="'password' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.password">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-FTP-password-input" type="password"
                                      v-model="entity.storageConfigurations.password" auto-complete="off"
                                      class="input-form-width" :placeholder="'必填'"></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="entity.storage == 'HDFS'|| entity.storage =='SFTP'">
                        <el-form-item :label="'path' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.path" ref="hdfsPath">
                            <el-input
                                    name="bm-ch-resourceMan-storageConfigurations-HDFS-storageConfigurationsPath-input"
                                    v-model="entity.storageConfigurations.path" auto-complete="off"
                                    class="input-form-width" :placeholder="'必填'"></el-input>
                        </el-form-item>

                        <el-form-item :label="'format' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.format">
                            <el-select name="bm-ch-resourceMan-storageConfigurations-HDFS-format-select"
                                       class='select-form-width' @change="formatChange" v-model="entity.storageConfigurations.format">
                                <el-option
                                        v-for="item in formatData"
                                        :key="item.name"
                                        :name="item.name"
                                        :label="item.value | cn"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item :label="'pathMode' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.pathMode">
                            <el-select name="bm-ch-resourceMan-storageConfigurations-HDFS-recursive-select"
                                       class='select-form-width' v-model="entity.storageConfigurations.pathMode">
                                <el-option
                                        v-for="item in ['exact','recursive','glob']"
                                        :key="item"
                                        :name="item"
                                        :label="item | cn"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item :label="'header' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.header"
                                      v-if="entity.storageConfigurations.format=='csv'||entity.storageConfigurations.format=='txt'">
                            <el-select name="bm-ch-resourceMan-storageConfigurations-HDFS-header-select"
                                       class='select-form-width' v-model="entity.storageConfigurations.header">
                                <el-option
                                        v-for="item in  ['true','false']"
                                        :key="item"
                                        :name="item"
                                        :label="item | cn"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item :label="'separator' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.separator"
                                      v-if=" entity.storageConfigurations.format=='csv' || entity.storageConfigurations.format=='txt'">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-HDFS-separator-input"
                                      v-model="entity.storageConfigurations.separator" auto-complete="off"
                                      class="input-form-width"></el-input>
                        </el-form-item>

                        <el-form-item :label="'quoteChar' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.quoteChar"
                                      v-if="entity.storageConfigurations.format=='csv'">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-HDFS-quoteChar-input"
                                      v-model="entity.storageConfigurations.quoteChar" auto-complete="off"
                                      class="input-form-width"></el-input>
                        </el-form-item>

                        <el-form-item :label="'escapeChar' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.escapeChar"
                                      v-if="entity.storageConfigurations.format=='csv'">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-HDFS-escapeChar-input"
                                      v-model="entity.storageConfigurations.escapeChar" auto-complete="off"
                                      class="input-form-width"></el-input>
                        </el-form-item>

                        <el-form-item :label="'encryptKey' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.encryptKey"
                                      v-if="entity.storageConfigurations.format=='csv' && entity.storage === 'HDFS'">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-HDFS-encryptKey-input"
                                      v-model="entity.storageConfigurations.encryptKey" auto-complete="off"
                                      type="textarea"
                                      class="input-form-width"></el-input>
                        </el-form-item>

                        <el-form-item :label="'encryptColumns' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.encryptColumns"
                                      v-if="entity.storageConfigurations.format=='csv' && entity.storage === 'HDFS'">
                            <el-select name="bm-ch-resourceMan-storageConfigurations-HDFS-encryptColumns-select"
                                       multiple
                                       class='select-form-width' v-model="entity.storageConfigurations.encryptColumns">
                                <el-option
                                        v-for="item in encryptColumnsArray"
                                        :key="item"
                                        :name="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>

                    <div v-if="entity.storage == 'HIVE'">

                        <el-form-item :label="'sql'| cn" :label-width="formLabelWidth" prop="storageConfigurations.sql"
                                      :rules="[ {validator: validateSqlOrTable, trigger: 'change' }]">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-HIVE-sql-input"
                                      v-model="entity.storageConfigurations.sql" auto-complete="off"
                                      class="input-form-width"></el-input>
                        </el-form-item>

                        <el-form-item :label="'table' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.table"
                                      :rules="[ {validator: validateSqlOrTable, trigger: 'change' }]">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-HIVE-table-input"
                                      v-model="entity.storageConfigurations.table" auto-complete="off"
                                      class="input-form-width"></el-input>
                        </el-form-item>

                        <el-form-item :label="'partitionColumns' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.partitionColumns">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-HIVE-partitionColumns-input"
                                      v-model="entity.storageConfigurations.partitionColumns" auto-complete="off"
                                      class="input-form-width"></el-input>
                        </el-form-item>
                    </div>

                    <div v-if="entity.storage == 'KAFKA'">

                        <el-form-item :label="'zookeeper' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.zookeeper">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-KAFKA-zookeeper-input"
                                      v-model="entity.storageConfigurations.zookeeper" auto-complete="off"
                                      class="input-form-width" :placeholder="'必填'"></el-input>
                        </el-form-item>

                        <el-form-item :label="'brokers' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.brokers">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-KAFKA-brokers-input"
                                      v-model="entity.storageConfigurations.brokers" auto-complete="off"
                                      class="input-form-width" :placeholder="'必填'"></el-input>
                        </el-form-item>

                        <el-form-item :label="'topic' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.topic">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-KAFKA-topic-input"
                                      v-model="entity.storageConfigurations.topic" auto-complete="off"
                                      class="input-form-width" :placeholder="'必填'"></el-input>
                        </el-form-item>

                        <el-form-item :label="'groupId' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.groupId">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-KAFKA-groupId-input"
                                      v-model="entity.storageConfigurations.groupId" auto-complete="off"
                                      class="input-form-width" :placeholder="'必填'"></el-input>
                        </el-form-item>

                        <el-form-item :label="'version' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.version">
                            <el-select name="bm-ch-resourceMan-storageConfigurations-KAFKA-version-select"
                                       class='select-form-width' v-model="entity.storageConfigurations.version">
                                <el-option
                                        v-for="item in [{name:'0.8',value:'0.8'},{ name:'0.9',value:'0.9'},{ name:'0.10',value:'0.10'}]"
                                        :key="item.name"
                                        :name="item.name"
                                        :label="item.name"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item :label="'format' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.format">
                            <el-select name="bm-ch-resourceMan-storageConfigurations-KAFKA-format-select"
                                       class='select-form-width' v-model="entity.storageConfigurations.format">
                                <el-option
                                        v-for="item in [{name:'csv',value:'csv'},{ name:'json',value:'json'},{ name:'xml',value:'xml'},{name:'avro',value:'avro'}]"
                                        :key="item.name"
                                        :name="item.name"
                                        :label="item.name | cn"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item :label="'header' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.header"
                                      v-if="entity.storageConfigurations.format=='csv'">
                            <el-select name="bm-ch-resourceMan-storageConfigurations-KAFKA-header-select"
                                       class='select-form-width' v-model="entity.storageConfigurations.header">
                                <el-option
                                        v-for="item in ['true','false']"
                                        :key="item"
                                        :name="item"
                                        :label="item | cn"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item :label="'separator' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.separator"
                                      v-if="entity.storageConfigurations.format=='csv'">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-KAFKA-separator-input"
                                      v-model="entity.storageConfigurations.separator" auto-complete="off"
                                      class="input-form-width"></el-input>
                        </el-form-item>

                        <el-form-item :label="'quoteChar' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.quoteChar"
                                      v-if="entity.storageConfigurations.format=='csv'">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-KAFKA-quoteChar-input"
                                      v-model="entity.storageConfigurations.quoteChar" auto-complete="off"
                                      class="input-form-width"></el-input>
                        </el-form-item>

                        <el-form-item :label="'escapeChar' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.escapeChar"
                                      v-if="entity.storageConfigurations.format=='csv'">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-KAFKA-escapeChar-input"
                                      v-model="entity.storageConfigurations.escapeChar" auto-complete="off"
                                      class="input-form-width"></el-input>
                        </el-form-item>

                        <el-form-item :label="'reader' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.reader"
                                      v-if="entity.storageConfigurations.format=='xml'">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-KAFKA-reader-input"
                                      v-model="entity.storageConfigurations.reader" auto-complete="off"
                                      class="input-form-width"></el-input>
                        </el-form-item>
                        <el-form-item :label="'encryptKey' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.encryptKey"
                                      v-if="entity.storageConfigurations.format=='csv'">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-HDFS-encryptKey-input"
                                      v-model="entity.storageConfigurations.encryptKey" auto-complete="off"
                                      type="textarea"
                                      class="input-form-width"></el-input>
                        </el-form-item>

                        <el-form-item :label="'encryptColumns' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.encryptColumns"
                                      v-if="entity.storageConfigurations.format=='csv'">
                            <el-select name="bm-ch-resourceMan-storageConfigurations-HDFS-encryptColumns-select"
                                       multiple
                                       class='select-form-width' v-model="entity.storageConfigurations.encryptColumns">
                                <el-option
                                        v-for="item in encryptColumnsArray"
                                        :key="item"
                                        :name="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>

                    </div>

                    <div v-if="entity.storage == 'HBASE'">

                        <el-form-item :label="'table' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.table"
                                      :rules=" {  required: true, message: '请输入内容...', trigger: 'change' }">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-HBASE-table-input"
                                      v-model="entity.storageConfigurations.table" auto-complete="off"
                                      class="input-form-width" :placeholder="'必填'"></el-input>
                        </el-form-item>

                        <el-form-item :label="'namespace' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.namespace">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-HBASE-namespace-input"
                                      v-model="entity.storageConfigurations.namespace" auto-complete="off"
                                      class="input-form-width" :placeholder="'必填'"></el-input>
                        </el-form-item>
                        <el-form-item :label="'columnsKey'| cn" :label-width="formLabelWidth">
                            <el-button type="primary" v-on:click="selectdColumn(0)" v-if="isSingle">单列族</el-button>
                            <el-button v-on:click="selectdColumn(1)" v-if="isSingle">多列族</el-button>
                            <el-button v-on:click="selectdColumn(0)" v-if="!isSingle">单列族</el-button>
                            <el-button type="primary" v-on:click="selectdColumn(1)" v-if="!isSingle">多列族</el-button>
                            <div id="columns">
                                <el-input name="bm-ch-resourceMan-storageConfigurations-HBASE-columns-key-input"
                                          v-model="entity.storageConfigurations.columnsKey" auto-complete="off"
                                          class="input-form-width" :placeholder="'key'"></el-input>
                                <el-input name="bm-ch-resourceMan-storageConfigurations-HBASE-columns-columns-input"
                                          v-model="entity.storageConfigurations.columnsColumns" auto-complete="off"
                                          class="input-form-width" v-if="isSingle"></el-input>
                                <el-input name="bm-ch-resourceMan-storageConfigurations-HBASE-columns-columns-input"
                                          v-model="entity.storageConfigurations.columnsColumns" auto-complete="off"
                                          class="input-form-width" v-if="!isSingle"></el-input>
                                <i class="fa fa-plus" v-if="!isSingle" style="margin-left:4px;" aria-hidden="true"
                                   v-on:click="editColumns('add')"></i>


                                <div v-for="(item,index) in columnsItems" v-bind:key="index">
                                    <el-input name="bm-ch-resourceMan-storageConfigurations-HBASE-columns-columns-input"
                                              v-model="entity.storageConfigurations['columnsColumns'+item]"
                                              auto-complete="off" class="input-form-width"></el-input>
                                    <i class="fa fa-times" aria-hidden="true" style="margin-left:8px;"
                                       v-on:click="editColumn('remove')"></i></div>
                            </div>
                            <div class="input-form-width">
                                <el-button size="mini"
                                           type="primary"
                                           name="bm-ch-resourceMan-storageConfigurations-HBASE-columns-button"
                                           @click="createColumns"
                                           class="button-create-columns"
                                           auto-complete="off">
                                    生成列
                                </el-button>
                            </div>
                        </el-form-item>

                        <el-form-item :label="'columns' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.columns">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-HBASE-columns-input" type="textarea"
                                      rows=8 v-model="entity.storageConfigurations.columns" auto-complete="off"
                                      class="input-form-width"
                                      :placeholder="'描述hbase的列，与schema中的列要一一对应，形如，columnFamily1:qualifier1,columnFamily1:qualifier2,columnFamily1:qualifier3,columnFamily2:qualifier1... 其中，rowKey对应的那一列，应写成rowKey:key'"></el-input>
                        </el-form-item>
                    </div>

                    <div v-if="entity.storage == 'FTP'">

                        <el-form-item :label="'path' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.relativePath">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-FTP-relativePath-input"
                                      v-model="entity.storageConfigurations.relativePath" auto-complete="off"
                                      class="input-form-width" :placeholder="'必填'" @input="changePath">
                            </el-input>
                        </el-form-item>


                        <el-form-item :label="'format' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.format">
                            <el-select name="bm-ch-resourceMan-storageConfigurations-FTP-format-select"
                                       class='select-form-width' v-model="entity.storageConfigurations.format">
                                <el-option
                                        v-for="item in [{name:'CSV',value:'csv'},{ name:'parquet',value:'parquet'}]"
                                        :key="item.name"
                                        :name="item.name"
                                        :label="item.value | cn"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="'user' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.user">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-FTP-user-input"
                                      v-model="entity.storageConfigurations.user" auto-complete="off"
                                      class="input-form-width" :placeholder="'必填'" @input="changePath"></el-input>
                        </el-form-item>

                        <el-form-item :label="'password' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.password">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-FTP-password-input" type="password"
                                      v-model="entity.storageConfigurations.password" auto-complete="off"
                                      class="input-form-width" :placeholder="'必填'" @input="changePath"></el-input>
                        </el-form-item>
                        <el-form-item :label="'header' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.header"
                                      v-if="entity.storageConfigurations.format=='csv'">
                            <el-select name="bm-ch-resourceMan-storageConfigurations-FTP-header-select"
                                       class='select-form-width' v-model="entity.storageConfigurations.header">
                                <el-option
                                        v-for="item in ['true','false']"
                                        :key="item"
                                        :name="item"
                                        :label="item | cn"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item :label="'separator' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.separator"
                                      v-if="entity.storageConfigurations.format=='csv'">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-FTP-separator-input"
                                      v-model="entity.storageConfigurations.separator" auto-complete="off"
                                      class="input-form-width"></el-input>
                        </el-form-item>

                        <el-form-item :label="'quoteChar' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.quoteChar"
                                      v-if="entity.storageConfigurations.format=='csv'">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-FTP-quoteChar-input"
                                      v-model="entity.storageConfigurations.quoteChar" auto-complete="off"
                                      class="input-form-width"></el-input>
                        </el-form-item>

                        <el-form-item :label="'escapeChar' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.escapeChar"
                                      v-if="entity.storageConfigurations.format=='csv'">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-FTP-escapeChar-input"
                                      v-model="entity.storageConfigurations.escapeChar" auto-complete="off"
                                      class="input-form-width"></el-input>
                        </el-form-item>

                    </div>

                    <div v-if="entity.storage == 'REDIS'">
                        <el-form-item :label="'url' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.url">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-REDIS-url-input"
                                      v-model="entity.storageConfigurations.url" auto-complete="off"
                                      class="input-form-width" :placeholder="''"></el-input>
                        </el-form-item>

                        <el-form-item :label="'keyColumn' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.keyColumn">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-REDIS-keyColumn-input"
                                      v-model="entity.storageConfigurations.keyColumn" auto-complete="off"
                                      class="input-form-width" :placeholder="'默认使用UUID填充'"></el-input>
                        </el-form-item>

                        <el-form-item :label="'password' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.password">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-REDIS-password-input"
                                      type="password" v-model="entity.storageConfigurations.password"
                                      auto-complete="off" class="input-form-width" :placeholder="''"></el-input>
                        </el-form-item>

                        <el-form-item :label="'table' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.table"
                                      :rules=" {  required: true, message: '请输入内容...', trigger: 'change' }">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-REDIS-table-input"
                                      v-model="entity.storageConfigurations.table" auto-complete="off"
                                      class="input-form-width"></el-input>
                        </el-form-item>
                    </div>

                    <div v-if="entity.storage == 'ElasticSearch' || entity.storage == 'SearchOne'">

                        <el-form-item :label="'clusterName' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.clusterName">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-ElasticSearch-clusterName-input"
                                      v-model="entity.storageConfigurations.clusterName" auto-complete="off"
                                      class="input-form-width" :placeholder="'必填'"></el-input>
                        </el-form-item>

                        <el-form-item :label="'ipAddresses' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.ipAddresses">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-ElasticSearch-ipAddresses-input"
                                      v-model="entity.storageConfigurations.ipAddresses" auto-complete="off"
                                      class="input-form-width" :placeholder="'必填'"></el-input>
                        </el-form-item>

                        <el-form-item :label="'index' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.index">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-ElasticSearch-index-input"
                                      v-model="entity.storageConfigurations.index" auto-complete="off"
                                      class="input-form-width" :placeholder="'必填'"></el-input>
                        </el-form-item>

                        <el-form-item :label="'indexType' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.indexType">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-ElasticSearch-indexType-input"
                                      v-model="entity.storageConfigurations.indexType" auto-complete="off"
                                      class="input-form-width" :placeholder="'必填'"></el-input>
                        </el-form-item>
                    </div>

                    <div v-if="entity.storage == 'Neo4j'" id="classGrop">
                        <el-form-item :label="'url' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.url">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-REDIS-url-input"
                                      v-model="entity.storageConfigurations.url" auto-complete="off"
                                      class="input-form-width" :placeholder="''"></el-input>
                        </el-form-item>
                        <el-form-item :label="'user' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.user">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-FTP-user-input"
                                      v-model="entity.storageConfigurations.user" auto-complete="off"
                                      class="input-form-width" :placeholder="'必填'"></el-input>
                        </el-form-item>

                        <el-form-item :label="'password' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.password">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-FTP-password-input" type="password"
                                      v-model="entity.storageConfigurations.password" auto-complete="off"
                                      class="input-form-width" :placeholder="'必填'"></el-input>
                        </el-form-item>

                        <el-form-item label="源" :label-width="formLabelWidth" required
                                      prop="storageConfigurations.src">
                            <el-select v-model="entity.storageConfigurations.src"
                                       name="src"
                                       class='select-form-width'
                                       filterable
                                       default-first-option
                                       allow-create placeholder="源">
                                <el-option value="all">all</el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="关系" :label-width="formLabelWidth"
                                      prop="storageConfigurations.edge">
                            <el-select v-model="entity.storageConfigurations.edge"
                                       name="edge"
                                       class='select-form-width'
                                       filterable
                                       default-first-option
                                       allow-create placeholder="关系">
                                <el-option value=""></el-option>
                                <el-option value="all">all</el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="目标" :label-width="formLabelWidth"
                                      prop="storageConfigurations.target">
                            <el-select v-model="entity.storageConfigurations.target"
                                       name="target"
                                       class='select-form-width'
                                       filterable
                                       default-first-option
                                       allow-create placeholder="目标">
                                <el-option value=""></el-option>
                                <el-option value="all">all</el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="源字段" :label-width="formLabelWidth" required
                                      prop="storageConfigurations.sourceFields">
                            <el-table v-if="entity.storageConfigurations.sourceFields"
                                      :data="entity.storageConfigurations.sourceFields == undefined ? []:entity.storageConfigurations.sourceFields.slice((currentPage['sourceFields']-1)*pagesize['sourceFields'],currentPage['sourceFields']*pagesize['sourceFields'])"
                                      style="width: 98%"
                                      max-height="500">
                                <el-table-column fixed type="index" width="60"
                                                 :index="(index)=> indexMethod(index, 'sourceFields')">
                                </el-table-column>
                                <el-table-column prop="name" label="名称">
                                    <template slot-scope="scope">
                                        <el-tooltip class="item" effect="dark"
                                                    :content="scope.row.name == ''?'请点击选择字段':scope.row.name"
                                                    placement="top">
                                            <el-input placeholder="字段（必填）" class="inputClassGrop"
                                                      v-model="scope.row.name"></el-input>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="value" label="值">
                                    <template slot-scope="scope">
                                        <el-select class="selectClass" v-model="scope.row.value" placeholder="源字段"
                                                   filterable
                                                   @focus="selectFields"
                                                   default-first-option>
                                            <el-option
                                                    v-for="(field,i) in getSelvalSchemaFields"
                                                    :key="field.name+i"
                                                    :name="field.name+i"
                                                    :label="field.name"
                                                    :value="field.name">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column fixed="right" label="操作" width="80">
                                    <template slot-scope="scope">
                                        <div class="removeTargetFields">
                                            <i @click="editFields('sourceFields', scope.$index, 'add')" title="新增对象"
                                               class="i add el-icon-circle-plus-outline"></i>
                                            <i @click="editFields('sourceFields', scope.$index, 'del')"
                                               title="移除当前对象"
                                               class="i remove el-icon-remove-outline"></i>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-pagination @size-change="($event)=> handleSizeChange($event, 'sourceFields')"
                                           @current-change="($event)=> handleCurrentChange($event, 'sourceFields')"
                                           :current-page="currentPage['sourceFields']"
                                           :page-sizes="[8, 16, 50, 100]" :page-size="pagesize['sourceFields']"
                                           layout="total, sizes, prev, pager, next, jumper"
                                           :total="entity.storageConfigurations.sourceFields == undefined ? 0 : entity.storageConfigurations.sourceFields.length">
                            </el-pagination>
                            <div class="adAggregations">
                                <i @click="editFields('sourceFields', undefined, 'add')" title="新增对象"
                                   class="i add el-icon-circle-plus-outline"></i>
                            </div>
                        </el-form-item>

                        <el-form-item label="关系字段" :label-width="formLabelWidth"
                                      prop="storageConfigurations.edgeFields">
                            <el-table v-if="entity.storageConfigurations.edgeFields"
                                      :data="entity.storageConfigurations.edgeFields== undefined ? []:entity.storageConfigurations.edgeFields.slice((currentPage['edgeFields']-1)*pagesize['edgeFields'],currentPage['edgeFields']*pagesize['edgeFields'])"
                                      style="width: 98%"
                                      max-height="500">
                                <el-table-column fixed type="index" width="60"
                                                 :index="(index)=> indexMethod(index, 'edgeFields')">
                                </el-table-column>
                                <el-table-column prop="name" label="名称">
                                    <template slot-scope="scope">
                                        <el-tooltip class="item" effect="dark"
                                                    :content="scope.row.name == ''?'请点击选择字段':scope.row.name"
                                                    placement="top">
                                            <el-input placeholder="字段（必填）" class="inputClassGrop"
                                                      v-model="scope.row.name"></el-input>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="value" label="值">
                                    <template slot-scope="scope">
                                        <el-select class="selectClass" v-model="scope.row.value" placeholder="关系字段"
                                                   filterable
                                                   @focus="selectFields"
                                                   default-first-option>
                                            <el-option
                                                    v-for="(field,i) in getSelvalSchemaFields"
                                                    :key="field.name+i"
                                                    :name="field.name+i"
                                                    :label="field.name"
                                                    :value="field.name">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column fixed="right" label="操作" width="80">
                                    <template slot-scope="scope">
                                        <div class="removeTargetFields">
                                            <i @click="editFields('edgeFields', scope.$index, 'add')" title="新增对象"
                                               class="i add el-icon-circle-plus-outline"></i>
                                            <i @click="editFields('edgeFields', scope.$index, 'del')"
                                               title="移除当前对象"
                                               class="i remove el-icon-remove-outline"></i>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-pagination @size-change="($event)=> handleSizeChange($event, 'edgeFields')"
                                           @current-change="($event)=> handleCurrentChange($event, 'edgeFields')"
                                           :current-page="currentPage['edgeFields']"
                                           :page-sizes="[8, 16, 50, 100]" :page-size="pagesize['edgeFields']"
                                           layout="total, sizes, prev, pager, next, jumper"
                                           :total="entity.storageConfigurations.edgeFields == undefined ? 0 : entity.storageConfigurations.edgeFields.length">
                            </el-pagination>
                            <div class="adAggregations">
                                <i @click="editFields('edgeFields',undefined,'add')" title="新增对象"
                                   class="i add el-icon-circle-plus-outline"></i>
                            </div>
                        </el-form-item>

                        <el-form-item label="目标字段" :label-width="formLabelWidth"
                                      prop="storageConfigurations.targetFields">
                            <el-table v-if="entity.storageConfigurations.targetFields"
                                      :data="entity.storageConfigurations.targetFields== undefined ? []:entity.storageConfigurations.targetFields.slice((currentPage['targetFields']-1)*pagesize['targetFields'],currentPage['targetFields']*pagesize['targetFields'])"
                                      style="width: 98%"
                                      max-height="500">
                                <el-table-column fixed type="index" width="60"
                                                 :index="(index)=> indexMethod(index, 'targetFields')">
                                </el-table-column>
                                <el-table-column prop="name" label="名称">
                                    <template slot-scope="scope">
                                        <el-tooltip class="item" effect="dark"
                                                    :content="scope.row.name == ''?'请点击选择字段':scope.row.name"
                                                    placement="top">
                                            <el-input placeholder="字段（必填）" class="inputClassGrop"
                                                      v-model="scope.row.name"></el-input>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="value" label="值">
                                    <template slot-scope="scope">
                                        <el-select class="selectClass" v-model="scope.row.value" placeholder="目标字段"
                                                   filterable
                                                   @focus="selectFields"
                                                   default-first-option>
                                            <el-option
                                                    v-for="(field,i) in getSelvalSchemaFields"
                                                    :key="field.name+i"
                                                    :name="field.name+i"
                                                    :label="field.name"
                                                    :value="field.name">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column fixed="right" label="操作" width="80">
                                    <template slot-scope="scope">
                                        <div class="removeTargetFields">
                                            <i @click="editFields('targetFields', scope.$index, 'add')" title="新增对象"
                                               class="i add el-icon-circle-plus-outline"></i>
                                            <i @click="editFields('targetFields', scope.$index, 'del')"
                                               title="移除当前对象"
                                               class="i remove el-icon-remove-outline"></i>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-pagination @size-change="($event)=> handleSizeChange($event, 'targetFields')"
                                           @current-change="($event)=> handleCurrentChange($event, 'targetFields')"
                                           :current-page="currentPage['targetFields']"
                                           :page-sizes="[8, 16, 50, 100]" :page-size="pagesize['targetFields']"
                                           layout="total, sizes, prev, pager, next, jumper"
                                           :total="entity.storageConfigurations.targetFields == undefined ? 0 : entity.storageConfigurations.targetFields.length">
                            </el-pagination>
                            <div class="adAggregations">
                                <i @click="editFields('targetFields', undefined, 'add')" title="新增对象"
                                   class="i add el-icon-circle-plus-outline"></i>
                            </div>
                        </el-form-item>
                    </div>

                    <div v-if="entity.storage == 'S3A'">
                        <el-form-item :label="'format' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.format">
                            <el-select name="bm-ch-resourceMan-storageConfigurations-HDFS-format-select"
                                       class='select-form-width' v-model="entity.storageConfigurations.format">
                                <el-option
                                        v-for="item in [{name:'CSV',value:'csv'},{ name:'parquet',value:'parquet'},{ name:'orc',value:'orc'},{ name:'txt',value:'txt'},{ name:'avro',value:'avro'}]"
                                        :key="item.name"
                                        :name="item.name"
                                        :label="item.value | cn"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item :label="'accessKey' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.accessKey">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-S3A-accessKey-input" type="input"
                                      v-model="entity.storageConfigurations.accessKey" auto-complete="off"
                                      class="input-form-width"></el-input>
                        </el-form-item>

                        <el-form-item :label="'secretKey' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.secretKey">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-S3A-secretKey-input"
                                      v-model="entity.storageConfigurations.secretKey" auto-complete="off"
                                      type="password" class="input-form-width"></el-input>
                        </el-form-item>

                        <el-form-item :label="'endpoint' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.endpoint">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-S3A-endpoint-input"
                                      v-model="entity.storageConfigurations.endpoint" auto-complete="off"
                                      class="input-form-width"></el-input>
                        </el-form-item>

                        <el-form-item :label="'path' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.path" ref="hdfsPath">
                            <el-input
                                    name="bm-ch-resourceMan-storageConfigurations-HDFS-storageConfigurationsPath-input"
                                    v-model="entity.storageConfigurations.path" auto-complete="off"
                                    class="input-form-width" :placeholder="'必填'"></el-input>
                        </el-form-item>

                        <el-form-item :label="'header' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.header"
                                      v-if="entity.storageConfigurations.format=='csv' || entity.storageConfigurations.format=='txt'">
                            <el-select name="bm-ch-resourceMan-storageConfigurations-HDFS-header-select"
                                       class='select-form-width' v-model="entity.storageConfigurations.header">
                                <el-option
                                        v-for="item in  ['true','false']"
                                        :key="item"
                                        :name="item"
                                        :label="item | cn"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item :label="'separator' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.separator"
                                      v-if=" entity.storageConfigurations.format=='csv' || entity.storageConfigurations.format=='txt'">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-HDFS-separator-input"
                                      v-model="entity.storageConfigurations.separator" auto-complete="off"
                                      class="input-form-width"></el-input>
                        </el-form-item>

                        <el-form-item :label="'quoteChar' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.quoteChar"
                                      v-if="entity.storageConfigurations.format=='csv'">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-HDFS-quoteChar-input"
                                      v-model="entity.storageConfigurations.quoteChar" auto-complete="off"
                                      class="input-form-width"></el-input>
                        </el-form-item>

                        <el-form-item :label="'escapeChar' | cn" :label-width="formLabelWidth"
                                      prop="storageConfigurations.escapeChar"
                                      v-if="entity.storageConfigurations.format=='csv'">
                            <el-input name="bm-ch-resourceMan-storageConfigurations-HDFS-escapeChar-input"
                                      v-model="entity.storageConfigurations.escapeChar" auto-complete="off"
                                      class="input-form-width"></el-input>
                        </el-form-item>
                    </div>

                    <el-form-item :label="'expiredPeriod'| cn" :label-width="formLabelWidth" prop="expiredPeriod">
                        <el-input placeholder="expiredTime" v-model="exTimeVal" class="input-with-select"
                                  @input="expiredTimeValue"
                                  name="bm-ch-resourceMan-storageConfigurations-HDFS-expiredPeriod-input">
                            <el-select class="input-with-select"
                                       name="bm-ch-resourceMan-storageConfigurations-HDFS-expiredPeriodUnit-select"
                                       v-model="expiredTimeSelect" slot="append" placeholder="请选择"
                                       @change="expiredTimeSelVal">
                                <el-option label="天" value="d" name="d"></el-option>
                                <el-option label="小时" value="h" name="h"></el-option>
                                <el-option label="分" value="m" name="m"></el-option>
                                <el-option label="秒" value="s" name="s"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>

                    <el-form-item :label="'sliceType' | cn" :label-width="formLabelWidth" prop="sliceType">
                        <el-select name="bm-ch-resourceMan-storageConfigurations-HDFS-sliceType-select"
                                   class='select-form-width' v-model="entity.sliceType">
                            <el-option
                                    v-for="item in ['1','5','Q','F','H','D']"
                                    :key="item"
                                    :name="item"
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item :label="'sliceTime' | cn" :label-width="formLabelWidth" prop="sliceTime">
                        <el-input name="bm-ch-resourceMan-storageConfigurations-HDFS-sliceTime-input"
                                  v-model="entity.sliceTime" auto-complete="off" class="input-form-width"
                                  :placeholder="'填写内容'"></el-input>

                    </el-form-item>



                    <el-collapse accordion>
                        <el-collapse-item>
                            <template slot="title">
                            <h3 class="advanced-options">
                                <i class="fa fa-sort-amount-asc"></i>&nbsp;&nbsp;高级选项
                            </h3>
                            </template>
                            <el-form-item :label="'clusterId' | cn" :label-width="formLabelWidth" prop="clusterId">
                                <el-select v-model="entity.clusterId" placeholder="请选择">
                                    <el-option
                                    v-for="item in optionsclusterId"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="'specialField' | cn" :label-width="formLabelWidth" prop="specialField">
                                <el-select v-model="entity.specialField" placeholder="请选择">
                                    <el-option
                                    v-for="item in specialFieldOption"
                                    :key="item.name"
                                    :label="item.name"
                                    :value="item.name">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            </el-collapse-item>
                        </el-collapse>
                </div>
                <!--预览数据-->
                <div class="right-form">
                    <preview :entity="entityNeo"></preview>
                </div>
            </el-form>
            <div slot="footer" class="data-footer">
                <el-button type="primary" @click="save()" name="bm-ch-resMan-storageConfigurations-schema-ok">确定
                </el-button>
                <el-button @click="cancel()" name="bm-ch-resMan-storageConfigurations-cancel-cancel">取消</el-button>
            </div>

        </div>

        <!-- Schema dialog-->
        <el-dialog v-dialog-drag
                   :visible.sync="dialogDataSchemaVisible"
                   width="80%"
                   :close-on-click-modal="false"
                   :modal-append-to-body="false"
                   title="元数据查询"
                   custom-class="dialogClass"
        >
            <el-form class="elForm" id="bm-sh-sc-form">
                <schema-inquire @thisSelectSchemaVal="getSelectSchemaVal"></schema-inquire>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitSchemaData()"
                           name="bm-ch-resMan-storageConfigurations-submitSchemaData-ok">确定
                </el-button>
                <el-button @click="dialogDataSchemaVisible=false"
                           name="bm-ch-resMan-storageConfigurations-submitSchemaData-cancel">取消
                </el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    // 把秒转成 时分秒
    import {getSchema, postDataset, getDataset, putDataset, getSchemaVersion, getHistorySchema, getSchemalength} from '@api'
    import schemaInquire from '@components/schemaInq/schemaInquire.vue';
    import resIn from '@components/dataTree/resNav.js'
    import resInPro from '@rhinos/projectDir/dataTree/resNav.js'
    import preview from './preview'
    import { encrypt,decrypt } from '@components/encryption/aes.js'
    import { clusterAll } from "@/api/cluster/index.js";
    import {map} from "lodash";

    export default {
        components: {
            schemaInquire,
            preview
        },
        watch: {
            entity: {
                handler: function (newValue, oldValue) {
                    //预览entityNeo代替entity
                    this.entityNeo = JSON.parse(JSON.stringify(newValue))
                    if (this.entityNeo.storage == 'SFTP') {
                        this.formatData = [{name: 'CSV', value: 'csv'}, {name: 'txt', value: 'txt'}]
                    } else {
                        this.formatData = [{name: 'CSV', value: 'csv'}, {
                            name: 'parquet',
                            value: 'parquet'
                        }, {name: 'orc', value: 'orc'}, {name: 'txt', value: 'txt'}, {name: 'avro', value: 'avro'}]
                    }
                    if (this.entity.storageConfigurations.sourceFields) {
                        this.entityNeo.storageConfigurations.sourceFields = this.objectArrayToString(this.entity.storageConfigurations.sourceFields)
                        this.entityNeo.storageConfigurations.edgeFields = this.objectArrayToString(this.entity.storageConfigurations.edgeFields)
                        this.entityNeo.storageConfigurations.targetFields = this.objectArrayToString(this.entity.storageConfigurations.targetFields)
                    }
                    //将加密字段得数组转换成字符串
                    if (this.entity.storageConfigurations.encryptColumns) {
                        this.entityNeo.storageConfigurations.encryptColumns = this.entity.storageConfigurations.encryptColumns.join(',')
                    }
                },
                deep: true
            },
        },
        name: 'dataset',
        data() {
            return {
                optionsclusterId:[],
                encryptColumnsArray: [], // 存放加密字段列表的备选值
                fieldTypes: ["string", "byte", "short", "bigint", "int", "float", "double", "boolean", "date", "timestamp", "binary", "decimal"],
                columnsItems: 0,
                columnsColumns: "",
                isSingle: true,
                formatData: [{name: 'CSV', value: 'csv'}, {name: 'parquet', value: 'parquet'}, {
                    name: 'orc',
                    value: 'orc'
                }, {name: 'txt', value: 'txt'}, {name: 'avro', value: 'avro'}],
                //所有可选数据类型
                saveType: [
                    {name: "HDFS", value: "HDFS"},
                    {name: "HIVE", value: "HIVE"},
                    {name: "KAFKA", value: "KAFKA"},
                    {name: "FTP", value: "FTP"},
                    {name: "REDIS", value: "REDIS"},
                    {name: "HBASE", value: "HBASE"},
                    {name: "ElasticSearch", value: "ElasticSearch"},
                    {name: 'SearchOne', value: 'SearchOne'},  //增加该项
                    {name: 'Neo4j', value: 'Neo4j'},  //增加该项
                    {name: 'S3A', value: 'S3A'},  //增加该项
                    {name: 'SFTP', value: 'SFTP'}
                ],
                dialogDataSchemaVisible: false,
                getSelValDataSchema: {},
                formLabelWidth: "120px",
                isNew: true,
                loading: false,
                expiredPeriodUnit: '天',
                entity: {
                    "id": "",
                    "name": "",
                    "schema": {name: ''},
                    "storage": "HDFS",
                    "expiredPeriod": 0,
                    "storageConfigurations": {
                        
                    },
                    "sliceTime": "",
                    "sliceType": "H",
                    'owner': "",
                    'schemaVersion':'',
                    'clusterId':'',
                    'specialField':{}
                },
                expiredTimeSelect: '',           //过期时间单位选择 expiredTime 默认值
                exTimeVal: '',                   //过期时间单位 exTimeVal 默认值
                cpexpiredTimeVal: '',            //过期时间 cpexpiredTimeVal 默认值
                entityNeo: {},
                rules: {
                    name: [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'schemaVersion':[
                        {required:true,message:'请输入内容...',trigger:'change'}
                        ],
                    'schema.name': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'storageConfigurations.path': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'storageConfigurations.quoteChar': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'storageConfigurations.escapeChar': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'storageConfigurations.zookeeper': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'storageConfigurations.brokers': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'storageConfigurations.topic': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'storageConfigurations.groupId': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'storageConfigurations.version': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'storageConfigurations.namespace': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'storageConfigurations.columns': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'storageConfigurations.relativePath': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'storageConfigurations.clusterName': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'storageConfigurations.ipAddresses': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'storageConfigurations.index': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'storageConfigurations.indexType': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'storageConfigurations.url': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'storageConfigurations.separator': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'storageConfigurations.accessKey': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'storageConfigurations.secretKey': [
                        {required: true, message: '请输入内容...', trigger: 'change'}
                    ],
                    'expiredPeriod': [
                        {
                            validator(rule, value, callback) {
                                if (!/^[0-9]+$/.test(value)) {
                                    callback('过期时间必须为数字值....');
                                } else {
                                    callback();
                                }
                            }, trigger: 'change'
                        }
                    ],
                },
                currentPage: {
                    'sourceFields': 1,
                    'edgeFields': 1,
                    'targetFields': 1
                },
                pagesize: {
                    'sourceFields': 8,
                    'edgeFields': 8,
                    'targetFields': 8
                },
                getSelvalSchemaFields: [],
                historySchemaEntity: [], //存储schema的历史版本信息
                objectHistory:{},////存储schema的历史版本对象信息
                schemaEntity: {}, // schema 的版本显示的弹框
                specialFieldOption:[]
            }
        },
        methods: {
            //当选择的不是csc去掉加密的密钥和加密字段
            formatChange(){
                if(this.entity.storageConfigurations && this.entity.storageConfigurations.format != 'csv'){
                    this.entity.storageConfigurations.encryptColumns = []
                    this.entity.storageConfigurations.encryptKey = ''
                }
            },
            versionChange(callback, row){
                var that = this;
                // 列表下拉，发送请求查看history
                if (callback == true) {
                    that.objectHistory = {}
                    that.loading = true
                    //根据oid查看历史数据
                    getHistorySchema(row.schema.oid).then(res => {
                        that.loading = false;
                        that.historySchemaEntity = res
                        res.forEach(item=>{
                            that.objectHistory[item.version] = item
                        })
                    })
                }else{
                    //收回下拉菜单弹出文本框
                    this.schemaEntity = that.objectHistory[row.schemaVersion]
                    this.entity.schemaId = this.schemaEntity.id
                    this.entity.schema = this.schemaEntity
                    this.getSelvalSchemaFields = this.schemaEntity.fields;
                    this.encryptColumnsArray = [];
                    this.getSelvalSchemaFields.forEach((item) => {
                        if (item.type.toLowerCase().indexOf('string') > -1) {
                            this.encryptColumnsArray.push(item.name);
                        }
                    })
                }
            },
            // 没选中字段时候就提示
            selectFields() {
                if (this.$route.params.id == 'new') {
                    if (this.getSelvalSchemaFields.length == 0) {
                        this.$message({
                            message: '请先选择一条元数据！',
                            type: 'error'
                        })
                    }
                } else {
                    if (this.entity.schemaId && this.getSelvalSchemaFields.length == 0) {
                        this.loading = true
                        getSchema(this.entity.schemaId).then(res => {
                            this.loading = false
                            this.getSelvalSchemaFields = res.fields;
                            this.encryptColumnsArray = [];
                            this.getSelvalSchemaFields.forEach((item, i) => {
                                if (item.type.toLowerCase().indexOf('string') > -1) {
                                    this.encryptColumnsArray.push(item.name);
                                }
                            })
                        }, error => {
                            this.loading = false
                            this.$message({
                                type: 'error',
                                message: error.response.data.err
                            })
                        })
                    }
                }
            },
            // 目标字段分页-修改当前页数据条数
            handleSizeChange(val, type) {
                this.pagesize[type] = val;
            },
            // 目标字段分页-修改当前页数据页数
            handleCurrentChange(val, type) {
                this.currentPage[type] = val;
            },
            // 目标字段的行号
            indexMethod(index, type) {
                return (this.pagesize[type] * (this.currentPage[type] - 1)) + index + 1;
            },
            //字段 删除
            editFields(type, index, edit) {
                var field = edit == 'add' ? {
                    "name": "name_" + (this.entity.storageConfigurations[type].length * 1 + 1),
                    "value": ""
                } : undefined

                var i = edit == 'add' ?
                    (index != undefined ? ((this.currentPage[type] - 1) * this.pagesize[type]) + index : this.entity.storageConfigurations[type].length) :
                    ((this.currentPage[type] - 1) * this.pagesize[type]) + index
                this.entity.storageConfigurations[type] = this.arrayAddOrRemoreElement(this.entity.storageConfigurations[type], i, field)
            },
            // path 改变触发
            changePath(val) {
                //如果是dtp类型的数据,还要再生成path之前进行处理
                if (this.entity.storage == "FTP" && this.entity.storageConfigurations.relativePath) {
                    this.createFtpPath();
                }
            },
            //hive 的table和sql选一个校验
            validateSqlOrTable: function (rule, value, callback) {
                //如果是redis的类型必填，其他类型sql和table选一个即可
                if (this.entity.storageConfigurations.table === '' && this.entity.storageConfigurations.sql === '') {
                    callback(new Error('sql和table至少填写一个'));
                } else {
                    callback();
                }
            },
            //生成columns
            createColumns: function () {
                //无论是否有key都可以生成coloumns
                if (!this.entity.storageConfigurations.columnsKey) {
                    this.$message({
                        message: 'key值未填写',
                        type: 'error',
                        duration: 1500
                    });
                }
                //保证schema的id存在
                if (this.entity.schemaId) {
                    console.log(this.isSingle);
                    if (this.isSingle) {
                        this.loading = true;
                        getSchema(this.entity.schemaId).then((schemaEntity) => {
                            this.loading = false;
                            var fieldsTmp = schemaEntity.fields
                            var len = fieldsTmp.length;
                            //清空columns文本框内容
                            this.entity.storageConfigurations.columns = "";
                            //拼出带有字段的columns
                            var fields = []
                            for (var i = 0; i < len; i++) {
                                fields.push(fieldsTmp[i].name)
                                this.entity.storageConfigurations.columns += this.entity.storageConfigurations.columnsColumns + ':' + fieldsTmp[i].name + ','
                            }
                            //替换掉key值
                            if (this.entity.storageConfigurations.columnsKey) {
                                //判断schema字段中是否含有key
                                if (fields.indexOf(this.entity.storageConfigurations.columnsKey) == -1) {
                                    this.$message({
                                        message: 'schema字段中不存在key值！',
                                        type: 'error',
                                        duration: 1500
                                    });
                                }
                                //替换指定的key，将最后的逗号（，）去掉
                                let reg = new RegExp(this.entity.storageConfigurations.columnsColumns + ':' + this.entity.storageConfigurations.columnsKey + ',', 'g')
                                this.entity.storageConfigurations.columns = this.entity.storageConfigurations.columns.replace(reg, 'rowKey:key,')
                                this.entity.storageConfigurations.columns = this.entity.storageConfigurations.columns.substring(0, this.entity.storageConfigurations.columns.length - 1);
                            }
                        }, error => {
                            this.loading = false;
                            if (error.response.status == 500) {
                                _this.$message({
                                    message: error.response.data.err,
                                    type: 'error',
                                    duration: 1500
                                });
                            }
                        })
                    } else {
                        this.entity.storageConfigurations.columns = "";
                        let columnsStr = [];
                        let columnObjFirst = this.entity.storageConfigurations['columnsColumns'].split(":");
                        if (columnObjFirst[1]) {
                            let columnObjFirstVaule = columnObjFirst[1].split(",");
                            for (let j = 0; j < columnObjFirstVaule.length; j++) {
                                columnsStr.push(columnObjFirst[0] + ":" + columnObjFirstVaule[j]);
                            }
                        } else {
                            this.$message({
                                message: '列族格式错误，请按照column:value1,value2',
                                type: 'error',
                                duration: 1500
                            });
                        }

                        for (let i = 0; i < this.columnsItems; i++) {
                            let columnObj;
                            columnObj = this.entity.storageConfigurations['columnsColumns' + (i + 1)].split(":");
                            let columnObjKey = columnObj[0];//获取填写的key
                            if (columnObj[1]) {
                                let columnArrayValue = columnObj[1].split(",");
                                for (let j = 0; j < columnArrayValue.length; j++) {
                                    columnsStr.push(columnObjKey + ":" + columnArrayValue[j]);
                                }
                            } else {
                                this.$message({
                                    message: '列族格式错误，请按照column:value1,value2',
                                    type: 'error',
                                    duration: 1500
                                });
                            }
                        }
                        this.entity.storageConfigurations.columns = "rowKey:" + this.entity.storageConfigurations.columnsKey + "," + columnsStr.join(",");
                    }
                } else {
                    this.$message({
                        message: '请先选择schema！',
                        type: 'error',
                        duration: 1500
                    });
                }
            },
            // 初始化数据集
            initDataset: function () {
                //清除hdfs的验证
                if (this.entity.storage != 'HDFS' && this.entity.storageConfigurations.hdfsPath) this.$refs['hdfsPath'].clearValidate()
                var storage = this.entity.storage
                //根据type选取dict的字段更新结构
                this.entity.storageConfigurations = Object.assign({}, this.dict[storage].storageConfigurations)
                this.filterExpiredTime()
                //如果有绝对路径就要替代path
                if (this.entity.storageConfigurations.relativePath)
                    this.entity.storageConfigurations.path = this.entity.storageConfigurations.relativePath;
            },
            //弹出"dataSchema查询"层
            dataSchemaInquire: function () {
                this.dialogDataSchemaVisible = true;
            },
            //添加多列族input
            editColumns(type) {
                this.columnsItems = type == 'remove' ? this.columnsItems - 1 : this.columnsItems + 1;
            },
            expiredTimeValue: function (val) {
                let exSel = this.expiredTimeSelect;
                this.exTimeVal = val;
                if (exSel == 's') {
                    this.cpexpiredTimeVal = val;
                } else if (exSel == 'm') {
                    this.cpexpiredTimeVal = val * 60
                } else if (exSel == 'h') {
                    this.cpexpiredTimeVal = val * 3600
                } else if (exSel == 'd') {
                    this.cpexpiredTimeVal = val * 86400
                }
                this.entity.expiredPeriod = this.cpexpiredTimeVal;
            },
            expiredTimeSelVal: function (val) {
                let nexVal = this.exTimeVal;
                let nexSelVal = ""
                if (val == 's') {
                    nexSelVal = nexVal;
                } else if (val == 'm') {
                    nexSelVal = nexVal * 60
                } else if (val == 'h') {
                    nexSelVal = nexVal * 3600
                } else if (val == 'd') {
                    nexSelVal = nexVal * 86400
                }
                this.cpexpiredTimeVal = nexSelVal;
                this.entity.expiredPeriod = this.cpexpiredTimeVal;
            },
            //过滤类型为SINK内expiredTime的时间值
            filterExpiredTime: function () {
                let eTimeVal = this.entity.expiredPeriod;
                let nexVal = '';
                if (60 > eTimeVal && eTimeVal > -1) {
                    nexVal = eTimeVal
                    this.exTimeVal = nexVal;
                    this.expiredTimeSelect = "s"
                } else if (59 < eTimeVal && eTimeVal < 3600) {
                    nexVal = eTimeVal / 60
                    this.exTimeVal = nexVal;
                    this.expiredTimeSelect = "m"
                } else if (86400 > eTimeVal && eTimeVal > -3599) {
                    nexVal = eTimeVal / 3600
                    this.exTimeVal = nexVal;
                    this.expiredTimeSelect = "h"
                } else if (eTimeVal > 86399) {
                    nexVal = eTimeVal / 86400
                    this.exTimeVal = nexVal;
                    this.expiredTimeSelect = "d"
                } else {
                    this.exTimeVal = 0;
                    this.expiredTimeSelect = "d"
                }
            },
            //编辑添加数据源
            init: function (entity) {
                this.entity.id = this.$route.params.id
                this.isNew = false;
                this.loading = true
                //获取dataset的entity
                getDataset(this.entity.id).then(res => {
                    this.loading = false
                    this.entity = Object.assign({}, this.entity, res)
                    this.entity.schema = res.schema;
                    this.entity.clusterId=res.storageConfigurations.clusterId;
                    this.filterExpiredTime();
                    this.filterSpecialField(res.schema.fields)
                    
                    if (this.entity.storageConfigurations) {
                        /*兼容旧版本
                         如果旧版本存值是true，值为递归匹配
                         如果值为false，值为精确匹配
                         */
                        this.isSingle = eval(this.entity.storageConfigurations.isSingle);
                        if (typeof this.isSingle === "undefined") {
                            this.isSingle = true;
                        }
                        this.columnsColumns = this.entity.storageConfigurations.columnsColumns;
                        this.columnsItems = eval(this.entity.storageConfigurations.columnsItems);
                        if (!this.columnsItems) {
                            this.columnsItems = 0;
                        }
                        if (this.entity.storageConfigurations.pathMode == undefined) {
                            if (this.entity.storageConfigurations.recursive == 'true') {
                                this.$set(this.entity.storageConfigurations, 'pathMode', 'recursive')
                            } else {
                                this.$set(this.entity.storageConfigurations, 'pathMode', 'exact')
                            }
                        }
                        delete this.entity.storageConfigurations.recursive
                        if (this.entity.storage == 'Neo4j') {
                            this.entity.storageConfigurations.sourceFields = this.stringToObjectArray(this.entity.storageConfigurations.sourceFields)
                            this.entity.storageConfigurations.edgeFields = this.stringToObjectArray(this.entity.storageConfigurations.edgeFields)
                            this.entity.storageConfigurations.targetFields = this.stringToObjectArray(this.entity.storageConfigurations.targetFields)
                        }
                        this.entity.storageConfigurations.encryptColumns = this.entity.storageConfigurations.encryptColumns ? this.entity.storageConfigurations.encryptColumns.split(',') : this.$set(this.entity.storageConfigurations, 'encryptColumns', [])//将获取的字符串转换成数组
                        this.entity.storageConfigurations.encryptKey = this.entity.storageConfigurations.encryptKey ? this.entity.storageConfigurations.encryptKey : this.$set(this.entity.storageConfigurations, 'encryptKey', '')//将获取的字符串转换成数组
                    }
                    if (this.entity.storage != 'HDFS') this.$refs['hdfsPath'].clearValidate()
                    //获取schema字段
                    if (this.entity.schemaId && this.getSelvalSchemaFields.length == 0) {
                        this.loading = true
                        getSchema(this.entity.schemaId).then(res => {
                            this.loading = false
                            this.getSelvalSchemaFields = res.fields;
                            this.entity.schemaVersion = res.version
                            this.encryptColumnsArray = [];
                            this.getSelvalSchemaFields.forEach((item, i) => {
                                if (item.type.toLowerCase().indexOf('string') > -1) {
                                    this.encryptColumnsArray.push(item.name);
                                }
                            })
                            getSchemalength(this.oid).then(resData=>{
                                this.versionData=[]
                                resData.forEach(item=>{
                                   this.versionData.push(item.version)
                                })
                            },error=>{

                            })
                        }, error => {
                            this.loading = false
                            this.$message({
                                type: 'error',
                                message: error.response.data.err
                            })
                        })
                    }
                    if(typeof res.specialField!='undefined'){
                         this.entity.specialField = res.specialField.name
                    }
                   
                }, err => {
                    this.loading = false
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                })
                this.initDataset();
            },
            filterSpecialField(val){
                this.specialFieldOption = (val).filter((item,index)=>{
                        return item.type == 'short'|| item.type == 'bigint'||item.type=='int'||item.type =='float' ||item.type == 'double'||
                        item.type == 'date'||item.type=='timestamp'
                    })
                this.specialFieldOption.push({type:'',name:''})
            },
            //选择单列族或者多列族
            selectdColumn(k) {
                this.entity.storageConfigurations.columns = "";
                if (k == 0) {
                    this.isSingle = true;
                    this.columnsItems = 0;
                    this.entity.storageConfigurations.isSingle = true;
                    this.entity.storageConfigurations.columnsColumns = this.columnsColumns;

                } else {
                    this.columnsItems = eval(this.entity.storageConfigurations.columnsItems);
                    if (!this.columnsItems) {
                        this.columnsItems = 0;
                    }
                    this.isSingle = false;
                    this.entity.storageConfigurations.isSingle = false;
                    this.entity.storageConfigurations.columnsColumns = this.columnsColumns;
                }
            },
            //获取子组件的DateSchema  entity
            getSelectSchemaVal(data) {
                this.getSelValDataSchema = data;
                this.filterSpecialField(data.fields)
            },
            //Schema查询数据提交
            submitSchemaData: function () {
                if (this.getSelValDataSchema === '') {
                    this.$message({
                        message: '请选择一条数据！',
                        type: 'error'
                    });
                    return false;
                } else {//更改version替换当前的schema信息
                    this.entity.schemaId = this.getSelValDataSchema.id
                    this.entity.schema = this.getSelValDataSchema
                    this.getSelvalSchemaFields = this.getSelValDataSchema.fields;
                    this.entity.schemaVersion = this.getSelValDataSchema.version
                    this.oid = this.getSelValDataSchema.oid
                    this.encryptColumnsArray = [];
                    this.getSelvalSchemaFields.forEach((item, i) => {
                        if (item.type.toLowerCase().indexOf('string') > -1) {
                            this.encryptColumnsArray.push(item.name);
                        }
                    })
                    this.dialogDataSchemaVisible = false;
                }
            },
            //ftp数据集的path生成
            createFtpPath: function () {
                //如果是ftp类型将path修改 user:password@path
                var str = this.entity.storageConfigurations['relativePath'];
                if (str.startsWith("ftp://")) {
                    var path = str.substr(6);
                    var auth = (this.entity.storageConfigurations.user != null &&
                        this.entity.storageConfigurations.user.trim() != ''
                    ) ?
                        (this.entity.storageConfigurations.user + ":" + this.entity.storageConfigurations.password) + "@" : "";
                    // this.entity.storageConfigurations.path = "ftp://" + auth + path;
                    this.entity.storageConfigurations.path = "ftp://" + path;
                } else {
                    this.$confirm("path，要以'ftp://'开头", "错误", {
                        type: "error"
                    })
                    return false;
                }
            },
            cancel: function () {
                //根据创建者为SYSTEM，判断是output类型dataset，在取消时刷新resourceman列表
                var resType = 'dataset'
                if (this.entity.creator == "SYSTEM")
                    resType = 'output_dataset'
                var urlTrue = window.location.href.indexOf('/project') > -1;
                if (urlTrue === true) {
                    resInPro.$emit('refreshList', false, resType);
                } else {
                    this.$router.push('/resourceMan')
                    resIn.$emit('refreshList', false, resType);
                }
            },
            //将字符串转换成对象数组
            stringToObjectArray(str) {
                var arr = []
                var arrMap = []
                arrMap = str.split(',')
                for (var i = 0; i < arrMap.length; i++) {
                    var map = [];
                    map = arrMap[i].split(":")
                    arr.push({name: map[0], value: map[1]})
                }
                return arr
            },
            //将对象数组转换成字符串
            objectArrayToString(arr) {
                var str = ''
                for (var i = 0; i < arr.length; i++) {
                    str += arr[i].name + ':' + arr[i].value + ','
                }
                return str.substring(0, str.length - 1)
            },
            //确定回调
            save: function () {
                this.$refs.entity.validate((valid) => {
                    console.log('entity',this.entity);
                    if (valid) {
                        var entity = JSON.parse(JSON.stringify(this.entity))
                        if (this.entity.storage != "FTP" && this.entity.storageConfigurations.path) {
                            this.entity.storageConfigurations.relativePath = this.entity.storageConfigurations.path;
                        }
                        //如果是ftp类型将path修改 user:password@path
                        if ((this.entity.storage == "FTP" || this.entity.storage == "SFTP") && this.entity.storageConfigurations.relativePath) {
                            this.createFtpPath();
                        }
                        //去掉tablename字段
                        if (this.entity.tableName)
                            delete this.entity.tableName;
                        // 将数组转换成字符串
                        var entity = JSON.parse(JSON.stringify(this.entity))
                        if (this.entity.storageConfigurations.sourceFields) {
                            entity.storageConfigurations.sourceFields = this.objectArrayToString(this.entity.storageConfigurations.sourceFields)
                            entity.storageConfigurations.edgeFields = this.objectArrayToString(this.entity.storageConfigurations.edgeFields)
                            entity.storageConfigurations.targetFields = this.objectArrayToString(this.entity.storageConfigurations.targetFields)
                        }
                        if (this.entity.storageConfigurations.encryptColumns) {
                            entity.storageConfigurations.encryptColumns = entity.storageConfigurations.encryptColumns.join(',')
                        }

                        if(entity.storageConfigurations.password){
                            entity.storageConfigurations.password = encrypt(entity.storageConfigurations.password)?entity.storageConfigurations.password: encrypt(entity.storageConfigurations.password)
                        }
                        if(entity.clusterId){
                            //addOrEditDataset.storageConfigurations.clusterId=addOrEditDataset.clusterId;
                            // entity.storageConfigurations={...entity.storageConfigurations,clusterId:entity.clusterId}
                            entity.storageConfigurations.clusterId = entity.clusterId
                            delete entity.clusterId;
                        }
                        if(entity.specialField){
                            let specialArr = this.specialFieldOption.filter((item,index)=>{
                                return item.name ==entity.specialField
                            })
                            entity.specialField = specialArr[0]
                        }
                        var addOrEditDataset = this.isNew ? postDataset(entity) : putDataset(entity.id, entity);

                        //提交 HTTP datasource
                        addOrEditDataset.then(addOrEditDataset => {
                            var resType = 'dataset'
                            if (this.entity.creator == "SYSTEM")
                                resType = 'output_dataset'
                            //提交之后获取列
                            var urlTrue = window.location.href.indexOf('/project') > -1;
                            if (urlTrue === true) {
                                this.$router.push({path: '/resourceManProject'});
                                resInPro.$emit('refreshList', false, resType);
                            } else {
                                this.$router.push({path: '/resourceMan'});
                                resIn.$emit('refreshList', false, resType);
                            }
                        }, error => {
                            var err = error.response.data.err
                            if (err && err.indexOf('Duplicate') > -1)
                                err = '保存失败，此名称已存在'
                            this.$message({
                                message: err,
                                type: 'error',
                                duration: 1500
                            });
                        })
                    } else {
                        return false;
                    }
                })
            }
        },
        mounted() {
            // 调用dataset的页面
            if (this.$route.params.id == 'new') {
                //选择schema的弹出框
                this.$emit('dataset', this.entity);
                var urlTrue = window.location.href.indexOf('/project') > -1;
                if (urlTrue === true) {
                    var data = {projectEntity: {id: this.$route.params.projectId}}
                } else {
                    var data = {resource: {id: this.$route.params.parentId}}
                }
                this.entity = Object.assign({}, this.entity, data)
                this.selectedNode = this.$route.params.node
                this.entity.owner = this.selectedNode ? this.selectedNode.owner : ''
                this.initDataset()
            } else this.init();

            clusterAll().then(res=>{
                this.optionsclusterId=map(res.data,item=>{
                    return{
                        label:item.name,
                        value:item.name
                    }
                })
                this.optionsclusterId.push({label:'',value:''})
            });
        }
    }
</script>

<style lang="scss" scoped>
    .main-content-form {

        .left-form {
            float: left;
            width: 550px;
            height: 100%;
            overflow-y: auto;
        }

        .right-form {
            float: right;
            width: calc(100vw - 850px);
            min-width: 300px;
        }
    }

    .btn-left {
        float: left;

        h4 {
            margin: 10px 0px 0px 10px;
        }
    }

    #classGrop .inputClassGrop {
        width: 117px;
    }

    .elForm {
        float: left;
        width: 100%;
        height: 100%;
        padding: 0px 20px 0px 20px;
        box-sizing: border-box;
    }

    .input-form {
        width: 350px;
    }

    .el-form {
        .el-input {
            width: 350px;
        }
    }

    .button-create-columns {
        float: right;
    }

    .select-form-width {
        width: 350px;
    }

    .input-form-width {
        width: 350px;
    }

    .input-expired-period {
        width: 225px;
    }

    .button-expired-period {
        width: 120px;
    }

    .input-with-select {
        width: 80px;
    }

    .selectFormWidth {
        width: 350px;
    }
    .advanced-options {
        width: 100%;
        color: #3e98fe;
        margin: 0px;
        height: 40px;
        line-height: 40px;
    }
</style>
