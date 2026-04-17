import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getCurrentUser } from "../api";
import AdminSidebar, { type AdminTab } from "../components/admin/AdminSidebar";
import WorkManager from "../components/admin/WorkManager";
import SportsManager from "../components/admin/SportsManager";
import ServicesManager from "../components/admin/ServicesManager";
import ClientsManager from "../components/admin/ClientsManager";
import JournalManager from "../components/admin/JournalManager";
import AboutContentManager from "../components/admin/AboutContentManager";
import ClientGalleriesManager from "../components/admin/ClientGalleriesManager";

const TAB_META: Record<AdminTab, { title: string; description: string }> = {
  work: {
    title: "Work",
    description:
      "Add and curate portfolio work, plus manage the full image library.",
  },
  sports: {
    title: "Sports",
    description: "Add or remove sports and organize events by season.",
  },
  services: {
    title: "Services",
    description: "Manage services, pricing, and visibility.",
  },
  clients: {
    title: "Clients",
    description: "Add clients and track key statistics.",
  },
  journal: {
    title: "Journal",
    description: "Publish journal posts with images and text.",
  },
  about: {
    title: "About",
    description: "Update the About page content and sections.",
  },
  contact: {
    title: "Contact",
    description: "No configuration required for the contact page.",
  },
  galleries: {
    title: "Personal Galleries",
    description: "Create galleries and upload images for clients.",
  },
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("work");
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

  const tabMeta = TAB_META[activeTab];

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        username={user.username}
      />

      <div className="flex-1">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                  Admin
                </p>
                <h1 className="text-3xl font-light text-gray-900">
                  {tabMeta.title}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {tabMeta.description}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                  Signed in
                </p>
                <p className="text-sm font-medium text-gray-800">
                  {user.username}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === "work" && <WorkManager />}
          {activeTab === "sports" && <SportsManager />}
          {activeTab === "services" && <ServicesManager />}
          {activeTab === "clients" && <ClientsManager />}
          {activeTab === "journal" && <JournalManager />}
          {activeTab === "about" && <AboutContentManager />}
          {activeTab === "contact" && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-medium text-gray-900">
                Contact Page
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                No management controls are required for the contact page.
              </p>
            </div>
          )}
          {activeTab === "galleries" && <ClientGalleriesManager />}
        </main>
      </div>
    </div>
  );
}
