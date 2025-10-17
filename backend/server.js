import express from "express";
import fs from "fs";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
import authRoutes from "./routes/auth.js";
import tripsRoutes from "./routes/trips.js";
import bookingRoutes from "./routes/booking.js"; 

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use("/auth", authRoutes); 

const DATA_FILE = "./data/booking.json";

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
// Routes
app.use("/auth", authRoutes);
app.use("/trips", tripsRoutes);
app.use("/bookings", bookingRoutes);

app.get('/api', (req, res) => {
  res.send({ message: 'Bienvenue sur le backend GreenTrip 🌱' });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Backend démarré sur http://localhost:${PORT}`));
