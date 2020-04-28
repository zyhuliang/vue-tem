<template>
  <el-card class="box-card card-height" shadow="never">
    <div slot="header" class="clearfix">
        <span>日志信息</span>
        <el-button class='clear-button' type="text" @click="clearLog">清除</el-button>
        <el-switch
                v-model="debugStatus"
                inactive-text="调试"
                class="button-color"
                @change="debugChange"
        >
        </el-switch>
    </div>
    <div class="log" v-if="isLog">
        <div v-for="log in logs"><pre>{{log}}</pre></div>
    </div>
    <div class="log" v-if="!isLog">
        <div v-text><pre>{{text}}</pre></div>
    </div>
  </el-card>
</template>
<script>
export default {

  props: ['logs'],
  data () {
    return {
      text: '',
      isLog: true,
      debugStatus: '',
    }
  },
  methods: {
    debugChange () {
    },
    clearLog () {
      this.text = '';
      this.logs = [];
    }
  }
}
</script>
<style lang="scss" scoped>
  .card-height{
    height: 250px;
    .clearfix{
        span, .el-button{
            color: #fff;
        }
    }
    .log{
        overflow-y: auto;
        height: 170px;
    }
    .button-color{
        float: right;
        color: #fff;
    }
  }
</style>

