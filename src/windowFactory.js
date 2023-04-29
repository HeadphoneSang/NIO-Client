import { BrowserWindow} from "electron"
const path = require("path")
const trayIconPath = process.env.NODE_ENV === 'development' ? path.join(__dirname,'../public/icons/ICON.png') : "./ICON.png"
const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:8080` : `file://${__dirname}/index.html`

/**
 * 
 * @returns 返回一个新的homeWin对象
 */
const createHomeWin = function(){
  const homeWin = new BrowserWindow({
    width:1100,
    height:720,
    minWidth:1100,
    minHeight:600,
    icon:trayIconPath,
    show:false,
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  })
  homeWin.center()
  // win2.loadURL(winURL+'#/homePage')
  homeWin.on('ready-to-show',()=>{
    homeWin.show()
  })
  homeWin.load = ()=>{
    homeWin.loadURL(winURL+"#/homePage")
  }
  homeWin.closeHandler = function(handler){
    homeWin.on('close',(e)=>{
      handler(e)
    })
  }
  homeWin.closedHandler = function(handler){
    homeWin.on('closed',(e)=>{
      handler(e)
    })
  }
  return homeWin
}
export default {
    createHomeWin
}