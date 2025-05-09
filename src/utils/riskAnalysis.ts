// utils/riskAnalysis.ts

export interface WalletData {
  riskScore: number;
  transactionRisk: number;
  smartContractRisk: number;
  transactions: Transaction[];
  analysis: WalletAnalysisData;
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  gasPrice: string;
  gasUsed: string;
  input: string;
}

interface WalletAnalysisData {
  totalTransactions: number;
  uniqueContacts: number;
  avgTransactionValue: number;
  riskFactors: string[];
  age: number; // cüzdan yaşı (gün)
  lastActivity: number; // son aktiviteden bu yana geçen gün
  contractInteractionRate: number;
}

export const analyzeWalletRisk = async (
  walletAddress: string,
  apiKey: string
): Promise<WalletData> => {
  try {
    const baseUrl = `https://api.etherscan.io/api`;
    const response = await fetch(
      `${baseUrl}?module=account&action=txlist&address=${walletAddress}&apikey=${apiKey}&startblock=0&endblock=99999999&sort=desc`
    );
    
    const data = await response.json();
    
    if (data.status !== "1") {
      throw new Error(data.message || "Failed to fetch wallet data");
    }

    const transactions = data.result;
    
    if (transactions.length === 0) {
      throw new Error("No transactions found for this wallet");
    }

    // Temel metrikleri hesapla
    const metrics = calculateBaseMetrics(transactions);
    
    // Risk skorlarını hesapla
    const transactionRisk = calculateTransactionRisk(transactions, metrics);
    const smartContractRisk = calculateSmartContractRisk(transactions, metrics);
    
    // Ağırlıklı ortalama ile genel risk skorunu hesapla
    const overallRisk = calculateOverallRisk(transactionRisk, smartContractRisk, metrics);

    return {
      riskScore: normalizeScore(overallRisk),
      transactionRisk: normalizeScore(transactionRisk),
      smartContractRisk: normalizeScore(smartContractRisk),
      transactions: transactions.slice(0, 10).map(formatTransaction),
      analysis: {
        totalTransactions: metrics.totalTransactions,
        uniqueContacts: metrics.uniqueContacts,
        avgTransactionValue: metrics.avgTransactionValue,
        riskFactors: determineRiskFactors(metrics),
        age: metrics.walletAge,
        lastActivity: metrics.daysSinceLastActivity,
        contractInteractionRate: metrics.contractInteractionRate
      }
    };
  } catch (error) {
    console.error("Error analyzing wallet:", error);
    throw error;
  }
};

const calculateBaseMetrics = (transactions: any[]) => {
  const now = Math.floor(Date.now() / 1000);
  const uniqueAddresses = new Set<string>();
  let totalValue = 0;
  let totalGasUsed = 0;
  let contractInteractions = 0;
  
  transactions.forEach(tx => {
    uniqueAddresses.add(tx.to);
    uniqueAddresses.add(tx.from);
    totalValue += parseInt(tx.value) / 1e18;
    totalGasUsed += parseInt(tx.gasUsed) * parseInt(tx.gasPrice);
    if (tx.input && tx.input !== '0x') contractInteractions++;
  });

  const firstTx = parseInt(transactions[transactions.length - 1].timeStamp);
  const lastTx = parseInt(transactions[0].timeStamp);
  
  return {
    totalTransactions: transactions.length,
    uniqueContacts: uniqueAddresses.size - 1,
    avgTransactionValue: totalValue / transactions.length,
    avgGasUsed: totalGasUsed / transactions.length,
    contractInteractionRate: contractInteractions / transactions.length,
    walletAge: Math.floor((now - firstTx) / 86400),
    daysSinceLastActivity: Math.floor((now - lastTx) / 86400),
    txFrequency: transactions.length / (Math.max(1, (lastTx - firstTx) / 86400))
  };
};

const calculateTransactionRisk = (transactions: any[], metrics: any): number => {
  let risk = 0;
  
  // Aktivite yoğunluğu riski (0-30)
  const activityRisk = Math.min(30, (metrics.txFrequency / 5) * 30);
  
  // İşlem değeri riski (0-25)
  const valueRisk = Math.min(25, (metrics.avgTransactionValue / 50) * 25);
  
  // Cüzdan yaşı riski (0-20) - yeni cüzdanlar daha riskli
  const ageRisk = Math.max(0, 20 - (metrics.walletAge / 30));
  
  // Son aktivite riski (0-15)
  const lastActivityRisk = Math.max(0, 15 - (metrics.daysSinceLastActivity / 2));
  
  // Benzersiz kontakt riski (0-10)
  const contactRisk = Math.min(10, (metrics.uniqueContacts / 100) * 10);
  
  risk = activityRisk + valueRisk + ageRisk + lastActivityRisk + contactRisk;
  return risk;
};

const calculateSmartContractRisk = (transactions: any[], metrics: any): number => {
  let risk = 0;
  
  // Kontrat etkileşim oranı riski (0-40)
  const interactionRisk = metrics.contractInteractionRate * 40;
  
  // Gaz kullanım riski (0-30)
  const gasRisk = Math.min(30, (metrics.avgGasUsed / 1e15) * 30);
  
  // Kontrat çeşitliliği riski (0-30)
  const uniqueContracts = new Set(
    transactions
      .filter(tx => tx.input && tx.input !== '0x')
      .map(tx => tx.to)
  ).size;
  const contractDiversityRisk = Math.min(30, (uniqueContracts / 20) * 30);
  
  risk = interactionRisk + gasRisk + contractDiversityRisk;
  return risk;
};

const calculateOverallRisk = (
  transactionRisk: number,
  smartContractRisk: number,
  metrics: any
): number => {
  // Cüzdan yaşına göre ağırlıkları ayarla
  const ageWeight = Math.min(1, metrics.walletAge / 365);
  
  // Aktivite seviyesine göre ağırlıkları ayarla
  const activityWeight = Math.min(1, metrics.totalTransactions / 1000);
  
  return (
    transactionRisk * (0.4 + ageWeight * 0.1) +
    smartContractRisk * (0.6 - ageWeight * 0.1)
  ) * (0.7 + activityWeight * 0.3);
};

const normalizeScore = (score: number): number => {
  // Skoru 0-100 aralığına normalize et
  return Math.min(100, Math.max(0, Math.round(score)));
};

const formatTransaction = (tx: any): Transaction => ({
  hash: tx.hash,
  from: tx.from,
  to: tx.to,
  value: (parseInt(tx.value) / 1e18).toFixed(4),
  timestamp: parseInt(tx.timeStamp),
  gasPrice: tx.gasPrice,
  gasUsed: tx.gasUsed,
  input: tx.input
});

const determineRiskFactors = (metrics: any): string[] => {
  const factors: string[] = [];
  
  if (metrics.txFrequency > 5) {
    factors.push("Yüksek işlem sıklığı");
  }
  
  if (metrics.contractInteractionRate > 0.5) {
    factors.push("Yoğun akıllı kontrat etkileşimi");
  }
  
  if (metrics.avgTransactionValue > 10) {
    factors.push("Yüksek işlem değerleri");
  }
  
  if (metrics.walletAge < 30) {
    factors.push("Yeni cüzdan");
  }
  
  if (metrics.daysSinceLastActivity < 1) {
    factors.push("Çok aktif cüzdan");
  }
  
  if (metrics.uniqueContacts > 100) {
    factors.push("Çok sayıda benzersiz kontakt");
  }
  
  return factors;
};