const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto"); 

const app = express();
app.use(cors());
app.use(bodyParser.json());
 
const DATA_FILE = "./database/data.json";
 
// Charger les données JSON
function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify({ trips: [], bookings: [], users: [] }, null, 2)
    );
  }
  return JSON.parse(fs.readFileSync(DATA_FILE));
}
 
// Sauvegarder les données JSON
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}
 
// --- Helper functions (changed code) ---
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}
function verifyPassword(password, salt, hash) {
  const computed = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(computed, "hex"), Buffer.from(hash, "hex"));
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
 
// --- Auth routes (sans token) ---
// POST /register { email, password, name? }
app.post("/register", (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: "email et password requis" });
  const data = loadData();
  if (data.users.find((u) => u.email === email)) {
    return res.status(400).json({ error: "Email déjà utilisé" });
  }
  const { salt, hash } = hashPassword(password);
  const user = {
    id: data.users.length + 1,
    email,
    name: name || null,
    salt,
    hash,
    createdAt: Date.now(),
  };
  data.users.push(user);
  saveData(data);
  // Ne pas renvoyer salt/hash
  const { salt: _, hash: __, ...safeUser } = user;
  res.json(safeUser);
});
 
// POST /login { email, password } -> { user }
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "email et password requis" });
  const data = loadData();
  const user = data.users.find((u) => u.email === email);
  if (!user) return res.status(400).json({ error: "Identifiants invalides" });
  if (!verifyPassword(password, user.salt, user.hash)) {
    return res.status(400).json({ error: "Identifiants invalides" });
  }
  const { salt: _, hash: __, ...safeUser } = user;
  // Retourne les données utilisateur (sans token)
  res.json({ user: safeUser });
});
 
// Middleware d'authentification via Basic Auth (Authorization: Basic base64(email:password))
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Basic ")) return res.status(401).json({ error: "Auth Basic requise" });
  const b64 = auth.slice(6);
  let decoded;
  try {
    decoded = Buffer.from(b64, "base64").toString();
  } catch (e) {
    return res.status(400).json({ error: "Basic auth invalide" });
  }
  const idx = decoded.indexOf(":");
  if (idx === -1) return res.status(400).json({ error: "Format email:password attendu" });
  const email = decoded.slice(0, idx);
  const password = decoded.slice(idx + 1);
  const data = loadData();
  const user = data.users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ error: "Identifiants invalides" });
  if (!verifyPassword(password, user.salt, user.hash)) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }
  req.user = { id: user.id, email: user.email, name: user.name };
  next();
}
 
// GET /me -> info utilisateur (auth Basic requise)
app.get("/me", authMiddleware, (req, res) => {
  res.json(req.user);
});
 
// Lancement du serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 GreenTrip API (JSON) sur http://localhost:${PORT}`);
});
