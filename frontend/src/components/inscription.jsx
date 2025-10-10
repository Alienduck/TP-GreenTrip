import React, { useState } from "react";

export default function Inscription() {
  /*const [name, setName] = useState("");*/
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setMessage("Erreur : " + err.message);
    }
  };

  return (
    <form id="registerForm" onSubmit={handleSubmit} style={{ textAlign: "center", padding: "2rem" }}>
      <h2>Inscription</h2>
      {/* <input placeholder="Nom" type="nom" value={name} onChange={e => setName(e.target.value)} /> */}
     
      <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">S'inscrire</button>
      <p>{message}</p>
    </form>
  );
}
