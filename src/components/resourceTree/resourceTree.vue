<template>
    <el-form id="dataTree" ref="form" :model="form" label-width="180px">
        <div class="dt-menu tree well">
            <ul class="tree-parent">
                <li>
                    <ul class="ulP" v-for="(tree,key,index) in theModel">
                        <resource-menu  ref="schemaMenu" :model="tree"></resource-menu>
                    </ul>
                </li>
            </ul>
        </div>
    </el-form>
</template>

<script>
    import resourceMenu from './resourceTreeMenu.vue'
    import resourceJs from './resourceInq.js'
    import { resDirTree } from '@api'
    export default {
        props:{
            theModel:''
        },
        components: {
            resourceMenu
        },
        data() {
            return {
                form: {
                    name: '',
                },
                selectedNode:{}
            }
        },
        methods: {
            getTree: function (parameter) {
                resDirTree(parameter).then(data => {
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
            resourceJs.$on('getNode',data=>{
                this.selectedNode = data;
            })
        }
    }

</script>

<style lang="scss" scoped>
    #dataTree {
        float: left;
        margin: 0 0 10px 0;
        background-color: #f9f9f9;
        width: 100%;
        height: calc(70vh - 50px);
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