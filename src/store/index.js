import { createStore } from 'vuex'

export default createStore({
  state: {
    nowPage:'文件',
    showMove:false,
    userInfo:{
      nick:'',
      username:'32331335333',
      head:require('@/assets/head.png'),
      permission:'user'
    },
    miniPathMap:{
      content:[
      ],
      files:[
      ],
      moveQueue:[],
      needFresh:false,
      title:''
    },
    pathMap:{
      files:{ 
        title:'文件',
        checkLength:0,
        stack:[
        ],
        fileList:[],
        flag:0,
        needFresh:false
      },
      favorite:{
        title:'收藏夹',
        checkLength:0,
        fileList:[
        ],
        stack:[
        ],
        flag:0,
        needFresh:false
      },
      recycle:{
        title:'回收站',
        checkLength:0,
        flag:0,
        stack:[
        ],
        fileList:[
        ],
        needFresh:false
      },
      lock:{ 
        title:'密码箱',
        checkLength:0,
        flag:0,
        stack:[
        ],
        fileList:[
        ],
        needFresh:false
      },
    }
  },
  getters: {

  },
  mutations: { 
    setUser(state,params){
      state.userInfo.username = params.username
    },
    setFileList(state,params){
      state.pathMap[params.title].fileList = params.fileList
    },
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
    },
    changeFileState(state,params){
      state.pathMap[params.title].fileList[params.index].state = params.state
      state.pathMap[params.title].checkLength+=params.state===1?1:-1
    },
    checkInRange(state,params){
      if(params.eIndex>state.pathMap[params.title].fileList.length-1)
        return
      for(let i = params.bIndex;i<=params.eIndex;i++){
        if(state.pathMap[params.title].fileList[i].state===0)
          state.pathMap[params.title].checkLength+=1
        state.pathMap[params.title].fileList[i].state=1
        
      } 
    },
    switchMiniPrePath(state,params){
      let modifier = params.modifier//要跳转的之前的目录的修饰符
      let stack = state.miniPathMap.content
      let findItem = ''
      do{
        stack.pop()
        findItem = stack[stack.length-1]
      }while(stack.length>0&&findItem.modifier!==modifier)
      state.miniPathMap.needFresh = true//更新这个模块的状态为需要更新,让vue监听器察觉并更新内容
    },
    switchMiniPostPath(state,params){
      let name = params.pathName
      let modifier = params.modifier
      state.miniPathMap.content.push({
        name:name,
        modifier:modifier
      })
      state.miniPathMap.needFresh = true 
    },
    setMiniFileList(state,params){
      state.miniPathMap.files = params.fileList
    },
    finishedMiniFresh(state){
      state.miniPathMap.needFresh = false
    },
    clearMiniPath(state){
      state.miniPathMap.content = [] 
      state.miniPathMap.needFresh = true
    },
    async showSubWindow(state,params){
      let list = params.list
      let title = params.title
      let moveQueue = params.moveQueue
      try{
        state.miniPathMap.files = list
        state.miniPathMap.moveQueue = moveQueue;
        state.miniPathMap.title = title
      }catch(E){
        console.log(E)
      }finally{
        state.miniPathMap.content = []
        state.miniPathMap.needFresh = true
        state.showMove = true
      }
      
    },
    hiddenSubWindow(state){
      state.showMove = false
    },
    /**
     * 将文件排序,将目录排序到前方,双指针时间复杂度O(n)
     * @param {*} state 
     */
    priorityDir(state){
      let arr = state.miniPathMap.files
      let l=0,r = arr.length-1
      while(l<r){
        while(l<r&&arr[l].type==='directory'){
          l++;
        }
        while(r>l&&arr[r].type!=='directory'){
          r--;
        }
        if(l>=r)
          break
        let temp = arr[l]
        arr[l] = arr[r]
        arr[r] = temp
      }
    },
    /**
     * 将文件排序,将目录排序到前方,双指针时间复杂度O(n)
     * @param {*} state 
     */
    priorityFilesDir(state,params){
      let arr = state.pathMap[params.title].fileList
      let l=0,r = arr.length-1
      while(l<r){
        while(l<r&&arr[l].type==='directory'){
          l++;
        }
        while(r>l&&arr[r].type!=='directory'){
          r--;
        }
        if(l>=r)
          break
        let temp = arr[l]
        arr[l] = arr[r]
        arr[r] = temp
      }
    },
    /**
     * 选中指定模块下的所有文件
     * @param {*} state 
     * @param {*} params 
     */
    selectAll(state,params){
      state.pathMap[params.title].fileList.forEach(element=>{
        element.state = 1
      })
      state.pathMap[params.title].checkLength = state.pathMap[params.title].fileList.length
    },
    /**
     * 换页后重置检查长度
     * @param {*} state 
     * @param {*} params 
     */
    resetCheckLength(state,params){
      let title = params.title
      state.pathMap[title].checkLength = 0
    },
    /**
     * 标记一个模块为已加载,不需要重复加载
     * @param {*} state 
     * @param {*} params 
     */
    pointContent(state,params){
      state.pathMap[params.title].flag = 1
    }
  }, 
  actions: { 
  },
  modules: {
  }
})
