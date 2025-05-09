import sha256 from "sha256";
import fs from "fs";

// File to store the blockchain data
const hippoCoinChainPath = 'hippoCoinChain.json';

let chain = [];
// Check if the file exists, if so load the data from it into chain
// If not, create a new file 

if (fs.existsSync(hippoCoinChainPath)) {
    const chainData = fs.readFileSync(hippoCoinChainPath, 'utf8');
    chain = JSON.parse(chainData);
}
else {
    chain = [
        {
            index: 0,
            time: Date.now(),
            transaction: {},
            nonce: 0,
            hash: "000hash",
            previousHash: "000prevhash"
        },
    ];
    fs.writeFileSync(hippoCoinChainPath, JSON.stringify(chain, null, 2), 'utf8');
}

const objHipppChain = {
    chain,
    getLastBlock: function(){
        return objHipppChain.chain[objHipppChain.chain.length - 1];
    },
    generateHash:(strPreviousHash, datStartTime, objStartTime, objNewTransaction) => {
        let strLocalHash = ''
        let intNonce = 0

        while(strLocalHash.substring(0,3) !== "000"){
            intNonce++
            strLocalHash = sha256(`${strPreviousHash}${datStartTime}${objNewTransaction}${intNonce}`)
        }
        return {strLocalHash, intNonce}
    },
    verifyHashUniqueness: (strHash) => {
        for (let i = 0; i < objHipppChain.chain.length; i++) {
            if (objHipppChain.chain[i].hash === strHash) {
                return false; // Hash is not unique
            }
        }
        return true; // Hash is unique
    },
    createNewBlock:(decTransAmt, strTransSender, strTransRecipient) => {
        const objNewTransaction = {decTransAmt, strTransSender, strTransRecipient}
        const datInitTime = Date.now()
        const prevBlock = objHipppChain.getLastBlock()
        const newCoinHash = objHipppChain.generateHash(prevBlock.hash, datInitTime, objNewTransaction)

        // Check if the hash is unique
        if (!objHipppChain.verifyHashUniqueness(newCoinHash.strLocalHash)) {
            console.log("Hash is not unique, transaction rejected.");
            return;
        }

        const newBlock = {
            index: prevBlock.index + 1,
            time: datInitTime,
            transaction: objNewTransaction,
            nonce: newCoinHash.intNonce,
            hash: newCoinHash.strLocalHash,
            previousHash: prevBlock.hash
        }
        objHipppChain.chain.push(newBlock)
        // Save the updated chain to the file
        fs.writeFileSync(hippoCoinChainPath, JSON.stringify(objHipppChain.chain, null, 2), 'utf8');
        console.log("New block added to the chain:", newBlock);

        return newBlock; // Return the new block
    },
    printChain: () => {
        console.log(objHipppChain.chain)
    },
}

export {objHipppChain}