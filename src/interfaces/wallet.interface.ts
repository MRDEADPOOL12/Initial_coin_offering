export interface Wallet {
  id?: number;
  nonce: string;
  userId: number;
  walletAddress: string;
  verified: boolean;
}
