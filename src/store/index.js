import { createStore } from 'vuex'

export default createStore({
  state: {
    pathMap:{
      files:{
        title:'文件',
        stack:[
          {
            name:'测试文件夹0',
            modifier:'RCUzQSU1QyV1NUJBMyV1NEYyMA=='
          }, 
          {
            name:'测试文件夹1',
            modifier:'RCUzQSU1QyV1NUJBMyV1NadA=='
          }, 
          {
            name:'测试文件夹2',
            modifier:'RCUzQSU1QyV1NUJBMyV1Nad1=='
          }, 
          {
            name:'测试文件夹3',
            modifier:'RCUzQSU1QyV1NUJBMyV1NadA4=='
          }, 
        ],
        needFresh:false
      },
      favorite:[],
      recycle:[],
      lock:[]
    }
  },
  getters: {

  },
  mutations: {
    /**
     * 跳转到当前路径栈前面的一个路径,不可以跳转当前路径
     * @param {*} state 内容库
     * @param {*} params 参数对象,{title:表示要跳转的是哪个模块的路径,modifier:表示要跳转的是哪个文件}
     */
    switchPrePath(state,params){
      let moduleName = params.title//要更换地址的模块的名字
      let modifier = params.modifier//要跳转的之前的目录的修饰符
      let stack = state.pathMap[moduleName].stack
      let findItem = ''
      do{
        stack.pop()
        findItem = stack[stack.length-1]
      }while(stack.length>0&&findItem.modifier!==modifier)
      state.pathMap[moduleName].needFresh = true//更新这个模块的状态为需要更新,让vue监听器察觉并更新内容
    },
    /**
     * 传入要跳转的目录的信息,更新视图数据,并通知vue视图更新
     * @param {*} state 内容
     * @param {*} params 参数对象,{title:表示要跳转的是哪个模块的路径,modifier:表示要跳转的是哪个文件}
     */
    switchPostPath(state,params){
      let moduleName = params.moduleName
      let name = params.pathName
      let modifier = params.modifier
      state.pathMap[moduleName].stack.push({
        name:name,
        modifier:modifier
      })
      state.pathMap[moduleName].needFresh = true 
    },
    /**
     * vue视图层完成视图渲染,通知持久化数据更改为不需要渲染
     * @param {*} state 内容
     * @param {*} params 参数对象,{title:表示要跳转的是哪个模块的路径}
     */
    finishedFresh(state,params){
      state.pathMap[params.title].needFresh = false
    },
    clearPath(state,title){
      state.pathMap[title].stack = []
      state.pathMap[title].needFresh = true
    }
  },
  actions: {
  },
  modules: {
  }
})
