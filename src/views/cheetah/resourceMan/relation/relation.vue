<template>
    <div class="relation" id='bm-ch-resMan-relation-tmp'>
        <div id="relationDrag">
            <div class="relation_coniner" id="relation_coniner">
                <div class="relation_list" v-for="(relationData, i) in relation_list" :key="i">
                    <div class="listPlumb"
                         v-for="(item, j) in relationData"
                         :key="item.name"
                         :id="item.name">
                        <h3>
            <span class="arrow-left">
              <el-button type="text" v-on:click="findParent(i, j, item)"
                         :icon="item.leftToogle ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></el-button>
            </span>
                            <span>
              <el-button type="text" v-on:click="findChild(i, j, item)"
                         :icon="item.rightToogle ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"></el-button>
            </span>
                            <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
                                <span class="text">{{item.name}}</span>
                            </el-tooltip>
                        </h3>
                        <p class="schemas">{{item.schemas.name}}</p>
                        <ul>
                            <li v-for="field in item.schemas.columns" :key="field.name"
                                :id="item.name + '(' + field.id + ')'">
              <span class="arrow-left">
                <el-button type="text" v-on:click="findParentField(item, field)" icon="el-icon-arrow-left"></el-button>
              </span>
                                {{field.id}}
                                <span>
              {{field.datatype}}
              <el-button type="text" v-on:click="findChildrenField(item, field)" icon="el-icon-arrow-right"></el-button>
            </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <!-- flowID 弹窗 -->
    </div>
</template>
<script>
    // import '@static/jsLibrary/jsPlumbLine/jsplumb.min.js'
    import {relation, relationField} from "@api";
    import zoom from '@static/jsLibrary/jsPlumbLine/zoom.js'
    import drag from '@static/jsLibrary/jsPlumbLine/drag.js'

    export default {
        data() {
            return {
                parentToChildHash: {},
                relation_list: [],
                datasetEdges: [],
                fieldEdges: [],
                datasetInstance: {},
                fieldInstance: {},
                datasetCommon: {
                    endpoint: ["Dot", {radius: 5}],
                    anchor: ["Left", "Right"],
                    endpointStyle: {fill: "#f35958"},
                    paintStyle: {stroke: "#f35958", strokeWidth: 1}
                },
                fieldCommon: {
                    endpoint: ["Dot", {radius: 5}],
                    anchor: ["Left", "Right"],
                    endpointStyle: {fill: "#b2d8fc"},
                    paintStyle: {stroke: "#b2d8fc", strokeWidth: 1},
                    overlays: [
                        [
                            'Arrow', {width: 6, length: 6, location: 0.5},
                        ]
                    ]
                },
                flowId: [],
                index: 0
            };
        },
        props: {
            relationId: {
                type: String,
                default: ''
            }
        },
        created() {
            let name = '';
            if (!this.$route.query.id) {
                return
            }
            name = JSON.parse(this.$route.query.id)
            relation(name)
                .then(data => {
                    this.relation_list.push([data]);
                })
                .catch(() => {
                });
            this.$nextTick(() => {
                this.init();
            });
        },
        methods: {
            // 查找 parent 关系
            findParent(i, j, item) {
                relation(item.name)
                    .then(data => {
                        // 如果 parent 是空， 直接退出
                        if (!data.parents.length) {
                            this.tips('已经没有 父集 了 ！！！')
                            return;
                        }
                        let _item = this.deepCloneArray(data.parents)
                        this.parentToChildHash['parent_' + item.name] = _item
                        // 如果 leftToogle === undefined 或者 false 请求接口连线 相反  执行收起方法
                        if (item.leftToogle) {
                            this.closeConnection(item.name, 'parent_');
                        } else {
                            // 如果 i+1 的位置 在末尾插入一条，如果存在就是数组，直接push 对象
                            if (this.relation_list[i - 1]) {
                                data.parents.forEach(item => {
                                    if (this.isExist(item.name, this.relation_list[i - 1], 'name')) {
                                        this.relation_list[i - 1].push(item);
                                    }
                                    this.fieldEdgesIsExist(data, this.relation_list[i - 1][j], 'parents', 'datasetEdges');
                                });
                            } else {
                                this.relation_list.splice(i, 0, data.parents);
                                // 连线处理
                                this.fieldEdgesIsExist(data, this.relation_list[i + 1][j], 'parents', 'datasetEdges');
                            }
                        }
                        this.$set(item, 'leftToogle', !item.leftToogle)
                    })
                    .catch(() => {
                    });
            },
            deepCloneArray: (arr) => {
                var ret = new Array(arr.length)
                for (var i = 0; i < arr.length; i++) {
                    var proto = Object.getPrototypeOf(arr[i]);
                    ret[i] = Object.assign({}, Object.create(proto), arr[i]);
                }
                return ret;
            },
            // 查找 child 关系
            findChild(i, j, item, event) {
                relation(item.name).then(data => {
                    // 如果 children 是空直接退出
                    if (!data.children.length) {
                        this.tips('已经没有 子集 了 ！！！')
                        return;
                    }
                    let _item = this.deepCloneArray(data.children)
                    this.parentToChildHash['children_' + item.name] = _item
                    if (item.rightToogle) {
                        this.closeConnection(item.name, 'children_');
                    } else {
                        // 如果 i+1 的位置 在末尾插入一条，如果存在就是数组，直接push 对象
                        if (this.relation_list[i + 1]) {
                            data.children.forEach(item => {
                                if (this.isExist(item.name, this.relation_list[i + 1], 'name')) {
                                    this.relation_list[i + 1].push(item);
                                }
                            });
                        } else {
                            this.relation_list.splice(i + 1, 0, data.children);
                        }
                        // 连线处理
                        this.fieldEdgesIsExist(data, this.relation_list[i][j], 'children', 'datasetEdges');
                    }
                    this.$set(item, 'rightToogle', !item.rightToogle)
                })
                    .catch(() => {
                    });
            },

            findParentField(item, field) {
                relationField(item.name, [field.id]).then(data => {
                    // 连线处理
                    this.fieldEdgesIsExist(data, field, 'parents', 'fieldEdges');
                })
            },

            findChildrenField(item, field) {
                relationField(item.name, [field.id]).then(data => {
                    // 连线处理
                    this.fieldEdgesIsExist(data, field, 'childrens', 'fieldEdges');
                })
            },

            // 错误提示
            tips(message) {
                this.$message({
                    type: "info",
                    message: message
                });
            },
            // 连线初始化配置
            init() {
                jsPlumb.ready(() => {
                    jsPlumb.setContainer("relationDrag");
                    // 数据集连线的实例
                    this.datasetInstance = jsPlumb.getInstance({
                        ConnectionsDetachable: false, //鼠标不能移动节点
                        Connector: "StateMachine",
                        Container: "relationDrag"
                    });
                    this.datasetInstance.fire("jsPlumbDemoLoaded", this.datasetInstance);
                    // 字段连线的实例
                    this.fieldInstance = jsPlumb.getInstance({
                        ConnectionsDetachable: false, //鼠标不能移动节点
                        Connector: "StateMachine",
                        Container: "relationDrag"
                    });
                    let nodeId = document.getElementById("relationDrag");
                    drag(nodeId);
                    zoom(nodeId, size => {
                        this.size = size;
                        this.fieldInstance.setZoom(size);
                    });
                    this.fieldInstance.fire("jsPlumbDemoLoaded", this.fieldInstance);
                    this.connectionSuccess();
                });
            },
            // 数据集默认连线
            datasetConenction() {
                if (this.datasetEdges === []) {
                    return;
                }
                this.$nextTick(() => {

                    jsPlumb.batch(() => {
                        this.datasetEdges.forEach(item => {
                            this.datasetInstance.connect({
                                source: item.source,
                                target: item.target,
                                overlays: [
                                    [
                                        "Custom", {
                                        create: (component) => {
                                            return $(`<span style='background: #ffabaa; border-radius: 5px; padding: 3px; z-index: 2000' id='${item.flowId}'><i class='el-icon-edit-outline flowId' style='color: #fff;'></i></span>`);
                                        },
                                        events: {
                                            click: (overlay) => {
                                                if (this.index === 3) {
                                                    this.index = 0
                                                }
                                                let id = overlay.canvas.getAttribute('id')
                                                let routeData = this.$router.resolve({
                                                    path: '/design/designDrawing/' + item.flowId,
                                                    query: {type: 'dataflow'}
                                                })
                                                if (this.index === 0) {
                                                    window.open(routeData.href, '_blank');
                                                }
                                                this.index++
                                            }
                                        },
                                        location: 0.6,
                                        id: "customOverlay"
                                    }
                                    ],
                                    [
                                        'Arrow', {width: 6, length: 6, location: 0.2},
                                    ]
                                ],
                            }, this.datasetCommon);
                        });
                    }, true)
                });
            },
            // 数据集默认连线
            fieldConenction() {
                if (this.fieldEdges === []) {
                    return;
                }
                this.$nextTick(() => {
                    jsPlumb.batch(() => {

                        this.fieldEdges.forEach(item => {
                            // 连线成功之后重新添加 closeId 的 个数
                            this.fieldInstance.connect({
                                source: item.source,
                                target: item.target
                            }, this.fieldCommon);
                        });
                    }, true)
                });
            },
            fieldEdgesIsExist(data, field, relation, edges) {
                // 在字段连线中
                if (!data[relation].length) {
                    this.tips('没有数据了！！！')
                    return;
                }
                // 如果能走到这 说明 parent 不是空的
                data[relation].forEach(item => {
                    let isSource = this.exist([data.name, item.name], this[edges], ['source', 'target']);
                    if (isSource) {
                        if (relation === 'parents') {
                            this[edges].push({
                                "source": item.name,
                                "target": data.name,
                                "flowId": item.flowId
                            })
                        } else {
                            this[edges].push({
                                "source": data.name,
                                "target": item.name,
                                "flowId": item.flowId
                            })
                        }

                    }
                });
                this.datasetInstance.reset();
                this.fieldInstance.reset();
                // 进行连线
                this.datasetConenction()
                this.fieldConenction()
            },
            /**
             * 判断两个值 是否是一个对象数组中的值  对象对角作比较
             * {               {
      *   source: a       source: b
      *   target: b       target: a
      * }                }
             */
            exist(filed, array, attr) {
                return array.every((value) => {
                    if (value[attr[0]] === filed[1] && value[attr[1]] === filed[0]) {
                        return false
                    }
                    return true
                })
            },
            //  连线处理
            connectionSuccess() {
                this.datasetInstance.bind("connection", connInfo => {

                });
            },
            closeConnection(name, relation) {
                let compare = 'source', field = 'target'
                if (relation === 'parent_') {
                    compare = 'target';
                    field = 'source'
                } else {
                    compare = 'source';
                    field = 'target'
                }
                if (!this.parentToChildHash[relation + name]) {
                    return
                }
                for (let item of this.parentToChildHash[relation + name]) {
                    for (let index in this.relation_list) {
                        for (let value of this.relation_list[index]) {
                            if (item.name === value.name) {
                                this.deleteObject(item.name, this.relation_list[index], 'name')
                                this.deleteObject(item.name, this.datasetEdges, field)
                            }
                        }
                    }
                    this.closeConnection(item.name, relation)
                    delete this.parentToChildHash[relation + name]
                }
                this.datasetInstance.reset();
                this.fieldInstance.reset();
                // 进行连线
                this.datasetConenction()
                this.fieldConenction()
            }
        },
        watch: {
            relationId: function (value) {
                // 值发生变化说明重新渲染页面， 所以把值清空
                this.relation_list = []
                this.datasetEdges = []
                this.fieldEdges = []
                // 删除连线
                if (this.datasetInstance.reset) {
                    this.datasetInstance.reset();
                    this.fieldInstance.reset();
                }
                relation(value)
                    .then(data => {
                        this.relation_list.push([data]);
                    })
                    .catch(() => {
                    });
                this.$nextTick(() => {
                    this.init();
                });
            }
        }
    };
</script>
<style lang="scss" scoped>
    .relation {
        width: 100%;
        height: 92vh;
        box-sizing: border-box;
        overflow: hidden;
        cursor: pointer;
        #relationDrag {
            position: absolute;
            width: 100%;
        }
        .relation_coniner {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            // 列
            .relation_list {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin-right: 100px;
                //  行
                .listPlumb {
                    margin-top: 30px;
                    width: 350px;
                    border-radius: 5px;
                    overflow: hidden;
                    border: 1px solid #e5e5e5;
                    & > .schemas {
                        height: 35px;
                        text-align: center;
                        margin: 0;
                        line-height: 35px;
                        font-size: 12px;
                    }
                    & > h3 {
                        margin: 0;
                        background: #80c0fc;
                        height: 40px;
                        font-weight: normal;
                        line-height: 40px;
                        text-align: center;
                        font-size: 12px;
                        color: #fff;
                        .text {
                            display: inline-block;
                            width: 45%;
                            float: none;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .arrow-left {
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
                        .el-button {
                            color: #fff;
                        }
                    }
                    & > ul {
                        border-radius: 10px;
                        padding: 0;
                        margin: 0;
                        & > li {
                            cursor: pointer;
                            font-size: 12px;
                            height: 30px;
                            line-height: 30px;
                            background: #fff;
                            overflow: hidden;
                            color: #666;
                            .el-button {
                                color: #999;
                            }
                            .arrow-left {
                                float: left;
                                cursor: pointer;
                            }
                            i {
                                cursor: pointer;
                            }
                            span {
                                float: right;
                            }
                            &:nth-child(even) {
                                background: #f9f9f9;
                            }
                        }
                    }
                }
            }
        }
        .jtk-overlay {
            background: #ffabaa;
            border-radius: 5px;
        }
        .jtk-overlay:hover {
            background: #f35958;
        }
        .relation-dialog {
            width: 100%;
            height: 100%;
        }
    }
</style>