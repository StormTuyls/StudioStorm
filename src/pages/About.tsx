import { useEffect, useState } from "react";
import { getAboutContent } from "../api";

interface AboutContent {
  title: string;
  image: string;
  paragraphs: string[];
  specializations: Array<{
    name: string;
    subtitle: string;
    description: string;
  }>;
  contactText: string;
  contactLinkText: string;
  contactLinkUrl: string;
  contactSuffix: string;
}

const fallbackContent: AboutContent = {
  title: "Studio Storm is built on athletics-first storytelling.",
  image:
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&auto=format&fit=crop",
  paragraphs: [
    "We focus on the edge of performance: the calm before the gun, the drive phase, the finish, and the moments in between. Our work is trusted by clubs and media partners who want clarity and prestige without the noise.",
    "With a primary focus on athletics, and additional coverage in volleyball and jiu-jitsu, we create imagery that feels editorial and timeless while staying true to the sport.",
    "Studio Storm partners with Atletieknieuws, Agones Media, Runnerslab Athletics Team, and VAL, delivering consistent coverage across seasons.",
  ],
  specializations: [
    {
      name: "Focus",
      subtitle: "Athletics-first.",
      description: "Speed, precision, and the emotional finish.",
    },
    {
      name: "Style",
      subtitle: "Clean and cinematic.",
      description: "Minimal UI, strong typography, and generous spacing.",
    },
    {
      name: "Delivery",
      subtitle: "Fast, curated edits.",
      description: "Organized and ready for media or sponsors.",
    },
  ],
  contactText: "Interesse in sportfotografie? Neem contact op via",
  contactLinkText: "@studiostorm.sports",
  contactLinkUrl: "https://instagram.com/studiostorm.sports",
  contactSuffix: "op Instagram of via ons contactformulier.",
};

export default function About() {
  const [content, setContent] = useState<AboutContent>(fallbackContent);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getAboutContent();
        setContent({
          title: data.title || fallbackContent.title,
          image: data.image || fallbackContent.image,
          paragraphs: data.paragraphs?.length
            ? data.paragraphs
            : fallbackContent.paragraphs,
          specializations: data.specializations?.length
            ? data.specializations
            : fallbackContent.specializations,
          contactText: data.contactText || fallbackContent.contactText,
          contactLinkText:
            data.contactLinkText || fallbackContent.contactLinkText,
          contactLinkUrl: data.contactLinkUrl || fallbackContent.contactLinkUrl,
          contactSuffix: data.contactSuffix || fallbackContent.contactSuffix,
        });
      } catch {
        setContent(fallbackContent);
      }
    };

    void loadContent();
  }, []);

  const contactLine =
    `${content.contactText} ${content.contactLinkText} ${content.contactSuffix}`.trim();

  return (
    <div className="bg-[#0b0b0c] text-white">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">
          About
        </p>
        <h1 className="font-display text-4xl sm:text-5xl mt-4">
          {content.title}
        </h1>
        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_1.2fr]">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/40">
            <img
              src={content.image}
              alt="Studio Storm"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-6 text-white/70">
            {content.paragraphs.map((paragraph, index) => (
              <p key={`${paragraph}-${index}`}>{paragraph}</p>
            ))}
            {content.contactLinkUrl && content.contactLinkText && (
              <p>
                {content.contactText}{" "}
                <a
                  href={content.contactLinkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#f0c987] hover:text-[#d8b77a]"
                >
                  {content.contactLinkText}
                </a>{" "}
                {content.contactSuffix}
              </p>
            )}
            {!content.contactLinkUrl && contactLine && <p>{contactLine}</p>}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {content.specializations.map((spec, index) => (
            <div
              key={`${spec.name}-${index}`}
              className="rounded-2xl border border-white/10 bg-black/40 p-6"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                {spec.name}
              </p>
              <p className="font-display text-2xl mt-4">{spec.subtitle}</p>
              <p className="mt-3 text-white/70">{spec.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
