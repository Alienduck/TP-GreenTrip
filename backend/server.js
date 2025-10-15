import express from "express";
import cors from "cors";
const app = express();
import authRoutes from "./routes/auth.js"; 

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes); 

app.get('/api', (req, res) => {
  res.send({ message: 'Bienvenue sur le backend GreenTrip 🌱' });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Backend démarré sur http://localhost:${PORT}`));
