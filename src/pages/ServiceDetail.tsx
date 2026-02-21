import { Link, useParams } from "react-router-dom";

const serviceContent: Record<
  string,
  {
    title: string;
    includes: string[];
    delivery: string;
    usage: string;
    investment: string;
  }
> = {
  "private-athlete": {
    title: "Private Athlete",
    includes: [
      "Pre-shoot planning call",
      "1.5 hour focused session",
      "20 curated high-res images",
      "Custom color grading",
    ],
    delivery: "5 business days",
    usage: "Personal branding + sponsor kits",
    investment: "Starting at 600 EUR",
  },
  "team-media-day": {
    title: "Team Media Day",
    includes: [
      "On-location studio setup",
      "Individual athlete portraits",
      "Team and group visuals",
      "Social-ready cutdowns",
    ],
    delivery: "7 business days",
    usage: "Club media + sponsor assets",
    investment: "Starting at 1,800 EUR",
  },
  "competition-coverage": {
    title: "Competition Coverage",
    includes: [
      "Full-event coverage",
      "Highlight edit + live selects",
      "Delivery by event + discipline",
      "Optional on-site upload",
    ],
    delivery: "48-72 hours",
    usage: "Event marketing + press",
    investment: "Starting at 2,400 EUR",
  },
};

export default function ServiceDetail() {
  const { service } = useParams();
  const content = service ? serviceContent[service] : null;

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
          {content.title}
        </h1>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-black/40 p-8">
            <h2 className="text-xs uppercase tracking-[0.3em] text-white/50">
              What Is Included
            </h2>
            <ul className="mt-6 space-y-3 text-white/70 list-disc list-inside">
              {content.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/40 p-8 space-y-6">
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-white/50">
                Delivery Time
              </h2>
              <p className="mt-2 text-white/70">{content.delivery}</p>
            </div>
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-white/50">
                Usage Rights
              </h2>
              <p className="mt-2 text-white/70">{content.usage}</p>
            </div>
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-white/50">
                Starting Investment
              </h2>
              <p className="mt-2 text-white/70">{content.investment}</p>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <Link
            to="/contact"
            className="bg-[#f0c987] text-black px-6 py-3 text-xs uppercase tracking-[0.3em] hover:bg-[#d8b77a] transition"
          >
            Request Availability
          </Link>
        </div>
      </section>
    </div>
  );
}
