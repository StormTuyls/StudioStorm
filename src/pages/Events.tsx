import { Link } from "react-router-dom";

const events = [
  {
    year: "2026",
    slug: "bk-veldlopen",
    title: "BK Veldlopen",
    note: "Shared directly with clubs and families.",
  },
  {
    year: "2026",
    slug: "clubkampioenschap",
    title: "Clubkampioenschap",
    note: "Access is provided via direct link.",
  },
];

export default function Events() {
  return (
    <div className="bg-[#0b0b0c] text-white">
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">
          Event Galleries
        </p>
        <h1 className="font-display text-4xl sm:text-5xl mt-4">
          Event galleries are shared quietly.
        </h1>
        <p className="mt-6 text-white/70">
          Parents and athletes typically receive a direct link from their club
          or event organizer. If you need access, use the link provided or
          contact us.
        </p>
        <div className="mt-10 grid gap-4">
          {events.map((event) => (
            <Link
              key={event.slug}
              to={`/events/${event.year}/${event.slug}`}
              className="rounded-2xl border border-white/10 bg-black/40 p-6 hover:border-white/40 transition"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                {event.year}
              </p>
              <h2 className="font-display text-2xl mt-3">{event.title}</h2>
              <p className="mt-2 text-white/60">{event.note}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
