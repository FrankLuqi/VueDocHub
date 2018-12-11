import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      userId: window.localStorage.getItem('user' || '[]') === null ? '未登录' : JSON.parse(window.localStorage.getItem('user' || '[]')).userId,
      userFace: window.localStorage.getItem('user' || '[]') === null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).userFace,
      userName: window.localStorage.getItem('user' || '[]') === null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).userName,
      roles: window.localStorage.getItem('user' || '[]') === null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).roles,
      token: window.localStorage.getItem('user' || '[]') === null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).token,
      departmentRoleId: window.localStorage.getItem('user' || '[]') === null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).departmentRoleId
    },
    routes: [],
    managements: {
      userManage: window.localStorage.getItem('managements' || '[]') === null ? '' : JSON.parse(window.localStorage.getItem('managements' || '[]')).userManage,
      departmentManage: window.localStorage.getItem('managements' || '[]') === null ? '' : JSON.parse(window.localStorage.getItem('managements' || '[]')).departmentManage,
      RoleManage: window.localStorage.getItem('managements' || '[]') === null ? '' : JSON.parse(window.localStorage.getItem('managements' || '[]')).RoleManage,
      DocCategoryManage: window.localStorage.getItem('managements' || '[]') === null ? '' : JSON.parse(window.localStorage.getItem('managements' || '[]')).DocCategoryManage,
      FunctionPermissionManage: window.localStorage.getItem('managements' || '[]') === null ? '' : JSON.parse(window.localStorage.getItem('managements' || '[]')).FunctionPermissionManage
    }
  },
  mutations: {
    initMenu (state, managements) {
      window.localStorage.setItem('managements', JSON.stringify(managements))
      state.managements.userManage = managements.userManage
      state.managements.departmentManage = managements.departmentManage
      state.managements.RoleManage = managements.RoleManage
      state.managements.DocCategoryManage = managements.DocCategoryManage
      state.managements.FunctionPermissionManage = managements.FunctionPermissionManage
    },
    login (state, user) {
      state.user = user
      window.localStorage.setItem('user', JSON.stringify(user))
    },
    logout (state) {
      window.localStorage.removeItem('user')
      window.localStorage.removeItem('managements')
      state.user = {}
      state.managements = {}
      state.routes = []
    }
  }
})
