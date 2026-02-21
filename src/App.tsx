import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Work from "./pages/Work";
import WorkSport from "./pages/WorkSport";
import Sports from "./pages/Sports";
import SportDetail from "./pages/SportDetail";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Clients from "./pages/Clients";
import Journal from "./pages/Journal";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Events from "./pages/Events";
import EventsDetail from "./pages/EventsDetail";
import FAQ from "./pages/FAQ";
import Privacy from "./pages/Privacy";
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
              <div className="min-h-screen flex flex-col bg-[#0b0b0c] text-white">
                <Header />
                <main className="grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/work" element={<Work />} />
                    <Route path="/work/:sport" element={<WorkSport />} />
                    <Route path="/sports" element={<Sports />} />
                    <Route path="/sports/:sport" element={<SportDetail />} />
                    <Route path="/services" element={<Services />} />
                    <Route
                      path="/services/:service"
                      element={<ServiceDetail />}
                    />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/journal" element={<Journal />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/events" element={<Events />} />
                    <Route
                      path="/events/:year/:slug"
                      element={<EventsDetail />}
                    />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/privacy" element={<Privacy />} />
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
