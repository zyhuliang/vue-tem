<!--  数据源 查询 树状图组件  -->
<template>
    <li class="treeBox">
        <i @click="toggle(model)"  class="icon" :class="[open ? 'icon iconfont icon-ir-nav-open navopen': 'icon iconfont icon-ir-nav-close navclose']"></i>
        <em @click="resourceNavStyle(model)" ref="resourceTreedataCss" class="resourceTreeActive" v-if="model.halfSelect" style="color: #000000":name="model.name |nameFilter">{{ model.name |nameFilter }}&nbsp;{{ model.children.length | lengthFilter}}</em>
        <em @click="resourceNavStyle(model)" ref="resourceTreedataCss" class="resourceTreeActive1" v-if="!model.halfSelect" style="color: #87939a" :name="model.name |nameFilter">{{ model.name |nameFilter }}&nbsp;{{ model.children.length | lengthFilter}}</em>
        <ul class="ulC" v-show="open" >
            <tree-menu v-for="(tree,index) in model.children" :key="index" :model="tree"></tree-menu>
        </ul>
    </li>
</template>

<script>
    import resourceJs from './resourceInq.js'
    import {  } from '@api'

    export default {
        name: 'tree-menu',
        props: ['model'],
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
            resourceNavStyle:function (node) {
                var arr = document.getElementsByClassName("resourceTreeActive");
                for(var i = 0 ; i< arr.length; i++){
                    arr[i].style.color = '';
                }
                //点击之后清空其余节点的蓝色选中恢复半选的灰色
                var arr1 = document.getElementsByClassName("resourceTreeActive1");
                for(var i = 0 ; i< arr1.length; i++){
                    arr1[i].style.color = '#87939a';
                }
                this.$refs.resourceTreedataCss.style.color = '#3e98fe';
                resourceJs.$emit('getNode',node);
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
