<!--  nav2 树状图组件  -->
<template>
    <li id="bm-designTreeMenu">
        <span>
            <i @click="toggle(model)" v-if="model.resType == 'user' || model.resType == 'user_dir'" :thisId="model.id" :class="[open ? ' fa fa-user-circle navopen': ' fa fa-user-circle-o navclose']"></i>
            <i @click="toggle(model)" v-if="model.resType == 'flow_dir'" style="color: #666666;" class="icon" :class="[open ? 'fa fa-folder-open navopen': 'fa fa-folder navclose']"></i>
            <!--<i v-if="model.name == 'default'" class="adminIcon icon fa fa-sitemap"></i>-->
            <em @click="desNavName(model.id,model.name, model)" ref="designTreeDataCss" class="designTreeActive" v-if="model.halfSelect" style="color: #000000":name="model.name | shareFilter| nameFilter">
                <b class="adminClass icon fa fa-user-circle-o" v-if="model.name == 'admin'">&nbsp;(我的)</b>
                <!--<b class="adminClass icon fa fa-user" v-if="model.resType == 'user' "></b>-->
                {{ model.name | shareFilter| nameFilter }}&nbsp;
                <b class="navChildLength">{{ model.children.length | lengthFilter}}</b>
            </em>
            <em @click="desNavName(model.id,model.name, model)" ref="designTreeDataCss" class="designTreeActive1" v-if="!model.halfSelect"style="color: #87939a" :name="model.name | shareFilter| nameFilter">
                <b class="adminClass icon fa fa-user-circle-o" v-if="model.name == 'admin'">&nbsp;(我的)</b>
                            <!--<b class="adminClass icon fa fa-user" v-if="model.resType == 'user' "></b>-->
                {{ model.name | shareFilter| nameFilter }}&nbsp;
                <b class="navChildLength">{{ model.children.length | lengthFilter}}</b>
            </em>
         </span>
        <ul v-show="open" v-if="isFolder">
            <tree-menu v-for="(tree,index) in model.children" :key="index" :model="tree"></tree-menu>
        </ul>
    </li>
</template>

<script>
    import {} from '@api'
    import desIn from './desNav.js'

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
            nameFilter: function (value) {
                if(value === "OtherUser"){
                    return "其他用户";
                }else if(value === "Flows"){
                    return "根目录";
                } else {
                    return value;
                }
            },
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
            toggle: function(e) {
                if(e.name === "Flows"){
                    desIn.$emit('desParentId',e);
                }
                if(e.id) {
                }
                    this.open = !this.open
            },
            desNavName : function (nameId,pName, node) {
                var arr = document.getElementsByClassName("designTreeActive");
                for(var i = 0 ; i< arr.length; i++){
                    arr[i].style.color = '';
                    arr[i].classList.remove("activeB");
                }
                var arr1 = document.getElementsByClassName("designTreeActive1");
                for(var i = 0 ; i< arr1.length; i++){
                    arr1[i].style.color = '#87939a';
                    arr1[i].classList.remove("activeB");
                }
                this.$refs.designTreeDataCss.style.color = '#3e98fe';
                this.$refs.designTreeDataCss.classList.add("activeB");
                desIn.$emit('desChildId',nameId,pName, node);
            }


        },
        mounted(){
            var that = this;
            desIn.$on('refreshDir',function(selectedNode,type){
                //获取要更新的node的id
                var id = ''
                if((type == 'del'||type == 'move') && selectedNode.parentId == that.model.id){
                    id = selectedNode.parentId
                }else  if(type == 'add' && selectedNode.id == that.model.id){
                    id = selectedNode.id
                }

            })
        }
    }
</script>

<style scoped>
	ul {
		list-style: none;
	}
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
		margin: 0px;
        padding: 0px 0px 0px 15px;
	}
    .tree-menu ul div{
        line-height: 1.6;
    }
</style>
