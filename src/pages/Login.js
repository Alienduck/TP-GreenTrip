import React, { useState } from "react";
import { loginUser } from "../services/api";

export default function Login({ onAuth }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginUser(form);
      if (data.error) return alert(data.error);
      const b = "Basic " + btoa(`${form.email}:${form.password}`);
      localStorage.setItem("auth", b);
      if (onAuth) onAuth({ auth: b, user: data.user || data });
      alert("Connexion réussie");
      setForm({ email: "", password: "" });
    } catch {
      alert("Erreur connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input placeholder="Email" value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Mot de passe" type="password" value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })} />
      <button type="submit" disabled={loading}>{loading ? "..." : "Se connecter"}</button>
    </form>
  );
}