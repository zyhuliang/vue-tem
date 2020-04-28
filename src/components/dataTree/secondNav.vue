<template>
    <div>
        <el-form id="bm-ch-nav2" ref="form" label-width="80px" @submit.prevent="onSubmit">
            <!-- nav2 -->
            <!--操作按钮-->
            <div class="breadcrumb-container" id="bm-ch-ep-nav2">
                <div class="nav2-header">
                    <!--资源目录标题-->
                    <strong class="title">资源目录</strong>
                    <span class="otherButton">
                        <!--其他操作按钮-->
                        <el-dropdown trigger="click" @command="otherOperations" v-if="isAdmin">
                            <el-button type="primary">
                                目录<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown" name="bm-rm-dropdpwn-name1">
                                <el-dropdown-item v-if="isButtonAbled('add_dir')" command="dir"><i
                                        class="icon iconfont icon-ir-text-add"></i>&nbsp;新建目录</el-dropdown-item>
                                <el-dropdown-item v-if="isButtonAbled('delete_dir') &&  !isBeiRuan" command="deleteDir"
                                                  uib-tooltip="目录删除"><i
                                        class="icon iconfont icon-ir-directory-delete"></i>&nbsp;删除目录</el-dropdown-item>
                                <el-dropdown-item v-if="isButtonAbled('move_dir')" command="moveDir" uib-tooltip="移动目录"><i
                                        class="icon iconfont icon-ir-directory-move"></i>&nbsp;移动目录</el-dropdown-item>
                                <el-dropdown-item v-if="isButtonAbled('reName_dir')" command="reNameDir"
                                                  uib-tooltip="目录改名"><i
                                        class="icon iconfont icon-ir-directory-rename"></i>&nbsp;目录改名</el-dropdown-item>
                                <el-dropdown-item v-if="isButtonAbled('sort_dir')" command="sortDir" uib-tooltip="目录排序"><i
                                        class="icon iconfont icon-ir-directory-rename"></i>&nbsp;目录排序</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </span>
                </div>
            </div>
            <!--目录树-->
            <div class="tree-menu tree well" v-loading="loading" id='bm-com-datatree-secondNav-table'>
                <ul class="tree-parent" name="treeUl">
                    <li>
                        <ul v-for="(tree,key,index) in theModel" :key="index" :name="tree.name">
                            <nav2-tree :model="tree" ref="navTree"></nav2-tree>
                        </ul>
                    </li>
                </ul>
            </div>

        </el-form>
        <!--目录 dialog-->
        <add-dir-source ref="addDir" @addDir="addOrEditDir"></add-dir-source>
        <!-- ResourceTree dialog-->
        <el-dialog
                :visible.sync="dialogResourceTreeVisible"
                width="50%"
                :close-on-click-modal="false" :modal-append-to-body="false"
                :title="'Resource tree'| cn"
        >
            <el-form>
                <resource-tree ref="resourcetree" :theModel="treeModel"></resource-tree>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitResourceTree()">确定</el-button>
                <el-button @click="dialogResourceTreeVisible=false">取消</el-button>
            </div>
        </el-dialog>

        <!-- sortdir dialog-->
        <el-dialog
                :visible.sync="dialogSortTreeVisible"
                width="50%"
                :close-on-click-modal="false"
                :modal-append-to-body="false"
                title="目录排序"
        >
            <el-tree
                    :data="sortTree"
                    node-key="id"
                    default-expand-all
                    @node-drop="handleDrop"
                    :allow-drop="allowDrop"
                    draggable>
                <span slot-scope="{ node,data}">
                    {{data.name | nameFilter}}
                </span>
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitSortTree()">确定</el-button>
                <el-button @click="dialogSortTreeVisible=false">取消</el-button>
            </div>
        </el-dialog>

        <!-- DatasetDelete dialog-->
        <el-dialog
                :visible.sync="dialogDatasetDelVisible"
                :close-on-click-modal="false"
                :modal-append-to-body="false"
                title="占用元数据的数据集"
        >
            <datset-table-list :data="datasetContext" :resourceId="selectedNode.id"></datset-table-list>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitDatasetDelete()">确定</el-button>
                <el-button @click="dialogDatasetDelVisible=false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import congfigData from '@config/data/index.json'
    import nav2Tree from './treeMenu.vue'
    import addDirSource from '@views/cheetah/resourceMan/addDir.vue'
    import resourceTree from '@components/resourceTree/resourceTree.vue';
    import datsetTableList from '@components/datsetTableList/datsetTableList.vue';
    import resIn from './resNav.js'

    import {resDirTree, putResource, postResource, deleteResource, sortTree, usedContentSchema} from '@api'
    import {moveResource} from '@api'

    export default {
        components: {
            nav2Tree,
            addDirSource,
            resourceTree,
            datsetTableList
        },
        data() {
            return {
                isBeiRuan: congfigData[process.env.BASE_PROJECT].systemName === 'BeiRuan',
                form: {
                    name: '',
                    region: '',
                    type: [],
                    resource: '',
                },
                isAdmin: true,
                dialogResourceTreeVisible: false,
                dialogSortTreeVisible: false,
                datasetContext: {},
                dialogDatasetDelVisible: false,
                dirType: 'dataset_dir',
                theModel: {},
                selectedNode: {},
                selectedRows: [],
                treeModel: [],
                loading: false,
                sortTree: [],
                tmpName: ''
            }
        },
        methods: {
            handleDrop(draggingNode, dropNode, dropType, ev) {
                console.log('handle drop: ', dropNode && dropNode.label, dropType);
            },
            //排序时候不能进入下一级
            allowDrop(draggingNode, dropNode, type) {
                return type !== 'inner';
            },
            //根据数据集等不同根目录，判断需要显示的创建按钮
            isButtonAbled: function (name) {
                var that = this;
                //delete dir
                if ("delete_dir" === name) {
                    if (!this.beiruanModel) {
                        return that.selectedNode && that.selectedNode.resType && that.selectedNode.resType.indexOf("dir") >= 0 && that.selectedNode.parentId;
                    } else {
                        return that.selectedNode && that.selectedNode.resType && that.selectedNode.resType.indexOf("dir") >= 0 && that.selectedNode.parentId && that.selectedNode.resType == 'standard_dir'
                    }
                }
                //add dir
                if ("add_dir" === name) {
                    return that.selectedNode && that.selectedNode.resType;
                }
                //reName dir
                if ("reName_dir" === name) {
                    return that.selectedNode && that.selectedNode.resType && that.selectedNode.parentId;
                }
                //move dir
                if ("move_dir" === name) {
                    return that.selectedNode && that.selectedNode.resType && that.selectedNode.parentId;
                }
                if ("move" === name) {
                    return !that.selectedNode && that.selectedRows.length === 0;
                }
                if ("sort_dir" === name) {
                    return (that.selectedNode && that.selectedNode.children && that.selectedNode.children.length && that.selectedNode.children.length > 1) || !that.selectedNode.resType;
                }
            },
            //其他操作下拉框的点击事件
            otherOperations: function (type) {
                if ((type).toLowerCase().indexOf('sortdir') > -1) {
                    this.sortDir()
                } else if ((type).toLowerCase().indexOf('renamedir') > -1) {
                    this.dirDialog('selectedNode')
                } else if ((type).toLowerCase().indexOf('deletedir') > -1) {
                    this.deleteDir()
                } else if ((type).toLowerCase().indexOf('movedir') > -1) {
                    this.moveDir('selectedNode')
                } else if ((type).toLowerCase().indexOf('dir') > -1) {
                    this.dirDialog()
                }
            },
            //调用接口刷新资源目录树
            refrenshResDir: function () {
                var para = {allUser: true, excludes: '$Workflow;$Dataflow;$Streamflow', includes: 'schema_dir;dataset_dir;datasource_dir;standard_dir', strict: true}
                resDirTree(para).then(res => {
                    this.theModel = res
                }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                })
            },
            //            addStandardMapping
            //获取resource的id 点击resourceTree确认按钮之后发送移动请求
            submitResourceTree: function () {
                //获取resource的node
                var resourceNode = this.$refs.resourcetree.selectedNode;
                var that = this;
                if (resourceNode === '') {
                    that.$message({
                        message: '请选择一个目录！',
                        type: 'error'
                    });
                    return false;
                } else {
                    //如果是project用到就执行下面的代码
                    var urlTrue = window.location.href.indexOf('/project') > -1;
                    if (urlTrue === true) {
                        that.resourceProject = resourceNode.name
                        that.entity.resource.projectEntity.id = resourceNode.id
                        that.dialogResourceTreeVisible = false;
                    } else {
                        var dirId = resourceNode.id
                        var ids = [];
                        ids.push(that.selectedNode.id)
                        that.$confirm('真的要移动目录' + that.selectedNode.name + "?", '提示', {}).then(() => {
                            moveResource(dirId, 'dir', ids).then(data => {
                                    //更新树
                                    this.refrenshResDir();
                                }, err => {

                                    var error = err.response.data.err.toLowerCase().indexOf('duplicate') > -1 ? '此目录已存在' : err.response.data.err.indexOf('the target directory can not be child directory') > -1 ? '不能移动到该目录的子目录' : err.response.data.err
                                    this.$message({
                                        message: error,
                                        type: 'error',
                                        duration: 1500
                                    });
                                }
                            )
                        })
                        that.dialogResourceTreeVisible = false;
                    }
                }
            }
            ,
            //移动目录
            moveDir: function () {
                var that = this;
                var parameter = {excludes: "", includes: that.selectedNode.resType, strict: true}
                resDirTree(parameter).then(data => {
                        this.treeModel = data;
                        that.dialogResourceTreeVisible = true
                    }, err => {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    }
                )
            }
            ,
            //排序dir
            sortDir: function () {
                // submitSortTree
                var that = this;
                //弹出框显示的tree数据
                that.sortTree = []
                that.dialogSortTreeVisible = true
                //如果是有被选中的节点那就获取其下面的chidren
                if (that.selectedNode.resType) {
                    that.sortTree = that.selectedNode.children
                    for (var i = 0; i < that.sortTree.length; i++) {
                        that.sortTree[i].children = []
                    }
                } else {
                    //如果是没有被选中的那就用给根节点排序
                    var para = {
                        allUser: true,
                        excludes: '$Workflow;$Dataflow;$Streamflow',
                        includes: 'schema_dir;dataset_dir;datasource_dir;standard_dir',
                        strict: true
                    }
                    resDirTree(para).then(res => {
                        that.sortTree = res
                        for (var i = 0; i < that.sortTree.length; i++) {
                            that.sortTree[i].children = []
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
            ,
            //排序
            submitSortTree: function () {
                var that = this;
                that.dialogSortTreeVisible = false
                sortTree(that.sortTree).then(res => {
                    //更新列表
                    this.refrenshResDir();
                    resIn.$emit('childMethod', that.selectedNode)
                }, err => {

                })
            }
            ,
            //删除datset列表确认按钮调用的方法
            submitDatasetDelete: function () {
                this.dialogDatasetDelVisible = false
                this.loading = true;
                //发请求获取被占用结果
                usedContentSchema(this.selectedNode.id, 8, 0).then(res => {
                    this.loading = false;
                    //有被占用的使用分页列表删除对应的dataset
                    if (res.totalElements > 0) {
                        this.$message({
                            message: '请删除占用元数据的数据集，再删除元数据目录！',
                            type: 'success'
                        });

                    } else {
                        //没被占用直接删除
                        deleteResource(this.selectedNode.id).then(res => {
                            this.$message({
                                message: '恭喜你，删除已成功！',
                                type: 'success'
                            });
                            //刷新右侧列表页
                            resIn.$emit('clearList')
                            this.refrenshResDir();
                        }, err => {
                            this.$message({
                                message: err.response.message,
                                type: 'error',
                                duration: 1500
                            });
                        })
                    }
                }, err => {
                    this.loading = false;
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                })
            }
            ,
            //删除dir
            deleteDir: function () {
                var that = this;
                that.$confirm('真的要删除目录?', '提示', {}).then(() => {
                    //在删除schema目录之前先判断被哪些dataset占用
                    if (that.selectedNode.resType.indexOf('schema') > -1) {
                        this.loading = true;
                        //发请求获取被占用结果
                        usedContentSchema(that.selectedNode.id, 8, 0).then(res => {
                            this.loading = false;
                            //有被占用的使用分页列表删除对应的dataset
                            if (res.totalElements > 0) {
                                this.datasetContext = res;
                                this.dialogDatasetDelVisible = true;
                            } else {
                                //没被占用直接删除
                                deleteResource(that.selectedNode.id).then(res => {
                                    that.$message({
                                        message: '恭喜你，删除已成功！',
                                        type: 'success'
                                    });
                                    this.refrenshResDir();
                                    //刷新右侧列表页
                                    resIn.$emit('clearList')
                                }, err => {
                                    this.$message({
                                        message: err.response.message,
                                        type: 'error',
                                        duration: 1500
                                    });
                                })
                            }
                        }, err => {
                            this.loading = false;
                            this.$message({
                                message: err.response.message,
                                type: 'error',
                                duration: 1500
                            });
                        })
                        //有被占用的使用分页列表删除对应的dataset
                        //没被占用直接删除
                    } else {
                        deleteResource(that.selectedNode.id).then(res => {
                            that.$message({
                                message: '恭喜你，删除已成功！',
                                type: 'success'
                            });
                            this.refrenshResDir();
                            //刷新右侧列表页
                            resIn.$emit('clearList')
                        }, err => {
                            this.$message({
                                message: err.response.message,
                                type: 'error',
                                duration: 1500
                            });
                        })
                    }
                }).catch(() => {
                });
            }
            ,
            //目录弹出框
            dirDialog: function (node) {
                var nodeTmp = node ? this.selectedNode : undefined
                this.tmpName = node ? this.selectedNode.name : ''
                this.$refs.addDir.dialogAddDir(nodeTmp)
                var para = {
                    allUser: true,
                    excludes: '$Workflow;$Dataflow;$Streamflow',
                    includes: 'schema_dir;dataset_dir;datasource_dir;standard_dir',
                    strict: true
                }
            }
            ,
            //添加或编辑目录
            addOrEditDir: function (newValue, node) {
                var that = this;
                var isNew = node ? false : true
                if (!node) {
                    node = {name: newValue, resType: that.selectedNode.resType}
                    if (that.selectedNode != null) {
                        node.parentId = that.selectedNode.id
                    }
                } else {
                    node = Object.assign({}, node);
                    node.name = newValue;
                }
                var addOrEditDir = isNew ? postResource(node) : putResource(node);
                //提交 dir
                addOrEditDir.then(data => {
                        if (!isNew){
                            that.selectedNode.name = node.name;
                        }else this.refrenshResDir();
                    }, err => {
                        if (!isNew) {
                            that.selectedNode.name = that.tmpName
                        }
                        that.tmpName = ''
                        var err = err.response.data.err.indexOf('duplicate') > 1 ? '目录名已存在' : err.response.data.err
                        this.$message({
                            message: err,
                            type: 'error',
                            duration: 1500
                        });
                    }
                )
            }
            ,
            onSubmit() {
                console.log('submit!');
            }
        },
        filters: {
            nameFilter: function (value) {
                if (value === "Datasets") {
                    return "数据集";
                } else if (value === "Standards") {
                    return "数据标准";
                } else if (value === "Datasources") {
                    return "数据源";
                } else if (value === "Schemas") {
                    return "元数据";
                } else if (value === "OtherUser") {
                    return "其他用户";
                } else {
                    return value;
                }
            }
            ,
        }
        ,
        mounted() {
            //获取资源目录的操作权限
            this.isAdmin = sessionStorage.getItem("isAdmin") == "true" ? true : false
            //获取目录树根节点
            var para = {
                allUser: true,
                excludes: '$Workflow;$Dataflow;$Streamflow',
                includes: 'schema_dir;dataset_dir;datasource_dir;standard_dir',
                strict: true
            }
            this.loading = true;

            resDirTree(para).then(data => {
                    this.loading = false;
                    this.theModel = data;
                }, err => {
                    this.loading = false;
                    if (err.response.status > 500) {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    }
                }
            )
            //点击目录树结构触发的事件
            resIn.$on('childMethod', (selecteNode) => {
                this.selectedNode = selecteNode;
            })
        }
    }

</script>

<style lang="scss" scoped>
    #bm-ch-nav2 {
        position: fixed;
        margin: 0px;
        top: 50px;
        box-sizing: border-box;
        z-index: 10;
        width: 250px;
        height: calc(100% - 50px);
        overflow-y: hidden;
        background-color: #f2f3f9;
        border-right: 1px solid #cccccc;
        overflow-x: hidden;

    }

    #bm-ch-nav2 #bm-ch-ep-nav2 {
        float: left;
        background: #f2f3f9;
        width: 250px;
    }

    #bm-ch-nav2 #bm-ch-ep-nav2 .nav2-header {
        float: left;
        background: #ffffff;
        border-right: 1px solid #cccccc;
        box-sizing: border-box;
        border-bottom: 1px solid #cccccc;
        width: 100%;
        height: 50px;
        line-height: 50px;
        box-shadow: 0px 1px 10px 0 rgba(0, 0, 0, 0.1);

    }

    #bm-ch-nav2 #bm-ch-ep-nav2 .nav2-header strong {
        float: left;
        width: 100px;
        margin-left: 15px;
    }

    #bm-ch-nav2 #bm-ch-ep-nav2 .nav2-header .el-dropdown {
        float: right;
        margin: 0px 10px 0px 0px;
    }

    #bm-ch-nav2 #bm-ch-ep-nav2 .nav2-header .el-dropdown span {
        color: #6d6f74;
        margin-left: 5px;
    }

    #bm-ch-nav2 #bm-ch-ep-nav2 .nav2-header .el-dropdown span i {
        margin-right: 0px;
    }

    #bm-ch-nav2 .tree-menu {
        width: 100%;
        margin-top: 50px;
    }

    .container .main .content-container .breadcrumb-container {
        padding: 0;
    }

    .el-dropdown-link i {
        font-size: 12px;
        color: #b2b3b9;
    }

    ul.el-dropdown-menu el-dropdown-item:first-child.el-dropdown-menu__item {
        border-bottom: 1px solid #cccccc;
    }

    ul.el-dropdown-menu el-dropdown-item.el-dropdown-menu__item {
        padding: 5px 0px 5px 0px;
        color: #666666;
    }

    ul.el-dropdown-menu el-dropdown-item.el-dropdown-menu__item i {
        color: #a7a7aa;
    }

    .container .breadcrumb-container {
        margin: 0px;

    }

    .otherButton {
        float: right;
        margin-left: -15px
    }

    /*.tree-menu{
        min-height: 50%;
    }*/

    /*z:样式优化*/
    .nav2-header {
        position: fixed;
        width: 250px !important;
    }

    .tree-menu {
        overflow-y: auto;
        height: calc(100% - 50px);
    }
</style>
