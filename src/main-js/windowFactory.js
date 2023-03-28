import { BrowserWindow} from "electron"

const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:8080` : `file://${__dirname}/index.html`

/**
 * 
 * @returns 返回一个新的homeWin对象
 */
const createHomeWin = function(){
  const homeWin = new BrowserWindow({
    width:800,
    height:700,
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
    homeWin.on('close',()=>{
      handler()
    })
  }
  return homeWin
}
export default {
    createHomeWin
}