import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setMessage("Connexion réussie ✅");
        navigate("/profile", { state: { user: data.user } })
      } else {
        setMessage(data.message || "Erreur de connexion ❌");
      }
    } catch (err) {
      setMessage("Erreur : " + err.message);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit} style={{ display: "inline-block", marginTop: "1rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: "0.5rem", width: "250px" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: "0.5rem", width: "250px" }}
          />
        </div>
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>Se connecter</button>
      </form>

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
  );
}
