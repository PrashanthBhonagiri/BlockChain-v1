const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const Blockchain = require('../blockchain/index');
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');

const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc, tp);
const miner = new Miner(bc, tp, wallet, p2pServer);

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(helmet());

app.get('/', (req,res) => {
    res.json({
        "VNR PAY": "Welcomes you!!©"
    });
});

app.get('/blocks',(req,res) => {
    res.json(bc.chain);
});

app.post('/mine',(req,res) => {
    const block = bc.addBlock(req.body.data);
    console.log(`New Block added : ${block.toString()}`);

    p2pServer.syncChains();

    res.redirect('/blocks');
});

app.get('/transactions', (req, res) => {
    res.json(tp.transactions);
});

app.post('/transact', (req, res) => {
    const { recipient, amount } = req.body;
    const transaction = wallet.createTransaction(recipient, amount, bc, tp);
    
    // console.log("transaction = " , transaction);

    p2pServer.broadcastTransaction(transaction);
    
    res.redirect('/transactions');
});

app.get('/mine-transactions',(req,res) => {
    const block = miner.mine();
    console.log(`New Block added : ${block.toString()}`);
    res.redirect('/blocks');
});

app.get('/public-key', (req, res) => {
    res.json({ publicKey: wallet.publicKey });
});
app.get('/balance', (req, res) => {
    res.json({ Balance: wallet.balance });
});

function notFound(req, res, next) {
    res.status(404);
    const error = new Error(`Not Found - ${  req.originalUrl}`);
    next(error);
}
  
function errorHandler(err, req, res, next) {
    res.status(res.statusCode || 500);
    res.json({
      status: false,
      message: err.message,
      stack: err.stack,
    });
}
  
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log('Listening on port', port);
});
p2pServer.listen();
