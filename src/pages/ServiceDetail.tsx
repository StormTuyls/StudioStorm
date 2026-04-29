import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getServices } from "../api";
import type { Service } from "../types";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function ServiceDetail() {
  const { service } = useParams();
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch {
        setServices([]);
      }
    };

    void loadServices();
  }, []);

  const content = useMemo(() => {
    if (!service) return null;
    return services.find((item) => slugify(item.name) === service) || null;
  }, [service, services]);

  if (!content) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 text-white">
        <h1 className="font-display text-3xl">Service not found</h1>
        <p className="mt-4 text-white/70">
          The service you are looking for is not available.
        </p>
        <Link to="/services" className="mt-6 inline-block text-white/60">
          Back to Services
        </Link>
      </div>
    );
  }

  const includes = content.whatsIncluded?.length
    ? content.whatsIncluded
    : ["Custom consultation", "Curated selection", "Professional edits"];
  const deliverables = content.deliverables?.length
    ? content.deliverables
    : ["Web + social delivery", "High-res download", "Usage guidance"];
  const investment =
    content.startingPrice && content.startingPrice > 0
      ? `Starting at ${content.startingPrice} EUR`
      : "Contact for pricing";

  return (
    <div className="bg-[#0b0b0c] text-white">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
        <Link
          to="/services"
          className="text-xs uppercase tracking-[0.3em] text-white/60"
        >
          {"<- Services"}
        </Link>
        <h1 className="font-display text-4xl sm:text-5xl mt-6">
          {content.name}
        </h1>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-black/40 p-8">
            <h2 className="text-xs uppercase tracking-[0.3em] text-white/50">
              What Is Included
            </h2>
            <ul className="mt-6 space-y-3 text-white/70 list-disc list-inside">
              {includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h3 className="text-xs uppercase tracking-[0.3em] text-white/50 mt-8">
              Deliverables
            </h3>
            <ul className="mt-4 space-y-2 text-white/70 list-disc list-inside">
              {deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/40 p-8 space-y-6">
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-white/50">
                Description
              </h2>
              <p className="mt-2 text-white/70">{content.description}</p>
            </div>
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-white/50">
                Sport Focus
              </h2>
              <p className="mt-2 text-white/70">
                {content.sport ? content.sport : "All sports"}
              </p>
            </div>
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-white/50">
                Starting Investment
              </h2>
              <p className="mt-2 text-white/70">{investment}</p>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <Link
            to={content.ctaUrl || "/contact"}
            className="bg-[#f0c987] text-black px-6 py-3 text-xs uppercase tracking-[0.3em] hover:bg-[#d8b77a] transition"
          >
            {content.ctaLabel || "Request Availability"}
          </Link>
        </div>
      </section>
    </div>
  );
}
