<template>
    <el-form id="dataTree" ref="form" :model="form" label-width="80px" @submit.prevent="onSubmit">
        <div class="dt-menu tree well">
            <ul class="tree-parent">
                <li>
                    <ul class="ulP" v-for="(tree) in theModel">
                        <flow-inq-tree ref="dataInqTree" :model="tree"></flow-inq-tree>
                    </ul>
                </li>
            </ul>
        </div>
    </el-form>
</template>

<script>
    import flowInqTree from './FlowTreeMenu.vue'
    import {resDirTree} from '@api'
    import {createParameter} from '@function/queryParameter.js';

    export default {
        components: {
            flowInqTree
        },
        data() {
            return {
                form: {},
                theModel: []
            }
        },
        methods: {
            //获取data菜单接口
            dataNavList: function dataNavList(parameter) {
                // GET /someUrl
                resDirTree(parameter).then(data => {
                    this.theModel = data;
                    var parameter = createParameter('parentId', data[0].id, 'EQUAL').Build();
                    //刷新列表的方法
                    this.$emit('transferNavId', parameter, data[0]);
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
            var parameter = {includes: "flow_dir", strict: true};
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
        line-height: 10px;
        overflow: auto;

        .dt-menu {
            float: left;
            width: 100%;
        }

        .dt-menu ul.ulP {
            margin: 0;
            padding: 0px;

            div {
                line-height: 0px;
            }
        }
    }
</style>