import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'popper.js'
import 'bootstrap/dist/js/bootstrap.js'
import 'jquery/dist/jquery.min.js'
import axios from 'axios';
import CryptoJS from 'crypto-js'


// 十六位十六进制数作为密钥
const SECRET_KEY = CryptoJS.enc.Utf8.parse("3333e6e143439161");
// 十六位十六进制数作为密钥偏移量
const SECRET_IV = CryptoJS.enc.Utf8.parse("e3bbe7e3ba84431a");
/**
 * 加密方法
 * @param data
 * @returns {string}
 */
function encrypt(data) {
    if (typeof data === "object") {
      try {
        data = JSON.stringify(data);
      } catch (error) {
        console.log("encrypt error:", error);
      }
    }
    const dataHex = CryptoJS.enc.Utf8.parse(data);
    const encrypted = CryptoJS.AES.encrypt(dataHex, SECRET_KEY, {
      iv: SECRET_IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.ciphertext.toString();
}
/**
 * 解密方法
 * @param data
 * @returns {string}
 */
function decrypt(data) {
    const encryptedHexStr = CryptoJS.enc.Hex.parse(data);
    const str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    const decrypt = CryptoJS.AES.decrypt(str, SECRET_KEY, {
      iv: SECRET_IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}

const app = createApp(App)
app.use(store).use(router).mount('#app')
app.config.globalProperties.$http = axios
app.config.globalProperties.$encode = encrypt
app.config.globalProperties.$decode = decrypt

function getGuid() {
 
  var guid = "";
 
  var prefix11 = ""; //基于时间产生的随机数
 
 
 
  var d = new Date();
 
  var x = Math.random(); //获取一个0~1之间的随机数
 
  var y = d.getTime(); //返回 1970 年 1 月 1 日至今的毫秒数
 
  if (x < 0.1) x += 0.1;
 
  //根据当前日期，产生GUID的前11位，避免GUID重复，引入一个随机数
 
  prefix11 = Math.round(x * y * 10).toString(16);
 
  guid += prefix11.substring(0, 8);
 
  guid += "-";
 
  guid += prefix11.substring(8, 11);
 
  //后面的数据位，完全采用随机数产生
 
  for (var i = 12; i <= 32; i++) {
 
    var g = Math.floor(Math.random() * 16).toString(16);
 
    guid += g;
 
    if (i == 12 || i == 16 || i == 20) {
 
      guid += "-";
 
    }
 
  }
 
  return guid.toUpperCase();
 
}

app.config.globalProperties.$guid = getGuid

function socketUpload(type,file,dom){
  
  let ws = new WebSocket('ws://localhost:8921/ws');
  ws.onopen=()=>{
    ws.send(JSON.stringify({
      fileName:file.name,
      fileSize:file.size
    }))
  }
  ws.onmessage = (evt)=>{
    let response = JSON.parse(evt.data)
    if(response.code==101){
      console.log("连接已就绪")
      let pieceSize = 64*1024
      let pieceCount = file.size/pieceSize
      let fileSize = file.size;
      
      for(let i = 0;i<pieceCount;i++){
        let s = pieceSize*i
        let e = Math.min(fileSize,s+pieceSize)
        let blob = file.slice(s,e)
        ws.send(blob)
      }
    }else if(response.code==100){
      console.log(response)
      // document.querySelector("#"+dom).innerHTML = response.data[0]
      if(response.data[1]==file.size)
      {
        ws.close()
        console.log("over")
        // document.querySelector("#"+dom).innerHTML = "上传完毕"
      }
        
    }
  }
  ws.onclose = ()=>{
    console.log('closed')
  }
}
app.config.globalProperties.$upload = socketUpload


