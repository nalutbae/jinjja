// index.js

const express = require('express');
const bodyParser = require('body-parser');
const { Blockchain, Transaction } = require('./blockchain');

const app = express();
const port = 3000;

// JSON 파싱을 위한 미들웨어 추가
app.use(bodyParser.json());

// 블록체인 인스턴스 생성
const jinjjaCoin = new Blockchain();

// 루트 경로에 대한 GET 요청 처리
app.get('/', (req, res) => {
  res.send('jinjja 블록체인 프로젝트에 오신 것을 환영합니다!');
});

// 전체 블록체인을 반환하는 엔드포인트
app.get('/blocks', (req, res) => {
  res.json(jinjjaCoin.chain);
});

// 새로운 트랜잭션을 생성하는 엔드포인트
app.post('/transaction', (req, res) => {
  const { from, to, amount } = req.body;
  const transaction = new Transaction(from, to, amount);
  jinjjaCoin.addTransaction(transaction);
  res.json({ message: '트랜잭션이 성공적으로 생성되었습니다.', transaction });
});

// 채굴 엔드포인트
app.get('/mine', (req, res) => {
  jinjjaCoin.minePendingTransactions('my-address');
  res.json({ message: '블록이 성공적으로 채굴되었습니다.', newChain: jinjjaCoin.chain });
});

// 지갑 잔고 조회 엔드포인트
app.get('/balance', (req, res) => {
  const { address } = req.query;
  const balance = jinjjaCoin.getBalanceOfAddress(address);
  res.json({ address, balance });
});

// 블록체인 유효성 검사 엔드포인트
app.get('/isValid', (req, res) => {
  const isValid = jinjjaCoin.isChainValid();
  res.json({ isValid });
});

// 서버 시작
app.listen(port, () => {
  console.log(`jinjja 블록체인 프로젝트 서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
