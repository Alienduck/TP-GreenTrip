// controllers/authController.js

const fs = require('fs').promises; // Pour les opérations de fichiers asynchrones
const path = require('path');
const bcrypt = require('bcrypt'); // Pour hacher le mot de passe

// Chemin d'accès au fichier de données (assurez-vous que le chemin est correct pour votre structure)
const USERS_FILE_PATH = path.join(__dirname, '..', 'data', 'users.json');

// ----------------------
// Fonctions utilitaires JSON
// ----------------------

/**
 * Lit le fichier users.json et retourne le tableau d'utilisateurs.
 */
async function readUsers() {
    try {
        const data = await fs.readFile(USERS_FILE_PATH, 'utf-8');
        // Si le fichier est vide, JSON.parse va échouer, nous gérons cela
        if (!data) return [];
        return JSON.parse(data);
    } catch (error) {
        // En cas d'erreur de lecture (fichier inexistant) ou de parsing, on retourne un tableau vide.
        return []; 
    }
}

/**
 * Écrit le tableau d'utilisateurs mis à jour dans le fichier users.json.
 */
async function writeUsers(users) {
    // Écrit le JSON avec une indentation de 2 espaces pour la lisibilité
    await fs.writeFile(USERS_FILE_PATH, JSON.stringify(users, null, 2), 'utf-8');
}

// ----------------------
// Contrôleur : Inscription (Register)
// ----------------------

exports.register = async (req, res) => {
    // 1. Récupération et validation des données
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Veuillez fournir un nom, un email et un mot de passe." });
    }

    try {
        const users = await readUsers();

        // 2. Vérification de l'unicité de l'email
        const existingUser = users.find(user => user.Email.toLowerCase() === email.toLowerCase());
        if (existingUser) {
            return res.status(409).json({ message: "Cet email est déjà utilisé." });
        }

        // 3. Hachage sécurisé du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // 4. Génération du nouvel UserId
        // Trouve le UserId maximum et ajoute 1. Si le tableau est vide, commence à 1.
        const maxId = users.length > 0 ? Math.max(...users.map(u => u.UserId)) : 0;
        const newUserId = maxId + 1;

        // 5. Création de l'objet utilisateur (selon votre modèle)
        const newUser = {
            "UserId": newUserId,
            "Name": name,
            "Email": email,
            "Password": hashedPassword, // IMPORTANT : Stocker la version hachée
            "AuthProvider": "local",
            "AuthProviderId": null,
            "Bookings": [] // Initialisé vide
        };

        // 6. Ajout de l'utilisateur et sauvegarde du fichier
        users.push(newUser);
        await writeUsers(users);

        // 7. Réponse de succès (201 Created)
        // Ne jamais renvoyer le mot de passe haché dans la réponse !
        const { Password: userPassword, ...safeDetails } = newUser;

        res.status(201).json({ 
            message: "Inscription réussie ! Vous êtes enregistré.",
            user: safeDetails
        });

    } catch (err) {
        console.error("Erreur serveur lors de l'inscription:", err);
        res.status(500).json({ message: "Une erreur interne est survenue." });
    }
};