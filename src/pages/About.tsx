import { useEffect, useState } from "react";
import { getAboutContent } from "../api";
import type { AboutContent } from "../types";

export default function About() {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getAboutContent();
        setContent(data);
      } catch (error) {
        console.error("Failed to load about content:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-center text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-center text-gray-600">Content not available</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-light text-gray-900 mb-8">
          {content.title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={content.image}
                alt={content.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-4 text-gray-600">
            {content.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-light text-gray-900 mb-6">
            Onze Specialisaties
          </h2>
          <div className="space-y-6">
            {content.specializations.map((spec, index) => (
              <div key={index}>
                <h3 className="text-lg font-medium text-gray-900">
                  {spec.name}
                </h3>
                <p className="text-sm text-gray-500">{spec.subtitle}</p>
                <p className="text-gray-600 mt-2">{spec.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 mt-8">
          <h2 className="text-2xl font-light text-gray-900 mb-4">Contact</h2>
          <p className="text-gray-600">
            {content.contactText}{" "}
            <a
              href={content.contactLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              {content.contactLinkText}
            </a>{" "}
            {content.contactSuffix}
          </p>
        </div>
      </div>
    </div>
  );
}
