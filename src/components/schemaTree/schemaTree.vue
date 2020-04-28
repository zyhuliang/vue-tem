<template>
    <el-form id="dataTree" ref="form" :model="form" label-width="180px">
        <div class="dt-menu tree well">
            <ul class="tree-parent">
                <li>
                    <ul class="ulP" v-for="(tree,key,index) in theModel">
                        <schema-menu  ref="schemaMenu" :model="tree"></schema-menu>
                    </ul>
                </li>
            </ul>
        </div>
    </el-form>
</template>

<script>
    import schemaMenu from './schemaTreeMenu.vue'
    import schemaJs from './schemaInq.js'
    import { resDirTree } from '@api'
    export default {
        components: {
            schemaMenu
        },
        data() {
            return {
                form: {
                    name: '',
                },
                theModel: [],
                parameter:{},
                selectedNode:{}
            }
        },
        methods: {
            getTree: function () {
                resDirTree(this.parameter).then(data => {
                    this.theModel = data;
                }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                })
            }
        },
        mounted() {
            //初次获取资源目录schema树的参数
            this.parameter = { excludes: "", includes: 'schema_dir', strict:true};
            this.getTree(this.parameter)
            schemaJs.$on('getNode',data=>{
                this.selectedNode = data;
            })
        }
    }

</script>

<style lang="scss" scoped>
    #dataTree {
        float: left;
        margin: 0 0 0 0;
        background-color: #f9f9f9;
        width: 100%;
        height: 100%;
        line-height: 10px;
        overflow: auto;
        .dt-title {
            float: left;
            width: 100%;
            h3 {
                float: left;
                padding: 0px;
                margin: 15px 10px 10px 10px;
                font-size: 14px;
            }
            label {
                float: right;
                margin: 15px 10px 10px 10px;
            }

        }
        .dt-menu{
            float: left;
            width: 100%;
        }
        .dt-menu ul.ulP {
            margin: 0;
            padding:0px;
            div{
                line-height: 0px;
            }
        }
    }
</style>