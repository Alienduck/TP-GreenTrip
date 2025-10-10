const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = "./database/data.json";

// Charger les données JSON
function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ trips: [], bookings: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

// Sauvegarder les données JSON
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// --- API ---
// GET /trips → liste des trajets
app.get("/trips", (req, res) => {
  const data = loadData();
  res.json(data.trips);
});

// POST /trips → ajouter un trajet
app.post("/trips", (req, res) => {
  const data = loadData();
  const newTrip = {
    id: data.trips.length + 1,
    departure: req.body.departure,
    arrival: req.body.arrival,
    date: req.body.date,
    transport: req.body.transport,
    seats: req.body.seats,
  };
  data.trips.push(newTrip);
  saveData(data);
  res.json(newTrip);
});

// (Optionnel) POST /bookings → réserver un trajet
app.post("/bookings", (req, res) => {
  const data = loadData();
  const trip = data.trips.find((t) => t.id === req.body.trip_id);

  if (!trip) {
    return res.status(404).json({ error: "Trajet non trouvé" });
  }
  if (trip.seats <= 0) {
    return res.status(400).json({ error: "Plus de places disponibles" });
  }

  // Réservation
  const booking = {
    id: data.bookings.length + 1,
    trip_id: req.body.trip_id,
    passenger_name: req.body.passenger_name,
  };
  data.bookings.push(booking);

  // Mise à jour des places
  trip.seats -= 1;

  saveData(data);
  res.json(booking);
});

// Lancement du serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 GreenTrip API (JSON) sur http://localhost:${PORT}`);
});
