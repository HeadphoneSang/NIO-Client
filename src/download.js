const { ipcMain, shell } = require('electron')
const path = require('path')
const fs = require('fs')

exports.initDownload = function (winCache,config) {
  var downloadObj = {
    downloadPath: '', // 要下载的链接或文件
    fileName: '', // 要保存的文件名，需要带文件后缀名
    savedPath: '' // 要保存的路径
  }
  function resetDownloadObj() {
    downloadObj = {
      downloadPath: '',
      fileName: '',
      savedPath: ''
    }
  }
  
  // 监听渲染进程发出的download事件
  ipcMain.on('download', (evt, args) => {
    downloadObj.downloadPath = args.downloadPath
    downloadObj.fileName = args.fileName
    console.log("donwload")
    if(fs.existsSync(config.downloadPath)){
      winCache.mainWin.webContents.downloadURL(downloadObj.downloadPath)
    }else{
      fs.mkdirSync(config.downloadPath)
      winCache.mainWin.webContents.downloadURL(downloadObj.downloadPath)
    }
  })
  winCache.mainWin.webContents.session.on('will-download', (event, item) => {
    //设置文件存放位置
    
    item.setSavePath(`${config.downloadPath}\\${downloadObj.fileName}`)
    // console.log(downloadObj.savedPath)

    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        winCache.mainWin.webContents.send('downloadInterruptedEvent',"")
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log(downloadObj.fileName+'运行中暂停了')
        } else {
          try{
            winCache.mainWin.webContents.send('downloadUpdateEvent',(item.getReceivedBytes()*100/item.getTotalBytes()).toFixed(2))
          }catch(e){
            item.cancel()
          }
        }
      }
    })
    item.once('done', (event, state) => {
      if (state === 'completed') {
        winCache.mainWin.webContents.send('downloadSuccessEvent',"")
        if(config.openDirAuto)
          shell.showItemInFolder(config.downloadPath+"\\"+downloadObj.fileName) // 下载成功后打开文件所在文件夹
      } else {
        
        winCache.mainWin.webContents.send('downloadFailedEvent',"")
      }
      item.cancel()
      console.log('cancel')
      ipcMain.removeAllListeners('clearAllQuest')
      resetDownloadObj()
    })
    ipcMain.on('clearAllQuest',()=>{
      item.cancel()
      console.log('cancel')
      ipcMain.removeAllListeners('clearAllQuest')
    })
  })
  return this
}
