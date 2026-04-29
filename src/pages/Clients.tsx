import { useEffect, useMemo, useState } from "react";
import { getClients } from "../api";
import type { Client } from "../types";

const fallbackStats = [
  { label: "Events covered", value: "120+" },
  { label: "Athletes photographed", value: "1,800+" },
  { label: "Average delivery", value: "72 hrs" },
];

const testimonials = [
  {
    name: "Runnerslab Athletics Team",
    quote:
      "Studio Storm delivers race-day focus with editorial polish. Our sponsors love the consistency.",
  },
  {
    name: "Agones Media",
    quote:
      "Reliable, fast, and always on the right moment. A partner we trust at major meets.",
  },
];

const fallbackEvents = [
  "BK Veldlopen",
  "National Track Finals",
  "Club Championships",
  "University Opens",
];

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await getClients();
        setClients(data);
        setLoadFailed(false);
      } catch {
        setClients([]);
        setLoadFailed(true);
      }
    };

    void loadClients();
  }, []);

  const stats = useMemo(() => {
    if (loadFailed) return fallbackStats;

    const eventsCovered = clients.reduce(
      (sum, client) => sum + (client.eventsCovered || 0),
      0,
    );
    const totalRevenue = clients.reduce(
      (sum, client) => sum + (client.totalRevenue || 0),
      0,
    );

    return [
      { label: "Clients", value: clients.length.toString() },
      { label: "Events covered", value: eventsCovered.toString() },
      {
        label: "Revenue tracked",
        value: totalRevenue > 0 ? `${totalRevenue}+` : "-",
      },
    ];
  }, [clients]);

  const clientGroups = useMemo(() => {
    if (loadFailed) {
      return {
        organizations: [
          "Atletieknieuws",
          "Agones Media",
          "Runnerslab Athletics Team",
          "VAL",
          "Regional Clubs",
        ],
        athletes: ["Elite Athletes"],
      };
    }

    const organizations = clients
      .filter((client) => client.clientType !== "athlete")
      .map((client) => client.name);
    const athletes = clients
      .filter((client) => client.clientType === "athlete")
      .map((client) => client.name);

    return { organizations, athletes };
  }, [clients, loadFailed]);

  const events = loadFailed
    ? []
    : clients
        .map((client) => client.notes)
        .filter((note): note is string => Boolean(note));

  return (
    <div className="bg-[#0b0b0c] text-white">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">
          Clients
        </p>
        <h1 className="font-display text-4xl sm:text-5xl mt-4">
          Trusted by clubs, federations, and athletes.
        </h1>
        <p className="mt-6 max-w-2xl text-white/70">
          We help organizations present sport with clarity and authority, from
          broadcast-ready imagery to sponsor-ready galleries.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-black/40 p-6"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                {stat.label}
              </p>
              <p className="font-display text-3xl mt-4">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="space-y-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50 mb-4">
              Organizations
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs uppercase tracking-[0.2em] text-white/70">
              {clientGroups.organizations.map((client) => (
                <div
                  key={client}
                  className="rounded-full border border-white/15 px-4 py-3 text-center"
                >
                  {client}
                </div>
              ))}
              {clientGroups.organizations.length === 0 && (
                <div className="rounded-full border border-white/15 px-4 py-3 text-center">
                  No organizations listed yet.
                </div>
              )}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50 mb-4">
              Athletes
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs uppercase tracking-[0.2em] text-white/70">
              {clientGroups.athletes.map((client) => (
                <div
                  key={client}
                  className="rounded-full border border-white/15 px-4 py-3 text-center"
                >
                  {client}
                </div>
              ))}
              {clientGroups.athletes.length === 0 && (
                <div className="rounded-full border border-white/15 px-4 py-3 text-center">
                  No athletes listed yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="rounded-3xl border border-white/10 bg-black/40 p-8"
            >
              <p className="text-white/70">"{item.quote}"</p>
              <p className="mt-6 text-xs uppercase tracking-[0.3em] text-white/50">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="rounded-3xl border border-white/10 bg-black/40 p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Major Events
          </p>
          <ul className="mt-6 grid gap-3 text-white/70 list-disc list-inside">
            {(events.length > 0 ? events : fallbackEvents).map((event) => (
              <li key={event}>{event}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
