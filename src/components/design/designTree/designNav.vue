<template>

    <div id="bm-designNav">
        <!--操作按钮-->
        <div class="breadcrumb-container" id="ep-nav2" v-if="dnNavOperation">
            <div class="nav2-header">
                <h3>流程目录</h3>
                <el-dropdown :disabled="nav2DirButton" trigger="click" @command="otherOperations">
                    <el-button type="primary" name="primaryBtn">
                        目录<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                         <span v-if="isAdmin">
                                <el-dropdown-item v-if='selectedNode && selectedNode.id' command="add" name="add"><i
                                        class="icon iconfont icon-ir-text-add"></i>&nbsp;新建目录</el-dropdown-item>
                                <el-dropdown-item v-if="selectedNode && selectedNode.parentId" command="delete"
                                                  name="delete"><i class="icon iconfont icon-ir-directory-delete"></i>&nbsp;删除目录</el-dropdown-item>
                                <el-dropdown-item v-if="selectedNode && selectedNode.name!= 'Flows'" command="rename"><i
                                        class="icon iconfont icon-ir-directory-rename"
                                        name="rename"></i>&nbsp;重命名</el-dropdown-item>
                                <el-dropdown-item v-if="selectedNode && selectedNode.parentId" command="move"
                                                  name="move"><i class="icon iconfont icon-ir-directory-move"></i>&nbsp;移动</el-dropdown-item>
                                <el-dropdown-item
                                        v-if="(selectedNode && selectedNode.children && selectedNode.children.length && selectedNode.children.length >1) || !selectedNode.resType"
                                        command="sortDir" uib-tooltip="目录排序" name="sortDir"><i
                                        class="icon iconfont icon-ir-directory-rename"></i>&nbsp;目录排序</el-dropdown-item>
                        </span>
                        <el-dropdown-item command="flowExport"><i class="icon iconfont icon-ir-download"
                                                                  name="flowExport"></i>&nbsp;导出流程
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>

        <el-form id="nav2" ref="form" label-width="80px" @submit.prevent="onSubmit">
            <!--目录树-->
            <div class="tree-content" v-loading="loading" id="bm-com-design-tree-nav-table">
                <div class="tree-menu tree well">
                    <ul class="tree-parent">
                        <li>
                            <ul v-for="(tree,key,index) in theModel">
                                <nav2-tree :model="tree" ref="navTree"></nav2-tree>
                            </ul>
                        </li>
                    </ul>
                </div>
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
            <el-form id="bm-designNav-form">
                <resource-tree ref="resourcetree" :theModel="treeModel"></resource-tree>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitResourceTree()" name="footerSure">确定</el-button>
                <el-button @click="dialogResourceTreeVisible=false" name="footerCancel">取消</el-button>
            </div>
        </el-dialog>
        <!-- sortdir dialog-->
        <el-dialog
                :visible.sync="dialogSortTreeVisible"
                width="50%"
                :close-on-click-modal="false" :modal-append-to-body="false"
                title="排序"
        >
            <el-tree
                    :data="sortTree"
                    node-key="id"
                    default-expand-all
                    @node-drop="handleDrop"
                    :allow-drop="allowDrop"
                    draggable>
                <span slot-scope="{ node,data}">
                    {{data.name}}
                </span>
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitSortTree()" name='dialogSure'>确定</el-button>
                <el-button @click="dialogSortTreeVisible=false" name="dialogCancel">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    import nav2Tree from './designTreeMenu.vue'
    import addDirSource from '@views/cheetah/resourceMan/addDir.vue'
    import desIn from './desNav.js'
    import resourceTree from '@components/resourceTree/resourceTree.vue';

    import {resDirTree, putResource, postResource, deleteResource, moveResource, sortTree} from '@api'

    export default {
        components: {
            nav2Tree,
            addDirSource,
            resourceTree
        },
        data() {
            return {
                form: {
                    name: '',
                    region: '',
                    type: [],
                    resource: '',
                },
                theModel: {},
                selectedNode: {},
                selectedRows: [],
                nav2DirButton: true,
                nav2FlowButton: true,
                drop01: true,
                drop02: true,
                drop03: true,
                dnNavOperation: true,
                loading: true,
                haveData: false,
                dialogResourceTreeVisible: false,
                dialogSortTreeVisible: false,
                treeModel: "",
                sortTree: '',
                tmpName: '',
                isAdmin: true,//存储是管理员还是普通用户的字段
            }
        },
        methods: {
            getNavId(desId, desName) {
                this.desId = desId;
                this.desName = desName;
            },
            handleDrop(draggingNode, dropNode, dropType, ev) {
                console.log('handle drop: ', dropNode && dropNode.label, dropType);
            },
            //排序时候不能进入下一级
            allowDrop(draggingNode, dropNode, type) {
                return type !== 'inner';
            },
            designLoading: function designLoading(parameter) {
                resDirTree(parameter).then(data => {
                    this.loading = false;
                    this.theModel = data;
                    var parId = sessionStorage.getItem("desFindFlowsId")
                    if (parId == null && this.theModel[0]) {
                        sessionStorage.setItem("desFindFlowsId", this.theModel[0].id);
                    }
                    // this.theModel = this.theModel.reverse();
                }, err => {
                    console.log(err.response);
                    const h = this.$createElement;
                    if(err.response.status==500){
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    }
                })
            },
            //目录弹出框
            dirDialog: function (node) {
                var nodeTmp = node ? this.selectedNode : undefined
                this.tmpName = node ? this.selectedNode.name : ''
                this.$refs.addDir.dialogAddDir(nodeTmp)
            },
            //添加或编辑目录
            addOrEditDir: function (newValue, node) {
                var that = this;
                var isNew = node ? false : true
                if (!node) {
                    node = {name: newValue, resType: that.selectedNode.resType}
                    if (that.selectedNode != null) {
                        node.parentId = that.selectedNode.id;
                    }
                } else {
                    node = Object.assign({}, node);
                    node.name = newValue;
                }
                var addOrEditDir = isNew ? postResource(node) : putResource(node);
                //提交 dir
                addOrEditDir.then(data => {
                    if (!isNew)
                        that.selectedNode.name = node.name;
                    desIn.$emit('refreshDir', that.selectedNode, 'add')
                }, error => {
                    if (!isNew) {
                        that.selectedNode.name = that.tmpName
                    }
                    that.tmpName = ''

                    this.$confirm(error.response.data.err, "错误", {
                        type: "error"
                    })
                })
            },
            //删除dir
            deleteDir: function () {
                var that = this;
                that.$confirm('真的要删除目录?', '提示', {}).then(() => {
                    deleteResource(that.selectedNode.id).then(res => {
                        that.$message({
                            message: '恭喜你，删除已成功！',
                            type: 'success'
                        });
                        desIn.$emit('refreshDir', that.selectedNode, 'del');
                        that.selectedNode = "";
                    }, err => {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    })
                }).catch(() => {
                });
            },
            //重命名
            renameDir: function () {
                this.dirDialog(this.selectedNode)
            },
            //移动目录
            moveDir: function () {
                var that = this;
                var parameter = {
                    excludes: "schema_dir;dataset_dir;datasource_dir;standard_dir",
                    includes: "flow_dir;share_dir;user_dir",
                    strict: true
                };
                resDirTree(parameter).then(data => {
                    this.loading = false;
                    this.treeModel = data;
                    that.dialogResourceTreeVisible = true
                }, err => {
                    console.log(error.response);
                    const h = this.$createElement;
                    if(err.response.status==500){
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    }
                    
                })
            },
            //排序目录
            sortDir: function () {
                // submitSortTree
                var that = this;
                //弹出框显示的tree数据
                that.sortTree = []
                that.dialogSortTreeVisible = true
                //如果是有被选中的节点那就获取其下面的chidren
                that.sortTree = that.selectedNode.children
                for (var i = 0; i < that.sortTree.length; i++) {
                    that.sortTree[i].children = []
                }

            },
            //排序
            submitSortTree: function () {
                var that = this;
                that.dialogSortTreeVisible = false
                sortTree(that.sortTree).then(res => {
                    //更新列表
                    desIn.$emit('refreshDir', that.selectedNode, 'move')
                }, err => {

                })
            },
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
                    var dirId = resourceNode.id
                    var ids = [];
                    ids.push(that.selectedNode.id)
                    that.$confirm('真的要移动目录' + that.selectedNode.name + "?", '提示', {}).then(() => {
                        moveResource(dirId, 'dir', ids).then(data => {
                            //更新列表
                            desIn.$emit('refreshDir', that.selectedNode, 'move')
                        }, err => {
                            var error = err.response.data.err.indexOf('duplicate ') > -1 ? '此目录已存在' : err.response.data.err.indexOf('the target directory can not be child directory') > -1 ? '不能移动到该目录的子目录' : err.response.data.err
                            this.$message({
                                message: error,
                                type: 'error',
                                duration: 1500
                            });
                        })
                    })
                    that.dialogResourceTreeVisible = false;
                }
            },
            //其他操作
            otherOperations: function (option) {
                if (option === 'add') {
                    if (Object.keys(this.selectedNode).length !== 0) {
                        this.dirDialog()
                    } else {
                        this.$confirm('选择一个根目录', '错误', {
                            type: 'error'
                        })
                    }
                } else if ('delete' === option) {
                    this.deleteDir()
                } else if ('rename' === option) {
                    this.renameDir()
                } else if ('move' === option) {
                    this.moveDir('selectedNode')
                } else if ('sortDir' === option) {
                    this.sortDir('selectedNode')
                } else {
                    desIn.$emit('desOptions', option)
                }
            }
        },
        mounted() {
            //获取资源目录的操作权限
            this.isAdmin = sessionStorage.getItem("isAdmin") == "true" ? true : false
            //获取目录树根节点
            var parameter = {
                excludes: "schema_dir;dataset_dir;datasource_dir;standard_dir",
                includes: "flow_dir;share_dir;user_dir",
                allUser: true,
                strict: true
            };
            this.designLoading(parameter);
            //点击目录树结构触发的事件
            desIn.$on('desChildId', (id, name, selecteNode) => {
                this.selectedNode = selecteNode;
            })
        }
    }

</script>

<style scoped>
    #nav2 {
        position: fixed;
        margin: 0px;
        top: 100px;
        box-sizing: border-box;
        z-index: 10;
        width: 250px;
        height: calc(100% - 100px);
        overflow-x: hidden;
        background-color: #f2f3f9;
        border-right: 1px solid #cccccc;
    }

    #ep-nav2 {
        position: fixed;
        top: 50px;
        background: #f2f3f9;
        width: 250px;
        z-index: 11;
    }

    #ep-nav2 .nav2-header {
        float: left;
        background: #ffffff;
        border-right: 1px solid #cccccc;
        box-sizing: border-box;
        border-bottom: 1px solid #cccccc;
        padding-left: 10px;
        width: 100%;
        height: 50px;
        line-height: 50px;
        box-shadow: 0px 1px 10px 0 rgba(0, 0, 0, 0.1);
    }

    #ep-nav2 .nav2-header h3 {
        float: left;
        font-size: 14px;
        font-style: normal;
        margin: 0px 0px 0px 5px;
    }


    #ep-nav2 .nav2-header .el-dropdown {
        float: right;
        margin: 0px 10px 0px 0px;
    }

    .container .main .content-container .breadcrumb-container {
        padding: 0;
    }

    .el-dropdown-link i {
        font-size: 12px;
        color: #b2b3b9;
    }

    .tree-menu ul {
        padding: 0px;
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
        margin-left: -15px;
    }

    .tree-content {
        min-height: 50%;
    }
</style>
