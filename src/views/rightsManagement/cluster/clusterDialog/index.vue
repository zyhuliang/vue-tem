<template>
  <div class="dialog-cluster">
    <el-dialog
      title="注册"
      :visible.sync="dialogFormVisible"
      width="50%"
      v-dialog-drag
      :closed="handleClose"
    >
      <el-form :model="form">
        <el-row type="flex" justify="end">
          <el-col><el-button @click="addItem('add', '')">添加</el-button></el-col>
          
        </el-row>
        <el-row
          v-for="(parentItem, parentIndex) in formItem"
          :key="parentIndex"
        >
          <el-col :span="24">
            <el-divider content-position="left"></el-divider>
            <el-form-item label="name" :label-width="formLabelWidth">
              <el-select v-model="parentItem.name" placeholder="请选择活动区域">
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="(item, index) in selectOption"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="livyUrl" :label-width="formLabelWidth">
              <el-row type="flex" class="row-bg" justify="space-between">
                <el-input
                  v-model="parentItem.livyUrl"
                  placeholder = "http://ip-address:port"
                  autocomplete="off"
                  style="width:50%"
                ></el-input>
              </el-row>
            </el-form-item>
            <el-form-item label="hdfsUrl" :label-width="formLabelWidth">
              <el-row>
                <el-col :span="16">
                    <el-input
                    v-model="parentItem.hdfsUrl"
                    :disabled="true"
                    placeholder = "hdfs://ip-address:port"
                    autocomplete="off"
                    style="width:50%"
                  ></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="httpfsUrl" :label-width="formLabelWidth">
              <el-row>
                <el-col :span="16">
                    <el-input
                    v-model="parentItem.httpfsUrl"
                    :disabled="true"
                    placeholder = "hdfs://ip-address:port"
                    autocomplete="off"
                    style="width:50%"
                  ></el-input>
                </el-col>
                <el-col :span="4">
                  <el-upload
                    class="upload-demo"
                    action=" /api/cluster/uploadconf "
                    :headers="{'X-AUTH-TOKEN':xToken}"
                    :before-upload="clearFiles"
                    :on-change="handleChange"
                    :on-success="fileSucceed"
                    :on-error="fileError"
                    :show-file-list="uploadFileStatus"
                    :file-list="fileList">
                    <el-button slot="trigger" @click="uploadFile(parentIndex)" size="small" type="primary">上传<i class="el-icon-upload el-icon--right"></i></el-button>
                  </el-upload>
              </el-col>

                <el-button
                  @click="addItem('remove', parentIndex)"
                  v-show="parentIndex != 0"
                  >移除</el-button
                >
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer v-dialog-footer">
        <el-button @click="cancle()">取 消</el-button>
        <el-button type="primary" @click="onSubmit(false)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  clusterinfo,
  clusterAll,
  createCluster,
  listCluster,
  disableCluster,
  enableCluster,
  removeCluster,
  cancleCluster
} from "@/api/cluster/index.js";
import { mapGetters, mapActions, mapState } from "vuex";
import _ from "lodash";
export default {
  watch: {
    data(val) {
      this.dialogFormVisible = val.dialogFormVisible;
      //this.formItem = [{ name: "", livyUrl: "" }];
      this.handleClose();
    }
  },
  props: {
    data: {
      type: Object,
      default: false
    }
  },
  components: {},
  data() {
    return {
      xToken:sessionStorage['x-auth-token'],
      dialogFormVisible: false,
      form: {
        name: "",
        livyUrl: "",
        hdfsUrl: '',
        httpfsUrl: ''
      },
      formLabelWidth: "120px",
      selectOption: [],
      formItem: [{fileId:"", name: "", livyUrl: "" ,hdfsUrl: "", httpfsUrl: ''}],
      fileList: [],
      index:0,
      ids:[],
      uploadFileStatus: true
    };
  },
  computed: {
    //...mapState([""])
  },
  mounted() {
    clusterinfo().then(res => {
      this.selectOption = _.map(res.data, val => {
        return {
          label: val,
          value: val
        };
      });
    });
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed: function() {},
  methods: {
    //...mapActions([""]),
    onSubmit(val) {
      this.dialogFormVisible = val;
      console.log('提交',this.formItem)
      createCluster(this.formItem).then(res => {
        this.$emit("getList", {
          params: { offset: 0, limit: 8 }
        });
        // if (res.data.status == 200) {
        //   this.$message({
        //     message: "操作成功",
        //     type: "success"
        //   });
        //   this.$emit("getList", {
        //     params: { offset: 0, limit: 8 }
        //   });
        // }
      });
    },
    addItem(val, key) {
      if (val == "add") {
        this.formItem = [...this.formItem, { name: "", livyUrl: "",hdfsUrl: "", httpfsUrl:'' }];
      }

      if (val == "remove") {
        this.formItem = _.filter(this.formItem, (item, index) => {
          return index != key;
        });
      }
    },
    handleClose() {
      this.formItem = [{ name: "", livyUrl: "",hdfsUrl: "", httpfsUrl:'' }];
    },
    handleChange(file, fileList) {
        if(fileList.length >=2){
            fileList.splice(0,1)
        }
    },
    fileSucceed(response, file,fileList){
      this.$message({
        message:file.name+'上传成功',
        type: 'success'
      })
      this.uploadFileStatus = false
      this.formItem[this.index].hdfsUrl =response.properties['fs.defaultFS']
      this.formItem[this.index].httpfsUrl =response.properties['dfs.namenode.http-address']
      //httpfsUrl
      this.formItem[this.index].fileId = response.fileId
      this.$set(this.formItem[this.index],'hdfsUrl',response.properties['fs.defaultFS'])
      this.$set(this.formItem[this.index],'httpfsUrl',response.properties['dfs.namenode.http-address'])
      // console.log('上传成功',this.formItem)
      // console.log('上传成功',response)
    },
    fileError(err, file, fileList) {
      this.$message({
        message:'上传失败',
        type: 'error'
      })
    },
    uploadFile(val){
      this.index = val
    },
    cancle(){
      this.dialogFormVisible = false
      this.ids = []
      this.formItem.forEach(item=>{
        this.ids.push(item.fileId)
      })
      cancleCluster(this.ids).then(res=>{
        console.log(res)
      })
    },
    clearFiles(){

    }
  }
};
</script>

<style lang="scss">
.dialog-cluster {
  .v-dialog-footer {
    text-align: center;
  }

  .el-divider {
    margin: 10px 0 !important;
  }
}
</style>
