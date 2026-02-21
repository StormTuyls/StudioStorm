import { Link, useParams } from "react-router-dom";

const workSportContent: Record<
  string,
  {
    title: string;
    description: string;
    images: string[];
  }
> = {
  atletiek: {
    title: "Atletiek",
    description:
      "From explosive starts to finish line emotion, athletics demands precision and timing.",
    images: [
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502904550040-7534597429ae?w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1600&auto=format&fit=crop",
    ],
  },
  volleybal: {
    title: "Volleybal",
    description:
      "Vertical movement, split-second reactions, and the energy between points.",
    images: [
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1600&auto=format&fit=crop",
    ],
  },
  "jiu-jitsu": {
    title: "Jiu-Jitsu",
    description:
      "Controlled chaos and close-range tension captured without losing the human story.",
    images: [
      "https://images.unsplash.com/photo-1500563853545-7a87626d2e61?w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544717302-de2939b7efcb?w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502904550040-7534597429ae?w=1600&auto=format&fit=crop",
    ],
  },
};

export default function WorkSport() {
  const { sport } = useParams();
  const content = sport ? workSportContent[sport] : null;

  if (!content) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 text-white">
        <h1 className="font-display text-3xl">Work not found</h1>
        <p className="mt-4 text-white/70">
          The gallery you are looking for is not available.
        </p>
        <Link to="/work" className="mt-6 inline-block text-white/60">
          Back to Work
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0b0b0c] text-white">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <Link
          to="/work"
          className="text-xs uppercase tracking-[0.3em] text-white/50"
        >
          {"<- Back to Work"}
        </Link>
        <h1 className="font-display text-4xl sm:text-5xl mt-6">
          {content.title}
        </h1>
        <p className="mt-4 max-w-2xl text-white/70">{content.description}</p>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.images.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="overflow-hidden rounded-2xl bg-black/40"
            >
              <img
                src={src}
                alt={content.title}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
