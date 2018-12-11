<template>
  <div class="user-table">
    <el-table
      :data="userItem"
      width="100%"
      align="center"
      style="width: 100%">
      <el-table-column
        label="用户名"
        width="200">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="用户角色"
        width="200">
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
  </div>
</template>
<script>
export default {
  name: 'UserTable',
  data () {
    return {
      userItem: [{
        id: '1',
        userName: '鹿琦',
        userRole: '管理员'
      }]
    }
  },
  methods: {
    changeUserRole (index, row) {
    },
    handleDelete (index, row) {
      this.userItem.splice(index, 1)
    }
  }
}
</script>
<style lang="stylus" scoped></style>
