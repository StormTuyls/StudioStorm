import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSports } from "../api";
import type { Sport } from "../types";

const fallbackSports: Sport[] = [
  {
    id: 1,
    slug: "atletiek",
    title: "Atletiek",
    summary: "Explosive starts, clean form, raw emotion.",
    imageUrl:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1500&auto=format&fit=crop",
  },
  {
    id: 2,
    slug: "volleybal",
    title: "Volleybal",
    summary: "Vertical movement and teamwork under pressure.",
    imageUrl:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1500&auto=format&fit=crop",
  },
  {
    id: 3,
    slug: "jiu-jitsu",
    title: "Jiu-Jitsu",
    summary: "Close-range intensity, captured with clarity.",
    imageUrl:
      "https://images.unsplash.com/photo-1500563853545-7a87626d2e61?w=1500&auto=format&fit=crop",
  },
];

export default function Sports() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    const loadSports = async () => {
      try {
        const data = await getSports();
        setSports(Array.isArray(data) ? data : []);
        setLoadFailed(false);
      } catch {
        setSports(fallbackSports);
        setLoadFailed(true);
      }
    };

    void loadSports();
  }, []);

  return (
    <div className="bg-[#0b0b0c] text-white">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">
          Sports
        </p>
        <h1 className="font-display text-4xl sm:text-5xl mt-4">
          Authority pages built on experience.
        </h1>
        <p className="mt-6 max-w-2xl text-white/70">
          Every sport has its own rhythm. We cover the details that make each
          discipline unique, and the visuals that show you understand it.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loadFailed ? (
            fallbackSports.map((sport) => (
              <Link
                key={sport.id || sport.slug}
                to={`/sports/${sport.slug}`}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-black/40"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={
                      sport.imageUrl ||
                      fallbackSports.find((item) => item.slug === sport.slug)
                        ?.imageUrl ||
                      fallbackSports[0].imageUrl
                    }
                    alt={sport.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                    {sport.title}
                  </p>
                  <h2 className="font-display text-2xl mt-3">
                    {sport.summary || "Performance-focused coverage."}
                  </h2>
                  <span className="mt-6 inline-block text-xs uppercase tracking-[0.3em] text-white/60 group-hover:text-white transition">
                    {"Explore ->"}
                  </span>
                </div>
              </Link>
            ))
          ) : sports.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-white/70">
              No sports have been added yet.
            </div>
          ) : (
            sports.map((sport) => (
              <Link
                key={sport.id || sport.slug}
                to={`/sports/${sport.slug}`}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-black/40"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={
                      sport.imageUrl ||
                      fallbackSports.find((item) => item.slug === sport.slug)
                        ?.imageUrl ||
                      fallbackSports[0].imageUrl
                    }
                    alt={sport.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                    {sport.title}
                  </p>
                  <h2 className="font-display text-2xl mt-3">
                    {sport.summary || "Performance-focused coverage."}
                  </h2>
                  <span className="mt-6 inline-block text-xs uppercase tracking-[0.3em] text-white/60 group-hover:text-white transition">
                    {"Explore ->"}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
