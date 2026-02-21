import { useState, useEffect } from "react";
import type { ContentPage, ContentBlock, ContentBlockType } from "../../types";

interface ContentPageEditorProps {
  pageSlug: ContentPage["slug"];
}

const BLOCK_TYPES: Array<{
  type: ContentBlockType;
  label: string;
  icon: string;
}> = [
  { type: "hero", label: "Hero Section", icon: "🎬" },
  { type: "text", label: "Text", icon: "📝" },
  { type: "image", label: "Image", icon: "🖼️" },
  { type: "gallery", label: "Gallery", icon: "📸" },
  { type: "cta", label: "Call-to-Action", icon: "🎯" },
  { type: "faq", label: "FAQ Item", icon: "❓" },
  { type: "testimonial", label: "Testimonial", icon: "💬" },
];

export default function ContentPageEditor({
  pageSlug,
}: ContentPageEditorProps) {
  const [page, setPage] = useState<ContentPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Fetch page from API
    setPage({
      id: pageSlug,
      slug: pageSlug,
      title: pageSlug.replace("-", " ").toUpperCase(),
      blocks: [],
      seoTitle: "",
      seoDescription: "",
    });
    setIsLoading(false);
  }, [pageSlug]);

  const handleAddBlock = (type: ContentBlockType) => {
    if (!page) return;

    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      type,
      order: page.blocks.length,
      data: {},
    };

    setPage({
      ...page,
      blocks: [...page.blocks, newBlock],
    });
    setShowAddBlock(false);
  };

  const handleUpdateBlock = (
    blockId: string,
    data: Record<string, unknown>,
  ) => {
    if (!page) return;

    setPage({
      ...page,
      blocks: page.blocks.map((b) => (b.id === blockId ? { ...b, data } : b)),
    });
  };

  const handleRemoveBlock = (blockId: string) => {
    if (!page) return;

    setPage({
      ...page,
      blocks: page.blocks.filter((b) => b.id !== blockId),
    });
  };

  const handleReorderBlocks = (fromIndex: number, toIndex: number) => {
    if (!page) return;

    const newBlocks = [...page.blocks];
    const [moved] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, moved);

    setPage({
      ...page,
      blocks: newBlocks.map((b, idx) => ({ ...b, order: idx })),
    });
  };

  const handleSave = async () => {
    if (!page) return;

    try {
      setIsSaving(true);
      // TODO: Call API to save page
      console.log("Saving page:", page);
      alert("Page saved successfully!");
    } catch {
      alert("Failed to save page");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500">Loading page...</div>
    );
  }

  if (!page) {
    return (
      <div className="text-center py-12 text-gray-500">Page not found</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-light text-gray-900">
            Edit {page.title}
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Page"}
        </button>
      </div>

      {/* SEO Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h2 className="font-medium text-gray-900">SEO Settings</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Page Title for Search Engines
          </label>
          <input
            type="text"
            value={page.seoTitle || ""}
            onChange={(e) => setPage({ ...page, seoTitle: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="e.g., Professional Athletics Photography | Studio Storm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Description
          </label>
          <textarea
            value={page.seoDescription || ""}
            onChange={(e) =>
              setPage({
                ...page,
                seoDescription: e.target.value,
              })
            }
            rows={2}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            placeholder="Brief description that appears in search results..."
          />
        </div>
      </div>

      {/* Content Blocks */}
      <div>
        <h2 className="text-xl font-light text-gray-900 mb-4">
          Content Blocks
        </h2>
        <div className="space-y-4">
          {page.blocks.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                No blocks yet. Add one to get started.
              </p>
            </div>
          ) : (
            page.blocks.map((block, idx) => (
              <BlockEditor
                key={block.id}
                block={block}
                isEditing={editingBlockId === block.id}
                onEdit={() => block.id && setEditingBlockId(block.id)}
                onClose={() => setEditingBlockId(null)}
                onUpdate={(data) => handleUpdateBlock(block.id!, data)}
                onRemove={() => handleRemoveBlock(block.id!)}
                onMoveUp={() => idx > 0 && handleReorderBlocks(idx, idx - 1)}
                onMoveDown={() =>
                  idx < page.blocks.length - 1 &&
                  handleReorderBlocks(idx, idx + 1)
                }
                canMoveUp={idx > 0}
                canMoveDown={idx < page.blocks.length - 1}
              />
            ))
          )}
        </div>
      </div>

      {/* Add Block */}
      {!showAddBlock ? (
        <button
          onClick={() => setShowAddBlock(true)}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 font-medium transition"
        >
          + Add Block
        </button>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900">Choose Block Type</h3>
            <button
              onClick={() => setShowAddBlock(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {BLOCK_TYPES.map((blockType) => (
              <button
                key={blockType.type}
                onClick={() => handleAddBlock(blockType.type)}
                className="p-3 border border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition text-left"
              >
                <div className="text-2xl mb-1">{blockType.icon}</div>
                <p className="text-sm font-medium text-gray-900">
                  {blockType.label}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface BlockEditorProps {
  block: ContentBlock;
  isEditing: boolean;
  onEdit: () => void;
  onClose: () => void;
  onUpdate: (data: Record<string, unknown>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

function BlockEditor({
  block,
  isEditing,
  onEdit,
  onClose,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: BlockEditorProps) {
  const [localData, setLocalData] = useState(block.data);

  const handleSave = () => {
    onUpdate(localData);
    onClose();
  };

  const blockTypeLabel = BLOCK_TYPES.find(
    (bt) => bt.type === block.type,
  )?.label;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
        <div className="flex items-center gap-3">
          <span className="text-2xl">
            {BLOCK_TYPES.find((bt) => bt.type === block.type)?.icon}
          </span>
          <div>
            <p className="font-medium text-gray-900">{blockTypeLabel}</p>
            <p className="text-xs text-gray-500">
              {Object.keys(block.data).length > 0
                ? `${Object.keys(block.data).length} fields filled`
                : "Empty"}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Move up"
          >
            ↑
          </button>
          <button
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Move down"
          >
            ↓
          </button>
          <button
            onClick={() => (isEditing ? onClose() : onEdit())}
            className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
          >
            {isEditing ? "Done" : "Edit"}
          </button>
          <button
            onClick={onRemove}
            className="px-3 py-2 border border-red-200 text-red-700 rounded text-sm hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Editor */}
      {isEditing && (
        <div className="p-6 space-y-4 bg-gray-50 border-t">
          <BlockTypeEditor
            type={block.type}
            data={localData}
            onChange={setLocalData}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              Save Block
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function BlockTypeEditor({
  type,
  data,
  onChange,
}: {
  type: ContentBlockType;
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}) {
  switch (type) {
    case "hero":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={(data.title as string) || ""}
              onChange={(e) => onChange({ ...data, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Main headline"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle
            </label>
            <textarea
              value={(data.subtitle as string) || ""}
              onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
              placeholder="Supporting text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Image URL
            </label>
            <input
              type="url"
              value={(data.backgroundImage as string) || ""}
              onChange={(e) =>
                onChange({ ...data, backgroundImage: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="https://..."
            />
          </div>
        </div>
      );

    case "text":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={(data.content as string) || ""}
              onChange={(e) => onChange({ ...data, content: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none font-mono text-sm"
              placeholder="Enter text content..."
            />
          </div>
        </div>
      );

    case "image":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={(data.imageUrl as string) || ""}
              onChange={(e) => onChange({ ...data, imageUrl: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Caption
            </label>
            <input
              type="text"
              value={(data.caption as string) || ""}
              onChange={(e) => onChange({ ...data, caption: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Optional image caption"
            />
          </div>
        </div>
      );

    case "cta":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Button Text
            </label>
            <input
              type="text"
              value={(data.buttonText as string) || ""}
              onChange={(e) =>
                onChange({ ...data, buttonText: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="e.g., Book a Shoot"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Button URL
            </label>
            <input
              type="url"
              value={(data.buttonUrl as string) || ""}
              onChange={(e) => onChange({ ...data, buttonUrl: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="/contact"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={(data.description as string) || ""}
              onChange={(e) =>
                onChange({ ...data, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
              placeholder="Supporting text"
            />
          </div>
        </div>
      );

    case "faq":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question
            </label>
            <input
              type="text"
              value={(data.question as string) || ""}
              onChange={(e) => onChange({ ...data, question: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="e.g., How long does editing take?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Answer
            </label>
            <textarea
              value={(data.answer as string) || ""}
              onChange={(e) => onChange({ ...data, answer: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
              placeholder="Answer to the question..."
            />
          </div>
        </div>
      );

    case "testimonial":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quote
            </label>
            <textarea
              value={(data.quote as string) || ""}
              onChange={(e) => onChange({ ...data, quote: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none italic"
              placeholder="Testimonial text..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author Name
            </label>
            <input
              type="text"
              value={(data.authorName as string) || ""}
              onChange={(e) =>
                onChange({ ...data, authorName: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="e.g., John Smith"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author Title
            </label>
            <input
              type="text"
              value={(data.authorTitle as string) || ""}
              onChange={(e) =>
                onChange({ ...data, authorTitle: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="e.g., Track & Field Coach"
            />
          </div>
        </div>
      );

    case "gallery":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gallery Type
            </label>
            <select
              value={(data.galleryType as string) || "portfolio"}
              onChange={(e) =>
                onChange({ ...data, galleryType: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="portfolio">Portfolio</option>
              <option value="recent">Recent Uploads</option>
              <option value="featured">Featured</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Images
            </label>
            <input
              type="number"
              value={(data.imageCount as number) || 6}
              onChange={(e) =>
                onChange({ ...data, imageCount: Number(e.target.value) })
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              min="1"
              max="20"
            />
          </div>
        </div>
      );

    default:
      return <p className="text-gray-500 text-sm">Block editor coming soon</p>;
  }
}
