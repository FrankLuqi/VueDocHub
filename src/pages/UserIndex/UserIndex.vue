<template>
  <div class="user-index">
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
        <el-button size="small" type="primary">上传头像</el-button>
        <el-button size="small" type="danger">退出登录</el-button>
      </div>
    </div>
    <div class="user-doc">
      <div class="user-doc-tip">
        最近上传的文件
      </div>
      <div>
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
            label="文件类型"
            width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.docType }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="上传时间"
            sortable
            prop="scope.row.uploadTime"
            width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.uploadTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="下载次数"
            prop="scope.row.downloads"
            width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.downloads }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="300">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleCheck(scope.$index, scope.row)">查看</el-button>
              <el-button
                size="mini"
                @click="handleDownload(scope.$index, scope.row)">下载</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <pdf-reader :pdfurl="url" v-if="showPdf" v-on:closepdf="ClosePdf"></pdf-reader>
    <el-dialog :title="vedioTitle" :visible.sync="showVideo">
      <video-player  v-if="showVideo" class="video-player vjs-custom-skin"
                     ref="videoPlayer"
                     :playsinline="true"
                     :options="playerOptions"
      ></video-player>
    </el-dialog>
  </div>
</template>
<script>
import userFace from '@/assets/img/user-face.jpg'
import PdfReader from '../PdfReader/PdfReader'
export default {
  name: 'UserIndex',
  components: {
    PdfReader
  },
  data () {
    return {
      UserPhoto: userFace,
      userName: '鹿琦',
      userRole: '生产部 经理',
      showPdf: false,
      showVideo: false,
      vedioTitle: '',
      url: '',
      vedioUrl: 'https://o6yh618n9.qnssl.com/oRUf3CyF_9800111451.mp4',
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
      docItem: [{
        id: '1',
        docName: '某高校科研管理系统摘要.pdf',
        uploadUser: '鹿琦',
        docType: '文档',
        uploadTime: '2018-11-22',
        downloads: 37,
        docId: 'test1'
      },
      {
        id: '2',
        docName: '数据库原理、编程与性能[中文版].pdf',
        uploadUser: '鹿琦',
        docType: '文档',
        uploadTime: '2018-11-23',
        downloads: 10,
        docId: 'test2'
      },
      {
        id: '3',
        docName: '比赛集锦 曼城2:0富勒姆',
        uploadUser: '鹿琦',
        docType: '视频',
        uploadTime: '2018-11-24',
        downloads: 1,
        vedioUrl: 'https://o6yh618n9.qnssl.com/oRUf3CyF_9800111451.mp4'
      },
      {
        id: '4',
        docName: '任天堂明星大乱斗',
        uploadUser: '鹿琦',
        docType: '视频',
        uploadTime: '2018-11-24',
        downloads: 22,
        vedioUrl: 'http://localhost:8080/static/test3.mp4'
      }]
    }
  },
  methods: {
    handleCheck (index, row) {
      // alert(row.docName)
      if (row.docType === '视频') {
        this.vedioUrl = row.vedioUrl
        this.playerOptions.sources[0].src = this.vedioUrl
        this.vedioTitle = row.docName
        this.showVideo = true
      } else if (row.docType === '文档') {
        this.url = 'http://localhost:8080/static/' + row.docId + '.pdf'
        this.showPdf = true
      }
    },
    ClosePdf () {
      this.showPdf = false
    }
  },
  mounted () {
    this.docItemShow = this.docItem

    this.userName = this.$store.state.user.userName
    this.userRole = this.$store.state.user.roles
    this.UserPhoto = this.$store.state.user.userFace
  }
}
</script>
<style lang="stylus" scoped>
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
        border-radius 50%
      .user-info
        margin-top .3rem
        div
          margin-bottom .3rem
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
</style>
