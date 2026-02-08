export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-sm text-gray-600">
          <p>&copy; {currentYear} Studio Storm. All rights reserved.</p>
          <p className="mt-2">
            <a href="https://instagram.com/studiostorm.sports" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition">
              @studiostorm.sports
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
