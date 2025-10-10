const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // pour autoriser React à appeler le backend
app.use(express.json());

// Route simple
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello depuis le backend Node.js !' });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Serveur backend sur http://localhost:${PORT}`));
