import Web3 from "web3";
import Eth from 'web3-eth';
require('dotenv').config();

const INFURA_RINKEBY_URL = 'https://rinkeby.infura.io/v3/';
const INFURA_ID = process.env.INFURA_KEY ?? 'some faulty text';
const randomFromFieldFromTX = '0x8d75f6db12c444e290db995f2650a68159364e25';

export class TransactionChecker {
    web3: Web3;
    account;

    constructor(infuraID: string, account: string) {
        this.web3 = new Web3(INFURA_RINKEBY_URL + infuraID);
        this.account = account.toLowerCase();
    }

    async checkBlock(blockNumber: number | string = 'latest') {
        try {
            let transactionFound = false;
            while (!transactionFound) {
                let block: Eth.BlockTransactionObject = await this.web3.eth.getBlock(blockNumber, true);
                let currentBlockNumber = block.number;
                console.log('Searching block ' + currentBlockNumber);
                if (block && block.transactions) {
                    let transactions: Eth.Transaction[] = [];
                    let transactionsArray: Promise<Eth.Transaction>[] = [];
                    for (const txAddress of block.transactions) {
                        transactionsArray.push(this.web3.eth.getTransaction(txAddress.hash));
                    }
                    await Promise.all(transactionsArray).then(values => transactions = [...values]).catch(console.log);
                    console.log(transactions);
                    const transactionHash = transactions.find(tx => tx.from.toLowerCase() === randomFromFieldFromTX);
                    if (transactionHash) {
                        console.log('transaction found on ' + currentBlockNumber);
                        console.log({ address: transactionHash, timestamp: new Date() });
                        return;
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
let txChecker = new TransactionChecker(INFURA_ID, randomFromFieldFromTX);
txChecker.checkBlock();