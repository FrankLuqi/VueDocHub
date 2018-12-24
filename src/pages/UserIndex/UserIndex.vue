<template>
  <div class="user-index" v-loading.fullscreen.lock="loading">
    <div class="header">
      <div>
        <img class="user-face" v-bind:src="UserPhoto" alt="">
      </div>
      <div class="user-info">
        <div style="font-size: .7rem">{{userName}}</div>
        <div><span v-for="role in userRole" v-bind:key="role">{{role}}</span></div>
      </div>
      <div class="tool-bar">
        <el-button size="small" type="primary">修改密码</el-button>
        <el-upload
          ref="upload-userface"
          class="upload-demo"
          v-bind:show-file-list= "show"
          action="http://localhost:8082/uploadUserface"
          :on-success="onSuccess"
          :on-progress="onProgress"
          v-bind:data="extraData">
          <el-button size="small" type="primary">上传头像</el-button>
        </el-upload>
        <el-button size="small" type="danger" @click="logout">退出登录</el-button>
      </div>
    </div>
    <div class="user-doc">
      <div class="user-doc-tip">
        最近上传的文件
      </div>
      <div class="doc-items">
        <el-table
          :data="docItem"
          width="100%"
          align="center"
          style="width: 100%">
          <el-table-column
            label="文件名称"
            width="400">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.docName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="文件类别"
            width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.category }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="文件类型"
            width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.type }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="上传时间"
            sortable
            prop="scope.row.uploadTime"
            width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.uploadDate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="下载次数"
            prop="scope.row.downloads"
            width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.downloads }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="是否公开"
            width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.open===1">是</span>
              <span v-if="scope.row.open===0">否</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="哪些人能看"
            width="180">
            <template slot-scope="scope">
              <span v-if="scope.row.open===1">所有人</span>
              <span v-if="scope.row.open===0">{{scope.row.permission}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="300">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleChangePermission(scope.$index, scope.row)">更改文件权限</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      title="请设置该文件权限"
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
            {{tag.powerName}}
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
import userFace from '@/assets/img/user-face.jpg'
import PdfReader from '../PdfReader/PdfReader'
export default {
  name: 'UserIndex',
  data () {
    return {
      UserPhoto: userFace,
      userName: '鹿琦',
      userRole: '生产部 经理',
      docItem: [],
      loading: false,
      showPowerChooseDialog: false,
      roles: [],
      departments: [],
      rolePower: '',
      departmentPower: [],
      powerList: [],
      powers: [],
      nowIndex: -1,
      extraData: {},
      show: false
    }
  },
  methods: {
    handleChangePermission (index, row) {
      this.showPowerChooseDialog = true
      this.nowIndex = index
    },
    addPower () {
      // 添加文件权限
      // var _this = this
      if (this.rolePower === '' && this.departmentPower.length === 0) {
        this.$message.warning('请选择权限')
      }
      var p = {}
      p.roleId = this.rolePower
      p.powerName = ''
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
        p.powerName += getLabel(this.departments)
        p.powerName += ' '
      } else {
        p.departmentId = ''
      }
      p.powerName += this.roles[p.roleId - 1].name
      p.id = this.powerList.length
      this.powerList[this.powerList.length] = p

      this.rolePower = ''
      this.departmentPower = []
      // alert(this.departmentPower)
      // alert(this.rolePower)
    },
    confirmAddPower () {
      for (var power of this.powerList) {
        this.powers.push(JSON.stringify(power))
      }
      this.loading = true
      // 点击文件权限选择页的确认
      this.postRequest('http://localhost:8082/changeDocPermission', {
        token: this.$store.state.user.token,
        docId: this.docItem[this.nowIndex].id,
        power: this.powers
      }).then(response => {
        this.loading = false
        if (response.data !== '') {
          if (response.data.code === 'Success') {
            this.$message.success(response.data.msg)
            this.docItem[this.nowIndex].permission = response.data.permission
            this.docItem[this.nowIndex].open = response.data.open
            this.powerList = []
          } else {
            this.$message.error(response.data.msg)
            this.powers = []
          }
        }
      }).catch((error) => {
        console.log(error)
        this.powers = []
        this.loading = false
        this.$message.error('服务器错误')
      })
      this.showPowerChooseDialog = false
      this.rolePower = ''
      this.departmentPower = []
    },
    handleCloseTag (tag) {
      // 删除一条powerlist
      this.powerList.splice(this.powerList.indexOf(tag), 1)
    },
    PowerDialogClose (done) {
      // 关闭权限选择窗口
      this.powerList = []
      this.rolePower = ''
      this.departmentPower = []
      done()
    },
    handleDelete (index, row) {
      this.loading = true
      this.postRequest('http://localhost:8082/deleteDoc', {
        token: this.$store.state.user.token,
        docId: row.id
      }).then(response => {
        this.loading = false
        if (response.data !== '') {
          if (response.data.code === 'Success') {
            this.$message.success(response.data.msg)
            this.docItem.splice(index, 1)
          } else {
            this.$message.error(response.data.msg)
          }
        }
      }).catch((error) => {
        console.log(error)
        this.loading = false
        this.$message.error('服务器错误')
      })
    },
    logout () {
      var _this = this
      this.loading = true
      this.postRequest('http://localhost:8082/logout1', {
        token: _this.$store.state.user.token
        // userId: _this.$store.state.user.userId
      }).then(response => {
        _this.loading = false
        if (response.data.code === 'Error') {
          this.$message.error('请重试')
        } else if (response.data.code === 'Success') {
          this.$message.success(response.data.msg)
          _this.$store.commit('logout')
          setTimeout(function () {
            _this.$router.push('/')
          }, 1000)
        }
      }).catch((error) => {
        console.log(error)
        _this.loading = false
      })
    },
    onSuccess (response, file, fileList) {
      this.loading = false
      if (response.code === 'Success') {
        this.$store.commit('changeUserface',response.userFace)
        this.UserPhoto = this.$store.state.user.userFace
        this.$message.success('修改成功')
      } else {
        this.$message.error('修改失败')
      }
    },
    onProgress () {
      this.loading = true
    }
  },
  mounted () {
    var _this = this
    this.loading = true
    if (this.docItem.length === 0) {
      this.postRequest('http://localhost:8082/getDocList', {
        token: _this.$store.state.user.token,
        himself: true
      }).then(response => {
        _this.loading = false
        if (response.data !== '') {
          _this.docItem = response.data
        }
      }).catch((error) => {
        console.log(error)
        _this.loading = false
        this.$message.error('服务器错误')
      })
    }
    if (this.departments.length === 0) {
      this.loading = true
      this.postRequest('http://localhost:8082/getDepartmentsInfo', {
        token: _this.$store.state.user.token
      }).then(response => {
        _this.loading = false
        _this.departments = response.data
      }).catch((error) => {
        console.log(error)
        _this.loading = false
        this.$message.error('服务器错误')
      })
    }
    if (this.roles.length === 0) {
      this.loading = true
      this.postRequest('http://localhost:8082/getRoles', {
        token: _this.$store.state.user.token
      }).then(response => {
        _this.loading = false
        _this.roles = response.data
      }).catch((error) => {
        console.log(error)
        _this.loading = false
        this.$message.error('服务器错误')
      })
    }
    this.extraData.token = this.$store.state.user.token
    this.userName = this.$store.state.user.userName
    this.userRole = this.$store.state.user.roles
    this.UserPhoto = this.$store.state.user.userFace
  }
}
</script>
<style lang="stylus" scoped>
  >>> .upload-demo
    width 80px
  .user-index
    width 100%
    .header
      height 6rem
      width 100%
      background-color: #E8E8E8
      display flex
      flex-direction column
      justify-content center
      text-align center
      box-shadow 1px 1px 5px #888888
      .user-face
        width 3rem
        height 3rem
        border-radius 50%
      .user-info
        margin-top .3rem
        div
          margin-bottom .3rem
      .tool-bar
        display flex
        margin auto
        button
          margin 0 .1rem
        div
          margin-right .15rem
    .user-doc
      margin-top .5rem
      width 100%
      text-align center
      .user-doc-tip
        text-align center
        color #888888
        font-size .3rem
        width 50%
        border-bottom 1px solid #E8E8E8
        margin 0 auto
        height .5rem
      .doc-items
        height 50%
        overflow auto
</style>
