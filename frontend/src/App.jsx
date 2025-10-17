// frontend/src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./components/Home";
import Connexion from "./components/connexion";
import Inscription from "./components/inscription";
import Profile from "./components/profile";

// Composant NavBar
function NavBar() {
  const location = useLocation();
  
  return (
    <nav className="bg-green-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-7">
            <Link to="/" className="flex items-center">
              <span className="text-white text-2xl font-semibold">🌱 GreenTrip</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/trips" 
                className={`py-4 px-2 ${location.pathname === '/trips' ? 
                  'text-white border-b-4 border-white font-semibold' : 
                  'text-green-100 hover:text-white transition duration-300'}`}>
                Trajets
              </Link>
              <Link to="/profile" 
                className={`py-4 px-2 ${location.pathname === '/profile' ? 
                  'text-white border-b-4 border-white font-semibold' : 
                  'text-green-100 hover:text-white transition duration-300'}`}>
                Profil
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/login" 
              className="py-2 px-4 bg-white text-green-600 rounded-lg hover:bg-green-50 transition duration-300">
              Connexion
            </Link>
            <Link to="/register" 
              className="py-2 px-4 bg-green-700 text-white rounded-lg hover:bg-green-800 transition duration-300">
              Inscription
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function TripsList() {
  const [trips, setTrips] = useState([]);
  const [form, setForm] = useState({ departure: "", arrival: "", date: "", transport: "", seats: 1 });
  const [bookingName, setBookingName] = useState("");

  // Charger les trajets
  useEffect(() => {
    fetch("http://localhost:5000/trips") // Changé le port à 5000
      .then((res) => res.json())
      .then((data) => setTrips(data))
      .catch(err => console.error("Erreur lors du chargement des trajets:", err));
  }, []);

  // Ajouter un trajet
  const addTrip = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/trips", { // Changé le port à 5000
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((newTrip) => setTrips([...trips, newTrip]))
      .catch(err => console.error("Erreur lors de l'ajout du trajet:", err));
  };

  // Réserver un trajet
  const bookTrip = (tripId) => {
    if (!bookingName) {
      alert("Veuillez entrer votre nom avant de réserver !");
      return;
    }
    fetch("http://localhost:5000/bookings", { // Changé le port à 5000
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trip_id: tripId, passenger_name: bookingName }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert("❌ " + data.error);
        } else {
          alert("✅ Réservation confirmée pour " + bookingName);
          // Recharger les trajets
          fetch("http://localhost:5000/trips")
            .then((res) => res.json())
            .then((data) => setTrips(data));
        }
      })
      .catch(err => console.error("Erreur lors de la réservation:", err));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-6">Publier un trajet</h2>
          <form onSubmit={addTrip} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input 
              type="text" 
              placeholder="Départ" 
              className="rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
              onChange={(e) => setForm({ ...form, departure: e.target.value })} 
            />
            <input 
              type="text" 
              placeholder="Arrivée" 
              className="rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
              onChange={(e) => setForm({ ...form, arrival: e.target.value })} 
            />
            <input 
              type="date" 
              className="rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
              onChange={(e) => setForm({ ...form, date: e.target.value })} 
            />
            <input 
              type="text" 
              placeholder="Transport" 
              className="rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
              onChange={(e) => setForm({ ...form, transport: e.target.value })} 
            />
            <input 
              type="number" 
              min="1" 
              placeholder="Nombre de places"
              className="rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
              onChange={(e) => setForm({ ...form, seats: e.target.value })} 
            />
            <button 
              type="submit" 
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-300">
              Publier
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">🚗 Trajets disponibles</h2>
            <input
              type="text"
              placeholder="Votre nom pour réserver"
              className="rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
              value={bookingName}
              onChange={(e) => setBookingName(e.target.value)}
            />
          </div>
          
          <div className="grid gap-4">
            {trips.map((t) => (
              <div key={t.id} className="border rounded-lg p-4 hover:shadow-md transition duration-300">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="text-lg font-semibold">
                      {t.departure} → {t.arrival}
                    </div>
                    <div className="text-gray-600">
                      📅 {t.date} | 🚗 {t.transport} | 👥 {t.seats} places
                    </div>
                  </div>
                  <button
                    onClick={() => bookTrip(t.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                  >
                    Réserver
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trips" element={<TripsList />} />
          <Route path="/login" element={<Connexion />} />
          <Route path="/register" element={<Inscription />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}
