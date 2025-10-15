// frontend/src/components/Home.jsx
import React from "react";  
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Bienvenue sur GreenTrip 🌱</h1>
      <div style={{ marginTop: "1rem" }}>
        <Link to="/login" style={{ marginRight: "1rem" }}>Connexion</Link>
        <Link to="/register">Inscription</Link>
      </div>
    </div>
  );
}
