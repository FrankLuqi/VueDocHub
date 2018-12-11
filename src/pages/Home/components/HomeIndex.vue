<template>
  <div class="home" v-loading.fullscreen.lock="loading">
    <div v-show="!loginform">
      <div class="title">DocHub</div>
      <transition name="show">
        <div v-show="showloginbutton" class="login-button"><button @click="showLogin">登 录</button></div>
      </transition>
    </div>
    <transition name="show">
      <div id="login_page" v-show="loginform">
        <div id="login_form" v-show="!turn_to_reg">
          <div class="title-box"><p class="login-title">DocHub</p></div>
          <div class="username">
            用户名：<el-input name="login_name" placeholder="请输入用户名" v-model="login_name"></el-input>
          </div>
          <div class="password">
            密码：<el-input name="login_psw" placeholder="请输入密码" v-model="login_psw" type="password"></el-input>
          </div>
          <div class="checkbox"><el-checkbox v-model="remember">记住我</el-checkbox></div>
          <div class="login-button"><button id="login" @click="login">登录</button></div>
          <div class="turn-to-reg">还没有账号？<span @click="turnToReg" style="cursor: pointer">立刻注册</span></div>
        </div>
        <div id="reg-form" v-show="turn_to_reg">
          <div class="title-box"><p class="login-title">注册DocHub</p></div>
          <div class="username">
            用户名：<el-input name="reg_name" v-validate.disable="'required|min:2|max:12'" v-model="reg_name" placeholder="请输入用户名" @blur.native.capture="checkCard"></el-input>
            <div class="warn"><span>{{ errors.first('reg_name') }}{{name_error}}</span></div>
          </div>
          <div class="password">
            密码：<el-input name="reg_psw" v-validate.disable="'required|min:6|max:18'" v-model="reg_psw" placeholder="请输入密码" ref="reg_psw" type="password"></el-input>
            <div class="warn"><span>{{ errors.first('reg_psw') }}</span></div>
          </div>
          <div class="password-conf">
            确认密码：<el-input name="reg_psw_conf" v-validate.disable="'required|confirmed:reg_psw'" v-model="reg_psw2" placeholder="请再次输入密码" type="password"></el-input>
            <div class="warn"><span>{{ errors.first('reg_psw_conf') }}</span></div>
          </div>
          <div class="login-button"><button id="register" @click="submitRegister">注册</button></div>
          <div class="turn-to-login">已有账号？<span @click="turnTologin" style="cursor: pointer">立刻登录</span></div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
// import axios from 'axios'
export default {
  name: 'HomeIndex',
  data () {
    return {
      showloginbutton: false,
      loginform: false,
      turn_to_reg: false,
      login_name: '',
      login_psw: '',
      reg_psw: '',
      reg_psw2: '',
      reg_name: '',
      remember: false,
      name_error: '',
      loading: false
    }
  },
  methods: {
    beforeEnter: function (el) {
    },
    showLogin: function () {
      if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        this.$router.push({path: '/Mobilelogin'})
      } else {
        this.loginform = true
      }
    },
    turnToReg: function () {
      this.turn_to_reg = true
    },
    submit: function () {

    },
    submitRegister: function () {
      this.$validator.validate().then(result => {
        if (result) {
          // axios({
          //   method: 'post',
          //   url: 'http://localhost:8082/user',
          //   headers: {
          //     'Content-type': 'application/x-www-form-urlencoded'
          //   },
          //   params: {
          //     'username': this.reg_name,
          //     'password': this.reg_psw
          //   }
          // }).then((response) => {
          //   console.log(response)
          //   if (response.data.code === 'Error') {
          //     this.$message.error(response.data.message)
          //   } else if (response.data.code === 'Success') {
          //     this.$message({
          //       message: '注册成功',
          //       type: 'success'
          //     })
          //     var that = this
          //     setTimeout(function () {
          //       that.login_name = that.reg_name
          //       that.reg_name = ''
          //       that.reg_psw = ''
          //       that.turn_to_reg = false
          //     }, 3000)
          //   }
          // }).catch((error) => { console.log(error) })
          var _this = this
          this.loading = true
          this.postRequest('http://localhost:8082/user', {
            'username': this.reg_name,
            'password': this.reg_psw
          }).then(response => {
            _this.loading = false
            if (response.data.code === 'Error') {
              this.$message.error(response.data.message)
            } else if (response.data.code === 'Success') {
              this.$message({
                message: '注册成功',
                type: 'success'
              })
              var that = this
              setTimeout(function () {
                that.login_name = that.reg_name
                that.reg_name = ''
                that.reg_psw = ''
                that.reg_psw2 = ''
                that.turn_to_reg = false
              }, 2000)
            }
          }).catch((error) => {
            console.log(error)
            _this.loading = false
            this.$message.error('服务器错误')
          })
        }
      })
    },
    turnTologin: function () {
      this.turn_to_reg = false
    },
    checkCard: function () {
      // 输入框失焦事件，失焦后判断输入的用户名是否合法，合法则提交到后台进行验证
      this.name_error = ''
      this.$validator.validate('reg_name').then(result => {
        if (result) {
          var _this = this
          this.loading = true
          this.postRequest('http://localhost:8082/checkUsername', {
            username: this.reg_name
          }).then(response => {
            _this.loading = false
            if (response.data.code === 'Error') {
              this.name_error = response.data.message
            }
          }).catch((error) => {
            console.log(error)
            _this.loading = false
            this.$message.error('服务器错误')
          })
        }
      })
    },
    login () {
      var _this = this
      this.loading = true
      this.postRequest('http://localhost:8082/login', {
        username: this.login_name,
        password: this.login_psw,
        rememberMe: this.remember === true ? 'remember' : ''
      }).then(response => {
        _this.loading = false
        // alert(response.data.userId)
        if (response.data.code === 'Error') {
          this.$message.error(response.data.msg)
        } else if (response.data.code === 'Success') {
          this.$message.success('登录成功，欢迎你' + response.data.userName)
          var user = {}
          user.userFace = response.data.userFace
          user.userName = response.data.userName
          // alert(response.data.token)
          user.roles = response.data.roles.substring(1, response.data.roles.length - 1).split(',')
          user.userId = response.data.userId
          user.token = response.data.token
          user.departmentRoleId = response.data.departmentRoleId.substring(1, response.data.departmentRoleId.length - 1).split(',')
          _this.$store.commit('login', user)
          _this.$router.push('/main')
        }
      }).catch((error) => {
        console.log(error)
        _this.loading = false
        this.$message.error('服务器错误请稍后再试')
      })
    }
  },
  mounted () {
    this.showloginbutton = true
  }
}
</script>
<style lang="stylus" scoped>
  >>> .el-checkbox__label
    color #fff
  .show-enter-active
    transition opacity 2s
  .show-enter
    opacity 0
  .home
    display flex
    justify-content center
    flex-direction column
    text-align center
    height 100%
    background-image url("~@/assets/img/home-background.jpg")
    background-size 100% 100%
    background-repeat no-repeat
    .title
      font-size 13vh
      color #ffffff
    .login-button
      font-size 0.5rem
      margin-top 5%
      button
        width 3rem
        height 1rem
        color #ffffff
        font-size 3vh
        background-color transparent
        border 1px #ffffff solid
        &:hover
          cursor pointer
    #login_page
      display flex
      justify-content center
      text-align center
      #login_form
        width 8rem
        height 10rem
        /*background-color transparent*/
        /*border 1px solid #ffffff*/
        /*border-radius 1rem*/
        padding 0.5rem
        box-sizing border-box
        .login-title
          font-size 8vh
          padding-bottom 10%
          color #ffffff
          border-bottom 2px solid  #ffffff
        .username,.password
          color #ffffff
          font-size 20px
          text-align right
          margin-top 10%
          padding-right 5%
          .el-input
            width 70%
            opacity 0.8
        .checkbox
          margin-top 5%
          color #ffffff
          font-size 10px
        .login-button
          margin-top 5%
          #login
            width 3rem
            height 1rem
            color #ffffff
            font-size 20px
            background-color transparent
            border 2px solid #ffffff
        .turn-to-reg
          color #ffffff
          font-size 15px
          margin-top 5%
          span
            color #10e2ff
      #reg-form
        width 8rem
        height 10rem
        padding 0.5rem
        box-sizing border-box
        .login-title
          font-size 6vh
          padding-bottom 10%
          color #ffffff
          border-bottom 2px solid  #ffffff
        .username,.password,.password-conf
          color #ffffff
          font-size 19px
          text-align right
          margin-top 3%
          padding-right 5%
          .el-input
            width 70%
            opacity 0.8
        .login-button
          margin-top 5%
          #register
            width 3rem
            height 1rem
            color #ffffff
            font-size 20px
            background-color transparent
            border 2px solid #ffffff
        .turn-to-login
          color #ffffff
          font-size 15px
          margin-top 5%
          span
            color #10e2ff
        .warn
          color #ffffff
          font-size 15px
          line-height 0.5rem
          text-align center
          margin-top 1%
          height 0.5rem
</style>
