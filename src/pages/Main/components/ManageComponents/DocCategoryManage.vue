<template>
  <div class="role-manage" v-loading.fullscreen.lock="loading">
    <p class="title">文件类别信息管理</p>
    <el-tree
      :data="roleData"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                type="text"
                size="mini"
                @click="() => append(data)">
                添加
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="() => remove(node, data)">
                删除
              </el-button>
            </span>
          </span>
    </el-tree>
  </div>
</template>
<script>
export default {
  name: 'DocCategoryManage',
  data () {
    return {
      id: 100,
      roleData: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      loading: false,
      DepartmentName: ''
    }
  },
  methods: {
    append (data) {
      this.inputDepartmentName(data)
    },
    remove (node, data) {
      var _this = this
      // const parent = node.parent
      // const children = parent.data.children || parent.data
      // const index = children.findIndex(d => d.id === data.id)
      // children.splice(index, 1)
      _this.loading = true
      this.postRequest('http://localhost:8082/DocCategoryManage/deleteDocCategory', {
        token: _this.$store.state.user.token,
        docCategoryId: data.value
      }).then(response => {
        _this.loading = false
        if (response.data.status === 'Success') {
          _this.$message.success(response.data.msg)
          const parent = node.parent
          const children = parent.data.children || parent.data
          const index = children.findIndex(d => d.id === data.id)
          children.splice(index, 1)
        } else {
          _this.$message.error(response.data.msg)
        }
      }).catch((error) => {
        console.log(error)
        _this.loading = false
        this.$message.error('服务器错误')
      })
    },
    inputDepartmentName (data) {
      var _this = this
      this.$prompt('请输入部门名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        if (value !== '') {
          _this.loading = true
          this.postRequest('http://localhost:8082/DocCategoryManage/addDocCategory', {
            token: _this.$store.state.user.token,
            docCategoryName: value,
            parentCode: data.code
          }).then(response => {
            _this.loading = false
            if (response.data.code === 'Success') {
              _this.$message.success('添加成功')
              const newChild = { value: response.data.id, label: value, children: [], code: response.data.departmentCode }
              if (!data.children) {
                _this.$set(data, 'children', [])
              }
              data.children.push(newChild)
            } else {
              _this.$message.success(response.data.msg)
            }
          }).catch((error) => {
            console.log(error)
            _this.loading = false
            this.$message.error('服务器错误')
          })
        }
      }).catch(() => {
      })
    }
  },
  mounted () {
    var _this = this
    this.loading = true
    this.postRequest('http://localhost:8082/getDocCategoryInfo', {
      token: _this.$store.state.user.token,
    }).then(response => {
      _this.loading = false
      if (response.data !== '') {
        _this.roleData = response.data
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
  .role-manage
    margin-top .1rem
    text-align center
    width 20%
    margin 0 auto
    @media screen and (max-width: 1200px) and (min-width: 700px)
      width 40%
    @media screen and (max-width: 800px)
      width 90%
    .title
      margin-top .3rem
      font-size .5rem
      color #888888
      margin-bottom .2rem
    .custom-tree-node
      flex: 1
      display: flex
      align-items: center
      justify-content: space-between
      font-size: 14px
      padding-right: 8px
</style>
