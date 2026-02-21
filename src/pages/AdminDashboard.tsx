import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getCurrentUser } from "../api";
import AdminSidebar, { type AdminTab } from "../components/admin/AdminSidebar";
import DashboardOverview from "../components/admin/DashboardOverview";
import AlbumsManager from "../components/admin/AlbumsManager";
import ClientsManager from "../components/admin/ClientsManager";
import SiteSettingsManager from "../components/admin/SiteSettingsManager";
import PortfolioManager from "../components/admin/PortfolioManager";
import ServicesManager from "../components/admin/ServicesManager";
import SalesManager from "../components/admin/SalesManager";
import ContentManager from "../components/admin/ContentManager";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [user, setUser] = useState<{ username: string } | null>(null);
  const navigate = useNavigate();

  const loadUser = useCallback(async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch {
      navigate("/admin/login");
    }
  }, [navigate]);

  useEffect(() => {
    const init = async () => {
      await loadUser();
    };
    void init();
  }, [loadUser]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        username={user.username}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <DashboardOverview onNavigate={setActiveTab} />
          )}

          {/* Events Tab */}
          {activeTab === "events" && (
            <div>
              <h1 className="text-4xl font-light text-gray-900 mb-8">Events</h1>
              <AlbumsManager />
            </div>
          )}

          {/* Portfolio Tab */}
          {activeTab === "portfolio" && (
            <div>
              <h1 className="text-4xl font-light text-gray-900 mb-8">
                Portfolio
              </h1>
              <PortfolioManager />
            </div>
          )}

          {/* Services Tab */}
          {activeTab === "services" && (
            <div>
              <h1 className="text-4xl font-light text-gray-900 mb-8">
                Services
              </h1>
              <ServicesManager />
            </div>
          )}

          {/* Clients Tab */}
          {activeTab === "clients" && (
            <div>
              <h1 className="text-4xl font-light text-gray-900 mb-8">
                Clients
              </h1>
              <ClientsManager />
            </div>
          )}

          {/* Content Tab */}
          {activeTab === "content" && <ContentManager />}

          {/* Sales Tab */}
          {activeTab === "sales" && (
            <div>
              <h1 className="text-4xl font-light text-gray-900 mb-8">
                Sales & Revenue
              </h1>
              <SalesManager />
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div>
              <h1 className="text-4xl font-light text-gray-900 mb-8">
                Settings
              </h1>
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-light text-gray-900 mb-4">
                    Site Settings
                  </h2>
                  <SiteSettingsManager />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
