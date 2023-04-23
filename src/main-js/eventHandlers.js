/**
 * 主线程监听模块
 * handlers属性下是对应事件的监听器
 */
import { ipcMain, ipcRenderer} from "electron"
import factory from './windowFactory.js'
var username
var url
export default {
    handlers:{
        /**
         * 监听当用户点击了登录按钮后的处理
         * 跳转页面到应用主页面
         */
        onClickLoginButton(mainWin){
            ipcMain.handle('clickloginButton',(e,msg)=>{
                mainWin.hide()
                let homeWin = factory.createHomeWin()
                homeWin.load()
                username = msg
                homeWin.closeHandler(()=>{
                    homeWin = null;
                    mainWin.show()
                })
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
        }
    }
}