import { PlaceholderPattern } from "@/components/ui/placeholder-pattern";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { BanknoteIcon, DollarSign, MagnetIcon } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Stats {
  total_investors: number;
  total_accounts: number;
  total_amount: number;
}

interface MonthlyTotal {
  month: string;
  total: number;
}

interface DashboardProps {
  stats: Stats;
  monthly_totals: MonthlyTotal[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Dashboard", href: "/dashboard" },
];

export default function Dashboard({ stats, monthly_totals }: DashboardProps) {
  const dashboardStats = [
    {
      title: "Total Investors",
      value: stats.total_investors,
      icon: MagnetIcon,
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "Total Accounts",
      value: stats.total_accounts,
      icon: BanknoteIcon,
      color: "bg-green-100 text-green-800",
    },
    {
      title: "Total Amount Received",
      value: `৳ ${stats.total_amount}`,
      icon: DollarSign,
      color: "bg-yellow-100 text-yellow-800",
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="flex items-center p-4 bg-white border rounded-xl shadow-sm dark:bg-gray-900 dark:border-gray-700"
              >
                <div className={`p-3 rounded-full mr-4 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chart */}
        <div className="p-4 bg-white rounded-xl border shadow-sm dark:bg-gray-900 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">📊 Monthly Amount Received</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthly_totals}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppLayout>
  );
}
