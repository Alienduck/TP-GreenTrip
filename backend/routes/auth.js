const express = require("express");
const router = express.Router();

// Route POST /auth/register
router.post("/register", (req, res) => {
  const { name,email, password } = req.body;

  // Vérification simple
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Nom ,Email et mot de passe requis" });
  }

  // Ici tu peux ajouter la logique pour sauvegarder l'utilisateur
  // Par exemple dans une base de données, mais pour le moment on simule :
  const newUser = { id: Date.now(),name, email, password };

  // Retourne un message de succès
  res.status(201).json({ message: `${name} ${email} créé avec succès !`, user: newUser });
});

module.exports = router;
