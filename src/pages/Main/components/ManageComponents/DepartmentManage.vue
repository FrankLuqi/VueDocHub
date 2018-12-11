<template>
  <div class="role-manage">
    <p class="title">部门信息管理</p>
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
                @click="() => changeName(node, data)">
                更改名称
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
  name: 'DepartmentManage',
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
      }]
    }
  },
  methods: {
    append (data) {
      const newChild = { id: this.id++, label: 'testtest', children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },
    remove (node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    changeName (node, data) {
      alert(node.parent.label)
      alert(data.label)
    }
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
