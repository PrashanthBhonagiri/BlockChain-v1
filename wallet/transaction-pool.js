const Transaction = require('../wallet/transaction');
class TransactionPool {
    constructor() {
      this.transactions = [];
    }
  
    updateOrAddTransaction(transaction) {
      let transactionWithId = this.transactions.find(t => t.id === transaction.id);
      console.log(transactionWithId);
      if (transactionWithId) {
        this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
        console.log("updated", this.transactions);
      } else {
        this.transactions.push(transaction);
        console.log("added new " , this.transactions);
      }
    }
    existingTransaction(address) {
        return this.transactions.find(transaction => transaction.input.address === address);
    }
    validTransactions() {
      return this.transactions.filter(transaction => {
        const outputTotal = transaction.outputs.reduce((total, output) => {
          return total + output.amount;
        }, 0);
        
        if (transaction.input.amount !== outputTotal) {
          console.log(`Invalid transaction from ${transaction.input.address}.`);
          return;
        }
    
        if (!Transaction.verifyTransaction(transaction)) {
          console.log(`Invalid signature from ${transaction.input.address}.`)
          return;
        };
        
        return transaction;
      });
    }
  }
  
module.exports = TransactionPool;
  