<template>
  <div class="user-table" v-loading.fullscreen.lock="loading">
    <el-table
      :data="userItem"
      width="100%"
      align="center"
      style="width: 100%">
      <el-table-column
        label="用户名"
        width="200">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="用户角色"
        width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.userRole }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="300">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="changeUserRole(scope.$index, scope.row)">更改用户角色</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :modal="false"
      title="修改用户部门角色"
      :visible.sync="showPowerChooseDialog"
      :before-close="PowerDialogClose">
      <div class="block" style="text-align: center">
        <div>
          <el-cascader
            expand-trigger="hover"
            :options="departments"
            v-model="departmentPower">
          </el-cascader>
          <el-select v-model="rolePower" placeholder="请选择角色">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-button type="primary" @click="addPower">添 加</el-button>
        </div>
        <div style="margin-top: .1rem">
          <el-tag
            v-for="tag in powerList"
            :key="tag.id"
            @close="handleCloseTag(tag)"
            closable>
            {{tag.name}}
          </el-tag>
        </div>
      </div>
      <div style="text-align: center">
        <el-button style="margin-top: .3rem" type="primary" @click="confirmAddPower">确 定</el-button>
      </div>
    </el-dialog>
    </div>
</template>
<script>
export default {
  name: 'UserTable',
  data () {
    return {
      userItem: [],
      loading: false,
      showPowerChooseDialog: false,
      powerList: [],
      nowUserIndex: -1,
      roles: [],
      departments: [],
      rolePower: '',
      departmentPower: []
    }
  },
  methods: {
    changeUserRole (index, row) {
      // alert(row.role)
      this.showPowerChooseDialog = true
      if (this.powerList.length === 0) {
        this.powerList = JSON.parse(row.role)
      }
      this.nowUserIndex = index
    },
    handleDelete (index, row) {
      var _this = this
      if (row.id.toString() !== this.$store.state.user.userId.toString()) {
        this.loading = true
        this.postRequest('http://localhost:8082/deleteUser', {
          token: _this.$store.state.user.token,
          userId: row.id
        }).then(response => {
          this.loading = false
          if (response.data.code === 'Success') {
            this.$message.success('删除成功')
            this.userItem.splice(index, 1)
          } else {
            this.$message.error(response.data.msg)
          }
        }).catch((error) => {
          console.log(error)
          _this.loading = false
          this.$message.error('服务器错误')
        })
      } else {
        this.$message.warning('不能删除自己')
      }
    },
    PowerDialogClose (done) {
      // 关闭权限选择窗口
      this.rolePower = ''
      this.departmentPower = []
      this.powerList = []
      done()
    },
    addPower () {
      // 添加用户角色
      if (this.rolePower === '' && this.departmentPower.length === 0) {
        this.$message.warning('请选择部门角色')
        return
      }
      this.loading = true
      var _this = this
      this.postRequest('http://localhost:8082/addOwendRole', {
        token: _this.$store.state.user.token,
        userId: _this.userItem[_this.nowUserIndex].id,
        roleId: _this.rolePower,
        departmentId: _this.departmentPower.length !== 0 ? _this.departmentPower[_this.departmentPower.length - 1] : ''
      }).then(response => {
        _this.loading = false
        if (response.data.code === 'Success') {
          var p = {}
          p.id = response.data.ownedRoleId
          p.name = ''
          if (this.departmentPower.length !== 0) {
            p.departmentId = this.departmentPower[this.departmentPower.length - 1]
            // 根据部门id获取 部门名称
            // alert(p.departmentId)
            function getLabel (list) {
              for (var item of list) {
                // alert(item.value)
                if (item.value === p.departmentId) {
                  return item.label
                }
                if (item.children !== undefined) {
                  var result = getLabel(item.children)
                  if (result !== undefined) {
                    return result
                  }
                }
              }
            }
            p.name += getLabel(this.departments)
            p.name += ' '
          } else {
            p.departmentId = ''
          }
          p.name += this.roles[_this.rolePower - 1].name
          this.userItem[this.nowUserIndex].userRole = _this.userItem[this.nowUserIndex].userRole + ' ' + p.name
          this.powerList.push(p)
          this.userItem[this.nowUserIndex].role = this.powerList
          this.rolePower = ''
          this.departmentPower = []
        } else {
          this.$message.error(response.data.msg)
          this.rolePower = ''
          this.departmentPower = []
        }
      }).catch((error) => {
        console.log(error)
        _this.loading = false
        this.$message.error('服务器错误')
      })
    },
    handleCloseTag (tag) {
      var _this = this
      this.loading = true
      this.postRequest('http://localhost:8082/deleteOwendRole', {
        token: _this.$store.state.user.token,
        owendRoleId: tag.id
      }).then(response => {
        _this.loading = false
        if (response.data.code === 'Success') {
          this.powerList.splice(this.powerList.indexOf(tag), 1)
          this.$message.success('删除成功')
          var name = ''
          for (var p of this.powerList) {
            name += p.name
          }
          _this.userItem[_this.nowUserIndex].userRole = name
          _this.userItem[_this.nowUserIndex].role = _this.powerList
        } else {
          this.$message.error(response.data.msg)
        }
      }).catch((error) => {
        console.log(error)
        _this.loading = false
        this.$message.error('服务器错误')
      })
    },
    confirmAddPower () {
      this.showPowerChooseDialog = false
      this.rolePower = ''
      this.departmentPower = []
    }
  },
  mounted () {
    this.currentUserId = this.$store.state.user.userId
    var _this = this
    this.loading = true
    this.postRequest('http://localhost:8082/getUsers', {
      token: _this.$store.state.user.token
    }).then(response => {
      if (response.data !== '') {
        _this.userItem = response.data
      }
      _this.loading = false
    }).catch((error) => {
      console.log(error)
      _this.loading = false
      this.$message.error('服务器错误')
    })
    if (this.departments.length === 0) {
      this.postRequest('http://localhost:8082/getDepartmentsInfo', {
        token: _this.$store.state.user.token
      }).then(response => {
        _this.departments = response.data
      }).catch((error) => {
        console.log(error)
        _this.loading = false
        this.$message.error('服务器错误')
      })
    }
    if (this.roles.length === 0) {
      this.postRequest('http://localhost:8082/getRoles', {
        token: _this.$store.state.user.token
      }).then(response => {
        _this.roles = response.data
      }).catch((error) => {
        console.log(error)
        _this.loading = false
        this.$message.error('服务器错误')
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
  .user-table
    height 60%
    overflow auto
</style>
