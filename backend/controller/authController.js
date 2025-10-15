import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";

// __dirname n'existe pas en ES Modules, on le recrée :
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin vers le fichier JSON
const USERS_FILE_PATH = path.join(__dirname, "..", "data", "users.json");

// ----------------------
// Fonctions utilitaires JSON
// ----------------------

async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE_PATH, "utf-8");
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeUsers(users) {
  await fs.writeFile(USERS_FILE_PATH, JSON.stringify(users, null, 2), "utf-8");
}

// ----------------------
// Contrôleur : Inscription
// ----------------------

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Veuillez fournir un nom, un email et un mot de passe." });
  }

  try {
    const users = await readUsers();

    const existingUser = users.find(
      (user) => user.Email.toLowerCase() === email.toLowerCase()
    );
    if (existingUser) {
      return res.status(409).json({ message: "Cet email est déjà utilisé." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const maxId = users.length > 0 ? Math.max(...users.map((u) => u.UserId)) : 0;
    const newUserId = maxId + 1;

    const newUser = {
      UserId: newUserId,
      Name: name,
      Email: email,
      Password: hashedPassword,
      AuthProvider: "local",
      AuthProviderId: null,
      Bookings: [],
    };

    users.push(newUser);
    await writeUsers(users);

    const { Password, ...safeUser } = newUser;
    res.status(201).json({
      message: "Inscription réussie ! Vous êtes enregistré.",
      user: safeUser,
    });
  } catch (err) {
    console.error("Erreur serveur");
  }}


export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Veuillez fournir email et mot de passe." });
  }


 try {
    const users = await readUsers();
    const user = users.find(u => u.Email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }

    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }

    // Ne jamais renvoyer le mot de passe haché
    const { Password, ...safeUser } = user;

    res.status(200).json({ message: "Connexion réussie ✅", user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }

};