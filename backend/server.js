const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth');

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes); 

app.get('/api', (req, res) => {
  res.send({ message: 'Bienvenue sur le backend GreenTrip 🌱' });
});

app.get('/register', (req, res) => {
  res.send({message : 'page inscription'});

});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Backend démarré sur http://localhost:${PORT}`));
