export default function FAQ() {
  return (
    <div className="bg-[#0b0b0c] text-white">
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">FAQ</p>
        <h1 className="font-display text-4xl sm:text-5xl mt-4">
          Answers to common questions.
        </h1>
        <div className="mt-10 space-y-6 text-white/70">
          <div>
            <p className="text-white">How do event galleries work?</p>
            <p className="mt-2">
              Event galleries are shared directly with clubs and athletes via
              private links.
            </p>
          </div>
          <div>
            <p className="text-white">When will images be delivered?</p>
            <p className="mt-2">
              Delivery depends on the service, typically between 48 hours and 7
              business days.
            </p>
          </div>
          <div>
            <p className="text-white">Can clubs request custom usage?</p>
            <p className="mt-2">
              Yes. We tailor usage rights for club, sponsor, and media needs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
