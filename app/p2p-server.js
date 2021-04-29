const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 3000;

const peers = process.env.PEERS ? process.env.PEERS.split(',') : [] ;//stream that contains a list of web Socan addresses

// set PORT=5001 && set P2P_PORT=3001 && set    PEERS=ws://localhost:3000 && npm run dev

const MESSAGE_TYPES = {
    chain: 'CHAIN',
    transaction: 'TRANSACTION',
    clear_transactions: 'CLEAR_TRANSACTIONS'
};

class P2pServer {
    constructor(blockchain,transactionPool ){
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
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

        this.sendChain(socket);
    }

    messageHandler(socket) {
        socket.on('message', (message) => {
            const data = JSON.parse(message);
            console.log("message received of type" , data.type);
            // console.log('data = ' , data);
            if(data.type == MESSAGE_TYPES.chain) {
                this.blockchain.replaceChain(data.chain);
            }
            else if(data.type == MESSAGE_TYPES.transaction){
                console.log("updated and add transaction method");
                this.transactionPool.updateOrAddTransaction(data.transaction);
            }
            else if(data.type === MESSAGE_TYPES.clear_transactions) {
                this.transactionPool.clear();
            }
        });
    }
    
    sendChain(socket) {
        socket.send(JSON.stringify({ type: MESSAGE_TYPES.chain, chain: this.blockchain.chain}));        
    }
    
    sendTransaction(socket, transaction) {
        socket.send(JSON.stringify({ type: MESSAGE_TYPES.transaction,transaction}));
    }
    syncChains() {
        this.sockets.forEach(socket => {
            this.sockets.forEach(socket => this.sendChain(socket));
        });
    }    
    broadcastTransaction(transaction) {
        this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
    }
    broadcastClearTransaction() {
        this.sockets.forEach(socket => socket.send(JSON.stringify({
            type: MESSAGE_TYPES.clear_transactions
        })));
    }

}

module.exports = P2pServer;
