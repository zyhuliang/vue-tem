<template>

    <el-form id="ruleTree" ref="form" :model="form" label-width="80px" @submit.prevent="onSubmit">
        <div class="rt-title">
            <h3>分析类型</h3>
            <el-checkbox @change="whole">全部</el-checkbox>
        </div>
        <div class="rt-menu tree well" v-show="showMenu">
            <ul class="tree-parent">
                <li>
                    <ul v-for="(tree,key,index) in theModel">
                        <nav2-tree :model="tree"></nav2-tree>
                    </ul>
                </li>
            </ul>
        </div>

    </el-form>
</template>

<script>
    var myData = [
        {
            'id': '1',
            'name': '数据类型',
            'menuCode': '10',
            'parameter': '',
            'children': [
                {
                    'name': '列',
                    'menuCode': '11',
                    'children': [
                        {
                            'name': '任意',
                            'menuCode': '121',
                            'parameter': {'name':'fieldValueType','value':'Any'}
                        },
                        {
                            'name': '数值',
                            'menuCode': '122',
                            'parameter': {'name':'fieldValueType','value':'Number'}
                        },
                        {
                            'name': '字符串',
                            'menuCode': '123',
                            'parameter': {'name':'fieldValueType','value':'String'}
                        },
                        {
                            'name': '日期',
                            'menuCode': '124',
                            'parameter': {'name':'fieldValueType', 'value':'Date'}
                        }
                    ]
                },
                {
                    'name': '其他',
                    'menuCode': '12',
                    'parameter': {'name':'dataScope', 'value':'Row|Other'}

                }
            ]
        },
        {
            'id': '2',
            'name': '内建',
            'menuCode': '',
            'parameter': {'name':'buildType', 'value':'Builtin'}
        },
        {
            'id': '3',
            'name': '扩展',
            'menuCode': '30',
            'parameter': {'name':'customType', 'value':'Extend'}
        },
        {
            'id': '4',
            'name': '表达式',
            'menuCode': '',
            'children': [],
            'parameter': {'name':'customType', 'value':'EL'}
        },
        {
            'id': '5',
            'name': 'SQL',
            'menuCode': '',
            'children': [],
            'parameter': {'name':'customType', 'value':'SQL'}
        }
    ];

    import nav2Tree from '../analysisRulesTree/ruleTreeMenu.vue'
    import ruleNav from '../analysisRulesTree/ruleNav.js'
    import { argetDate } from '@api';
    import {queryObject} from "../function/queryParameter";
    import Bus from '@zebra/bus.js'
    var parameter=queryObject();
    export default {
        components: {
            nav2Tree,
            ruleNav
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
                    desc: ''
                },
                theModel: myData,
                showMenu:true
            }
        },
        methods: {
            onSubmit() {

            },
            //table list
            listTable(parameter){
                // GET /someUrl
                argetDate(parameter).then(data => {
                    this.loading = false
                    this.table = data;
                }, err => {
                        this.$message({
                            message: err.response.message,
                            type: 'error',
                            duration: 1500
                        });
                    }
                )

            },
            whole(val){
            	if(val==true){
            		this.showMenu=false;
            		Bus.$emit('checkVal',val)
            		
            	}else{
            		this.showMenu=true;
            	}
            	
            }
        }
    }

</script>

<style lang="scss" scoped>
    #ruleTree{
        /*float: left;*/
        margin: 0px 0 0 0;
        background-color: #ffffff;
        height: calc(100vh - 120px);
        border: 1px solid #dee1e2;
        box-shadow: 0px 1px 10px 0 rgba(0, 0, 0, 0.1);
        overflow: auto;
        .rt-title{
            float: left;
            width: 100%;
            border-bottom: 1px solid #eeeeee;
            box-shadow: 0px 1px 10px 0 rgba(0, 0, 0, 0.1);
            background-color:#f1f3f4;
            h3{
                float: left;
                padding: 0px;
                margin: 12px 10px 10px 10px;
                font-size: 14px;
            }
            label{
                float: right;
                margin: 12px 10px 10px 10px;
            }

        }
        .rt-menu{
            float: left;
            width: 100%;
        }

        .rt-menu ul{
            margin: 0;
        }
    }
</style>