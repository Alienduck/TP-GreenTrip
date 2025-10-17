import React, { useEffect, useState } from "react";
import { fetchTrips, createTrip, getAuthHeader, bookTrip, fetchMyBookings } from "../services/api";

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [form, setForm] = useState({ departure: "", arrival: "", date: "", transport: "", seats: 1 });
  const [loading, setLoading] = useState(false);

  // reservation UI state
  const [reservingTripId, setReservingTripId] = useState(null);
  const [reserveSeats, setReserveSeats] = useState(1);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    load();
    loadBookings();
  }, []);

  async function load() {
    const data = await fetchTrips();
    setTrips(data || []);
  }

  async function loadBookings() {
    const auth = getAuthHeader();
    if (!auth.Authorization) return setBookings([]);
    try {
      const b = await fetchMyBookings();
      setBookings(Array.isArray(b) ? b : []);
    } catch {
      setBookings([]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, seats: Number(form.seats) };
      const newTrip = await createTrip(payload);
      if (newTrip.error) {
        if (newTrip.error === "Not authenticated") return alert("Veuillez vous connecter");
        return alert(newTrip.error);
      }
      setTrips(prev => [...prev, newTrip]);
      setForm({ departure: "", arrival: "", date: "", transport: "", seats: 1 });
    } catch {
      alert("Erreur lors de la création du trajet");
    } finally {
      setLoading(false);
    }
  }

  async function handleBook(tripId) {
    const auth = getAuthHeader();
    if (!auth.Authorization) {
      return alert("Veuillez vous connecter pour réserver.");
    }
    if (!reserveSeats || reserveSeats < 1) return alert("Nombre de places invalide");
    try {
      const res = await bookTrip(tripId, Number(reserveSeats));
      if (res.error) {
        if (res.error === "Not authenticated") {
          alert("Session expirée — reconnectez-vous");
          localStorage.removeItem("auth");
          return;
        }
        return alert(res.error);
      }
      alert("Réservation confirmée");
      // optionnel : mettre à jour la liste des bookings et des trips (si backend renvoie mise à jour)
      load(); // refresh trips
      loadBookings();
      setReservingTripId(null);
      setReserveSeats(1);
    } catch {
      alert("Erreur lors de la réservation");
    }
  }

  const auth = getAuthHeader();

  return (
    <div>
      <h2>Publier un trajet</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input placeholder="Départ" value={form.departure} onChange={e => setForm({ ...form, departure: e.target.value })} />
        <input placeholder="Arrivée" value={form.arrival} onChange={e => setForm({ ...form, arrival: e.target.value })} />
        <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
        <input placeholder="Transport" value={form.transport} onChange={e => setForm({ ...form, transport: e.target.value })} />
        <input type="number" min="1" value={form.seats} onChange={e => setForm({ ...form, seats: e.target.value })} />
        <button type="submit" disabled={loading}>{loading ? "..." : "Publier"}</button>
        {!auth.Authorization && <div style={{ color: "crimson" }}>Non connecté — le trajet sera refusé si le serveur exige une auth</div>}
      </form>

      <h2 style={{ marginTop: 20 }}>Trajets disponibles</h2>
      <ul>
        {trips.map(t => (
          <li key={t.id} style={{ marginBottom: 12 }}>
            <div>
              <strong>{t.departure} → {t.arrival}</strong> ({t.date}) [{t.transport}] - {t.seats} places
            </div>
            <div style={{ marginTop: 6 }}>
              <button onClick={() => { setReservingTripId(reservingTripId === t.id ? null : t.id); setReserveSeats(1); }}>
                {reservingTripId === t.id ? "Annuler" : "Réserver"}
              </button>
            </div>

            {reservingTripId === t.id && (
              <div style={{ marginTop: 8 }}>
                <label>
                  Places à réserver:
                  <input type="number" min="1" value={reserveSeats} onChange={e => setReserveSeats(e.target.value)} style={{ marginLeft: 8, width: 60 }} />
                </label>
                <button onClick={() => handleBook(t.id)} style={{ marginLeft: 8 }}>Confirmer la réservation</button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <h2 style={{ marginTop: 20 }}>Mes réservations</h2>
      {bookings.length === 0 ? (
        <div>Aucune réservation</div>
      ) : (
        <ul>
          {bookings.map(b => (
            <li key={b.id}>{b.trip?.departure} → {b.trip?.arrival} ({b.trip?.date}) - {b.seats} place(s)</li>
          ))}
        </ul>
      )}
    </div>
  );
}