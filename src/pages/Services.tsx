import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getServices } from "../api";
import type { Service } from "../types";

const fallbackServices: Service[] = [
  {
    id: "private-athlete",
    name: "Private Athlete",
    description: "Personal branding for elite competitors.",
    whatsIncluded: [],
    startingPrice: 0,
    deliverables: [],
    ctaLabel: "Get Started",
    isActive: true,
  },
  {
    id: "team-media-day",
    name: "Team Media Day",
    description: "Cohesive visuals for clubs and federations.",
    whatsIncluded: [],
    startingPrice: 0,
    deliverables: [],
    ctaLabel: "Get Started",
    isActive: true,
  },
  {
    id: "competition-coverage",
    name: "Competition Coverage",
    description: "Full-event storytelling for meets and tournaments.",
    whatsIncluded: [],
    startingPrice: 0,
    deliverables: [],
    ctaLabel: "Get Started",
    isActive: true,
  },
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await getServices();
        setServices(Array.isArray(data) ? data : []);
        setLoadFailed(false);
      } catch {
        setServices(fallbackServices);
        setLoadFailed(true);
      }
    };

    void loadServices();
  }, []);

  const visibleServices = useMemo(() => {
    const source = loadFailed ? fallbackServices : services;
    return source.filter((service) => service.isActive !== false);
  }, [loadFailed, services]);

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
          {visibleServices.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-white/70">
              No services are available right now.
            </div>
          ) : (
            visibleServices.map((service) => (
              <Link
                key={service.id || service.name}
                to={`/services/${slugify(service.name)}`}
                className="rounded-2xl border border-white/10 bg-black/40 p-6 hover:border-white/40 transition"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  {service.name}
                </p>
                <h2 className="font-display text-2xl mt-4">
                  {service.description}
                </h2>
                <span className="mt-6 inline-block text-xs uppercase tracking-[0.3em] text-white/60">
                  {"View details ->"}
                </span>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
