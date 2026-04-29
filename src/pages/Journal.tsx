import { useEffect, useState } from "react";
import { getJournalPosts } from "../api";
import type { JournalPost } from "../types";

const fallbackPosts: JournalPost[] = [
  {
    id: 1,
    title: "BK Veldlopen 2026 - Highlights",
    date: "2026-02",
    summary: "A focused selection of the most decisive frames from the course.",
  },
  {
    id: 2,
    title: "How to Prepare for Competition Photos",
    date: "2026-01",
    summary: "What athletes and clubs can do to elevate event coverage.",
  },
  {
    id: 3,
    title: "Capturing Finals Under Pressure",
    date: "2025-12",
    summary: "Timing, positioning, and calm execution when everything is on.",
  },
];

const formatDate = (value: string) => {
  if (!value) return "";
  const [year, month] = value.split("-");
  if (!year || !month) return value;
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
};

export default function Journal() {
  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await getJournalPosts();
        setPosts(Array.isArray(data) ? data : []);
        setLoadFailed(false);
      } catch {
        setPosts(fallbackPosts);
        setLoadFailed(true);
      }
    };

    void loadPosts();
  }, []);

  return (
    <div className="bg-[#0b0b0c] text-white">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">
          Journal
        </p>
        <h1 className="font-display text-4xl sm:text-5xl mt-4">
          Strategic content, not noise.
        </h1>
        <p className="mt-6 max-w-2xl text-white/70">
          Short, focused updates that reinforce expertise and share insights for
          clubs, parents, and athletes.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid gap-6">
          {posts.length === 0 && !loadFailed ? (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-white/70">
              No journal posts yet.
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post.id || post.title}
                className="rounded-2xl border border-white/10 bg-black/40 p-6"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  {formatDate(post.date)}
                </p>
                <h2 className="font-display text-2xl mt-3">{post.title}</h2>
                {post.summary && (
                  <p className="mt-3 text-white/70">{post.summary}</p>
                )}
                {post.body && <p className="mt-3 text-white/60">{post.body}</p>}
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
