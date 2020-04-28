<template>
  <div
    class="releaseNote"
  >
    <div class="warp">
      <div class="content">
        <el-scrollbar style="height: 386px">
          <p
            v-for="item in releaseNote"
            :key="item"
          >
            {{ item }}
          </p>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ReleaseNote',
  data () {
    return {
      releaseNote: []
    }
  },
  created () {
    this.queryRelease()
  },
  methods: {
    // 查询版本号
    queryRelease () {
       this.serverApi({
        interface: 'queryRelease',
        success: data => {
          this.releaseNote = data.releaseNote
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.releaseNote {
  width: 100%;
  height: calc(100vh - 50px);
  display: flex;
  justify-content: center;
  .warp{
    width: 80%;
    height: 100%;
    background: url('~@images/releaseNote.jpg') no-repeat center;
    background-size: 80%;
    position: relative;
    .content{
      position: absolute;
      left: 22%;
      top: 25%;
      color: #fff;
      p{
        line-height: 24px;
        width: 80%;
      }
    }
  }
}
</style>
