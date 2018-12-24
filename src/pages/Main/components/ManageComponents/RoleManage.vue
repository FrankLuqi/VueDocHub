<template>
  <div class="role-manage"  v-loading.fullscreen.lock="loading">
    <el-table
      :data="roles"
      width="100%"
      align="center"
      style="width: 100%">
      <el-table-column
        label="角色名称"
        width="200">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="300">
        <template slot="header" slot-scope="scope">
          <el-button
            size="mini"
            @click="addRole(scope.$index, scope.row)">添加角色</el-button>
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="deleteRole(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'RoleManage',
  data () {
    return {
      roles:[],
      loading: false,
      roleName: ''
    }
  },
  methods: {
    deleteRole (index, row) {
      var _this = this
      this.loading = true
      this.postRequest('http://localhost:8082/RoleManage/deleteRole', {
        token: _this.$store.state.user.token,
        roleId: row.id
      }).then(response => {
        _this.loading = false
        if (response.data.code === 'Success') {
          this.roles.splice(index, 1)
          this.$message.success('删除成功')
        } else {
          this.$message.error(response.data.msg)
        }
      }).catch((error) => {
        console.log(error)
        _this.loading = false
        this.$message.error('服务器错误')
      })
    },
    addRole (index, row) {
      this.openInput()
    },
    openInput () {
      var _this = this
      this.loading = true
      this.$prompt('请输入角色名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.roleName = value
        this.postRequest('http://localhost:8082/RoleManage/addRole', {
          token: _this.$store.state.user.token,
          roleName: _this.roleName
        }).then(response => {
          _this.loading = false
          if (response.data.code === 'Success') {
            var p = {}
            p.name = response.data.name
            p.id = response.data.id
            this.roles.push(p)
            this.$message.success('添加成功')
          } else {
            this.$message.error(response.data.msg)
          }
        }).catch((error) => {
          console.log(error)
          _this.loading = false
          this.$message.error('服务器错误')
        })
      }).catch(() => {

      })
    }
  },
  mounted () {
    var _this = this
    this.loading = true
    this.postRequest('http://localhost:8082/getRoles', {
      token: _this.$store.state.user.token
    }).then(response => {
      _this.loading = false
      if (response.data !== '') {
        _this.roles = response.data
      }
    }).catch((error) => {
      console.log(error)
      _this.loading = false
      this.$message.error('服务器错误')
    })
  }
}
</script>
<style lang="stylus" scoped>
</style>
