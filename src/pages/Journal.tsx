const posts = [
  {
    title: "BK Veldlopen 2026 - Highlights",
    date: "Feb 2026",
    summary: "A focused selection of the most decisive frames from the course.",
  },
  {
    title: "How to Prepare for Competition Photos",
    date: "Jan 2026",
    summary: "What athletes and clubs can do to elevate event coverage.",
  },
  {
    title: "Capturing Finals Under Pressure",
    date: "Dec 2025",
    summary: "Timing, positioning, and calm execution when everything is on.",
  },
];

export default function Journal() {
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
          {posts.map((post) => (
            <article
              key={post.title}
              className="rounded-2xl border border-white/10 bg-black/40 p-6"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                {post.date}
              </p>
              <h2 className="font-display text-2xl mt-3">{post.title}</h2>
              <p className="mt-3 text-white/70">{post.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
