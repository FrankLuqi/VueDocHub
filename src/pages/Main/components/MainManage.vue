<template>
  <div class="manage">
    <div class="tool-bar">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-submenu index="1">
          <template slot="title">用户管理</template>
          <el-menu-item index="1-1" v-bind:disabled="userManage">用户管理</el-menu-item>
          <el-menu-item index="1-2" v-bind:disabled="departmentManage">部门管理</el-menu-item>
          <el-menu-item index="1-3" v-bind:disabled="RoleManage">角色管理</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">文件管理</template>
          <el-menu-item index="2-1" v-bind:disabled="DocCategoryManage">文件类别管理</el-menu-item>
          <el-menu-item index="2-2">文件统计</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">功能管理</template>
          <el-menu-item index="3-1" v-bind:disabled="FunctionPermissionManage">功能管理</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div class="manage-area">
      <user-table v-if="area === '1-1'"></user-table>
      <department-manage v-if="area === '1-2'"></department-manage>
      <doc-category-manage v-if="area === '2-1'"></doc-category-manage>
      <function-manage v-if="area === '3-1'"></function-manage>
      <role-manage v-if="area === '1-3'"></role-manage>
      <doc-report v-if="area === '2-2'"></doc-report>
    </div>
  </div>
</template>
<script>
import UserTable from './ManageComponents/UserTable'
import DepartmentManage from './ManageComponents/DepartmentManage'
import DocCategoryManage from './ManageComponents/DocCategoryManage'
import FunctionManage from './ManageComponents/FunctionManage'
import RoleManage from './ManageComponents/RoleManage'
import DocReport from './ManageComponents/DocReport'
export default {
  name: 'MainManage',
  data () {
    return {
      activeIndex: '2-2',
      area: '2-2',
      userManage: !this.$store.state.managements.userManage,
      departmentManage: !this.$store.state.managements.departmentManage,
      RoleManage: !this.$store.state.managements.RoleManage,
      DocCategoryManage: !this.$store.state.managements.DocCategoryManage,
      FunctionPermissionManage: !this.$store.state.managements.FunctionPermissionManage
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      this.area = key
    }
  },
  components: {
    DocCategoryManage,
    UserTable,
    DepartmentManage,
    FunctionManage,
    RoleManage,
    DocReport
  },
  mounted () {

  }
}
</script>
<style lang="stylus" scoped>
  .manage
    position fixed
    top 1.55rem
    width 100%
    height 100%
    .tool-bar
      margin 0 auto
      width 80%
      @media screen and (max-width: 1000px)
        width 100%
    .manage-area
      height 79%
      overflow auto
</style>
