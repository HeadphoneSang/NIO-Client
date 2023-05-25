const WebSocketClient = require('websocket').client
const fs = require('fs')
const AsyncLock = require('async-lock');
const lock = new AsyncLock();
import CtrlPtl from './ctrlPtl';
import StatePtl from './statePtl';
import proUtil from './protocolUtil';
import { connection } from 'websocket';
import { BrowserWindow } from 'electron';
import upload from './upload.js'
import wsCtr from './wsCtr.js';
import protocolUtil from './protocolUtil';
const allSockets = new Map();
const pSize = 256*1024;
var url;

/**
 * @type {BrowserWindow}
 */
var win;

/**
 * 将字符串解析为byte数组
 * @param {*} str 字符串
 * @param {*} encoding 字符串编码 
 * @returns 
 */
function toBytes(str,encoding){
    var bytes = [];
    var buff = new Buffer.from(str,encoding);
    for(var i= 0; i< buff.length; i++){
      var byteint = buff[i];
      bytes.push(byteint);
    }
    return bytes;
}
/**
 * 解析定长协议帧
 * @param {*} msg 
 * @returns 
 */
function parseFrame(msg){//将定长协议报文解析为帧
    let buf = Buffer.from(toBytes(msg.utf8Data,msg.type));
    return {
        protocol: buf.readIntBE(0,4),
        data: parseInt(buf.subarray(4).toString(msg.type))
    }
}

//向服务器申请关闭连接，不由客户端主动断开连接
function readFileSendToSocket(fileObj,conn,startIndex){
    const reader = fs.createReadStream(fileObj.oriPath,{
        start:startIndex,
        highWaterMark: pSize,
    });
    reader.on('data',(chunk)=>{
        if(conn.state=='open')
            conn.send(chunk);
        else
            reader.close();
    });
    // reader.on('end',()=>{
    //     console.log(`${fileObj.name}读取完毕`);
    // });
}

/**
 * 处理任务创建阶段的协议
 * @param {*} frame  
 * @param {*} fileObj 
 * @param {connection} conn 
 */
function handlerTaskCreating(frame,fileObj,conn){
    if(win.isDestroyed())
        return;
    switch(frame.protocol & 0xf){
        case StatePtl.NEW_TASK:{//创建新任务
            win.webContents.send('uploadTaskCreated',fileObj.tarPath);
            wsCtr.createNewControlTask(fileObj,conn,frame.data);
            // conn.send(JSON.stringify(proUtil.createFrame(CtrlPtl.TASK_CREATING|StatePtl.CREATE_CTRL,0)));
            // readFileSendToSocket(fileObj,conn,0);
            break;
        }
        case StatePtl.CONTINUE_TASK:{//继续服务器缓存的任务
            win.webContents.send('uploadTaskCreated',fileObj.tarPath);
            wsCtr.createNewControlTask(fileObj,conn,frame.data);
            // readFileSendToSocket(fileObj,conn,frame.data);
            // conn.send(JSON.stringify(proUtil.createFrame(CtrlPtl.TASK_CREATING|StatePtl.CREATE_CTRL,0)));
            break;
        }
        case StatePtl.FILE_EXIST:{
            //向服务器申请关闭连接，不由客户端主动断开连接
            handlerTaskCompleted(frame,fileObj,conn);
            break; 
        }
    }
    /**
     * 续传还是新传
     *  续传根据回复报文的坐标将文件读入切片写出
     *  新传直接将坐标置0分片读入写出
     * 通知渲染线程更新任务状态
     */
}

/**
 * 处理任务完成后的协议
 * @param {*} frame  
 * @param {*} fileObj 
 * @param {connection} conn 
 */
function handlerTaskCompleted(frame,fileObj,conn){
    if(win.isDestroyed())
        return;
    win.webContents.send("uploadTaskProgress",fileObj.tarPath,fileObj.size);
    fileObj.sendByte = fileObj.size
    lock.acquire('deleteUploadItem',(done)=>{
        upload.deleteMainUploadTask(fileObj.tarPath);
        win.webContents.send('uploadTaskCompleted',fileObj.tarPath);
        conn.send(JSON.stringify(protocolUtil.createFrame(CtrlPtl.TASK_COMPLETED,0)));
        done();
    })
    
    
    /**
     * 向渲染线程发送成功和成功的任务的id,删除sockets里面的任务
     * 渲染线程也删除表中的对象和下载列表里的对象，删除列表对象方法锁起来
     * 删除用while删除，等待可以删了再删
     * while(删除是否成功?){
     *      删除请求
     * }
     */
}


/**
 * 处理任务进行时协议
 * @param {*} frame  
 * @param {*} fileObj 
 * @param {connection} conn 
 */
function handlerTaskRunning(frame,fileObj,conn){
    fileObj.sendByte = frame.data;
    if(conn.forceClose){
        // conn.sendCloseFrame(1000,(err)=>{
        //     console.log(err);
        // });
        return;
    }
    if(win.isDestroyed()){
        conn.close();
        return;
    }
    win.webContents.send('uploadTaskProgress',fileObj.tarPath,frame.data);
}

/**
 * 处理任务失败时的协议
 * @param {*} frame  
 * @param {*} fileObj 
 * @param {connection} conn 
 */
function handlerTaskFailed(frame,fileObj,conn){
    switch(frame.protocol & 0xf){
        case StatePtl.FILE_CHANGED:{
            
            break;
        }
        default :{
            break;
        }
    }
}
/**
 * 管道关闭事件
 * @param {*} fileObj 
 * @param {WebSocketClient} client 
 * @param {connection} conn
 */
function handlerTaskClosed(fileObj,client,conn){
    let residueAmount = fileObj.size - fileObj.sendByte;
    if(residueAmount>0){//是否还存在未上传的字节
        if(win.isDestroyed()||(conn.forceClose!=undefined&&conn.forceClose))
            return;
        win.webContents.send('uploadTaskClosed',fileObj.tarPath);
        if(conn.closeTap!==undefined)
            return;
        fileObj.reconnTime = 0;
        setTimeout(()=>{
            fileObj.reconnTime++;
            client.connect(url);
        },3000);
    }else//完整上传
    {
        allSockets.delete(fileObj.tarPath);
        wsCtr.closeSocket(fileObj.uuid);
    }
}

/**
 * ws连接失败
 * @param {Error} e 连接失败错误 
 * @param {*} fileObj 文件对象
 * @param {WebSocketClient} client ws的客户端 
 * @param {connection} conn
 */
function handlerTaskConnectFailed(e,fileObj,client,conn){
    if(fileObj.reconnTime!=undefined){
        if(win.isDestroyed())
            return;
        if(fileObj.reconnTime<1200){
            setTimeout(()=>{
                fileObj.reconnTime++;
                if(win.isDestroyed())
                    return;
                // console.log('正在尝试重连...:'+fileObj.reconnTime);
                client.connect(url);
            },3000);
        }else{
            allSockets.delete(fileObj.tarPath);
            wsCtr.closeSocket(fileObj.uuid);
            // console.log('请求超时,任务失败：'+fileObj.reconnTime);
        }
    }else{
        // client.off();
        lock.acquire('deleteUploadItem',(done)=>{
            upload.deleteMainUploadTask(fileObj.tarPath);
            win.webContents.send('uploadTaskFailed',fileObj.tarPath);
            allSockets.delete(fileObj.tarPath);
            done();
        })
    }
}

export default{

    /**
     * 创建一个数据连接和控制连接的组合任务
     * @param {*} fileObj 上传文件对象
     */
    async createNewCombineTask(fileObj){
        createNewTask(fileObj);
    },
    /**
     * 创建一个上传任务
     * @param {*} fileObj 任务信息对象
     */
    async createNewTask(fileObj){
        let client = new WebSocketClient();
        client.on('connect',(conn)=>{
            allSockets.set(fileObj.tarPath,conn);
            // console.log(`${fileObj.name}连接已建立`)
            conn.on('error',(e)=>{
                console.log(conn.closeReasonCode)
            })
            conn.on('closeConnect',()=>{
                // console.log(111)
            })
            conn.on('close',(e)=>{
                // console.log(`${fileObj.name}连接已断开${e}`);
                handlerTaskClosed(fileObj,client,conn);
            })
            conn.on('message',(msg)=>{
                let frame = parseFrame(msg);
                switch(frame.protocol& ~0xf){
                    case CtrlPtl.TASK_CREATING:
                        handlerTaskCreating(frame,fileObj,conn);break;
                    case CtrlPtl.TASK_RUNNING:
                        handlerTaskRunning(frame,fileObj,conn);break;
                    case CtrlPtl.TASK_FAILED:
                        handlerTaskFailed(frame,fileObj,conn);break;
                    case CtrlPtl.TASK_COMPLETED:
                        handlerTaskCompleted(frame,fileObj,conn);break;
                }
            })
            conn.send(JSON.stringify(proUtil.createFrame(CtrlPtl.TASK_CREATING|StatePtl.NEW_TASK,fileObj.size,{path:fileObj.tarPath,username:fileObj.username,uuid:fileObj.uuid})));
        });
        client.on('connectFailed',(e)=>{
            handlerTaskConnectFailed(e,fileObj,client);
        });
        client.connect(url);
    },
    /**
     * 删除指定路径的任务
     * @param {*} path 任务文件路径
     */
    closeSocket(path,uid){
        let socket = allSockets.get(path);
        socket.forceClose = true;
        allSockets.delete(path);
        /**
         * @type {connection}
         */
        let ctlConn = wsCtr.getCtrSocket(uid);
        if(ctlConn!=null){
            ctlConn.c
            ctlConn.send(JSON.stringify(protocolUtil.createFrame(CtrlPtl.TASK_RUNNING|StatePtl.CANCEL_CONTINUE,0,{uuid:uid})));
        }
        // if(socket!==null||socket!==undefined){
        //     socket.forceClose = true;
        // }
        // else{
        //     console.log(`${path}的连接不存在`)
        // }
    },
    /**
     * 取消掉所有的任务,删除对象
     */
    cancelThisMissions(){
        allSockets.forEach(
            /**
             * 
             * @param {connection} socket 
             * @param {*} key 
             */(socket,key)=>{
                socket.forceClose = true;
        })
        wsCtr.cancelThisMissions();
        allSockets.clear()
    },
    /**
     * 
     * @param {BrowserWindow} w 
     */
    setWin(w){
        win = w;
    },
    /**
     * 
     * @param {String} u 
     */
    setUrl(u){
        url = `ws${u.substring(u.indexOf(':'))}/ws`
    },
    readFileSendToSocket(fileObj,conn,startIndex){
        const reader = fs.createReadStream(fileObj.oriPath,{
            start:startIndex,
            highWaterMark: pSize,
        });
        reader.on('data',(chunk)=>{
            if(conn.state=='open')
                conn.send(chunk);
            else
                reader.close();
        });
        // reader.on('end',()=>{
        //     console.log(`${fileObj.name}读取完毕`);
        // });
    }
}