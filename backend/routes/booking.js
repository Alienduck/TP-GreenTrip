import express from "express";
import fs from "fs";
const router = express.Router();
const DATA_FILE = "./data/booking.json";

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ trips: [], bookings: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// POST /bookings
router.post("/", (req, res) => {
  const data = loadData();
  const trip = data.trips.find((t) => t.id === req.body.trip_id);

  if (!trip) return res.status(404).json({ error: "Trajet non trouvé" });
  if (trip.seats <= 0) return res.status(400).json({ error: "Plus de places disponibles" });

  const booking = {
    id: data.bookings.length + 1,
    trip_id: req.body.trip_id,
    passenger_name: req.body.passenger_name,
  };
  data.bookings.push(booking);
  trip.seats -= 1;

  saveData(data);
  res.json(booking);
});

export default router;
