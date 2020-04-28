<!--  数据源 查询 树状图组件  -->
<template>
    <li class="treeBox">
        <i @click="toggle(model)"  class="icon" :class="[open ? 'fa fa-folder-open navopen': 'fa fa-folder navclose']"></i>
        <em @click="dataNavStyle(model)" ref="dataSourceInqDataCss" class="dataSourceInqActive" :name="model.name |nameFilter">{{ model.name |nameFilter}}&nbsp;{{ model.children.length | lengthFilter}}</em>
        <ul class="ulC" v-show="open" >
            <tree-menu v-for="(tree,index) in model.children" :key="index" :model="tree"></tree-menu>
        </ul>
    </li>
</template>

<script>
    import daInCom from './dataSourceInq.js'
    import {  } from '@api'

    export default {
        name: 'tree-menu',
        props: ['model',''],
        data() {
            return {
                open: false,
            }
        },
        computed: {
            isFolder: function() {
                return this.model.children && this.model.children.length
            }
        },
        filters: {
            lengthFilter : function (value) {
                if(value == "0"){
                    return "";
                }else {
                    return "(" + value + ")";
                }
            },
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
        },
        methods: {
            //点击文件夹图标调用事件，更新树
            toggle: function(data,open) {
                if(data.id) {
                }
                if(!open)
                    this.open = !this.open
            },
            //点击目录树节点名称图标调用事件，更新列表
            dataNavStyle:function (dataNavId) {
                var arr = document.getElementsByClassName("dataSourceInqActive");
                for(var i = 0 ; i< arr.length; i++){
                    arr[i].style.color = '';
                }
                this.$refs.dataSourceInqDataCss.style.color = '#3e98fe';
                daInCom.$emit('childMethod',dataNavId);
            }
        }
    }
</script>

<style scoped>
    ul em{
        font-style: normal;
        cursor: pointer;
    }
    .icon.el-icon-tickets {
        color: #999999;
        font-size: 12px;
    }
    .tree-menu li {
        line-height: 1.5;
    }
    .treeBox{
        padding: 9px 5px 0 5px!important;
    }
    ul.ulC{
        margin: 0px 0 0px 15px;
        padding: 0;
    }
    ul.ulC div{
        line-height: 20px;
    }
    ul.ulC div span{

    }
    .activetrue{
        color: #3e98fe
    }
</style>