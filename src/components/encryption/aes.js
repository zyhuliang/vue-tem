
//aes加密
var CryptoJS = require('crypto-js')
let encrypt = function (word){  //加密
    if (word.startsWith("AES")||word=='') {
        return word
    }else {
        var key = CryptoJS.enc.Utf8.parse("infoaeskey123456");
        var srcs = CryptoJS.enc.Utf8.parse(word);
        var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
        return `AES(${encrypted.ciphertext.toString()})`
    }
}
let decrypt = function(word){//解密
    // 判断是否是 AES 加密的
    if (!word.startsWith("AES(")) {
        console.error('不是AES加密的字符串');
        return false
    }
    word = word.substring(4, word.length - 1)
    var key = CryptoJS.enc.Utf8.parse("infoaeskey123456");
    word = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(word)); // 16转base64
    var decrypt = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}
let addBase64 = function(word){
    if (word.startsWith("BASE64")||word == '') {
        return word
    }else {
        return `BASE64(${Base64.encode(word)})`
    }
}
let isBase64 = function(val){
    if(val.indexOf('Base64')>=0){
        return true
    }else {
        return false
    }
}
export { encrypt,decrypt, isBase64,addBase64}
