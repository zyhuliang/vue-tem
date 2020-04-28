<template>
    <div id="jsplumbBox" class="btnClass">
        <div class="btn-right">
            <el-button type="info" id='bm-ch-resMan-analysis-create-button' plain v-on:click="buildSchemas()"><i
                    class="icon iconfont icon-ir-add iconStyle"></i>新建
            </el-button>
            <el-button type="info" id='bm-ch-resMan-analysis-save-button' plain v-on:click="save()"><i
                    class="icon iconfont icon-ir-save"></i>保存
            </el-button>
            <!-- <el-button type="info" id='bm-ch-resMan-analysis-create-button' plain v-on:click="buildSchemas()" :disabled="!($route.query.id)"><i class="icon iconfont icon-ir-add iconStyle"></i>新建</el-button> -->
            <!-- <el-button type="info" id='bm-ch-resMan-analysis-save-button' plain v-on:click="save()" :disabled="!($route.query.id)"><i class="icon iconfont icon-ir-save"></i>保存</el-button> -->
        </div>

        <div id="canvas">
            <div class="canvasBox">
                <div class="listPlumb"
                     :id="item.id"
                     v-for="(item,i) in dataset.nodes"
                     :key="i"
                     v-bind:style="{left: item.x +'px', top: item.y  +'px'}"
                >
                    <h3>
                        <span class="delete" v-on:click="deleteSchemas(item.id, i, item.name)"><i
                                class="el-icon-close"></i></span>
                        <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
                            <b class="name">{{item.name}}</b>
                        </el-tooltip>
                        <span>
            <i class="el-icon-edit" v-on:click="editSchemasTitle(item.name, i)">
            </i><i class="el-icon-plus" v-on:click="editField(undefined,i)"></i>
          </span>

                    </h3>
                    <ul>
                        <li
                                v-for="(column, j) in item.columns"
                                :key="j"
                                :type="column.datatype"
                                :style="{background: column.primaryKey === true ? '#2a4b6a': ''}"
                                :id="column.nodeId">
                            <span class="delete"><i class="el-icon-close"
                                                    v-on:click="deleteSchemas(column.nodeId, i, j, column.id)"></i></span>
                            <b>{{column.id}}</b>
                            <span class="liEdit"> {{column.datatype}}<i class="el-icon-edit "
                                                                        v-on:click="editField(column.id, i, j)"> </i> </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- 点击连线之后的弹框处理 -->
        <el-dialog v-dialog-drag
                   title="编辑字段"
                   :visible.sync="relationshipDialog"
                   width="30%">
            <p>编辑关系</p>
            <el-radio-group v-model="relationship">
                <el-radio :label="1">1 ： 1</el-radio>
                <el-radio :label="2">1 ： N</el-radio>
                <el-radio :label="3">N ： M</el-radio>
            </el-radio-group>
            <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="relationshipConfirm"
                 name="bm-ch-resMan-analysis-relationshipConfirm-ok">确定</el-button>
      <el-button @click="relationshipCancel" name="bm-ch-resMan-analysis-relationshipCancel-cancel">取消</el-button>
    </span>
        </el-dialog>

        <!-- 点击连线之后的弹框处理 -->
        <el-dialog v-dialog-drag
                   title="提示"
                   :visible.sync="fieldDialog"
                   width="50%">
            <el-form id="bm-ch-resourceMan-analysis-form" ref="form" :model="fieldForm" label-width="80px">
                <el-form-item label="主键">
                    <el-input name="bm-ch-resourceMan-analysis-id-input" v-model="fieldForm.id"
                              placeholder="请输入id"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-checkbox name="bm-ch-resourceMan-analysis-checkedKey-checkedKey" label="Primary Key"
                                 v-model="fieldForm.checkedKey"></el-checkbox>
                </el-form-item>
                <el-form-item label="dataType">
                    <el-select name="bm-ch-resourceMan-analysis-datatype-select" v-model="fieldForm.datatype">
                        <el-option
                                v-for="item in fieldFormDatatype"
                                :key="item.value"
                                :label="item.label"
                                :name="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                        </el-option>
                    </el-select>
                    <!-- 类型为 decimal 的单独处理-->
                    <span v-if="fieldForm.datatype === 'decimal'">
            <el-select
                    @change="decimalChange('wholePlaceHolder')"
                    v-model="wholePlaceHolder"
                    class='selects-para'>
              <el-option v-for="(a,key) in allowArray()"
                         :key="key"
                         :name="key"
                         :value="a">{{a}}
              </el-option>
            </el-select>
            <el-select
                    @change="decimalChange('fractionPlaceHolder')"
                    v-model="fractionPlaceHolder"
                    style="margin-right: 5px;"
                    class='selects-para'>
              <el-option v-for="(a,key) in allowArray()"
                         :key="key"
                         :name="key"
                         :value="a">{{a}}
              </el-option>
            </el-select>
        </span>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="fieldConfirm" name="bm-ch-resMan-analysis-fieldConfirm-ok">确定</el-button>
      <el-button @click="fieldCancel" name="bm-ch-resMan-analysis-fieldCancel-cancel">取消</el-button>
    </span>
        </el-dialog>
        <!-- 元数据存放位置树-->
        <el-dialog v-dialog-drag
                   :visible.sync="dialogSchemaTreeVisible"
                   width="50%"
                   :close-on-click-modal="false" :modal-append-to-body="false"
                   title="选择元数据分析的存放位置"
                   custom-class="dialogClass"
        >
            <el-form class="dt-content" id="bm-sh-r-data-db3-form">
                <schema-tree ref="schematree"></schema-tree>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitSchemaTree()"
                           name="bm-ch-resMan-dbdataset-submitSchemaTree-schema-ok">确定
                </el-button>
                <el-button @click="dialogSchemaTreeVisible=false"
                           name="bm-ch-resMan-dbdataset-submitSchemaTree-schema-cancel">取消
                </el-button>
            </div>
        </el-dialog>
    </div>

</template>
<script>
    import zoom from '@static/jsLibrary/jsPlumbLine/zoom.js'
    import drag from '@static/jsLibrary/jsPlumbLine/drag.js'
    // import '@static/jsLibrary/jsPlumbLine/jsplumb.min.js'
    import {
        appointElement
    } from '@static/jsLibrary/jsPlumbLine/util.js'
    import {queryObject, createParameter} from '@components/function/queryParameter.js';
    import {analysisPost, qaassist} from '@api';
    import schemaTree from '@components/schemaTree/schemaTree.vue';

    export default {
        components: {
            schemaTree
        },
        data() {
            return {
                dialogSchemaTreeVisible: false,//元数据树的弹框显示隐藏
                wholePlaceHolder: '总长度',
                fractionPlaceHolder: "小数长度",
                fieldFormDatatype: [
                    {
                        value: "string",
                        label: "string"
                    },
                    {
                        value: "byte",
                        label: "byte"
                    },
                    {
                        value: "short",
                        label: "short"
                    },
                    {
                        value: "int",
                        label: "int"
                    },
                    {
                        value: "float",
                        label: "float"
                    },
                    {
                        value: "double",
                        label: "double"
                    },
                    {
                        value: "boolean",
                        label: "boolean"
                    },
                    {
                        value: "timestamp",
                        label: "timestamp"
                    },
                    {
                        value: "binary",
                        label: "binary"
                    },
                    {
                        value: "decimal",
                        label: "decimal"
                    },
                    {
                        value: "date",
                        label: "date"
                    },
                    {
                        value: "bigint",
                        label: "bigint"
                    }
                ],
                dataset: {
                    nodes: [],
                    edges: []
                },
                instance: {},
                closeId: [],
                size: 1.0,
                parameter: {},
                relationshipDialog: false,
                relationship: 1,
                connInfo: {}, // 连线的对象
                fieldDialog: false,
                field: "",
                fieldForm: {
                    id: "",
                    datatype: "string",
                    checkedKey: false
                },
                argument: [], //保存 field 的参数
                position: undefined, //初始化定位位置
                overlay: [
                    [
                        "Custom",
                        {
                            create: function (component) {
                                return $("<span><i class='el-icon-close close'></i></span>");
                            },
                            location: 0.5,
                            id: "customOverlay"
                        }
                    ],
                    [
                        "Label",
                        {label: "1", id: "label-1", cssClass: "aLabel", location: 0.15}
                    ],
                    [
                        "Label",
                        {label: "1", id: "label-2", cssClass: "aLabel", location: 0.85}
                    ]
                ],
                common: {
                    Endpoint: ["Dot", {radius: 5}],
                    Connector: "StateMachine",
                    HoverPaintStyle: {stroke: "#a92929", strokeWidth: 3},
                    endpointHoverStyles: {fillStyle: "#f35958"},
                    anchor: ["Left", "Right"],
                    paintStyle: {stroke: "#f35958", strokeWidth: 2},
                    endpointStyle: {fill: "#f35958"},
                    connectorStyle: {
                        stroke: "#f35958",
                        strokeWidth: 2,
                        outlineStroke: "transparent",
                        outlineWidth: 4
                    },
                    connectionType: "basic",
                    isSource: true,
                    isTarget: true,
                }
            };
        },
        created() {
            if (!this.$route.query.id) {
                this.$nextTick(() => {
                    this.init();
                })
                return
            }
            const analysisId = JSON.parse(this.$route.query.id);
            // 根据 ids 判断有没有勾选
            if (analysisId.ids) {
                this.parameter = createParameter("parentId", analysisId.parentId, "EQUAL").Build();
                this.parameter = createParameter("ids", analysisId.ids, "EQUAL").Build(this.parameter);
            } else {
                this.parameter = createParameter("parentId", analysisId.parentId, "EQUAL").Build();
            }
            analysisPost(this.parameter).then(
                data => {
                    this.dataset = data;
                    this.$nextTick(() => {
                        this.init();
                        if (!this.dataset.nodes.length) {
                            return;
                        }
                        // 判断是不是第一次请求接口, 第一次数据， x = 0, y = 0
                        if (!this.dataset.nodes[0].x && !this.dataset.nodes[0].y) {
                            this.position = this.positionRandom();
                            for (let i = 0; i < this.dataset.nodes.length; i++) {
                                this.dataset.nodes[i].x = this.position[i].x;
                                this.dataset.nodes[i].y = this.position[i].y;
                            }
                        }
                    });
                },
                error => {
                    if (error.response.status == 500) {
                        _this.$message({
                            message: error.response.data.err,
                            type: 'error',
                            duration: 1500
                        });
                    }
                }
            );
        },
        mounted() {
        },
        methods: {
            // 总长度 和 小数长度 比大小
            decimalChange(type) {
                if (type === 'fractionPlaceHolder') {
                    if (this.wholePlaceHolder < this.fractionPlaceHolder) {
                        this.wholePlaceHolder = this.fractionPlaceHolder
                    }
                } else {
                    if (this.wholePlaceHolder < this.fractionPlaceHolder) {
                        this.fractionPlaceHolder = this.wholePlaceHolder
                    }
                }
            },
            allowArray: function () {
                var a = [];
                for (var i = 0; i < 39; i++) {
                    a.push(i)
                }
                return a;
            },
            init() {
                jsPlumb.ready(() => {
                    jsPlumb.setContainer("canvas");
                    this.instance = jsPlumb.getInstance({
                        Container: "canvas"
                    });
                    this.instance.batch(() => {
                        this.instance.registerConnectionType("basic", {
                            anchor: ["Left", "Right"],
                            connector: "StateMachine"
                        });
                        let canvas = this.instance.getSelector(".canvas");
                        // 进行拖拽
                        this.instance.draggable(canvas);
                        // 给每个 schemas 添加拖拽功能
                        this.draggables();
                        // 给每个nodes 注册连线操作
                        this.nodesConnection();
                        // 默认连线
                        this.defaultConenction();

                        // 连线成功处理
                        this.connectionSuccess();
                    });
                    // 注册 关闭连线按钮事件
                    this.closeConnection();
                    let nodeId = document.getElementById("canvas");

                    drag(nodeId);
                    zoom(nodeId, size => {
                        this.size = size;
                        this.instance.setZoom(size);
                    });
                    this.instance.fire("jsPlumbDemoLoaded", this.instance);
                });
            },
            //  给每个schemas 添加拖拽功能
            draggables() {
                let listPlumb = this.instance.getSelector(".listPlumb");
                // 进行拖拽
                this.instance.draggable(listPlumb);
            },
            //  随机定位
            positionRandom() {
                if (!this.dataset.nodes.length) {
                    return;
                }
                let position = [];
                for (let i = 0; i < this.dataset.nodes.length; i++) {
                    let x = Math.floor(Math.random() * 1000) + 100;
                    let y = Math.floor(Math.random() * 600) + 100;
                    position.push({
                        x: x,
                        y: y
                    });
                }
                return position;
            },
            //  连线处理
            connectionSuccess() {
                this.instance.bind("connection", connInfo => {
                    // 不能连接自己和类型不一样不能连接
                    // decimal 类型特殊处理
                    let sourceType = connInfo.source.type // 默认值
                    let targetType = connInfo.target.type // 默认值
                    let sourceIndex = connInfo.source.type.indexOf('(')
                    let targetIndex = connInfo.target.type.indexOf('(')
                    if (sourceIndex > -1) {
                        sourceType = connInfo.source.type.substr(0, sourceIndex - 1)
                    }
                    if (targetIndex > -1) {
                        targetType = connInfo.target.type.substr(0, targetIndex - 1)
                    }
                    if (
                        connInfo.connection.sourceId === connInfo.connection.targetId ||
                        sourceType !== targetType) {
                        // 删除连线
                        this.instance.detach(connInfo.connection);
                    } else {
                        this.connInfo = connInfo;
                        this.relationshipDialog = true;
                    }
                });
            },
            // 连线点击确定按钮
            relationshipConfirm() {
                this.relationshipDialog = false;
                let sourceLabel = 1;
                let targetLabel = 1;
                if (this.relationship == 2) {
                    sourceLabel = 1;
                    targetLabel = "N";
                } else if (this.relationship == 3) {
                    sourceLabel = "N";
                    targetLabel = "M";
                }
                // 连线成功之后重新添加 closeId 的 个数
                this.connInfo.connection.getOverlay("label-1").setLabel(`${sourceLabel}`);
                this.connInfo.connection.getOverlay("label-2").setLabel(`${targetLabel}`);
                this.closeConnection();
                // 添加链接数据
                this.dataset.edges.push({
                    source: this.connInfo.sourceId,
                    target: this.connInfo.targetId,
                    schemaSourceId: this.connInfo.source.offsetParent.id,
                    schemaTargetId: this.connInfo.target.offsetParent.id,
                    data: {
                        type: `${sourceLabel}:${targetLabel}`
                    }
                });
            },
            // 连线取消按钮
            relationshipCancel() {
                this.relationshipDialog = false;
                this.instance.detach(this.connInfo.connection);
            },
            // 点击连线中间的关闭按钮
            closeConnection() {
                this.closeId = jsPlumb.getSelector(".close");
                if (this.closeId.length === 0) {
                    return;
                }
                for (let i = 0; i < this.closeId.length; i++) {
                    // 以下使用 箭头函数 防止 this 的指向改变
                    this.closeId[i].onclick = () => {
                        this.instance.bind("click", c => {
                            // 删除连线
                            this.instance.detach(c);
                            // 删除数据
                            appointElement(
                                {
                                    source: c.sourceId,
                                    target: c.targetId
                                },
                                this.dataset.edges
                            );
                            // 解除绑定事件
                            this.instance.unbind("click");
                            // 删除连线之后需要从新获取 closeId 的长度
                        });
                    };
                }
            },
            nodesConnectionDefaultConfig(nodeId) {
                // 所有节点创建 source
                this.instance.makeSource(nodeId, {
                    filter: ":not(b)",
                    filterExclude: true,
                    connectorOverlays: this.overlay,
                    extract: {
                        action: "the-action"
                    }
                }, this.common);
                // 所有节点创建 target
                this.instance.makeTarget(nodeId, {
                    dropOptions: {hoverClass: "dragHover"},
                    allowLoopback: true,
                }, this.common);
            },
            // 给所有的 nodes 添加连线功能 source target
            nodesConnection() {
                if (this.dataset.nodes == []) {
                    return;
                }
                this.dataset.nodes.forEach(item => {
                    if (item.columns) {
                        item.columns.forEach(column => {
                            this.nodesConnectionDefaultConfig(column.nodeId);
                        });
                    }
                });
            },
            // 默认连线
            defaultConenction() {
                if (this.dataset.edges === []) {
                    return;
                }
                this.dataset.edges.forEach(item => {
                    // 连线成功之后重新添加 closeId 的 个数
                    let connection = this.instance.connect({
                        source: item.source,
                        target: item.target,
                        overlays: this.overlay,
                    }, this.common);
                    let type = item.data.type.split(":");
                    if (connection) {
                        connection.getOverlay("label-1").setLabel(`${type[0]}`);
                        connection.getOverlay("label-2").setLabel(`${type[1]}`);
                    }
                });
            },
            // 删除 表 或者 字段
            // 如果删除的是表 需要三个参数， 需要删除  id  , 位置， i, 删除的名字  name
            // 如果删除的是字段， 需要四个参数， 需要删除的id, 表的位置 i, 字段位置 j 删除的名字 i
            deleteSchemas(id, i, j, name) {
                if (!name) {
                    name = j
                }
                this.$confirm(`是否删除${name}?`, "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.schemas(id, i, j, name);
                        // 删除节点以及和节点相关的连线
                        this.instance.remove(id);
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消删除"
                        });
                    });
            },
            // 根据第 name 判断是否是 表或者字段
            schemas(id, i, j, name) {
                // 如果name 是 undefined 是删除表， 否则 删除字段
                if (name == j) {
                    // 表
                    this.dataset.nodes[i].status = "delete";
                    this.deleteObject(id, this.dataset.edges, "schemaSourceId");
                    this.deleteObject(id, this.dataset.edges, "schemaTargetId");
                } else {
                    this.dataset.nodes[i].columns[j].status = "delete";
                    this.deleteObject(id, this.dataset.edges, "source");
                }
            },

            // 编辑表的名称
            editSchemasTitle(name, index) {
                this.$prompt(`修改表名：  ${name}`, "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消"
                })
                    .then(({value}) => {
                        let node = this.dataset.nodes[index];
                        node.name = value;
                        if (node.status === "insert") {
                            node.status = "insert";
                        } else {
                            node.oid = name;
                            node.status = "update";
                        }
                        this.$message({
                            type: "success",
                            message: "修改成功"
                        });
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "取消修改"
                        });
                    });
            },
            // 添加字段 确认按钮
            fieldCancel() {
                this.fieldDialog = false;
            },
            fieldConfirm() {
                this.fieldDialog = false;
                // 如果columns 不存在要等于 空数， 容错处理
                if (!this.dataset.nodes[this.argument.i].columns) {
                    this.dataset.nodes[this.argument.i].columns = [];
                }
                // 根据参数判断是 添加，还是修改
                if (this.argument.id == undefined) {
                    // 添加之前判断是否存在
                    if (this.isExist(this.fieldForm.id, this.dataset.nodes[this.argument.i].columns, "id")) {
                        // 新建的字段的 nodeId 名 规则， nodes 的 name 属性加 输入的id
                        var nodeId = this.dataset.nodes[this.argument.i].name + "." + this.fieldForm.id;
                        this.dataset.nodes[this.argument.i].columns.push({
                            id: this.fieldForm.id,
                            datatype: this.fieldForm.datatype === 'decimal' ? `decimal(${this.wholePlaceHolder},${this.fractionPlaceHolder})` : this.fieldForm.datatype,
                            nodeId: nodeId,
                            primaryKey: this.fieldForm.checkedKey,
                            status: "add"
                        });
                        // 添加节点成功之后，添加 连线功能 source target
                        this.$nextTick(() => {
                            this.nodesConnectionDefaultConfig(nodeId);
                        });
                    } else {
                        this.$message({
                            type: "success",
                            message: this.fieldForm.id + "已存在"
                        });
                    }
                } else {
                    // 修改的时候把点击的显示， 在点确定按钮的时候保存
                    let column = this.dataset.nodes[this.argument.i].columns[this.argument.index];
                    let oid = column.id;
                    column.id = this.fieldForm.id;
                    column.datatype = this.fieldForm.datatype;
                    column.primaryKey = this.fieldForm.checkedKey;
                    // 防止在添加之后立即修改，状态记录的不正确
                    if (column.status === "add") {
                        column.status = "add";
                    } else {
                        column.status = "modified";
                        column.oid = oid;
                    }
                }
            },
            editField(id, i, index) {
                // 首先清空
                (this.fieldForm = {
                    id: "",
                    datatype: "string",
                    checkedKey: false
                }),
                    // 把参数保存到全局， 在点击确定时候使用
                    (this.argument = {
                        id: id,
                        i: i,
                        index: index
                    });
                this.fieldDialog = true;
                // 根据参数判断是 添加，还是修改
                if (id) {
                    let column = this.dataset.nodes[i].columns[index];
                    this.fieldForm = {
                        id: column.id,
                        datatype: column.datatype,
                        checkedKey: column.primaryKey
                    };
                }
            },
            // 新建 node
            buildSchemas() {
                this.$prompt(`新建元数据： `, "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消"
                })
                    .then(({value}) => {
                        if (this.isExist(value, this.dataset.nodes, "name")) {
                            this.dataset.nodes.push({
                                name: value,
                                id: value,
                                x: 300,
                                y: 300,
                                status: "insert",
                                type: "table"
                            });
                            this.$nextTick(() => {
                                this.draggables();
                            });
                            this.$message({
                                type: "success",
                                message: "新建成功"
                            });
                        } else {
                            this.$message({
                                type: "success",
                                message: value + "已存在"
                            });
                        }
                    })
                    .catch(err => {
                        this.$message({
                            type: "info",
                            message: err
                        });
                    });
            },
            //提交接口
            submit:function () {
                qaassist(this.dataset).then(data => {
                    if (data === 200) {
                        this.$message({
                            type: "success",
                            message: "保存成功"
                        });
                    } else {
                        this.$message({
                            type: "error",
                            message: "保存失败"
                        });
                    }
                }, err => {
                    var err = err.response.data.error
                    if (err === 'Name Duplicated') {
                        err = "名字已存在"
                    } else if (err === 'Arguments error') {
                        err = "参数错误"
                    }else if(err === 'Internal Server Error'||'undefined'){
                        err = "服务器内部错误"
                    }
                    this.$message({
                        type: "error",
                        message: err
                    });
                });
            },
            //获取schema的id
            submitSchemaTree: function () {
                //获取schema的node
                var schmaNode = this.$refs.schematree.selectedNode;
                if (schmaNode === '') {
                    this.$message({
                        message: '请选择一个目录！',
                        type: 'error'
                    });
                    return false;
                } else {
                    this.schemaResource = schmaNode.name
                    this.dataset.schemaResourceId = schmaNode.id
                    this.dataset.schemaResourceType = 'resource'
                    this.submit();
                    this.dialogSchemaTreeVisible = false;
                }
            },
            // 保存
            save() {
                this.dataset.nodes.every((item, index) => {
                    if (!item.columns || item.columns.length === 0) {
                        this.$message({
                            type: "info",
                            message: "保存失败 schemas 下，字段不能为空"
                        });
                        return false;
                    } else {
                        var element = document.getElementById(item.id);
                        if (!element) {
                            return false;
                        } else {
                            item.x = element.offsetLeft;
                            item.y = element.offsetTop;
                        }
                    }
                    return true;
                });
                if(!this.dataset.schemaResourceId){
                    this.dialogSchemaTreeVisible = true
                }else {
                    this.submit();
                }
            }
        },
        watch: {
            '$route.query': {
                handler: function (value) { // 可以获取新值与老值两个参数
                    this.$router.go(0)
                },
                deep: true // 开启深度监听
            }
        },
    };
</script>
<style lang="scss" scope>
    #jsplumbBox {
        width: 100%;
        height: 92vh;
        cursor: pointer;
        overflow: hidden;
        position: relative;
        .save {
            position: relative;
            left: 280px;
            top: 20px;
            z-index: 2000;
        }
        #canvas {
            width: 100%;
            height: 100%;
            position: absolute;
            .canvasBox {
                position: relative;
                .listPlumb {
                    position: absolute;
                    width: 300px;
                    border-radius: 5px;
                    overflow: hidden;
                    & > h3 {
                        margin: 0;
                        background: #335e87;
                        height: 30px;
                        font-weight: normal;
                        line-height: 30px;
                        text-align: center;
                        font-size: 12px;
                        color: #fff;
                        cursor: move;
                        .delete {
                            float: left;
                            padding-left: 10px;
                            cursor: pointer;
                        }
                        i {
                            margin-right: 10px;
                            cursor: pointer;
                        }
                        span {
                            float: right;
                        }
                        > b {
                            display: inline-block;
                            width: 50%;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                    & > ul {
                        border-radius: 10px;
                        padding: 0;
                        margin: 0;
                        & > li {
                            cursor: pointer;
                            font-size: 12px;
                            height: 25px;
                            line-height: 25px;
                            background: #587693;
                            color: #bedaf5;
                            border-bottom: 1px solid #688bac;
                            .delete {
                                float: left;
                                padding: 0 10px;
                            }
                            b {
                                display: inline-block;
                                width: 45%;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                            .liEdit {
                                float: right;
                                .el-icon-edit {
                                    padding: 0 10px;
                                }
                            }
                        }
                    }
                }
            }
        }
        .listPlumb:hover {
            box-shadow: 1px 1px 5px #444;
        }
        .jtk-overlay {
            background: #ffabaa;
            border-radius: 5px;
            i {
                font-size: 12px;
                color: #fff;
            }
        }
        .jtk-overlay:hover {
            background: #f35958;
        }

        li.dragHover {
            background: #759abd !important;
        }
        .aLabel {
            background-color: white;
            opacity: 0.8;
            border-radius: 0.5em;
            cursor: pointer;
        }
        .aLabel.jtk-hover {
            background-color: #f35958;
            color: white;
        }
        .drop-hove {
        }
        .btn-right {
            position: relative;
            z-index: 1000
        }
    }
</style>


