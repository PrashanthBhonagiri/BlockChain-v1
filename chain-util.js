const EC = require('elliptic').ec;
const {v1 : uuidV1} = require('uuid');  //for unique id absed on timestamp(v1)
const SHA256 = require('crypto-js/sha256');


const ec = new EC('secp256k1'); 
//secp => standards of efficient/official cryptography prime 256 bits

class ChainUtil {
    static genKeyPair() {
        return ec.genKeyPair();
    }
    static id() {
        return uuidV1();
    }
    static hash(data) {
        return SHA256(JSON.stringify(data)).toString();
    }
}

module.exports = ChainUtil;