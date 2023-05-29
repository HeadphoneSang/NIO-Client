const WebSocketClient = require('websocket').client
import CtrlPtl from './ctrlPtl';
import { connection } from 'websocket';
import StatePtl from './statePtl';
import proUtil from './protocolUtil';
import ws from './ws.js'
import protocolUtil from './protocolUtil';
const AsyncLock = require('async-lock');
const lock = new AsyncLock();

var url;
var isConnect = false;
const allSockets = new Map();

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
/**
 * 
 * @param {*} frame 
 * @param {*} fileObj 
 * @param {connection} conn 
 * @param {connection} dataConn 
 */
function handlerTaskCreating(frame,fileObj,conn,dataConn,data){
    switch(frame.protocol & 0xf){
        case StatePtl.CTRL_CREATED:{
            ws.readFileSendToSocket(fileObj,dataConn,data);
            setTimeout(() => {
                conn.send(JSON.stringify(protocolUtil.createFrame(CtrlPtl.TASK_RUNNING|StatePtl.PING,0)));
            }, 60000);
            break;
        }
        case StatePtl.CTRL_FAILED:{
            conn.send(JSON.stringify(protocolUtil.createFrame(CtrlPtl.TASK_RUNNING|StatePtl.CANCEL_CONTINUE,0)));
            break;
        }
    }
}
/**
 * 
 * @param {*} frame 
 * @param {*} fileObj 
 * @param {connection} conn 
 * @param {connection} dataConn 
 * @param {*} data 
 */
function handlerTaskRunning(frame,fileObj,conn,dataConn,data){
    switch(frame.protocol & 0xf){
        case StatePtl.PONG:{
            setTimeout(() => {
                conn.send(JSON.stringify(protocolUtil.createFrame(CtrlPtl.TASK_RUNNING|StatePtl.PING,0)));
            }, 60000);
            break;
        }
    }
}

function handlerTaskClosed(frame,fileObj,conn,dataConn,data){
    allSockets.delete(fileObj.uuid);
    //调用closeSocket
}
export default{
    /**
     * 创建一个上传任务的控制连接
     * @param {*} fileObj 任务信息对象
     * @param {connection} dataConn 数据连接的连接对象
     */
    createNewControlTask(fileObj,dataConn,data){
        lock.acquire('createCtrlConnect',(done)=>{
            let client = new WebSocketClient();
            client.on('connect',(conn)=>{
                allSockets.set(fileObj.uuid,conn);
                // console.log(`${fileObj.name}连接已建立`)
                conn.on('error',(e)=>{
                    console.log(e)
                })
                conn.on('close',(e)=>{
                    handlerTaskClosed(fileObj,client,conn,dataConn,data);
                })
                conn.on('message',(msg)=>{
                    let frame = parseFrame(msg);
                    switch(frame.protocol& ~0xf){
                        case CtrlPtl.TASK_CREATING:
                            handlerTaskCreating(frame,fileObj,conn,dataConn,data);break;
                        case CtrlPtl.TASK_RUNNING:{
                            handlerTaskRunning(frame,fileObj,conn,dataConn,data);break;
                        }
                    }
                })
                conn.send(JSON.stringify(proUtil.createFrame(CtrlPtl.TASK_CREATING|StatePtl.CREATE_CTRL,0,{uuid:fileObj.uuid})));
            });
            client.connect(url);
            isConnect = true;
            done();
        })
    },

    deleteCtrlSocket(uuid){
        allSockets.delete(uuid);
    },
    /**
     * 通过控制连接关闭socket通道
     * @param {*} path 任务文件路径
     */
    closeSocket(uuid){
        
    },
    /**
     * 通过控制连接取消掉所有的任务,删除对象
     */
    cancelThisMissions(){
        allSockets.forEach(
            /**
             * 
             * @param {connection} socket 
             * @param {*} key 
             */(socket,key)=>{
                socket.send(JSON.stringify(protocolUtil.createFrame(CtrlPtl.TASK_RUNNING|StatePtl.CANCEL_CONTINUE,0,{uuid:key})));
        })
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
    getCtrSocket(uuid){
        return allSockets.get(uuid);
    }
}