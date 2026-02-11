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
    <header className="bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-2xl font-bold tracking-wide text-gray-900 hover:text-gray-600 transition"
          >
            STUDIO STORM
          </Link>

          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-sm text-gray-700 hover:text-gray-900 transition"
            >
              Home
            </Link>
            <Link
              to="/gallery"
              className="text-sm text-gray-700 hover:text-gray-900 transition"
            >
              Gallery
            </Link>
            <Link
              to="/albums"
              className="text-sm text-gray-700 hover:text-gray-900 transition"
            >
              Albums
            </Link>
            <Link
              to="/about"
              className="text-sm text-gray-700 hover:text-gray-900 transition"
            >
              Over Ons
            </Link>
            <Link
              to="/contact"
              className="text-sm text-gray-700 hover:text-gray-900 transition"
            >
              Contact
            </Link>

            {/* Auth Section */}
            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="text-sm font-medium text-purple-600 hover:text-purple-700 transition"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {isClient && (
                    <Link
                      to="/client/galleries"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
                    >
                      Mijn Galerijen
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-600 hover:text-gray-900 transition"
                  >
                    Uitloggen
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/client/login"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
                  >
                    Client Login
                  </Link>
                  <Link
                    to="/admin/login"
                    className="text-sm font-medium text-purple-600 hover:text-purple-700 transition"
                  >
                    Admin
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
