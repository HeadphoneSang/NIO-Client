import { client as WebSocketClient } from 'websocket';
import CtrlPtl from './ctrlPtl';
import StatePtl from './statePtl';
import proUtil from './protocolUtil';
var url;

export default{
    /**
     * 创建一个上传任务的控制连接
     * @param {*} fileObj 任务信息对象
     */
    async createNewControlTask(fileObj){
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
                console.log(frame)
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
            conn.send(JSON.stringify(proUtil.createFrame(CtrlPtl.TASK_CREATING|StatePtl.NEW_TASK,fileObj.size,{path:fileObj.tarPath,username:fileObj.username})));
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
    closeSocket(path){
        let socket = allSockets.get(path);
        allSockets.delete(path);
        if(socket!==null||socket!==undefined){
            socket.forceClose = true;
            console.log('readyClose')
        }
        else{
            console.log(`${path}的连接不存在`)
        }
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
                console.log('readyClose')
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
    }
}