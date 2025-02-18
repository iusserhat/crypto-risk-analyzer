
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const transactions = [
  {
    id: 1,
    type: "Transfer",
    amount: "0.5 ETH",
    risk: "Low",
    timestamp: "2024-03-20 14:30",
  },
  {
    id: 2,
    type: "Smart Contract",
    amount: "1.2 ETH",
    risk: "Medium",
    timestamp: "2024-03-19 09:15",
  },
  {
    id: 3,
    type: "DEX Trade",
    amount: "2.0 ETH",
    risk: "High",
    timestamp: "2024-03-18 16:45",
  },
];

export const TransactionHistory = () => {
  return (
    <Card className="p-6 backdrop-blur-lg bg-white/30 dark:bg-black/30 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Recent Transactions</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{tx.type}</TableCell>
                <TableCell>{tx.amount}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      tx.risk === "Low"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : tx.risk === "Medium"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                  >
                    {tx.risk}
                  </span>
                </TableCell>
                <TableCell>{tx.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
