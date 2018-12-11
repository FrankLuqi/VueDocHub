<template>
  <div>
    <main-header v-on:handleSelect="changeMain"></main-header>
    <main-doc v-if="contentshow === 'doc'"></main-doc>
    <main-manage v-else-if="contentshow === 'manage'"></main-manage>
    <main-message v-else-if="contentshow === 'message'"></main-message>
  </div>
</template>
<script>
import MainHeader from './components/MainHeader'
import MainDoc from './components/MainDoc'
import MainManage from './components/MainManage'
import MainMessage from './components/MainMessage'
export default {
  name: 'Home',
  components: {
    MainHeader,
    MainDoc,
    MainManage,
    MainMessage
  },
  methods: {
    changeMain (changeto) {
      this.contentshow = changeto
    }
  },
  data () {
    return {
      contentshow: 'doc'
    }
  }
}
</script>
<style></style>
