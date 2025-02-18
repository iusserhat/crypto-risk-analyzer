
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
    const response = await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&sort=asc&apikey=YourApiKey`);
    const data = await response.json();

    // API yanıtını kontrol et
    if (data.status === "0" || !Array.isArray(data.result)) {
      throw new Error(data.message || "Invalid API response");
    }

    // Transactionları dönüştür
    const transactions = data.result.slice(0, 10).map((tx: any) => ({
      hash: tx.hash || "Unknown",
      type: tx.input === "0x" ? "Transfer" : "Contract Interaction",
      amount: `${(Number(tx.value) / 1e18).toFixed(4)} ETH`,
      timestamp: new Date(Number(tx.timeStamp) * 1000).toISOString(),
      riskLevel: determineRiskLevel(tx)
    }));

    return {
      address: walletAddress,
      transactions,
      balance: "Loading...", // Balance will be implemented later
      riskScore: calculateRiskScore(transactions)
    };
  } catch (error) {
    console.error("Error analyzing wallet:", error);
    throw new Error("Failed to analyze wallet");
  }
};

// Risk seviyesini belirle
function determineRiskLevel(tx: any): "Low" | "Medium" | "High" {
  const value = Number(tx.value) / 1e18; // Convert to ETH
  if (value > 10) return "High";
  if (value > 1) return "Medium";
  return "Low";
}

// Risk skorunu hesapla
function calculateRiskScore(transactions: Transaction[]): number {
  if (transactions.length === 0) return 0;
  
  const riskPoints = transactions.reduce((total, tx) => {
    switch (tx.riskLevel) {
      case "High": return total + 10;
      case "Medium": return total + 5;
      case "Low": return total + 1;
      default: return total;
    }
  }, 0);

  // Normalize to 0-100 range
  return Math.min(100, Math.round((riskPoints / (transactions.length * 10)) * 100));
}
