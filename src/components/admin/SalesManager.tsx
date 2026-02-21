import { useState, useEffect } from "react";
import type { SalesMetrics } from "../../types";

// TODO: Wire to actual API endpoints
export default function SalesManager() {
  const [metrics, setMetrics] = useState<SalesMetrics>({
    totalRevenue: 14250,
    revenueThisMonth: 3500,
    revenueLastMonth: 2800,
    downloadVolume: 287,
    topEvent: { eventId: "1", amount: 1200 },
    topSport: { sport: "athletics", amount: 8500 },
  });
  const [timeframe, setTimeframe] = useState<
    "thisMonth" | "thisYear" | "allTime"
  >("thisMonth");

  return (
    <div className="space-y-8">
      {/* Timeframe Filter */}
      <div className="flex gap-2">
        {(["thisMonth", "thisYear", "allTime"] as const).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              timeframe === tf
                ? "bg-gray-900 text-white"
                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {tf === "thisMonth" && "This Month"}
            {tf === "thisYear" && "This Year"}
            {tf === "allTime" && "All Time"}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Revenue"
          value={`$${metrics.totalRevenue}`}
          icon="💰"
          trend={0.12}
        />
        <MetricCard
          label="This Month"
          value={`$${metrics.revenueThisMonth}`}
          icon="📈"
          subtext={`vs $${metrics.revenueLastMonth} last month`}
        />
        <MetricCard
          label="Download Volume"
          value={metrics.downloadVolume.toString()}
          icon="📥"
          subtext="files downloaded"
        />
        <MetricCard
          label="Avg per Event"
          value={`$${Math.round(metrics.totalRevenue / 12)}`}
          icon="📊"
        />
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Sport */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-medium text-gray-900 mb-4">Top Sport</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <p className="capitalize text-gray-700 font-medium">
                  {metrics.topSport?.sport || "N/A"}
                </p>
                <p className="text-gray-900 font-medium">
                  ${metrics.topSport?.amount || 0}
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gray-900 h-2 rounded-full"
                  style={{
                    width: `${((metrics.topSport?.amount || 0) / metrics.totalRevenue) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-medium text-gray-900 mb-4">Recent Events</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <p className="text-gray-700">Track Championships 2025</p>
              <p className="font-medium text-gray-900">$1,200</p>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <p className="text-gray-700">Regional Qualifier</p>
              <p className="font-medium text-gray-900">$850</p>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <p className="text-gray-700">Inter-club Tournament</p>
              <p className="font-medium text-gray-900">$650</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Transaction History */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-medium text-gray-900 mb-4">Transaction History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left py-2 text-gray-600 font-medium">
                  Date
                </th>
                <th className="text-left py-2 text-gray-600 font-medium">
                  Event
                </th>
                <th className="text-left py-2 text-gray-600 font-medium">
                  Client
                </th>
                <th className="text-right py-2 text-gray-600 font-medium">
                  Amount
                </th>
                <th className="text-left py-2 text-gray-600 font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                {
                  date: "2025-02-18",
                  event: "Track Championships",
                  client: "Local Athletics Club",
                  amount: 1200,
                  status: "paid",
                },
                {
                  date: "2025-02-15",
                  event: "Regional Qualifier",
                  client: "Runner's Lab",
                  amount: 850,
                  status: "paid",
                },
                {
                  date: "2025-02-10",
                  event: "Inter-club Tournament",
                  client: "Ville UniSports",
                  amount: 650,
                  status: "pending",
                },
              ].map((tx, idx) => (
                <tr key={idx}>
                  <td className="py-3 text-gray-700">{tx.date}</td>
                  <td className="py-3 text-gray-700">{tx.event}</td>
                  <td className="py-3 text-gray-700">{tx.client}</td>
                  <td className="py-3 text-right font-medium text-gray-900">
                    ${tx.amount}
                  </td>
                  <td className="py-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        tx.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {tx.status === "paid" ? "Paid" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
  subtext,
  trend,
}: {
  label: string;
  value: string;
  icon: string;
  subtext?: string;
  trend?: number;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex justify-tussen items-start">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">
            {label}
          </p>
          <p className="text-2xl font-light text-gray-900">{value}</p>
          {subtext && <p className="text-xs text-gray-500 mt-2">{subtext}</p>}
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
      {trend && (
        <p className="text-xs text-green-600 mt-2">
          {trend > 0 ? "↗" : "↘"} {Math.abs(trend * 100)}% vs last period
        </p>
      )}
    </div>
  );
}
