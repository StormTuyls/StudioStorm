import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import PhotoDetail from "./pages/PhotoDetail";
import Albums from "./pages/Albums";
import AlbumDetail from "./pages/AlbumDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ClientRegister from "./pages/ClientRegister";
import ClientLogin from "./pages/ClientLogin";
import ClientDashboard from "./pages/ClientDashboard";
import ClientGalleryView from "./pages/ClientGalleryView";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Admin Routes (no header/footer) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Client Auth Routes (no header/footer) */}
          <Route path="/client/register" element={<ClientRegister />} />
          <Route path="/client/login" element={<ClientLogin />} />
          <Route path="/client/galleries" element={<ClientDashboard />} />

          {/* Client Gallery (no header/footer) */}
          <Route path="/gallery/:uniqueUrl" element={<ClientGalleryView />} />

          {/* Public Routes (with header/footer) */}
          <Route
            path="/*"
            element={
              <div className="min-h-screen flex flex-col bg-gray-50">
                <Header />
                <main className="grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/photo/:id" element={<PhotoDetail />} />
                    <Route path="/albums" element={<Albums />} />
                    <Route path="/albums/*" element={<AlbumDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
