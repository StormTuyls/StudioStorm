import { useState } from "react";

export type AdminTab =
  | "work"
  | "sports"
  | "services"
  | "clients"
  | "journal"
  | "about"
  | "contact"
  | "galleries";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
  username: string;
}

export default function AdminSidebar({
  activeTab,
  onTabChange,
  onLogout,
  username,
}: AdminSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems: Array<{ id: AdminTab; label: string; icon: string }> = [
    { id: "work", label: "Work", icon: "🖼️" },
    { id: "sports", label: "Sports", icon: "🏅" },
    { id: "services", label: "Services", icon: "🎯" },
    { id: "clients", label: "Clients", icon: "👥" },
    { id: "journal", label: "Journal", icon: "📓" },
    { id: "about", label: "About", icon: "ℹ️" },
    { id: "contact", label: "Contact", icon: "✉️" },
    { id: "galleries", label: "Personal Galleries", icon: "🗂️" },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-gray-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-lg font-medium">Studio Storm</h1>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="text-2xl"
        >
          {isMobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Sidebar */}
      <nav
        className={`${
          isMobileOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-gray-900 text-white md:h-screen md:overflow-y-auto flex flex-col`}
      >
        {/* Logo / Branding */}
        <div className="hidden md:block p-6 border-b border-gray-800">
          <h1 className="text-xl font-light tracking-wider">Studio Storm</h1>
          <p className="text-xs text-gray-400 mt-1">Admin</p>
        </div>

        {/* Menu Items */}
        <div className="flex-1 space-y-1 p-4 md:p-0 md:rounded-none">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setIsMobileOpen(false);
              }}
              className={`w-full text-left px-4 md:px-6 py-3 rounded-lg md:rounded-none flex items-center gap-3 transition ${
                activeTab === item.id
                  ? "bg-[#f0c987] text-gray-900 font-medium"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium md:font-normal">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* User Section */}
        <div className="border-t border-gray-800 p-4 md:p-6 space-y-3">
          <div className="text-xs">
            <p className="text-gray-500">Logged in as</p>
            <p className="text-white font-medium truncate">{username}</p>
          </div>
          <button
            onClick={onLogout}
            className="w-full px-4 py-2 text-sm font-medium bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </nav>
    </>
  );
}
