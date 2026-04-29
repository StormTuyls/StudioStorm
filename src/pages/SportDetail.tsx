import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getEvents, getSports } from "../api";
import type { Event, Sport } from "../types";

const mapSportKey = (slug: string) => {
  if (slug === "atletiek") return "athletics";
  if (slug === "volleybal") return "volleyball";
  return slug;
};

export default function SportDetail() {
  const { sport } = useParams();
  const [sports, setSports] = useState<Sport[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [sportsData, eventsData] = await Promise.all([
          getSports(),
          getEvents(),
        ]);
        setSports(sportsData);
        setEvents(eventsData);
      } catch {
        setSports([]);
        setEvents([]);
      }
    };

    void loadData();
  }, []);

  const content = useMemo(() => {
    if (!sport) return null;
    return sports.find((entry) => entry.slug === sport) || null;
  }, [sport, sports]);

  const eventNames = useMemo(() => {
    if (!sport) return [];
    const sportKey = mapSportKey(sport);
    return events
      .filter((event) => event.sport === sportKey && event.parentId)
      .map((event) => event.name);
  }, [events, sport]);

  if (!content) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 text-white">
        <h1 className="font-display text-3xl">Sport not found</h1>
        <p className="mt-4 text-white/70">
          The page you are looking for is not available.
        </p>
        <Link to="/sports" className="mt-6 inline-block text-white/60">
          Back to Sports
        </Link>
      </div>
    );
  }

  const experience =
    content.summary ||
    "Studio Storm builds authority coverage with crisp, performance-first storytelling.";
  const difference =
    "Each sport needs a dedicated rhythm, clean framing, and decisive timing to feel premium.";
  const heroImage =
    content.imageUrl ||
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1600&auto=format&fit=crop";
  const eventsCovered =
    eventNames.length > 0
      ? eventNames
      : ["Signature events", "Club showcases", "Key competitions"];

  return (
    <div className="bg-[#0b0b0c] text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt={content.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#0b0b0c]" />
        </div>
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-24">
          <Link
            to="/sports"
            className="text-xs uppercase tracking-[0.3em] text-white/60"
          >
            {"<- Sports"}
          </Link>
          <h1 className="font-display text-4xl sm:text-5xl mt-6">
            {content.title}
          </h1>
          <p className="mt-4 max-w-2xl text-white/75">{experience}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-black/40 p-8">
            <h2 className="text-xs uppercase tracking-[0.3em] text-white/50">
              Events Covered
            </h2>
            <ul className="mt-6 space-y-3 text-white/70 list-disc list-inside">
              {eventsCovered.map((event) => (
                <li key={event}>{event}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/40 p-8">
            <h2 className="text-xs uppercase tracking-[0.3em] text-white/50">
              Why It Is Different
            </h2>
            <p className="mt-6 text-white/70">{difference}</p>
          </div>
        </div>
        <div className="mt-12">
          <Link
            to="/contact"
            className="bg-[#f0c987] text-black px-6 py-3 text-xs uppercase tracking-[0.3em] hover:bg-[#d8b77a] transition"
          >
            Contact
          </Link>
        </div>
      </section>
    </div>
  );
}
