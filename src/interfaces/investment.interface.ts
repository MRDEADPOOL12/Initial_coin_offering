export interface Investment {
  id?: number;
  walletAddress:string;
  walletId:number;
  userId: number;
  txnHash: string;
  amount: number;
  currency: string;
  tokenTransfered?: boolean;
  txnStatus: string;
  isTokenMinted?: boolean;
  mintTxnHash?: string;
  transferWalletAddr: string;
  referralCode: string;
  txn_chain: string;
}
