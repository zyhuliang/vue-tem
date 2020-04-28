<!--  nav2 树状图组件  -->
<template>
    <li id="bm-rh-treeMenu">
        <i @click="toggle(model)"  class="icon" :class="[open ? 'fa fa-folder-open navopen': 'fa fa-folder navclose']"></i>
        <em @click="dataNavStyle(model)" ref="dataTreeProDataCss" class="dataTreeProActive" :name="model.name">{{ model.name }}</em>
        <ul v-show="open" >
            <tree-menu v-for="(tree,index) in model.children" :key="index" :model="tree"></tree-menu>
        </ul>
    </li>
</template>

<script>
    import resIn from './resNav.js'
    import { getProject } from '@api'

    export default {
        name: 'tree-menu',
        props: ['model'],
        data() {
            return {
                open: false
            }
        },
        computed: {
            isFolder: function() {
                return this.model.children && this.model.children.length;
            }
        },
        filters: {
            shareFilter: function (value) {
                if(value === "share_category"){
                    return "共享";
                }else if(value === "inbox_category"){
                    return "跨租户共享";
                }else {
                    return value;
                }
            },
            shareClassFilter : function (value) {
                if(value === "share_category"){
                    return "icon el-icon-share";
                }else if(value === "inbox_category"){
                    return "icon el-icon-share";
                }else{
                    return "fa fa-folder-o";
                }
            },
            lengthFilter : function (value) {
                if(value == "0"){
                    return "";
                }else {
                    return "(" + value + ")";
                }
            }
        },
        methods: {
//            点击文件夹图标调用事件，更新树
            toggle: function(data,open) {
                if(data.id) {
                    if(data.resType){
                        return;
                    }
                    getProject(data.id).then(data => {
                        this.model.children = data.children;
                    },error =>{
                        // this.$confirm(error.response.data.err,"错误", {
                        //     type: "error"
                        // })
                    })
                }
                if(!open)
                    this.open = !this.open
            },
//            点击目录树节点名称图标调用事件，更新列表
            dataNavStyle:function (dataNavId) {
                var arr = document.getElementsByClassName("dataTreeProActive");
                for(var i = 0 ; i< arr.length; i++){
                    arr[i].style.color = '';
                    arr[i].classList.remove("activeB");
                }
                this.$refs.dataTreeProDataCss.style.color = '#3e98fe';
                resIn.$emit('childMethod',dataNavId);
            }
        }
    }
</script>

<style scoped>

    b{
        font-weight: normal;
    }
	i.icon {
		display: inline-block;
        float: left;
        margin: 2px 3px 0px 0px;
		width: 14px;
		height: 14px;
        line-height: 14px;
        font-size: 14px!important;
		background-repeat: no-repeat;
		vertical-align: middle;
	}
    .adminIcon{
        float: inherit!important;
        margin: -2px 2px 0px 2px!important;
        font-size: 14px;
        color: #333333;
    }
    .active{
        color: #333333;
    }
    .navChildLength{
        color: #999999;
    }
    .activeB .navChildLength{
        color: #3e98fe!important;
    }
	.tree-menu ul {
        padding: 0px 0px 0px 15px;
	}
    .tree-menu ul div{
        line-height: 1.6;
    }
</style>