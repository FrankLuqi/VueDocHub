import axios from 'axios'
import {Message} from 'element-ui'
import router from '../router/index'
import Store from '../Store/index'

axios.interceptors.request.use(config => {
  return config
}, err => {
  Message.error({message: '请求超时!'})
  return Promise.resolve(err)
})
axios.interceptors.response.use(data => {
  // alert(data)
  // if (data.status && data.status === 200 && data.data.status === 'error') {
  //   Message.error({message: data.data.msg})
  //   return
  // }
  return data
}, err => {
  if (err.response.status === 504 || err.response.status === 404) {
    Message.error({message: '服务器被吃了⊙﹏⊙∥'})
  } else if (err.response.status === 403) {
    if (err.response.data.msg === '请登录!') {
      Message.error({message: '账户失效请重新登录'})
      setTimeout(function () {
        router.push('/')
        Store.commit('logout')
      }, 1000)
    } else Message.error({message: '权限不足,请联系管理员!'})
  } else {
    Message.error({message: '未知错误!'})
  }
  return Promise.resolve(err)
})

let base = ''

export const postRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    timeout: 15000,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': 'http://localhost:8082'
    }
  })
}
export const uploadFileRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    timeout: 10000,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Origin': 'http://localhost:8082'
    }
  })
}
export const putRequest = (url, params) => {
  return axios({
    method: 'put',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': 'http://localhost:8082'
    }
  })
}
export const deleteRequest = (url) => {
  return axios({
    method: 'delete',
    url: `${base}${url}`
  })
}
export const getRequest = (url) => {
  return axios({
    method: 'get',
    url: `${base}${url}`,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:8082'
    }
  })
}
