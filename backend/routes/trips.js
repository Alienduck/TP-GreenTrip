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

// GET /trips
router.get("/", (req, res) => {
  const data = loadData();
  res.json(data.trips);
});

// POST /trips
router.post("/", (req, res) => {
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

export default router;
