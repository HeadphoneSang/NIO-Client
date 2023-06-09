/**
 * 主线程监听模块
 * handlers属性下是对应事件的监听器
 */
import { ipcMain, dialog,powerSaveBlocker, BrowserWindow,shell} from "electron"
import factory from './windowFactory.js'
import fs from 'fs';
import upload from './upload.js';
import ws from './ws.js';
import wsCtr from "./wsCtr.js";
import update  from "./update.js";
const path = require("path")
const { autoUpdater } = require('electron-updater');
const { initDownload } = require('./download.js')
const configPath = process.env.NODE_ENV === 'development' ? path.join(__dirname, '../config.json') : path.join(process.cwd(), 'config.json');
var configData = fs.readFileSync(configPath, 'utf-8');
const config = JSON.parse(configData)
var sleepId;
const winCache = {
    /**
     * @type {BrowserWindow}
     */
    mainWin:null
}
var username;
var url;
var {version} = require("../package.json");
if(config!=null&&config.stopSleep!=undefined){
    if(config.stopSleep){
        sleepId = powerSaveBlocker.start('prevent-app-suspension');
    }
}

export default {
    winCache:winCache,
    id:username,
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
                initDownload(winCache,config).downloadObj
                ws.setWin(homeWin);
                ws.setUrl(url);
                wsCtr.setUrl(url);
                ipcMain.handle('commitMission',(e,args)=>{
                    return upload.addDownloadQuest(JSON.parse(args))
                })
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
                    ipcMain.emit('clearAllQuest')
                    await winCache.mainWin.webContents.session.closeAllConnections()
                    ipcMain.removeAllListeners('download');
                    ipcMain.removeHandler('commitMission');                    winCache.mainWin.destroy();
                    upload.clearTaskQueue();
                    ws.cancelThisMissions();
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
        },
        onChangePowerState(){
            ipcMain.handle('changePowerState',(e,flag)=>{
                config.stopSleep = flag;
                fs.writeFileSync(configPath,JSON.stringify(config));
                if(flag&&(sleepId==undefined||powerSaveBlocker.isStarted(sleepId))){
                    sleepId = powerSaveBlocker.start('prevent-app-suspension');
                }else if(!flag){
                    powerSaveBlocker.stop(sleepId);
                }
            })
        },
        onChangeMaxUpload(){
            ipcMain.handle('changeMaxUpload',(e,max)=>{
                config.maxUploadThread = max;
                fs.writeFileSync(configPath,JSON.stringify(config));
                upload.setMax(max);
            })
        },
        onOpenDownloadDir(){
            ipcMain.handle('onOpenDownloadDir',()=>{
                shell.openPath(config.downloadPath);
            })
        },
        onForceDeleteUploadTask(){
            ipcMain.handle("onForceDeleteUploadTask",(e,key,uuid)=>{
                ws.closeSocket(key,uuid);
                upload.deleteMainUploadTask(key);
                return true;
            })
        },
        onCheckUpdate(){
            ipcMain.handle('checkUpdate',(e)=>{
                let u = `${url}/update/checkUpdate/`
                update.checkUpdateAvaible(u);
            })
        },
        onUpdateStart(){
            ipcMain.handle('startUpdate',(e)=>{
                update.startUpdate();
            })
        },
        onInstallUpdate(){
            ipcMain.handle('installUpdate',(e)=>{
                update.installUpdate()
                return true;
            })
        }
    }
}