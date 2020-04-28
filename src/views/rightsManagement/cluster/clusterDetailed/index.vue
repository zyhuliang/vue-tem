<template>
  <div class="dialog-cluster">
    <el-dialog
      :title="name"
      :visible.sync="dialogDetailedVisible"
      width="50%"
      v-dialog-drag
      :closed="handleClose"
    >
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="Livy">
        <el-col :span="16">
          <el-input  v-model="form.livyUrl"></el-input>
        </el-col>  
      </el-form-item><el-form-item label="HDFS">
        <el-col :span="16">
            <el-input :disabled="true"  v-model="form.hdfsUrl"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="httpfsUrl">
        <el-col :span="16">
            <el-input :disabled="true"  v-model="form.httpfsUrl"></el-input>
        </el-col>
        
          <el-col :span="4">
              <el-upload
                class="upload-demo"
                ref="upload"
                action=" /api/cluster/uploadconf "
                :headers="{'X-AUTH-TOKEN':xToken}"
                :on-change="handleChange"
                :on-success="fileSucceed"
                :on-error="fileError"
                :file-list="fileList">
                <el-button  slot="trigger" size="small" type="primary">上传<i class="el-icon-upload el-icon--right"></i></el-button>
              </el-upload>
            </el-col>
            <el-col :span="4">
          <div> <el-button slot="trigger" size="small" @click="downLoad()" type="primary">下载<i class="el-icon-download el-icon--right"></i></el-button></div>
        </el-col>
      </el-form-item>

   </el-form>
   <el-row>
     <el-col>
       <p style="margin:20px 0 20px 0;">DF-EXECUTOR信息</p>
     </el-col>
   </el-row>
    <el-table
        :data="tableData"
        height="250"
        auto
        border>
        <el-table-column
        prop="instanceId"
        label="instanceId">
        </el-table-column>
        <el-table-column
        prop="uri"
        label="uri">
        </el-table-column>
        <el-table-column
        prop="rpc-callback-url"
        label="rpc-callback-url">
        <template slot-scope="scope">
          {{ scope.row.metadata['rpc-callback-url'] }}
        </template>
        </el-table-column>
    </el-table>
      <div slot="footer" class="dialog-footer v-dialog-footer">
        <el-button @click="cancle()">取 消</el-button>
        <el-button type="primary" @click="updateClusterFn()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import { updateCluster, cancleCluster, clusterDown } from "@/api/cluster/index.js";
import _ from "lodash";
export default {
  watch: {
      data:{
          handler(val) {
            this.paramer = JSON.parse(JSON.stringify(val))
            this.dialogDetailedVisible = val.dialogDetailedVisible
            this.name = val.name
            this.form.livyUrl = val.livyUrl
            this.form.hdfsUrl = val.hdfsUrl
            this.form.httpfsUrl = val.httpfsUrl
            this.tableData = val.dfInstance
        },
        deep: true
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
        xToken:sessionStorage['x-auth-token'],
        dialogDetailedVisible:false,
        form:{
            livyUrl:'',
            hdfsUrl: '',
            httpfsUrl: ''
        },
        name:'',
        tableData:[],
        paramer:{},
        fileList:[],
        fileId:[]
    };
  },
  computed: {
    //...mapState([""])
  },
  mounted() {
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed: function() {},
  methods: {
      handleClose(){},
      updateClusterFn(){
        this.paramer = {
          ...this.paramer,
          ...this.form,
          enabled:this.filterenabled(this.paramer.enabled),
          createTime: this.dateToStr(this.paramer.createTime),
          lastModifiedTime: this.dateToStr(this.paramer.lastModifiedTime)
        }
        this.dialogDetailedVisible = false
        updateCluster(this.paramer,this.paramer.id).then(res=>{
           this.$message({
             message:'更新成功',
             type:'success',
           })
           

        })
      },
      //日期转时间戳
      dateToStr(val){
        // let value = val.toString()
        let date = new Date(val)

        let time = date.getTime()
        return Number(time)
      },
      filterenabled(val){
        if(val=='启用'){
          return '1'
        } else {
          return '0'
        }
      },
      handleChange(file, fileList) {
        if(fileList.length >=2){
            fileList.splice(0,1)
        }
      },
      fileSucceed(response, file,fileList){
        this.form.hdfsUrl = response.properties['fs.defaultFS']
        this.form.httpfsUrl = response.properties['dfs.namenode.http-address']
        this.form.fileId = response.fileId
        this.fileId[0] = response.fileId
        // this.$set(this.formItem[this.index],'hdfsUrl',response.properties['fs.defaultFS'])
        console.log('上传成功',this.form)
      },
      fileError(err, file, fileList) {

      },
      uploadFile(val){
        this.index = val
        console.log(val)
      },
      cancle(){
        this.dialogDetailedVisible = false
        cancleCluster(this.fileId).then(res=>{
          console.log(res)
        })
      },
      downLoad(){
        clusterDown(this.paramer.id)
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
