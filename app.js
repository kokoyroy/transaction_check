"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionChecker = void 0;
const web3_1 = __importDefault(require("web3"));
require('dotenv').config();
const INFURA_RINKEBY_URL = 'https://rinkeby.infura.io/v3/';
const INFURA_ID = (_a = process.env.INFURA_KEY) !== null && _a !== void 0 ? _a : 'some faulty text';
const randomFromFieldFromTX = '0x8d75f6db12c444e290db995f2650a68159364e25';
class TransactionChecker {
    constructor(infuraID, account) {
        this.web3 = new web3_1.default(INFURA_RINKEBY_URL + infuraID);
        this.account = account.toLowerCase();
    }
    checkBlock(blockNumber = 'latest') {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let transactionFound = false;
                while (!transactionFound) {
                    let block = yield this.web3.eth.getBlock(blockNumber, true);
                    let currentBlockNumber = block.number;
                    console.log('Searching block ' + currentBlockNumber);
                    if (block && block.transactions) {
                        let transactions = [];
                        let transactionsArray = [];
                        for (const txAddress of block.transactions) {
                            transactionsArray.push(this.web3.eth.getTransaction(txAddress.hash));
                        }
                        yield Promise.all(transactionsArray).then(values => transactions = [...values]).catch(console.log);
                        console.log(transactions);
                        const transaction = transactions.find(tx => tx.from.toLowerCase() === randomFromFieldFromTX);
                        if (transaction) {
                            console.log('transaction found on ' + currentBlockNumber);
                            console.log({
                                address: transaction,
                                value: this.web3.utils.fromWei(transaction === null || transaction === void 0 ? void 0 : transaction.value, 'ether'),
                                timestamp: new Date()
                            });
                            return;
                        }
                        else {
                            console.log('not found :(');
                            blockNumber = currentBlockNumber - 1;
                        }
                    }
                }
            }
            catch (err) {
                console.log(err);
            }
        });
    }
}
exports.TransactionChecker = TransactionChecker;
let txChecker = new TransactionChecker(INFURA_ID, randomFromFieldFromTX);
txChecker.checkBlock();
