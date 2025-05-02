import { InvestmentModel } from "@/models/investment.model";
import { UserModel } from "@/models/users.model";
import { WalletModel } from "@/models/wallet.model";

export const claimInvestment = async (req, res) => {
  const { walletAddress, txnHash, email, chain } = req.body;

  try {
    // Check if the email or wallet address already exist
    const existingUser = await UserModel.findOne({ where: { email } });
    const existingWallet = await WalletModel.findOne({ where: { walletAddress } });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.json({ success: false, message: "Please provide a valid email address." });
      return;
    }

    if (existingUser || existingWallet) {
      // User or wallet already exists, send a response indicating the claim is not possible
      let message = '';

      if (existingUser && existingWallet) {
        message = "Sorry, we are unable to process your claim at the moment. The provided email and wallet address already exist.";
      } else if (existingUser) {
        message = "Sorry, we are unable to process your claim at the moment. The provided email address already exists.";
      } else {
        message = "Sorry, we are unable to process your claim at the moment. The provided wallet address already exists.";
      }

      res.json({ success: false, message });
    } else {
      // User and wallet are not found, register the user and save the details
      const user = await UserModel.create({ name: '', email });
      const wallet = !existingWallet ? await WalletModel.create({ userId: user.id, walletAddress, nonce: "" }) : existingWallet;

      // Save the investment details with default values
      await InvestmentModel.create({
        walletAddress,
        userId: user.id,
        txnHash,
        amount: 0, // Example default value for amount
        currency: 'USD', // Example default value for currency
        tokenTransfered: false, // Example default value for tokenTransfered
        txnStatus: 'pending', // Example default value for txnStatus
        isTokenMinted: false, // Example default value for isTokenMinted
        mintTxnHash: null,
        transferWalletAddr: '', // Example default value for transferWalletAddr
        referralCode: '', // Example default value for referralCode
        txn_chain: chain,
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
