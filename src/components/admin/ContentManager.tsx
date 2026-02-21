import { useState } from "react";
import type { ContentPage } from "../../types";
import ContentPageEditor from "./ContentPageEditor";

const PAGES: Array<{ slug: ContentPage["slug"]; title: string; icon: string }> =
  [
    { slug: "home", title: "Homepage", icon: "🏠" },
    { slug: "about", title: "About", icon: "ℹ️" },
    {
      slug: "sport-athletics",
      title: "Athletics",
      icon: "🏃",
    },
    { slug: "sport-volleyball", title: "Volleyball", icon: "🏐" },
    { slug: "sport-jiu-jitsu", title: "Jiu-Jitsu", icon: "🥋" },
    { slug: "journal", title: "Journal", icon: "📔" },
    { slug: "faq", title: "FAQ", icon: "❓" },
  ];

export default function ContentManager() {
  const [selectedPage, setSelectedPage] = useState<ContentPage["slug"] | null>(
    null,
  );

  if (selectedPage) {
    return (
      <div>
        <button
          onClick={() => setSelectedPage(null)}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mb-6"
        >
          ← Back to Pages
        </button>
        <ContentPageEditor pageSlug={selectedPage} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-light text-gray-900">Brand Content</h2>
        <p className="text-gray-500 text-sm mt-1">
          Edit pages with draggable blocks. No coding required.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PAGES.map((page) => (
          <button
            key={page.slug}
            onClick={() => setSelectedPage(page.slug)}
            className="group bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-gray-300 transition text-left"
          >
            <div className="text-3xl mb-3">{page.icon}</div>
            <h3 className="font-medium text-gray-900">{page.title}</h3>
            <p className="text-xs text-gray-500 mt-2">Edit page content</p>
          </button>
        ))}
      </div>
    </div>
  );
}
