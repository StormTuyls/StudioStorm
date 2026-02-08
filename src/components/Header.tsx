import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold tracking-wide text-gray-900 hover:text-gray-600 transition">
            STUDIO STORM
          </Link>
          
          <div className="flex space-x-8">
            <Link to="/" className="text-sm text-gray-700 hover:text-gray-900 transition">
              Home
            </Link>
            <Link to="/gallery" className="text-sm text-gray-700 hover:text-gray-900 transition">
              Gallery
            </Link>
            <Link to="/albums" className="text-sm text-gray-700 hover:text-gray-900 transition">
              Albums
            </Link>
            <Link to="/about" className="text-sm text-gray-700 hover:text-gray-900 transition">
              Over Ons
            </Link>
            <Link to="/contact" className="text-sm text-gray-700 hover:text-gray-900 transition">
              Contact
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
