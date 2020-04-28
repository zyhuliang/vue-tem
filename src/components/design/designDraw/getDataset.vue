<!--  design 设置 参数声明 组件  -->
<template>
    <div>
        <div>
            <el-input placeholder="请输入内容" v-model="fieldSearch" v-on:keydown="keydown" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-table
                    ref="multipleTable"
                    :data="fieldDatas.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                    style="width: 100%;"
                    @row-click="selFields">
                <el-table-column
                        fixed
                        type="index"
                        width="60"
                        :index="indexMethod">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="字段名">
                </el-table-column>
            </el-table>
            <el-pagination small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                           :page-sizes="[10, 20, 50, 100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="fieldDatas.length">
            </el-pagination>
        </div>

    </div>
</template>

<script>

    export default {
        data() {
            return {
                fieldDatas:[],
                fieldSearch:"",
                currentPage: 1,
                copyGetFields:[],
                pagesize: 10,
            }
        },
        props:["getdataset"],
        watch: {
            getdataset:{
                handler: function(val){
                    this.fieldDatas = JSON.parse(JSON.stringify(val))
                    this.copyGetFields = JSON.parse(JSON.stringify(val))
                    this.fieldSearch = ""
                },
                deep: true
            },
            fieldSearch:function(){
                this.keydown();
            },
        },
        methods: {
            indexMethod:function (index) {
                return (this.pagesize * (this.currentPage - 1)+ index + 1);
            },
            handleSizeChange(val) {
                this.pagesize = val;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            selFields:function (row) {
                this.$emit('selDataSet', row.name)
            },
            keydown:function () {
                if(this.fieldSearch != ""){
                    this.fieldDatas = JSON.parse(JSON.stringify(this.copyGetFields.filter( item => (~item.name.indexOf(this.fieldSearch)))));
                }else {
                    this.fieldDatas = JSON.parse(JSON.stringify(this.copyGetFields.filter( item => (~item.name.indexOf(this.fieldSearch)))));
                }
            }
        },
        mounted() {
            this.fieldDatas = JSON.parse(JSON.stringify(this.getdataset))
            this.copyGetFields = JSON.parse(JSON.stringify(this.getdataset))
            this.fieldSearch = ""
        }
    }
</script>

<style scoped lang="scss">

</style>