const uploadQueue = new Array();
const path = require("path");
import fs from 'fs';
const configPath = process.env.NODE_ENV === 'development' ? path.join(__dirname, '../config.json') : path.join(process.cwd(), 'config.json');
var configData = fs.readFileSync(configPath, 'utf-8');
const config = JSON.parse(configData);
var maxTask = config.maxUploadThread;
import ws from "./ws";
var size = 0;
// setInterval(()=>{
//     console.log(size);

// },4000);
export default{
    addDownloadQuest(fileObj){
        if(size>=maxTask)
            return false;
        uploadQueue[size++] = fileObj;
        ws.createNewTask(fileObj);
        return true;
    },
    removeTaskByPath(path){
        
    },
    clearTaskQueue(){
        uploadQueue.splice(0,uploadQueue.length);
        size = 0;
    },
    getLength(){
        return size
    },
    deleteMainUploadTask(key){
        // console.log(uploadQueue)
        let index = uploadQueue.findIndex((item)=>item.tarPath==key);
        // console.log("=============="+index);
        uploadQueue.splice(index,1);
        // console.log(uploadQueue)
        size--;
    },
    setMax(max){
        maxTask =max; 
    }
}