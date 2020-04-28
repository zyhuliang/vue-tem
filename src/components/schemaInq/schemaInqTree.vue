<template>

    <el-form id="dataTree" ref="form" :model="form" label-width="80px" @submit.prevent="onSubmit">
        <div class="dt-menu tree well">
            <ul class="tree-parent">
                <li>
                    <ul class="ulP" v-for="(tree,key,index) in theModel">
                        <schema-inq-tree  ref="schemaInqTree" :model="tree"></schema-inq-tree>
                    </ul>
                </li>
            </ul>
        </div>
    </el-form>
</template>

<script>
    import schemaInqTree from './schemaTreeMenu.vue'
    import { resDirTree } from '@api'
    import {queryObject,createParameter} from '@function/queryParameter.js';
    export default {
        components: {
            schemaInqTree
        },
        data() {
            return {
                form: {
                    name: '',
                },
                theModel: [],
                navLoading:true
            }
        },
        methods: {
            onSubmit() {

            },
            //获取data菜单接口
            schemaNavList:function dataNavList(parameter){
                // GET schema tree
                resDirTree(parameter).then(data => {
                    // console.log(data);
                    this.theModel = data;
                    // var parameter={parentId: data[0].id, limit: 8, offset: 0, sorts: "-lastModifiedTime"}
                    var parameter =createParameter('parentId',data[0].id,'EQUAL').Build();
                    //get schema list
                    this.$emit('transferSchemaNavId',data[0].id,this.navLoading,data[0].owner);
                }, err => {
                    this.$message({
                        message: err.response.message,
                        type: 'error',
                        duration: 1500
                    });
                })
            },

        },
        mounted() {
            //初次获取资源目录schema树的参数
            var parameter = {allUser: true, excludes: "", includes: 'schema_dir', strict:true};
            this.schemaNavList(parameter)
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
        box-sizing: border-box;
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