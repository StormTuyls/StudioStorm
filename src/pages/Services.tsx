import { Link } from "react-router-dom";

const services = [
  {
    slug: "private-athlete",
    title: "Private Athlete",
    summary: "Personal branding for elite competitors.",
  },
  {
    slug: "team-media-day",
    title: "Team Media Day",
    summary: "Cohesive visuals for clubs and federations.",
  },
  {
    slug: "competition-coverage",
    title: "Competition Coverage",
    summary: "Full-event storytelling for meets and tournaments.",
  },
];

export default function Services() {
  return (
    <div className="bg-[#0b0b0c] text-white">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">
          Services
        </p>
        <h1 className="font-display text-4xl sm:text-5xl mt-4">
          Premium coverage with transparent value.
        </h1>
        <p className="mt-6 max-w-2xl text-white/70">
          Every service is built for clubs, athletes, and media partners who
          want confident imagery without the noise.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.slug}
              to={`/services/${service.slug}`}
              className="rounded-2xl border border-white/10 bg-black/40 p-6 hover:border-white/40 transition"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                {service.title}
              </p>
              <h2 className="font-display text-2xl mt-4">{service.summary}</h2>
              <span className="mt-6 inline-block text-xs uppercase tracking-[0.3em] text-white/60">
                {"View details ->"}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
