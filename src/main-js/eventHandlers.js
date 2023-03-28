/**
 * 主线程监听模块
 * handlers属性下是对应事件的监听器
 */
import { ipcMain} from "electron"
import factory from './windowFactory.js'

export default {
    handlers:{
        /**
         * 监听当用户点击了登录按钮后的处理
         * 跳转页面到应用主页面
         */
        onClickLoginButton(mainWin){
            ipcMain.handle('clickloginButton',(args,msg)=>{
                mainWin.hide()
                let homeWin = factory.createHomeWin()
                homeWin.load()
                homeWin.closeHandler(()=>{
                    homeWin = null;
                    mainWin.show()
                })
            })
        },
        onClickLogoutButton(mainWin){
            ipcMain.handle('clickLogoutButton',(args,msg)=>{
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