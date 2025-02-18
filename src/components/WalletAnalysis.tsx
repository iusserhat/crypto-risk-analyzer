
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", risk: 65 },
  { name: "Feb", risk: 59 },
  { name: "Mar", risk: 80 },
  { name: "Apr", risk: 81 },
  { name: "May", risk: 56 },
  { name: "Jun", risk: 55 },
  { name: "Jul", risk: 40 },
];

export const WalletAnalysis = () => {
  return (
    <Card className="p-6 backdrop-blur-lg bg-white/30 dark:bg-black/30 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Risk Analysis Over Time</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="risk"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ stroke: '#6366f1', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
