// routes/auth.js

const express = require("express");
const router = express.Router();

// 💡 ATTENTION : Corrigez le chemin si votre dossier s'appelle 'controllers' (pluriel)
// Je vais utiliser 'controllers' comme standard ici :
const authController = require('../controller/authController'); 


// Cette seule ligne suffit : elle passe la main à la fonction register
// de votre authController pour gérer la logique complète (hachage, écriture JSON).
router.post('/register', authController.register); 

module.exports = router;