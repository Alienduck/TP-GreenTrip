import React, { useState, useEffect } from "react";
import "./App.css";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Trips from "./pages/Trips";

export default function App() {
  const [auth, setAuth] = useState(localStorage.getItem("auth") || null);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("trips"); // "trips" | "login" | "register"

  useEffect(() => {
    if (!auth) return;
    fetch("http://localhost:3000/me", { headers: { Authorization: auth } })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((u) => setUser(u))
      .catch(() => {
        localStorage.removeItem("auth");
        setAuth(null);
        setUser(null);
      });
  }, [auth]);

  function handleAuth({ auth: newAuth, user: newUser }) {
    if (newAuth) {
      localStorage.setItem("auth", newAuth);
      setAuth(newAuth);
    }
    setUser(newUser || null);
    setPage("trips");
  }

  function logout() {
    localStorage.removeItem("auth");
    setAuth(null);
    setUser(null);
    setPage("trips");
  }

  return (
    <div className="p-6 font-sans">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">🌱 GreenTrip</h1>
        <nav>
          <button onClick={() => setPage("trips")} className="px-3 py-1 mr-2">Trajets</button>
          {!user && <button onClick={() => setPage("login")} className="px-3 py-1 mr-2">Connexion</button>}
          {!user && <button onClick={() => setPage("register")} className="px-3 py-1">Inscription</button>}
          {user && (
            <span className="ml-4 flex items-center space-x-3">
              <div className="text-sm">
                <div className="font-semibold">{user.name || user.email}</div>
                <div className="text-xs text-gray-600">{user.email}</div>
              </div>
              <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
            </span>
          )}
        </nav>
      </header>

      <main>
        {page === "register" && <Register onAuth={handleAuth} />}
        {page === "login" && <Login onAuth={handleAuth} />}
        {page === "trips" && <Trips />}
      </main>
    </div>
  );
}
