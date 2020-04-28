<template>
    <div id="bm-rh-secondNav">
        <!-- nav2 -->
        <!--操作按钮-->
        <div class="breadcrumb-container" id="ep-nav2">
            <div class="nav2-header">
                <!--资源目录标题-->
                <strong class="title">项目目录</strong>
                <el-dropdown trigger="click" @command="otherOperationsProject">
                    <el-button type="primary" :hide="isButtonsDisabled(['deleteDir','moveDir','reNameDir','shareDir'])">
                        目录<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-if="isButtonAbled('add_dir')" command="dir" name="dir"><i class="icon iconfont icon-ir-text-add"></i>&nbsp;新建项目</el-dropdown-item>
                        <el-dropdown-item v-if ="isButtonAbled('delete_dir')" command="deleteDir" uib-tooltip="目录删除" name="deleteDir"><i class="icon iconfont icon-ir-directory-delete"></i>&nbsp;删除项目</el-dropdown-item>
                        <el-dropdown-item v-if ="isButtonAbled('reName_dir')" command="reNameDir" uib-tooltip="目录改名" name="reNameDir"><i class="icon iconfont icon-ir-directory-rename"></i>&nbsp;项目改名</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <el-form id="nav2" ref="form"  label-width="80px" @submit.prevent="onSubmit">
            <!--目录树-->
            <div class="tree-menu tree well" v-loading="loading" id="bm-rh-project-dataTree-secordNav-table">
                <ul class="tree-parent">
                    <li>
                        <ul v-for="(tree,key,index) in theModel">
                            <nav2-tree :model="tree" ref="navTree"></nav2-tree>
                        </ul>
                    </li>
                </ul>
            </div>
        </el-form>
        <!--目录 dialog-->
        <add-dir-source ref="addDir" @addDir="addOrEditDir"></add-dir-source>
    </div>
</template>

<script>

    import nav2Tree from './treeMenu.vue'
    import addDirSource from '@cheetah/resourceMan/addDir.vue'
    import resIn from './resNav.js'

    import { getRootsProject, getProject, putProject, postProject, postDatasource, listData, postDataset, deleteProject } from '@api'

    export default {
        components: {
            nav2Tree,
            addDirSource,
        },
        data() {
            return {
                form: {
                    name: '',
                    region: '',
                    type: [],
                    projectEntity: '',
                },
                theModel: {},
                selectedNode: {},
                selectedRows: [],
                loading : true,
                tmpName: ''
            }
        },
        methods: {
            //根据数据集等不同根目录，判断需要显示的创建按钮
            isButtonAbled : function (name) {
                //delete dir
                if("delete_dir" === name) {
                    if(typeof(this.selectedNode.resType) == 'undefined'){
                        return true;
                    }
                }
                //add dir
                if("add_dir" === name) {
                    return true;
                }
                //reName dir
                if("reName_dir" === name) {
                    if(typeof(Object.keys(this.selectedNode).length!==0 && this.selectedNode.resType) === 'undefined'){
                        return true;
                    }
                }
                if("delete" === name) {
                    return !this.selectedRows && this.selectedRows.length === 0;
                }
            },
            //判断是否不显示新建或者更多的按钮, false 显示
            isButtonsDisabled : function (tokens) {
                var that = this;
                var disabled = true;
                tokens.forEach(function (e) {
                    var node = that.selectedNode
                    if(!that.isButtonAbled(e)) {
                        disabled = false;
                        return false;
                    }
                })
                return disabled;
            },
            //其他操作下拉框的点击事件
            otherOperationsProject: function (type) {
                if((type).toLowerCase().indexOf('deletedir')>-1){
                    this.deleteDir()
                }else if((type).toLowerCase().indexOf('renamedir')>-1){
                    this.dirDialog('selectedNode')
                }else if((type).toLowerCase().indexOf('dir')>-1){
                    this.dirDialog()
                }

            },
            //删除dir
            deleteDir: function () {
                this.$confirm('真的要删除目录?', '提示', {
                }).then(() => {
                    deleteProject(this.selectedNode.id).then(res => {
                        this.$message({
                            message: '恭喜你，删除已成功！',
                            type: 'success'
                        });
                        this.listRoot();
                       this.$router.go(0)
                    })
                }).catch(() => {
                });
            },
            //目录弹出框
            dirDialog: function (node) {
                var nodeTmp = node? this.selectedNode: undefined
                this.tmpName = node? this.selectedNode.name: ''
                this.$refs.addDir.dialogAddDir (nodeTmp)
            },
            //添加或编辑目录
            addOrEditDir : function (newValue,node) {
                var isNew = node? false: true
                node? node.name: "新建项目";
                if(!node) {
                    node = {name: newValue}
                } else {
                    node = Object.assign({}, node);
                    node.name = newValue;
                }
                var addOrEditDir = isNew ? postProject(node):  putProject(node);
                //提交 dir
                addOrEditDir.then(data => {
                    if(!isNew)
                        this.selectedNode.name = node.name;
                    this.listRoot();
                },error =>{
                    if(!isNew ){
                        this.selectedNode.name = this.tmpName
                    }
                    this.tmpName = ''
                    // this.$confirm(error.response.data.err,"错误", {
                    //     type: "error"
                    // })
                })
            },
            listRoot:function(){
                //获取目录树根节点
                var para = '';
                getRootsProject(para).then(data =>{
                    this.loading = false;
                    this.theModel = data;
                }, err => {
                        this.loading = true;
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    }
                )
            },
        },
        mounted() {
            this.listRoot();
            //点击目录树结构触发的事件
            resIn.$on('childMethod', (selecteNode) => {
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
        background-color: #f2f3f9;
        border-right: 1px solid #cccccc;
        overflow-x: hidden;
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
        border-bottom: 1px solid #cccccc;
        box-sizing: border-box;
        width: 100%;
        height: 50px;
        line-height: 50px;
        box-shadow: 0px 1px 10px 0 rgba(0, 0, 0, 0.1);
    }

    #ep-nav2 .nav2-header strong {
        float: left;
        margin-left: 15px;
    }

    #ep-nav2 .nav2-header .el-dropdown {
        float: right;
        margin: 0px 10px 0px 0px;
    }

    #ep-nav2 .nav2-header .el-dropdown span {
        color: #6d6f74;
        margin-left: 5px;
    }

    #ep-nav2 .nav2-header .el-dropdown span i {
        margin-right: 0px;
    }
    .container .main .content-container .breadcrumb-container{
        padding: 0;
    }

    .el-dropdown-link i{
        font-size: 12px;
        color: #b2b3b9;
    }

    ul.el-dropdown-menu el-dropdown-item:first-child.el-dropdown-menu__item{
        border-bottom: 1px solid #cccccc;
    }

    ul.el-dropdown-menu el-dropdown-item.el-dropdown-menu__item{
        padding: 5px 0px 5px 0px;
        color: #666666;
    }
    ul.el-dropdown-menu el-dropdown-item.el-dropdown-menu__item i{
        color: #a7a7aa;
    }
    .container .breadcrumb-container{
        margin: 0px;

    }
    .otherButton{
        float: right ;
        margin-left: -15px
    }
    .tree-menu{
        min-height: 50%;
    }
    .tree-menu ul{
        padding: 0px 0px 0px 0px;
    }
</style>