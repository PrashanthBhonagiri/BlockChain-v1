const EC = require('elliptic').ec;
const {v1 : uuidV1} = require('uuid');
//for unique id absed on timestamp(v1)

const ec = new EC('secp256k1'); 
//secp => standards of efficient/official cryptography prime 256 bits

class ChainUtil {
    static genKeyPair() {
        return ec.genKeyPair();
    }
    static id() {
        return uuidV1();
    }
}

module.exports = ChainUtil;