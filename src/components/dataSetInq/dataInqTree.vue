<template>
    <el-form id="dataTree" ref="form" :model="form" label-width="80px" @submit.prevent="onSubmit">
        <div class="dt-menu tree well">
            <ul class="tree-parent">
                <li>
                    <ul class="ulP" v-for="(tree,key,index) in theModel">
                        <data-inq-tree  ref="dataInqTree" :model="tree" ></data-inq-tree>
                    </ul>
                </li>
            </ul>
        </div>
    </el-form>
</template>

<script>
    import dataInqTree from './DataTreeMenu.vue'
    import { resDirTree } from '@api'

    import {queryObject,createParameter} from '@function/queryParameter.js';

    export default {
        components: {
            dataInqTree
        },
        data() {
            return {
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: '',
                    navLoading:true
                },
                theModel: []
            }
        },
        methods: {
            onSubmit() {

            },
            //获取data菜单接口
            dataNavList:function dataNavList(parameter){
                // GET /someUrl
                resDirTree(parameter).then(data => {
                    this.theModel = data;
                    this.navLoading = false;
                    var parameter =createParameter('parentId',data[0].id,'EQUAL').Build();
                    this.$emit('transferNavId',data[0].id,this.navLoading,data[0].owner);
                }, err => {
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
            //初次获取资源目录data树的参数
            var parameter = {allUser:true,excludes:"$Workflow;$Dataflow;$Streamflow",includes:"dataset_dir",strict:true};

            this.dataNavList(parameter)
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