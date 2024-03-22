// blockchain.js

const SHA256 = require('crypto-js/sha256');

// blockchain.js

class Transaction {
    constructor(fromAddress, toAddress, amount) {
      this.fromAddress = fromAddress;
      this.toAddress = toAddress;
      this.amount = amount;
    }
  }
  
  class Block {
    constructor(timestamp, transactions, previousHash = '') {
      this.timestamp = timestamp;
      this.transactions = transactions;
      this.previousHash = previousHash;
      this.hash = this.calculateHash();
      this.nonce = 0;
    }
  
    calculateHash() {
      return SHA256(this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce).toString();
    }
  
    mineBlock(difficulty) {
      while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
        this.nonce++;
        this.hash = this.calculateHash();
      }
      console.log(`블록 채굴 성공: ${this.hash}`);
    }
  
    hasValidTransactions() {
      for (const tx of this.transactions) {
        if (!tx.isValid()) {
          return false;
        }
      }
      return true;
    }
  }
  
  class Blockchain {
    constructor() {
      this.chain = [this.createGenesisBlock()];
      this.difficulty = 2;
      this.pendingTransactions = [];
      this.miningReward = 100;
    }
  
    createGenesisBlock() {
      return new Block('01/01/2022', [], '0');
    }
  
    getLatestBlock() {
      return this.chain[this.chain.length - 1];
    }
  
    minePendingTransactions(miningRewardAddress) {
      const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
      this.pendingTransactions.push(rewardTx);
  
      const block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
      block.mineBlock(this.difficulty);
  
      console.log('블록 채굴 성공!');
      this.chain.push(block);
  
      this.pendingTransactions = [
        new Transaction(null, miningRewardAddress, this.miningReward)
      ];
    }
  
    addTransaction(transaction) {
      if (!transaction.fromAddress || !transaction.toAddress) {
        throw new Error('트랜잭션에는 보내는 사람과 받는 사람의 주소가 필요합니다.');
      }
  
      if (!transaction.isValid()) {
        throw new Error('유효하지 않은 트랜잭션을 추가할 수 없습니다.');
      }
  
      this.pendingTransactions.push(transaction);
    }
  
    getBalanceOfAddress(address) {
      let balance = 0;
  
      for (const block of this.chain) {
        for (const tx of block.transactions) {
          if (tx.fromAddress === address) {
            balance -= tx.amount;
          }
  
          if (tx.toAddress === address) {
            balance += tx.amount;
          }
        }
      }
  
      return balance;
    }
  
    isChainValid() {
      for (let i = 1; i < this.chain.length; i++) {
        const currentBlock = this.chain[i];
        const previousBlock = this.chain[i - 1];
  
        if (!currentBlock.hasValidTransactions()) {
          return false;
        }
  
        if (currentBlock.hash !== currentBlock.calculateHash()) {
          return false;
        }
  
        if (currentBlock.previousHash !== previousBlock.hash) {
          return false;
        }
      }
      return true;
    }
  }
  
  module.exports.Blockchain = Blockchain;
  module.exports.Transaction = Transaction;
  