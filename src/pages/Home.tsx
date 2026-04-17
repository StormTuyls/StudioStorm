import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getClients, getHomeSettings } from "../api";
import type { Client } from "../types";

interface Highlight {
  id: string;
  title: string;
  imageUrl: string;
  order: number;
}

interface HomeSettings {
  id: string;
  heroImageUrl: string;
  heroImageTitle: string;
  highlights: Highlight[];
  createdAt?: Date;
  updatedAt?: Date;
}

const fallbackHighlights: Highlight[] = [
  {
    id: "hl-1",
    title: "Finish Line Burst",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1400&auto=format&fit=crop",
    order: 1,
  },
  {
    id: "hl-2",
    title: "Relay Handoff",
    imageUrl:
      "https://images.unsplash.com/photo-1502904550040-7534597429ae?w=1400&auto=format&fit=crop",
    order: 2,
  },
  {
    id: "hl-3",
    title: "Arena Silence",
    imageUrl:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1400&auto=format&fit=crop",
    order: 3,
  },
  {
    id: "hl-4",
    title: "Explosive Jump",
    imageUrl:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1400&auto=format&fit=crop",
    order: 4,
  },
  {
    id: "hl-5",
    title: "Volley Rise",
    imageUrl:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1400&auto=format&fit=crop",
    order: 5,
  },
  {
    id: "hl-6",
    title: "Serve Pressure",
    imageUrl:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1400&auto=format&fit=crop",
    order: 6,
  },
  {
    id: "hl-7",
    title: "Grip Fight",
    imageUrl:
      "https://images.unsplash.com/photo-1500563853545-7a87626d2e61?w=1400&auto=format&fit=crop",
    order: 7,
  },
  {
    id: "hl-8",
    title: "Final Seconds",
    imageUrl:
      "https://images.unsplash.com/photo-1544717302-de2939b7efcb?w=1400&auto=format&fit=crop",
    order: 8,
  },
  {
    id: "hl-9",
    title: "Victory Break",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1400&auto=format&fit=crop",
    order: 9,
  },
];

const fallbackHomeSettings: HomeSettings = {
  id: "home-settings",
  heroImageUrl:
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1900&auto=format&fit=crop",
  heroImageTitle: "Iconic sports moment",
  highlights: fallbackHighlights,
};

const defaultClients = [
  "Atletieknieuws",
  "Agones Media",
  "Runnerslab Athletics Team",
  "VAL",
];

export default function Home() {
  const [clients, setClients] = useState<Client[]>([]);
  const [homeSettings, setHomeSettings] =
    useState<HomeSettings>(fallbackHomeSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientsData, homeSettingsData] = await Promise.all([
          getClients().catch(() => []),
          getHomeSettings().catch(() => fallbackHomeSettings),
        ]);

        const featured = clientsData.filter((c: Client) => c.featured);
        setClients(
          featured.length > 0
            ? featured
            : clientsData.length > 0
              ? clientsData
              : defaultClients.map((name) => ({ name })),
        );
        setHomeSettings(homeSettingsData || fallbackHomeSettings);
      } catch {
        // Fallback to defaults if API fails
        setClients(defaultClients.map((name) => ({ name })));
        setHomeSettings(fallbackHomeSettings);
      } finally {
        setIsLoading(false);
      }
    };
    void loadData();
  }, []);

  return (
    <div className="bg-[#0b0b0c] text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={homeSettings.heroImageUrl}
            alt={homeSettings.heroImageTitle}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#0b0b0c]" />
        </div>
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-28 sm:py-36">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">
            Sports Photography
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl mt-6 leading-tight">
            Studio Storm captures the split-second intensity of elite sport.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/70">
            Athletics-first. Trusted by clubs, events, and athletes who value
            precision, timing, and a cinematic point of view.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/work"
              className="bg-[#f0c987] text-black px-6 py-3 text-xs uppercase tracking-[0.3em] hover:bg-[#d8b77a] transition"
            >
              View Work
            </Link>
            <Link
              to="/contact"
              className="border border-white/40 px-6 py-3 text-xs uppercase tracking-[0.3em] text-white/80 hover:text-white hover:border-white transition"
            >
              Book a Shoot
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">
              Selected Highlights
            </p>
            <h2 className="font-display text-3xl sm:text-4xl mt-4">
              A tight edit of our strongest frames.
            </h2>
          </div>
          <Link
            to="/work"
            className="text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white transition"
          >
            {"Explore the full edit ->"}
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homeSettings.highlights
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((item) => (
              <figure
                key={item.id}
                className="group relative overflow-hidden rounded-2xl bg-black/40"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 text-sm uppercase tracking-[0.3em] text-white/70 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                  {item.title}
                </figcaption>
              </figure>
            ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(240,201,135,0.18),_rgba(11,11,12,0.9))] p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                Trusted By
              </p>
              <h3 className="font-display text-3xl mt-3">
                Clubs and media partners
              </h3>
            </div>
            <Link
              to="/clients"
              className="text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white transition"
            >
              {"View client list ->"}
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm uppercase tracking-[0.2em] text-white/70">
            {isLoading ? (
              <p className="col-span-4 text-center text-white/50">Loading...</p>
            ) : (
              clients.map((client) => (
                <div
                  key={client.id || client.name}
                  className="rounded-full border border-white/15 px-4 py-3 text-center"
                >
                  {client.name}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">
              Ready to collaborate
            </p>
            <h2 className="font-display text-3xl sm:text-4xl mt-4">
              Let us cover your next event with precision and prestige.
            </h2>
          </div>
          <Link
            to="/contact"
            className="bg-white text-black px-6 py-3 text-xs uppercase tracking-[0.3em] hover:bg-[#f0c987] transition"
          >
            Request Availability
          </Link>
        </div>
      </section>
    </div>
  );
}
