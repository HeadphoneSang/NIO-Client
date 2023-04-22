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
