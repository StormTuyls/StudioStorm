import { useState } from "react";
import type { FormEvent } from "react";
import { submitContactForm } from "../api";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    service: "private-athlete",
    eventDate: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await submitContactForm(formData);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        organization: "",
        service: "private-athlete",
        eventDate: "",
        message: "",
      });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-[#0b0b0c] text-white">
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">
          Contact
        </p>
        <h1 className="font-display text-4xl sm:text-5xl mt-4">
          Request availability for your next event.
        </h1>
        <p className="mt-6 text-white/70">
          Share the essentials and we will respond with a tailored proposal and
          timeline.
        </p>

        {submitted && (
          <div className="mt-8 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-4 text-emerald-200">
            Thanks for reaching out. We will respond shortly.
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-10 grid gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="block text-xs uppercase tracking-[0.3em] text-white/60 mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:border-white/40 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-xs uppercase tracking-[0.3em] text-white/60 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:border-white/40 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="organization"
                className="block text-xs uppercase tracking-[0.3em] text-white/60 mb-2"
              >
                Organization
              </label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:border-white/40 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="service"
                className="block text-xs uppercase tracking-[0.3em] text-white/60 mb-2"
              >
                Service
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:border-white/40 focus:outline-none"
              >
                <option value="private-athlete">Private Athlete</option>
                <option value="team-media-day">Team Media Day</option>
                <option value="competition-coverage">
                  Competition Coverage
                </option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="eventDate"
              className="block text-xs uppercase tracking-[0.3em] text-white/60 mb-2"
            >
              Event Date
            </label>
            <input
              type="date"
              id="eventDate"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:border-white/40 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-xs uppercase tracking-[0.3em] text-white/60 mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              value={formData.message}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:border-white/40 focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#f0c987] text-black px-6 py-4 text-xs uppercase tracking-[0.3em] hover:bg-[#d8b77a] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Request Availability"}
          </button>
        </form>
      </section>
    </div>
  );
}
