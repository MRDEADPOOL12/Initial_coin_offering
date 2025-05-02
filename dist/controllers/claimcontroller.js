"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "claimInvestment", {
    enumerable: true,
    get: ()=>claimInvestment
});
const _investmentModel = require("../models/investment.model");
const _usersModel = require("../models/users.model");
const _walletModel = require("../models/wallet.model");
const claimInvestment = async (req, res)=>{
    const { walletAddress , txnHash , email , chain  } = req.body;
    try {
        const existingUser = await _usersModel.UserModel.findOne({
            where: {
                email
            }
        });
        const existingWallet = await _walletModel.WalletModel.findOne({
            where: {
                walletAddress
            }
        });
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.json({
                success: false,
                message: "Please provide a valid email address."
            });
            return;
        }
        if (existingUser || existingWallet) {
            let message = '';
            if (existingUser && existingWallet) {
                message = "Sorry, we are unable to process your claim at the moment. The provided email and wallet address already exist.";
            } else if (existingUser) {
                message = "Sorry, we are unable to process your claim at the moment. The provided email address already exists.";
            } else {
                message = "Sorry, we are unable to process your claim at the moment. The provided wallet address already exists.";
            }
            res.json({
                success: false,
                message
            });
        } else {
            const user = await _usersModel.UserModel.create({
                name: '',
                email
            });
            const wallet = !existingWallet ? await _walletModel.WalletModel.create({
                userId: user.id,
                walletAddress,
                nonce: ""
            }) : existingWallet;
            await _investmentModel.InvestmentModel.create({
                walletAddress,
                userId: user.id,
                txnHash,
                amount: 0,
                currency: 'USD',
                tokenTransfered: false,
                txnStatus: 'pending',
                isTokenMinted: false,
                mintTxnHash: null,
                transferWalletAddr: '',
                referralCode: '',
                txn_chain: chain
            });
            res.json({
                success: true,
                message: "Your claim has been successfully submitted. Please note that it may take up to 24 hours for your claim to be processed. Thank you for your patience."
            });
        }
    } catch (error) {
        console.error('Error claiming investment:', error);
        res.sendStatus(500);
    }
};

//# sourceMappingURL=claimcontroller.js.map