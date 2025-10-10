import React, { useState } from "react";

export default function Inscription() {
  // 1. Décommenter l'état pour le nom (name)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 2. Inclure 'name' dans le corps de la requête
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await res.json();
      
      // Ajoutez une vérification pour les messages d'erreur du backend
      if (res.ok) {
        setMessage(data.message);
      } else {
        // Affiche l'erreur renvoyée par le backend (ex: "Cet email est déjà utilisé")
        setMessage(`Erreur : ${data.message}`);
      }
      
    } catch (err) {
      // Erreur réseau ou autre problème technique
      setMessage("Erreur de connexion au serveur : " + err.message);
    }
  };

  return (
    <form id="registerForm" onSubmit={handleSubmit} style={{ textAlign: "center", padding: "2rem" }}>
      <h2>Inscription</h2>
      
      {/* 3. Ajouter l'input pour le nom (Name). Utilisez type="text" */}
      <input 
        placeholder="Nom complet" 
        type="text" 
        value={name} 
        onChange={e => setName(e.target.value)} 
        required // Ajouter 'required' pour une meilleure UX
      />
      
      <input 
        placeholder="Email" 
        type="email" 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
        required
      />
      <input 
        placeholder="Mot de passe" 
        type="password" 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
        required
      />
      <button type="submit">S'inscrire</button>
      <p>{message}</p>
    </form>
  );
}