import Web3 from "web3";
import Eth from 'web3-eth';
import { BlockNumber } from 'web3-core/types';
require('dotenv').config();

const INFURA_RINKEBY_URL = 'https://rinkeby.infura.io/v3/';
const INFURA_ID = process.env.INFURA_KEY ?? 'some faulty text';
const TXHash = '0xd79ff08e90c04cc22264c7aafe228d35d99d3c802d19654f27007d83dd4bcc7d';

export class TransactionChecker {
    web3: Web3;
    account;

    constructor(infuraID: string, account: string) {
        this.web3 = new Web3(INFURA_RINKEBY_URL + infuraID);
        this.account = account.toLowerCase();
    }

    async getBlock(blockNumber: BlockNumber): Promise<Eth.BlockTransactionObject> {
        return this.web3.eth.getBlock(blockNumber, true);
    };

    async findTransactionInsideBlock(block: Eth.BlockTransactionObject, TXHash: string): Promise<Eth.Transaction | undefined> {
        return block.transactions.find(tx => tx.hash === TXHash);
    };

    async checkBlock(blockNumber: number | string = 'latest') {
        try {
            let transactionFound = false;
            while (!transactionFound) {
                let block: Eth.BlockTransactionObject = await this.getBlock(blockNumber);
                let currentBlockNumber = block.number;
                console.log('Searching block ' + currentBlockNumber);
                if (block && block.transactions) {
                    const transaction = await this.findTransactionInsideBlock(block, TXHash);
                    if (transaction) {
                        transactionFound = true;
                        console.log('Transaction Found on block : ', currentBlockNumber);
                        console.log({
                            transaction: transaction,
                            value: this.web3.utils.fromWei(transaction?.value, 'ether'),
                            timestamp: new Date()
                        });
                    } else {
                        console.log('not found :(');
                        blockNumber = currentBlockNumber - 1;
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }

    }

}
let txChecker = new TransactionChecker(INFURA_ID, TXHash);
txChecker.checkBlock();