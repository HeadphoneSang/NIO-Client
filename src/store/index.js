import { createStore } from 'vuex'

export default createStore({
  state: {
    nowPage:'文件',
    showMove:false,
    miniPathMap:{
      content:[
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
          name:'测试文件夹6', 
          modifier:'RCUzQSU1Q123yV1NUJBMyV1NadA4=='
        },
        {
          name:'测试文件夹7',
          modifier:'RCUzQSU1QyV1NUJBMy123V1NadA4=='
        },
        {
          name:'测试文件夹9',
          modifier:'RCUzQS123U1QyV1NUJBMyV1NadA4=='
        },
      ],
      files:[
        {
          name:'测试.zip',
          modifier:'RCUzQSU1QyV1NUJBMyV11212N141123adA4==',
          state:0, 
          type:'zip',
          time:'2023/4/3'
        },
        {
          name:'数据12312包目录',
          modifier:'RCUzQS12312U1QyV54、1NUJBM1231yV11211132NadA4==',
          state:0, 
          type:'directory',
          time:'2023/4/3'
        },
        {
          name:'uuu.js',
          modifier:'RCUzQSU1QyV1N5131UJBMyV11211442NadA4==',
          state:0,  
          type:'js',
          time:'2023/4/3'
        },
        {
          name:'学习资料.rar',
          modifier:'RCU123zQSU1QyV1NUJBM1231yV11212NadA4==',
          state:0, 
          type:'rar',
          time:'2023/4/3'
        },
        {
          name:'说明书.pdf',
          modifier:'RCUzQSU1QyV1NUJBM1231yV11211132NadA4==',
          state:0, 
          type:'pdf',
          time:'2023/4/3'
        },
        {
          name:'数据包目录',
          modifier:'RCUzQSU1QyV54、1NUJBM1231yV11211132NadA4==',
          state:0, 
          type:'directory',
          time:'2023/4/3'
        },
        {
          name:'学习资料.rar',
          modifier:'RCU123zQSU1QyV1NUJBM1231yV11212NadA4==',
          state:0, 
          type:'rar',
          time:'2023/4/3'
        },
        {
          name:'说明书.pdf',
          modifier:'RCUzQSU1QyV1NUJBM1231yV11211132NadA4==',
          state:0, 
          type:'pdf',
          time:'2023/4/3'
        },
        {
          name:'数据包目录',
          modifier:'RCUzQSU1QyV54、1NUJBM1231yV11211132NadA4==',
          state:0, 
          type:'directory',
          time:'2023/4/3'
        },
        {
          name:'说明书',
          modifier:'RCUz1231QSU1QyV1NUJBM1231yV11211132NadA4==',
          state:0, 
          type:'directory',
          time:'2023/4/3'
        },
      ],
      needFresh:false
    },
    pathMap:{
      files:{ 
        title:'文件',
        checkLength:0,
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
        fileList:[
          {
            name:'数据.excel',
            modifier:'RCUzQSU1QyV1NUJBMyV11212NadA1234==',
            state:0, 
            type:'xlsx',
            time:'2023/4/3'
          },
        ],
        needFresh:false
      },
      favorite:{
        title:'收藏夹',
        checkLength:0,
        fileList:[
          {
            name:'老师视频学习资料.zip',
            modifier:'RCUzQSU1QyV1NUJBMyV11212NadA1234==',
            state:0, 
            type:'zip',
            time:'2023/4/3'
          },
        ],
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
      recycle:{
        title:'回收站',
        checkLength:0,
        stack:[
          {
            name:'测试文件夹-1',
            modifier:'RCUzQSU1QyV1NUJBMyV1NEYyMA==11'
          }, 
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
          {
            name:'测试文件夹4',
            modifier:'RCUzQSU1QyV1NUJBMyV1NadA4=1='
          }, 
        ],
        fileList:[
          {
            name:'数据.excel',
            modifier:'RCUzQSU1QyV1NUJBMyV11212NadA1234==',
            state:0, 
            type:'xlsx',
            time:'2023/4/3'
          },
          {
            name:'测试.zip',
            modifier:'RCUzQSU1QyV1NUJBMyV11212N141123adA4==',
            state:0, 
            type:'zip',
            time:'2023/4/3'
            
          },
          {
            name:'uuu.js',
            modifier:'RCUzQSU1QyV1N5131UJBMyV11211442NadA4==',
            state:0,  
            type:'js',
            time:'2023/4/3'
          },
          {
            name:'学习资料.rar',
            modifier:'RCU123zQSU1QyV1NUJBM1231yV11212NadA4==',
            state:0, 
            type:'rar',
            time:'2023/4/3'
          },
          {
            name:'说明书.pdf',
            modifier:'RCUzQSU1QyV1NUJBM1231yV11211132NadA4==',
            state:0, 
            type:'pdf',
            time:'2023/4/3'
          },
          {
            name:'音乐.ogg',
            modifier:'RCUzQSU1QyV1NUJBM1231yV111212NadA134==',
            state:0, 
            type:'ogg',
            time:'2023/4/3'
          },
          {
            name:'tools',
            modifier:'RCUzQSU1QyV1NUJBM1231yV11212NadA134==',
            state:0, 
            type:'directory',
            time:'2023/4/3'
          },
          {
            name:'资料.doc',
            modifier:'RCUz11QSU1QyV1NUJBM1231yV11212NadA134==',
            state:0, 
            type:'doc',
            time:'2023/4/3'
          }, 
          { 
            name:'tools',
            modifier:'RCUz31QSU1QyV1NUJBM1231yV11212NadA134==',
            state:0, 
            type:'',
            time:'2023/4/3'
          },
          {
            name:'嘘唏.ppt',
            modifier:'RC4aUzQSU1QyV1NUJBM1231yV11212NadA134==',
            state:0, 
            type:'ppt',
            time:'2023/4/3'
          },
          {
            name:'网站.html',
            modifier:'RCasdaUzQSU1QyV1NUJBM1231yV11212NadA134==',
            state:0, 
            type:'html',
            time:'2023/4/3'
          },
          { 
            name:'tools.jar',
            modifier:'RCUzQSU1QyV1NUfaJBM1231yV11212NadA134==',
            state:0, 
            type:'jar',
            time:'2023/4/3'
          },  
          {
            name:'哈哈哈哈234.mkv',
            modifier:'RCUzasdaQSU1QyV1NUJBM1231yV11212NadA134==',
            state:0, 
            type:'mkv',
            time:'2023/4/3'
          },
        ],
        needFresh:false
      },
      lock:{ 
        title:'密码箱',
        checkLength:0,
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
        fileList:[
          {
            name:'秘密文件.log',
            modifier:'RCUzQSU1QyV1NUJBMyV11212NadA1234==',
            state:0, 
            type:'log',
            time:'2023/4/3'
          },
        ],
        needFresh:false
      },
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
    },
    changeFileState(state,params){
      state.pathMap[params.title].fileList[params.index].state = params.state
      state.pathMap[params.title].checkLength+=params.state===1?1:-1
    },
    checkInRange(state,params){
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
    finishedMiniFresh(state){
      state.miniPathMap.needFresh = false
    },
    clearMiniPath(state){
      state.miniPathMap.content = [] 
      state.miniPathMap.needFresh = true
    },
    showSubWindow(state){
      state.showMove = true
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
    }
  }, 
  actions: { 
  },
  modules: {
  }
})
