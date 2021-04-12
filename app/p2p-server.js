const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 3001;

const peers = process.env.PEERS ? process.env.PEERS.split(',') : [] ;//stream that contains a list of web Socan addresses

// PORT=5001 P2P_PORT=3003 PEERS=ws://localhost:3001,ws://localhost:3002 npm run dev

class P2pServer {
    constructor(blockchain){
        this.blockchain = blockchain;
        this.sockets = [];
    }

    listen() {
        const server = new Websocket.Server({port : P2P_PORT});
        server.on('connection', socket => this.connectSocket(socket));
        
        this.connectToPeers();

        console.log(`listing for p2p connections on : ${P2P_PORT}`);
    }

    connectToPeers() {
        peers.forEach(peer => {
            const socket = new Websocket(peer);
            socket.on('open', () => this.connectSocket(socket));
        });
    }

    connectSocket(socket) {
        this.sockets.push(socket);
        console.log('Socket connected');
        
        this.messageHandler(socket);

        socket.send(JSON.stringify(this.blockchain.chain));

    }

    messageHandler(socket) {
        socket.on('message', (message) => {
            const data = JSON.parse(message);
            console.log('data = ' , data);
        });
    }
}

module.exports = P2pServer;