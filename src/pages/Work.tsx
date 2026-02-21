import { Link } from "react-router-dom";

const workSections = [
  {
    slug: "atletiek",
    title: "Atletiek",
    description: "Speed, tension, and the quiet before the gun.",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1800&auto=format&fit=crop",
  },
  {
    slug: "volleybal",
    title: "Volleybal",
    description: "Verticality, timing, and the geometry of the net.",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1800&auto=format&fit=crop",
  },
  {
    slug: "jiu-jitsu",
    title: "Jiu-Jitsu",
    description: "Pressure, grip, and the story inside every exchange.",
    image:
      "https://images.unsplash.com/photo-1500563853545-7a87626d2e61?w=1800&auto=format&fit=crop",
  },
];

export default function Work() {
  return (
    <div className="bg-[#0b0b0c] text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(216,183,122,0.18),_rgba(11,11,12,0.95))]" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">
            Work
          </p>
          <h1 className="font-display text-4xl sm:text-5xl mt-4">
            Curated. Focused. Built for impact.
          </h1>
          <p className="mt-6 max-w-2xl text-white/70">
            A premium selection of our strongest imagery across athletics,
            volleyball, and jiu-jitsu. No filters. No endless scrolling. Just
            decisive moments.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 gap-10">
          {workSections.map((section) => (
            <Link
              key={section.slug}
              to={`/work/${section.slug}`}
              className="group grid gap-6 rounded-3xl border border-white/10 bg-black/40 p-6 md:grid-cols-[1.3fr_1fr]"
            >
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={section.image}
                  alt={section.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                  {section.title}
                </p>
                <h2 className="font-display text-3xl mt-4">
                  {section.description}
                </h2>
                <span className="mt-6 text-xs uppercase tracking-[0.3em] text-white/60 group-hover:text-white transition">
                  {"View gallery ->"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
