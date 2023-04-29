/**
 * 主线程监听模块
 * handlers属性下是对应事件的监听器
 */
import { ipcMain, ipcRenderer,dialog} from "electron"
import factory from './windowFactory.js'
import fs from 'fs';
const path = require("path")
const { initDownload } = require('./download.js')
const configPath = process.env.NODE_ENV === 'development' ? path.join(__dirname, '../config.json') : path.join(process.cwd(), 'config.json');
var configData = fs.readFileSync(configPath, 'utf-8');
const config = JSON.parse(configData)
const winCache = {
    mainWin:null
}
var username
var url
export default {
    winCache:winCache,
    handlers:{
        /**
         * 监听当用户点击了登录按钮后的处理
         * 跳转页面到应用主页面
         */
        onClickLoginButton(mainWin){
            ipcMain.handle('clickloginButton',(e,msg)=>{
                mainWin.hide()
                let homeWin = factory.createHomeWin()
                winCache.mainWin = homeWin
                initDownload(winCache,config)
                homeWin.closeHandler(async (e)=>{
                    e.preventDefault()
                    homeWin.webContents.send('close-win')
                })
                homeWin.closedHandler(()=>{
                    winCache.mainWin = null
                })
                username = msg
                winCache.mainWin.load()
                
            })
        },
        onReadyToLogin(mainWin){
            ipcMain.handle('readyToLoginEvent',()=>{
                return url
            })
        },
        onClickLogoutButton(mainWin){
            ipcMain.handle('clickLogoutButton',(args,msg)=>{
            })
        },
        onInitAddress(mainWin){
            ipcMain.handle('initAddressEvent',(e,address)=>{
                url = address
            })
        },
        onloadedHome(mainWin){
            ipcMain.handle('loadedHome',(e,msg)=>{
                return [username,url]
            })
        },
        onSwitchedPage(mainWin){
            ipcMain.handle('switchedPage',(args,msg)=>{
                if(msg=='ok'){
                    mainWin.setSize(800,700)
                    mainWin.center()
                    mainWin.show()
                    mainWin.reload()
                }
            })
        },
        onCloseMainPage(mainWin){
            ipcMain.handle('close-homeWin',async (e,value)=>{
                if(value){
                    winCache.mainWin.webContents.session.removeAllListeners('will-download')
                    await winCache.mainWin.webContents.session.closeAllConnections()
                    ipcMain.removeAllListeners('download')
                    winCache.mainWin.destroy()
                    mainWin.close()
                }else{
                    winCache.mainWin.hide()
                }
                
            })
        },
        onGetConfig(){
            ipcMain.handle('getConfig',(args,msg)=>{
                return config
            })
        },
        onOpenSelectDialog(mainWin){
            ipcMain.handle('openSelectPathDialog',()=>{
                console.log(config.downloadPath)
                let res = dialog.showOpenDialogSync(mainWin, { 
                    title: "Select Directory", 
                    properties: ['openDirectory'],
                    defaultPath:config.defaultPath
                })
                if(res==null)
                    return
                config.downloadPath = res[0]
                fs.writeFileSync(configPath,JSON.stringify(config))
                return res[0]
            })
        },
        onChangeAutoOpen(mainWin){
            ipcMain.handle('changeAutoOpen',(e,msg)=>{
                config.openDirAuto = msg
                fs.writeFileSync(configPath,JSON.stringify(config))
            })
        }
    }
}