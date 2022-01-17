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
const TXHash = '0xd79ff08e90c04cc22264c7aafe228d35d99d3c802d19654f27007d83dd4bcc7d';
class TransactionChecker {
    constructor(infuraID, account) {
        this.web3 = new web3_1.default(INFURA_RINKEBY_URL + infuraID);
        this.account = account.toLowerCase();
    }
    getBlock(blockNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.web3.eth.getBlock(blockNumber, true);
        });
    }
    ;
    findTransactionInsideBlock(block, TXHash) {
        return __awaiter(this, void 0, void 0, function* () {
            return block.transactions.find(tx => tx.hash === TXHash);
        });
    }
    ;
    checkBlock(blockNumber = 'latest') {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let transactionFound = false;
                while (!transactionFound) {
                    let block = yield this.getBlock(blockNumber);
                    let currentBlockNumber = block.number;
                    console.log('Searching block ' + currentBlockNumber);
                    if (block && block.transactions) {
                        const transaction = yield this.findTransactionInsideBlock(block, TXHash);
                        if (transaction) {
                            transactionFound = true;
                            console.log('Transaction Found on block : ', currentBlockNumber);
                            console.log({
                                transaction: transaction,
                                value: this.web3.utils.fromWei(transaction === null || transaction === void 0 ? void 0 : transaction.value, 'ether'),
                                timestamp: new Date()
                            });
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
let txChecker = new TransactionChecker(INFURA_ID, TXHash);
txChecker.checkBlock();
