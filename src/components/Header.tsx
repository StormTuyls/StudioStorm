import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const { isAuthenticated, isClient, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 py-4">
          <Link
            to="/"
            className="text-lg sm:text-xl font-semibold tracking-[0.3em] uppercase text-white hover:text-white/80 transition"
          >
            Studio Storm
          </Link>

          <div className="flex flex-wrap items-center gap-6 text-xs tracking-[0.2em] uppercase">
            <Link
              to="/work"
              className="text-white/80 hover:text-white transition"
            >
              Work
            </Link>
            <Link
              to="/sports"
              className="text-white/80 hover:text-white transition"
            >
              Sports
            </Link>
            <Link
              to="/services"
              className="text-white/80 hover:text-white transition"
            >
              Services
            </Link>
            <Link
              to="/clients"
              className="text-white/80 hover:text-white transition"
            >
              Clients
            </Link>
            <Link
              to="/journal"
              className="text-white/80 hover:text-white transition"
            >
              Journal
            </Link>
            <Link
              to="/about"
              className="text-white/80 hover:text-white transition"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-white/80 hover:text-white transition"
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4 text-xs uppercase tracking-[0.2em]">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-white/70 hover:text-white transition"
                  >
                    Admin
                  </Link>
                )}
                {isClient && (
                  <Link
                    to="/client/galleries"
                    className="text-white/70 hover:text-white transition"
                  >
                    Client Access
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-white/50 hover:text-white transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/client/login"
                className="border border-white/20 px-3 py-2 text-white/70 hover:text-white hover:border-white/60 transition"
              >
                Client Access
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
