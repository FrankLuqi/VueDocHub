<template>
  <div class="report-item" v-loading.fullscreen.lock="loading">
    <el-table
      align="center"
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="文件类别名称"
        width="250">
      </el-table-column>
      <el-table-column
        prop="count"
        label="文件数量"
        width="180">
      </el-table-column>
      <el-table-column
        prop="downloads"
        width="180"
        label="下载量">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'DocReport',
  data () {
    return {
      loading: false,
      tableData: []
    }
  },
  mounted () {
    var _this = this
    this.loading = true
    this.postRequest('http://localhost:8082/getDocReportByCategory', {
      token: _this.$store.state.user.token
    }).then(response => {
      if (response.data !== '') {
        _this.tableData = response.data
      }
      _this.loading = false
    }).catch((error) => {
      console.log(error)
      _this.loading = false
      this.$message.error('服务器错误')
    })
  }
}
</script>
<style lang="stylus" scoped>
  .report-item
    text-align center
    height 80%
    overflow auto
</style>
