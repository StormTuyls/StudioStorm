import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 bg-black/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-white/70">
              Studio Storm
            </p>
            <p className="text-xs text-white/50 mt-2">
              &copy; {currentYear} Studio Storm. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 text-xs uppercase tracking-[0.2em] text-white/60">
            <Link to="/faq" className="hover:text-white transition">
              FAQ
            </Link>
            <Link to="/events" className="hover:text-white transition">
              Event Galleries
            </Link>
            <a
              href="https://instagram.com/studiostorm.sports"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              Instagram
            </a>
            <Link to="/privacy" className="hover:text-white transition">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
