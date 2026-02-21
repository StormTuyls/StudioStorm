import { Link, useParams } from "react-router-dom";

export default function EventsDetail() {
  const { year, slug } = useParams();
  const title = slug ? slug.replace(/-/g, " ") : "Event";

  return (
    <div className="bg-[#0b0b0c] text-white">
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20">
        <Link
          to="/events"
          className="text-xs uppercase tracking-[0.3em] text-white/60"
        >
          {"<- Event Galleries"}
        </Link>
        <h1 className="font-display text-4xl sm:text-5xl mt-6">
          {year} - {title}
        </h1>
        <p className="mt-6 text-white/70">
          This gallery is available to invited clients via direct link. If you
          do not have access, contact us and we will connect you with the event
          organizer.
        </p>
        <Link
          to="/contact"
          className="mt-10 inline-block bg-[#f0c987] text-black px-6 py-3 text-xs uppercase tracking-[0.3em] hover:bg-[#d8b77a] transition"
        >
          Request Access
        </Link>
      </section>
    </div>
  );
}
