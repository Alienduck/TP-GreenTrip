import React, { useState } from "react";
import { registerUser } from "../services/api";

export default function Register({ onAuth }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await registerUser(form);
      if (data.error) return alert(data.error);
      // store Basic auth and notify parent
      const b = "Basic " + btoa(`${form.email}:${form.password}`);
      localStorage.setItem("auth", b);
      if (onAuth) onAuth({ auth: b, user: data });
      alert("Inscription réussie");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      alert("Erreur inscription");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input placeholder="Nom (optionnel)" value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Mot de passe" type="password" value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })} />
      <button type="submit" disabled={loading}>{loading ? "..." : "S'inscrire"}</button>
    </form>
  );
}