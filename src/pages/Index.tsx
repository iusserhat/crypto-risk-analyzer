
import React, { useState } from "react";
import { WalletAnalysis } from "@/components/WalletAnalysis";
import { RiskScoreCard } from "@/components/RiskScoreCard";
import { TransactionHistory } from "@/components/TransactionHistory";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    if (!walletAddress) {
      toast({
        title: "Error",
        description: "Please enter a wallet address",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    // Simulate analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
            Crypto Wallet Risk Analyzer
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Advanced risk analysis for cryptocurrency wallets using AI-powered insights
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-xl mx-auto mb-12"
        >
          <div className="backdrop-blur-lg bg-white/30 dark:bg-black/30 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex gap-4">
              <Input
                type="text"
                placeholder="Enter wallet address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleAnalysis}
                disabled={isAnalyzing}
                className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze"}
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <RiskScoreCard title="Overall Risk Score" score={85} />
          <RiskScoreCard title="Transaction Risk" score={92} />
          <RiskScoreCard title="Smart Contract Risk" score={78} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WalletAnalysis />
          <TransactionHistory />
        </div>
      </div>
    </div>
  );
};

export default Index;
