import { info } from 'console';

const { ipcMain, shell, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')
const {version} = require('../package.json')
const { autoUpdater } = require('electron-updater');
const isDevelopment = process.env.NODE_ENV !== 'production'
/**
 * @type {BrowserWindow} 
 */
var win;
export default{
    checkUpdateAvaible:
    /**
     * 
     * @param {String} u 
     * @param {BrowserWindow} win 
     */
    (u)=>{
        if(isDevelopment){
            return win.webContents.send('update-no');
        }
        autoUpdater.autoDownload = false;
        autoUpdater.on('update-available',(info)=>{
            if(info.version==version){
                return;
            }
            win.webContents.send('update-avaible',info);
        })
        autoUpdater.once('error',()=>{
            console.log(error);
            win.webContents.send('update-error',404);
        })
        autoUpdater.once('update-not-available',()=>{
            console.log('not')
            win.webContents.send('update-no');
        })
        autoUpdater.once('update-cancelled',info=>{
            console.log('cancel')
        })
        autoUpdater.setFeedURL(u);
        autoUpdater.checkForUpdates().catch(reason=>{
            autoUpdater.setFeedURL('http://file.chbcraft.cn:25565/update/checkUpdate/');
            autoUpdater.checkForUpdates().catch(reason=>{
                win.webContents.send('update-error',404);
            })
        })
        
    },
    startUpdate:()=>{
        autoUpdater.on('error',(error)=>{
            win.webContents.send('update-error',error.message);
        });
        autoUpdater.on('download-progress',(info)=>{
            win.webContents.send('update-progress',info.percent);
        });
        autoUpdater.on('update-downloaded',async (e)=>{
            win.webContents.send('update-complete');
        });
        autoUpdater.on('update-cancelled',(info)=>{
            win.webContents.send('update-error',"任务暂停");
        });
        autoUpdater.downloadUpdate();
    },
    installUpdate(){
        autoUpdater.quitAndInstall();
    },
    setWin(w){
        win = w;
    }
}