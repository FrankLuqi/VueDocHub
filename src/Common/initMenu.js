// import {postRequest} from './api'
export const initMenu = (store) => {
  if (store.state.managements.userManage !== undefined) {
    if (store.state.managements.userManage !== '') {
      return
    }
  }
  // alert('fsdaf')
  // postRequest('http://localhost:8082/system/getUsableFunction', {
  //   token: store.state.user.token
  // }).then(response => {
  //   if (response.data.code === 'Success') {
  //     alert('hahaha')
  //     // var fmtRoutes = formatRoutes(response.data)
  //     store.commit('initMenu', response.data)
  //   }
  // })
}

// export const formatManagements = (managements) => {
//   let fmManagements = []
//
// }

export const formatRoutes = (routes) => {
  let fmRoutes = []
  routes.forEach(router => {
    let {
      path,
      // component,
      name,
      meta,
      iconCls,
      children
    } = router
    if (children && children instanceof Array) {
      children = formatRoutes(children)
    }
    let fmRouter = {
      path: path,
      component (resolve) {
        // if (component.startsWith("Home")) {
        //   require(['../components/' + component + '.vue'], resolve)
        // } else if (component.startsWith("Emp")) {
        //   require(['../components/emp/' + component + '.vue'], resolve)
        // } else if (component.startsWith("Per")) {
        //   require(['../components/personnel/' + component + '.vue'], resolve)
        // } else if (component.startsWith("Sal")) {
        //   require(['../components/salary/' + component + '.vue'], resolve)
        // } else if (component.startsWith("Sta")) {
        //   require(['../components/statistics/' + component + '.vue'], resolve)
        // } else if (component.startsWith("Sys")) {
        //   require(['../components/system/' + component + '.vue'], resolve)
        // }
      },
      name: name,
      iconCls: iconCls,
      meta: meta,
      children: children
    }
    fmRoutes.push(fmRouter)
  })
  return fmRoutes
}
