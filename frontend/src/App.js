import React, { useState, useEffect } from "react";

export default function App() {
  const [trips, setTrips] = useState([]);
  const [form, setForm] = useState({ departure: "", arrival: "", date: "", transport: "", seats: 1 });
  const [bookingName, setBookingName] = useState("");

  // Charger les trajets
  useEffect(() => {
    fetch("http://localhost:3000/trips")
      .then((res) => res.json())
      .then((data) => setTrips(data));
  }, []);

  // Ajouter un trajet
  const addTrip = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((newTrip) => setTrips([...trips, newTrip]));
  };

  // Réserver un trajet
  const bookTrip = (tripId) => {
    if (!bookingName) {
      alert("Veuillez entrer votre nom avant de réserver !");
      return;
    }
    fetch("http://localhost:3000/bookings", {
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
          // Recharger les trajets pour mettre à jour les places restantes
          fetch("http://localhost:3000/trips")
            .then((res) => res.json())
            .then((data) => setTrips(data));
        }
      });
  };

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">🌱 GreenTrip</h1>

      {/* Formulaire de création de trajet */}
      <form onSubmit={addTrip} className="mb-6 space-y-2">
        <input type="text" placeholder="Départ" className="border p-2"
          onChange={(e) => setForm({ ...form, departure: e.target.value })} />
        <input type="text" placeholder="Arrivée" className="border p-2"
          onChange={(e) => setForm({ ...form, arrival: e.target.value })} />
        <input type="date" className="border p-2"
          onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <input type="text" placeholder="Transport" className="border p-2"
          onChange={(e) => setForm({ ...form, transport: e.target.value })} />
        <input type="number" min="1" className="border p-2"
          onChange={(e) => setForm({ ...form, seats: e.target.value })} />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Publier
        </button>
      </form>

      {/* Champ nom pour les réservations */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Votre nom pour réserver"
          className="border p-2"
          value={bookingName}
          onChange={(e) => setBookingName(e.target.value)}
        />
      </div>

      {/* Liste des trajets avec bouton réserver */}
      <h2 className="text-xl font-semibold">🚗 Trajets disponibles</h2>
      <ul className="mt-2">
        {trips.map((t) => (
          <li key={t.id} className="border-b py-2 flex items-center justify-between">
            <span>
              {t.departure} → {t.arrival} ({t.date}) [{t.transport}] - {t.seats} places
            </span>
            <button
              onClick={() => bookTrip(t.id)}
              className="ml-4 bg-blue-500 text-white px-3 py-1 rounded"
            >
              Réserver
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}