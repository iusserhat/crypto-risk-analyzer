
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface RiskScoreCardProps {
  title: string;
  score: number;
}

export const RiskScoreCard = ({ title, score }: RiskScoreCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 backdrop-blur-lg bg-white/30 dark:bg-black/30 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{title}</h3>
        <div className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}</div>
        <div className="mt-4 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full rounded-full ${score >= 90 ? 'bg-green-500' : score >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
          />
        </div>
      </Card>
    </motion.div>
  );
};
