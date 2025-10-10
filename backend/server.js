const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());


app.get('/api', (req, res) => {
  res.send({ message: 'Bienvenue sur le backend GreenTrip 🌱' });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Backend démarré sur http://localhost:${PORT}`));
