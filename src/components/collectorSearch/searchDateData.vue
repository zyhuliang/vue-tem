<template>
    <span>
        <el-date-picker
                v-model="dateValue"
                type="daterange"
                @change="handleDateValue"
                value-format="timestamp"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
        </el-date-picker>
    </span>
</template>

<script>
    import {queryObject,createParameter} from '@function/queryParameter.js';
    export default {
        name: 'searchDateData',
        props:['searchInput','pagesize'],
        data() {
            return {
                dateValue: '',
                startTime: false,
                endTime:false,
            }
        },
        methods: {
            initParameter: function () {
                this.dateValue= ''
            },
            handleDateValue:function (val) {
                if(val == null){
                    this.dateValue = [];
                }else{
                    this.dateValue = [val[0],val[1]+86399000];
                }
                if(this.dateValue != null) {
                    var parameter = this.buildParameters(this.pagesize,1, this.dateValue[0],this.dateValue[1],this.searchInput)
                    this.$emit('searchDate', parameter,'',this.dateValue[0],this.dateValue[1], this.searchInput,this.pagesize);
                }else {
                    var parameter = this.buildParameters(this.pagesize,1,'','',this.searchInput)
                    this.$emit('searchDate', parameter,'','','', this.searchInput,this.pagesize);
                }
                
            },
        }
    }

</script>

<style lang="scss" scoped>

</style>