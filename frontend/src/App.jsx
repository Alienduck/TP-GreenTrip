import React, { useEffect, useState } from "react";

export default function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api")
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setMessage("Erreur : " + err.message));
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Bienvenue sur GreenTrip 🌱</h1>
      <p>{message || "Chargement..."}</p>
    </div>
  );
}
