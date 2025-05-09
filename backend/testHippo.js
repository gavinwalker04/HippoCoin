import { objHipppChain } from "./index.js";

import express from 'express';
import cors from 'cors';

const HTTP_PORT = 8000

var app = express()
app.use(cors())
app.use(express.json())

app.listen(HTTP_PORT,() => {
    console.log('App listening on ', HTTP_PORT)
})


// Route to get the current chain
app.get("/chain", (req, res) => {
    res.status(200).json({status: "success", chain: objHipppChain.chain})
})

// Route to add a new block
app.post("/chain", (req, res) => {
    const { decTransAmt, strTransSender, strTransRecipient } = req.body;

    if (!decTransAmt || !strTransSender || !strTransRecipient) {
        return res.status(400).json({ error: "Missing transaction details" });
    }

    // Call the createNewBlock method to add a new block to the chain
    const newBlock = objHipppChain.createNewBlock(decTransAmt, strTransSender, strTransRecipient);
    if (newBlock) {
        res.status(201).json({status: "success", newBlock});
    } else {
        res.status(500).json({ error: "Failed to create new block" });
    }
});