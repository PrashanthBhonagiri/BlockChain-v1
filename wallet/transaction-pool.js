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
  }
  
module.exports = TransactionPool;
  