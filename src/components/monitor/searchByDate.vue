<!--日期查询插件-->
<template>
    <section class="left">
        <el-date-picker
                v-model="dateValue"
                type="daterange"
                value-format="timestamp"
                @change="handledateValue"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
        </el-date-picker>
        <div v-show="startTime" ref="startTime">{{dateValue[0]}}</div>
        <div v-show="endTime" ref="endTime">{{dateValue[1]}}</div>
    </section>
</template>
<script>
    import {queryObject, createParameter} from '@function/queryParameter.js';

    export default {
        name: 'searchByDate',
        data() {
            return {
                dateValue: '',
                startTime: false,
                endTime: false
            }
        },
        methods: {
            handledateValue: function (val) {
                if (val == null) {
                    this.dateValue = [];
                } else {
                    this.dateValue = [val[0], val[1] + 86399000];
                }
                var str = this.interceptedStr(this.$route.path)
                var test = Number(this.$refs.startTime.innerText);
                var parameter = createParameter('lastModifiedTime', Number(this.$refs.startTime.innerText), 'GREATER_THAN').And('lastModifiedTime', Number(this.$refs.endTime.innerText), 'LESS_THAN').And('statusType', str, 'EQUAL').Build();
                this.$emit('searchByDateKey', parameter);
            },
        }
    }
</script>
<style scoped>
    .left {
        float: right;
    }
</style>