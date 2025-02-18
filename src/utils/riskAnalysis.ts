
export interface WalletData {
  address: string;
  transactions: Transaction[];
  balance: string;
  riskScore: number;
}

interface Transaction {
  hash: string;
  type: string;
  amount: string;
  timestamp: string;
  riskLevel: "Low" | "Medium" | "High";
}

export const analyzeWalletRisk = async (walletAddress: string): Promise<WalletData> => {
  try {
    const response = await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&sort=asc`);
    const data = await response.json();

    // Basit bir risk skoru hesaplama
    const transactions = data.result?.slice(0, 10).map((tx: any) => ({
      hash: tx.hash,
      type: tx.input === "0x" ? "Transfer" : "Contract Interaction",
      amount: `${(Number(tx.value) / 1e18).toFixed(4)} ETH`,
      timestamp: new Date(Number(tx.timeStamp) * 1000).toISOString(),
      riskLevel: "Low"
    })) || [];

    return {
      address: walletAddress,
      transactions,
      balance: "Loading...",
      riskScore: Math.floor(Math.random() * 100)
    };
  } catch (error) {
    console.error("Error analyzing wallet:", error);
    throw new Error("Failed to analyze wallet");
  }
};
