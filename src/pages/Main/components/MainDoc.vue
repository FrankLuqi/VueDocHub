<template>
  <div style="position: relative" v-loading.fullscreen.lock="loading">
    <el-row class="tool-bar" ref="theToolBar">
      <el-col :xs="0" :sm="0" :md="6" :lg="8" :xl="6"></el-col>
      <el-col :xs="0" :sm="0" :md="6" :lg="8" :xl="12" class="item"></el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
        <div class="tool-search">
          <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="search"></el-input>
          <el-button icon="el-icon-search" circle style="margin-left: .1rem" @click="searchDoc"></el-button>
          <el-button type="primary" @click="uploadDoc">上传</el-button>
        </div>
      </el-col>
    </el-row>
    <div class="doc-items">
      <el-table
        id="theTable"
        :data="docItemShow"
        width="100%"
        align="center"
        style="width: 100%">
        <el-table-column
          align="center"
          label="文件名称"
          width="300">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.docName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="文件类别"
          width="120">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.category }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="上传者"
          width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.uploadUser }}</span>
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
          label="操作"
          width="300">
          <template slot-scope="scope">
            <el-button v-if="scope.row.type!='其他文件'"
              size="mini"
              @click="handleCheck(scope.$index, scope.row)">查看</el-button>
            <el-button
              size="mini"
              @click="handleDownload(scope.$index, scope.row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pdf-reader :pdfurl="url" v-if="showPdf" v-on:closepdf="ClosePdf"></pdf-reader>
    <el-dialog :title="vedioTitle" :visible.sync="showVideo">
      <video-player  v-if="showVideo" class="video-player vjs-custom-skin"
                     ref="videoPlayer"
                     :playsinline="true"
                     :options="playerOptions"
      ></video-player>
    </el-dialog>
    <el-dialog id="dia1" title="上传文件" :visible.sync="showUpload" :before-close="UploadDocHandleClose">
      <div>
        <div class="upload">
          <div class="upload-area">
            <el-upload
              ref="upload"
              class="upload-demo"
              action="http://localhost:8082/uploadDoc"
              v-bind:data="extraData"
              :before-remove="beforeRemove"
              :on-remove="onRemove"
              :before-upload="beforeUpload"
              :on-success="onSuccess"
              :on-error="onError"
              :auto-upload="false"
              :on-change="docChange"
              multiple
              :limit="1"
              :on-exceed="handleExceed"
              :file-list="fileList">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <el-button style="margin-left: 10px;" size="small" type="warning" @click="choosePowerType">设置文件权限</el-button>
              <el-button style="margin-left: 10px;" size="small" type="success" @click="chooseDocType">上传到服务器</el-button>
            </el-upload>
          </div>
        </div>
      </div>
      <el-dialog
        title="请设置该文件所属分类"
        :visible.sync="showTypeChooseDialog"
        :before-close="ChooseDialogClose"
        append-to-body>
        <div class="block">
          <span class="demonstration">分类</span>
          <el-cascader
            expand-trigger="hover"
            :options="docCategoryOptions"
            v-model="DocCategory">
          </el-cascader>
          <el-button type="primary" @click="upload">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="请设置该文件权限"
        :visible.sync="showPowerChooseDialog"
        :before-close="PowerDialogClose"
        append-to-body>
        <div class="block" style="text-align: center">
          <div>
            <el-cascader
              expand-trigger="hover"
              :options="departments"
              v-model="departmentPower">
            </el-cascader>
            <!--<el-select v-model="departmentPower" placeholder="请选择部门">-->
              <!--<el-option-->
                <!--v-for="item in departments"-->
                <!--:key="item.id"-->
                <!--:label="item.name"-->
                <!--:value="item.id">-->
              <!--</el-option>-->
            <!--</el-select>-->
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
    </el-dialog>
    <viewer style="visibility: hidden">
      <img id="imgShower" v-bind:src="signImages" width="50">
    </viewer>
  </div>
</template>
<script>
import PdfReader from '../../PdfReader/PdfReader'
import UploadDoc from '../../UploadDoc/UploadDoc'
// import axios from 'axios'
export default {
  name: 'MainDoc',
  data () {
    return {
      loading: false,
      search: '',
      url: '',
      vedioUrl: 'https://o6yh618n9.qnssl.com/oRUf3CyF_9800111451.mp4',
      showPdf: false,
      showVideo: false,
      showUpload: false,
      showTypeChooseDialog: false,
      showPowerChooseDialog: false,
      vedioTitle: '',
      DocCategory: [],
      docItemShow: [],
      extraData: {},
      powerList: [],
      rolePower: '',
      departmentPower: [],
      departments: [],
      roles: [],
      signImages: '',
      docItem: [],
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: '',
          // src: 'http://127.0.0.1:8082/preview?token=' + this.$store.state.user.token + '&name=' + this.preview_url // url地址
          src: this.vedioUrl // url地址
        }],
        poster: '../../static/images/test.jpg', // 你的封面地址
        // width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true // 全屏按钮
        }
      },
      fileList: [],
      options: [
        {value: 'A',
          label: '公司资产证据',
          children: [{
            value: 'A1',
            label: '合同'
          },
          {
            value: 'A2',
            label: '许可证'
          }
          ]
        },
        {value: 'B',
          label: '普通文件'
        }
      ],
      docCategoryOptions: []
    }
  },
  methods: {
    beforeMount () {
    },
    searchDoc () {
      if (this.search !== '') {
        this.docItemShow = []
        this.docItem.forEach((value) => {
          if (value.docName.indexOf(this.search) > -1 || value.uploadUser.indexOf(this.search) > -1 || value.type.indexOf(this.search) > -1 || value.category.indexOf(this.search) > -1) {
            this.docItemShow.push(value)
          }
        })
      } else {
        this.docItemShow = this.docItem
      }
    },
    handleCheck (index, row) {
      // this.$refs.imgShower.trigger('click')
      // alert(row.docName)
      if (row.type === '视频') {
        this.vedioUrl = row.vedioUrl
        this.playerOptions.sources[0].src = row.previewUrl
        // this.playerOptions.sources[0].src = 'http://127.0.0.1:8082/preview?token=' + this.$store.state.user.token + '&name='+row.previewUrl
        this.vedioTitle = row.docName
        this.showVideo = true
      } else if (row.type === 'office文档' || row.type === 'pdf文档') {
        this.url = row.previewUrl
        this.showPdf = true
      } else if (row.type === '图片') {
        this.signImages = row.previewUrl
        document.getElementById('imgShower').click()
      }
    },
    ClosePdf () {
      this.showPdf = false
    },
    uploadDoc () {
      this.showUpload = true
    },
    handleExceed (files, fileList) {
      this.$message.warning(`文件已选取，请开始上传`)
    },
    beforeRemove (file, fileList) {
    },
    onRemove (file, fileList) {
      this.fileList = fileList
    },
    beforeUpload (file) {
    },
    docChange (file, fileList) {
      this.fileList = fileList
    },
    onSuccess (response, file, fileList) {
      var _this = this
      this.$refs.upload.clearFiles()
      this.DocCategory = []
      this.powerList = []
      this.postRequest('http://localhost:8082/getDocList', {
        token: _this.$store.state.user.token,
        himself: false
      }).then(response => {
        _this.loading = false
        if (response.data !== '') {
          _this.docItem = response.data
          _this.docItemShow = _this.docItem
        }
      }).catch((error) => {
        console.log(error)
        _this.loading = false
        this.$message.error('服务器错误')
      })
    },
    onError (err, file, fileList) {
      console.log(err.toString())
      this.DocCategory = []
      this.powerList = []
      this.$message.error(`上传失败请重试`)
    },
    chooseDocType () {
      if (this.fileList.length !== 0) {
        this.showTypeChooseDialog = true
      } else {
        this.$message.warning(`请选择要上传的文件`)
      }
    },
    submitUpload () {
      this.$refs.upload.submit()
    },
    upload () {
      // 单击上传到服务器
      if (this.DocCategory.length === 0) {
        this.$message.warning(`请选择文件类别`)
      } else {
        // alert(this.DocCategory)
        this.extraData.docCategory = this.DocCategory[this.DocCategory.length - 1]
        this.extraData.token = this.$store.state.user.token
        this.extraData.powerList = []
        for (var power of this.powerList) {
          this.extraData.powerList.push(JSON.stringify(power))
        }
        this.extraData.powerList = this.extraData.powerList.join(',')
        this.submitUpload()
        this.showTypeChooseDialog = false
      }
    },
    ChooseDialogClose (done) {
      // 关闭选择文件类别窗口
      this.DocCategory = []
      done()
    },
    UploadDocHandleClose (done) {
      // 关闭上传文件窗口
      this.fileList = []
      this.powerList = []
      done()
    },
    choosePowerType () {
      // 打开权限选择窗口
      this.showPowerChooseDialog = true
    },
    DeletePower (index, row) {
      // 删除一个权限
      this.powerList.deleteIndex(index)
    },
    PowerDialogClose (done) {
      // 关闭权限选择窗口
      this.powerList = []
      this.rolePower = ''
      this.departmentPower = []
      done()
    },
    addPower () {
      // 添加文件权限
      // var _this = this
      if (this.rolePower === '' && this.departmentPower === '') {
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
      if (this.rolePower !== '') {
        p.powerName += this.roles[p.roleId - 1].name
      }
      p.id = this.powerList.length
      this.powerList[this.powerList.length] = p

      this.rolePower = ''
      this.departmentPower = []
      // alert(this.departmentPower)
      // alert(this.rolePower)
    },
    confirmAddPower () {
      // 点击文件权限选择页的确认
      this.showPowerChooseDialog = false
      this.rolePower = ''
      this.departmentPower = []
    },
    handleCloseTag (tag) {
      // 删除一条powerlist
      this.powerList.splice(this.powerList.indexOf(tag), 1)
    },
    handleDownload (index, row) {
      this.docItem[index].downloads++
      // 下载文件
      // window.open('http://localhost:8082/downloadDoc?token=' + _this.$store.state.user.token + '&docId=' + _this.docItem[index].id)
      window.open(row.downloadUrl)
    }

  },
  mounted () {
    var _this = this
    this.loading = true
    if (this.docItem.length === 0) {
      this.postRequest('http://localhost:8082/getDocList', {
        token: _this.$store.state.user.token,
        himself: false
      }).then(response => {
        if (response.data !== '') {
          _this.docItem = response.data
          _this.docItemShow = _this.docItem
          _this.loading = false
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
        _this.departments = response.data
        _this.loading = false
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
        _this.roles = response.data
        _this.loading = false
      }).catch((error) => {
        console.log(error)
        _this.loading = false
        this.$message.error('服务器错误')
      })
    }

    if (this.docCategoryOptions.length === 0) {
      this.loading = true
      this.postRequest('http://localhost:8082/getDocCategoryInfo', {
        token: _this.$store.state.user.token
      }).then(response => {
        _this.loading = false
        _this.docCategoryOptions = response.data
      }).catch((error) => {
        console.log(error)
        _this.loading = false
        this.$message.error('服务器错误')
      })
    }
  },
  computed: {
    tableHeight: function () {
      var h = document.documentElement.clientHeight || document.body.clientHeight
      return h
    }
  },
  components: {
    PdfReader,
    UploadDoc
  }
}
</script>
<style lang="stylus" scoped>
  .tool-bar
    box-shadow: 1px 1px 5px #888888
    position fixed
    width 100%
    top 1.5rem
    .el-col
      min-height: 1rem
      display flex
      flex-direction column
      justify-content center
      .tool-search
        min-width 5rem
        text-align center
        .el-input
          width 40%
  .doc-items
    top: 2.55rem
    position fixed
    width 100%
    overflow auto
    height 80%
  >>> .el-dialog__wrapper .el-dialog
    @media screen and (max-width: 800px)
      width 100%
  .upload
    display flex
    flex-direction row
    justify-content center
    width 100%
    .upload-area
      border 2px solid #000033
      border-radius 20%
      padding 1rem
      .el-upload
        .el-button
          width 3rem
  /*#theTable*/
    /*height 500rem*/
</style>
