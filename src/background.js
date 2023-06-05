import { app, protocol, BrowserWindow,Menu,Tray, ipcMain} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import handlers from './eventHandlers.js'
import path from 'path'
import upload from './upload.js';
import ws from './ws.js';
import update from './update.js'
const { autoUpdater } = require('electron-updater');
const trayIconPath = process.env.NODE_ENV === 'development' ? path.join(__dirname,'../public/icons/ICON.png') : "./ICON.png"
const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:8080` : `file://${__dirname}/index.html`
var appTray
var win;
const isDevelopment = process.env.NODE_ENV !== 'production'
// Object.defineProperty(app,'isPackaged',{
//   get(){
//     return true;
//   }
// })

// if (process.env.NODE_ENV === 'development') {
//   autoUpdater.updateConfigPath = path.join(__dirname, 'win-unpacked/resources/app-update.yml')
//   // mac的地址是'Contents/Resources/app-update.yml'
// }
// console.log(powerSaveBlocker)
// powerSaveBlocker.start('prevent-app-suspension')
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])
Menu.setApplicationMenu(null)
//删除工具栏
async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 520,
    height: 640,
    icon: trayIconPath,
    show:false,
    resizable:false,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true,
      contextIsolation: false
    } 
  })
  registerListener(win)
  win.on('ready-to-show',()=>{
    update.setWin(win);
    win.show()
  })
  // win.webContents.session.on('will-download',(event,item)=>{
    
  // })
  win.on('close',()=>{
    app.quit()
  })
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  createWindow()
  var trayMenuTemplate = [
    {
        label: "切换账号",        
        click: async function() {
          if(handlers.winCache.mainWin!==null){
            ws.cancelThisMissions();
            upload.clearTaskQueue();
            handlers.winCache.mainWin.webContents.session.removeAllListeners('will-download')
            ipcMain.emit('clearAllQuest')
            await handlers.winCache.mainWin.webContents.session.closeAllConnections()
            ipcMain.removeAllListeners('download');
            ipcMain.removeHandler('commitMission');
            handlers.winCache.mainWin.destroy() 
            win.show()
          }    
        } //打开相应页面
    },
    {
        label: "退出客户端",
        click: function() {
            if(handlers.winCache.mainWin!==null)
            {
              handlers.winCache.mainWin.show();
              handlers.winCache.mainWin.close();
            }else
              app.quit();
        }
    }
  ]
  appTray = new Tray(trayIconPath);

  appTray.setContextMenu(Menu.buildFromTemplate([]));
    //图标的上下文菜单
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
  //设置此托盘图标的悬停提示内容
  appTray.setToolTip("云上云下");
  //设置此图标的上下文菜单
  appTray.setContextMenu(contextMenu);
  appTray.on('double-click',()=>{
    if(handlers.winCache.mainWin!==null){
      handlers.winCache.mainWin.show()
    }
  })
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
/**
 * 注册所有进程通信之间的监听器
 * @param {*} win 登录窗口对象 
 */
const registerListener = function(win){
  Object.keys(handlers.handlers).forEach(e=>{handlers.handlers[e](win)})
}
export default{
  isDevelopment:isDevelopment
}
