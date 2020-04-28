<template>
  <div class="upload">
    <div v-if="dialogUploadVisible == true" class="nodeDialog">
      <div class="diHeader">
        <h3>
          <i class="i titleIcon fa fa-upload"></i>&nbsp;批量导入
        </h3>
        <span @click="dialogUploadVisible = false" class="el-icon-close"></span>
      </div>
      <div class="diContent">
        <div class="rf-swap">
          <el-input
            type="textarea"
            class="areaSize"
            v-model="upLoadVal"
            placeholder="请输入表达式(多个以'回车'作为分隔符)"
            @change="(value) => upLoadArea(value)"
            name="upLoadVal"
          ></el-input>
        </div>
      </div>
      <div slot="footer" class="diFooter">
        <el-button type="primary" @click="submitUpload" name="uploadSure">确定</el-button>
        <el-button @click="dialogUploadVisible = false" name="uploadCancel">取消</el-button>
      </div>
    </div>
  </div>
</template>


<script>
import { mapGetters, mapActions, mapState } from "vuex";
import _ from "lodash";
export default {
  watch: {
    data(val) {
      this.dialogUploadVisible = val.dialogUploadVisible;
    }
  },
  props: {
    data: {
      type: Object,
      default: false
    }
  },
  components: {},
  data: function() {
    return {
      dialogUploadVisible: false,
      upLoadVal: ""
    };
  },
  computed: {
    //...mapState([""])
  },
  mounted() {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed: function() {},
  methods: {
    //...mapActions([""]),
    submitUpload() {
      var upArr = new Array(); //定义一数组
      if (this.upLoadVal == "") {
        this.dialogUploadVisible = false;
      } else {
        upArr = this.upLoadVal.split("\n"); //字符分割
        for (var i = 0; i < upArr.length; i++) {
          //this.expressionsArr.push(upArr[i]);
          this.$emit("setExpressionsArr", upArr[i]);
        }
        this.dialogUploadVisible = false;
      }
    },
    upLoadArea: function(val) {
      this.upLoadVal = val.replace("\r\n", "；");
    }
  }
};
</script>

<style lang="scss">
.upload {
  /*design 执行详细 tabs*/
  .executingDetail .el-tabs__item {
    padding: 0px !important;
  }

  /*design node 嵌套弹出层统一样式*/
  .nodeDialog {
    position: fixed;
    left: 50%;
    top: 10%;
    width: 80%;
    height: 80%;
    margin-left: -40%;
    background-color: #ffffff;
    z-index: 2002;
  }

  .nodeDialog .diHeader {
    position: absolute;
    width: 100%;
    height: 45px;
    z-index: 10;
    line-height: 45px;
    background-color: #4c4c51;
  }

  .nodeDialog .diHeader h3 {
    float: left;
    margin: 0px;
    width: 60%;
    padding: 0px 0px 0px 20px;
    font-weight: normal;
    color: #ffffff;
  }

  .nodeDialog .diHeader span {
    color: #ffffff;
    float: right;
    margin-right: 20px;
    margin-top: 14px;
    font-size: 16px;
    cursor: pointer;
  }

  .nodeDialog .diFooter {
    position: absolute;
    bottom: 0px;
    width: 100%;
    height: 60px;
    border-top: 1px solid #eeeeee;
    background-color: #ffffff;
    padding: 15px 20px 15px 15px;
    z-index: 10;
    box-sizing: border-box;
    text-align: right;
  }

  .nodeDialog .diContent {
    position: absolute;
    padding: 45px 0px 0px 0px;
    box-sizing: border-box;
    width: 100%;
    height: calc(100% - 50px);
  }
}
</style>
