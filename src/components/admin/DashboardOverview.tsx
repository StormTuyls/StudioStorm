import { useEffect, useState } from "react";
import type { AdminTab } from "./AdminSidebar";

interface DashboardStats {
  upcomingEvents: number;
  recentUploads: number;
  sales30Days: number;
  activeGalleries: number;
  expiringGalleries: number;
}

interface DashboardProps {
  onNavigate: (section: AdminTab) => void;
}

export default function DashboardOverview({ onNavigate }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    upcomingEvents: 0,
    recentUploads: 0,
    sales30Days: 0,
    activeGalleries: 0,
    expiringGalleries: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch real stats from API
    // For now, placeholder
    const loadStats = async () => {
      setStats({
        upcomingEvents: 3,
        recentUploads: 28,
        sales30Days: 2450,
        activeGalleries: 5,
        expiringGalleries: 1,
      });
      setIsLoading(false);
    };
    void loadStats();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-gray-600">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-light text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back. Here's your overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Upcoming Events"
          value={stats.upcomingEvents.toString()}
          icon="📅"
        />
        <StatCard
          label="Recent Uploads"
          value={stats.recentUploads.toString()}
          icon="📸"
        />
        <StatCard
          label="Revenue (30d)"
          value={`$${stats.sales30Days}`}
          icon="💰"
        />
        <StatCard
          label="Active Galleries"
          value={stats.activeGalleries.toString()}
          icon="🔗"
        />
        <StatCard
          label="Expiring Soon"
          value={stats.expiringGalleries.toString()}
          icon="⏰"
          warning={stats.expiringGalleries > 0}
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-light text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            label="Add Work"
            description="Curate portfolio and upload images"
            icon="📤"
            onClick={() => onNavigate("work")}
          />
          <QuickActionCard
            label="Add Sport"
            description="Manage sports and events"
            icon="🎁"
            onClick={() => onNavigate("sports")}
          />
          <QuickActionCard
            label="Add Client"
            description="Register new client relationship"
            icon="👤"
            onClick={() => onNavigate("clients")}
          />
          <QuickActionCard
            label="New Journal"
            description="Publish a journal update"
            icon="🏠"
            onClick={() => onNavigate("journal")}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-light text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-500">No recent activity yet.</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  warning = false,
}: {
  label: string;
  value: string;
  icon: string;
  warning?: boolean;
}) {
  return (
    <div
      className={`rounded-lg p-6 border ${
        warning ? "bg-amber-50 border-amber-200" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={`text-xs uppercase tracking-[0.2em] ${
              warning ? "text-amber-600" : "text-gray-500"
            }`}
          >
            {label}
          </p>
          <p
            className={`text-2xl font-light mt-2 ${
              warning ? "text-amber-900" : "text-gray-900"
            }`}
          >
            {value}
          </p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
}

function QuickActionCard({
  label,
  description,
  icon,
  onClick,
}: {
  label: string;
  description: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-gray-300 transition text-left"
    >
      <div className="text-3xl mb-3 group-hover:scale-110 transition">
        {icon}
      </div>
      <h3 className="font-medium text-gray-900">{label}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </button>
  );
}
