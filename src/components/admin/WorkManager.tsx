import { useState } from "react";
import PortfolioManager from "./PortfolioManager";
import PhotosManager from "./PhotosManager";

type WorkTab = "portfolio" | "images";

export default function WorkManager() {
  const [activeTab, setActiveTab] = useState<WorkTab>("portfolio");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-light text-gray-900">Work</h2>
        <p className="text-sm text-gray-600 mt-1">
          Curate featured work and manage the full image library.
        </p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex flex-wrap gap-6">
          <button
            onClick={() => setActiveTab("portfolio")}
            className={`whitespace-nowrap py-3 px-1 border-b-2 text-sm font-medium transition ${
              activeTab === "portfolio"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Curated Work
          </button>
          <button
            onClick={() => setActiveTab("images")}
            className={`whitespace-nowrap py-3 px-1 border-b-2 text-sm font-medium transition ${
              activeTab === "images"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Image Library
          </button>
        </nav>
      </div>

      <div className="pt-2">
        {activeTab === "portfolio" && <PortfolioManager />}
        {activeTab === "images" && <PhotosManager />}
      </div>
    </div>
  );
}
