import { Link, useParams } from "react-router-dom";

const sportContent: Record<
  string,
  {
    title: string;
    experience: string;
    events: string[];
    difference: string;
    cta: string;
    image: string;
  }
> = {
  atletiek: {
    title: "Atletiek",
    experience:
      "Studio Storm is athletics-first, covering national championships, club meets, and track series across the Benelux.",
    events: ["BK Veldlopen", "Clubkampioenschappen", "Regional track meets"],
    difference:
      "Athletics is about micro-moments: the breathing, the drive phase, the finish-line release. We prioritize sharp timing and clean composition.",
    cta: "Book Coverage",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1600&auto=format&fit=crop",
  },
  volleybal: {
    title: "Volleybal",
    experience:
      "We document league matches, finals, and media days with an emphasis on height, reaction, and team energy.",
    events: ["National finals", "Club showcases", "Media days"],
    difference:
      "Volleyball needs elevation and rhythm. Our edits capture the verticality and the clean geometry of the court.",
    cta: "Contact",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1600&auto=format&fit=crop",
  },
  "jiu-jitsu": {
    title: "Jiu-Jitsu",
    experience:
      "From open mats to tournaments, we capture grip fights, detail, and the human story inside each exchange.",
    events: ["Invitational events", "Academy showcases", "Championship rounds"],
    difference:
      "Jiu-jitsu is close-range and emotional. We shoot in tight, keeping texture and expression without losing the flow of the match.",
    cta: "Contact",
    image:
      "https://images.unsplash.com/photo-1500563853545-7a87626d2e61?w=1600&auto=format&fit=crop",
  },
};

export default function SportDetail() {
  const { sport } = useParams();
  const content = sport ? sportContent[sport] : null;

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

  return (
    <div className="bg-[#0b0b0c] text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={content.image}
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
          <p className="mt-4 max-w-2xl text-white/75">{content.experience}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-black/40 p-8">
            <h2 className="text-xs uppercase tracking-[0.3em] text-white/50">
              Events Covered
            </h2>
            <ul className="mt-6 space-y-3 text-white/70 list-disc list-inside">
              {content.events.map((event) => (
                <li key={event}>{event}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/40 p-8">
            <h2 className="text-xs uppercase tracking-[0.3em] text-white/50">
              Why It Is Different
            </h2>
            <p className="mt-6 text-white/70">{content.difference}</p>
          </div>
        </div>
        <div className="mt-12">
          <Link
            to="/contact"
            className="bg-[#f0c987] text-black px-6 py-3 text-xs uppercase tracking-[0.3em] hover:bg-[#d8b77a] transition"
          >
            {content.cta}
          </Link>
        </div>
      </section>
    </div>
  );
}
