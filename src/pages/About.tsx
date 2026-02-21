export default function About() {
  return (
    <div className="bg-[#0b0b0c] text-white">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">
          About
        </p>
        <h1 className="font-display text-4xl sm:text-5xl mt-4">
          Studio Storm is built on athletics-first storytelling.
        </h1>
        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_1.2fr]">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/40">
            <img
              src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&auto=format&fit=crop"
              alt="Studio Storm"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-6 text-white/70">
            <p>
              We focus on the edge of performance: the calm before the gun, the
              drive phase, the finish, and the moments in between. Our work is
              trusted by clubs and media partners who want clarity and prestige
              without the noise.
            </p>
            <p>
              With a primary focus on athletics, and additional coverage in
              volleyball and jiu-jitsu, we create imagery that feels editorial
              and timeless while staying true to the sport.
            </p>
            <p>
              Studio Storm partners with Atletieknieuws, Agones Media,
              Runnerslab Athletics Team, and VAL, delivering consistent coverage
              across seasons.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Focus
            </p>
            <p className="font-display text-2xl mt-4">Athletics-first.</p>
            <p className="mt-3 text-white/70">
              Speed, precision, and the emotional finish.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Style
            </p>
            <p className="font-display text-2xl mt-4">Clean and cinematic.</p>
            <p className="mt-3 text-white/70">
              Minimal UI, strong typography, and generous spacing.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Delivery
            </p>
            <p className="font-display text-2xl mt-4">Fast, curated edits.</p>
            <p className="mt-3 text-white/70">
              Organized and ready for media or sponsors.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
