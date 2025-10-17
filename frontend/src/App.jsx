// frontend/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Connexion from "./components/connexion";
import Inscription from "./components/inscription";
import Profile from "./components/profile";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Page d'accueil */}
        <Route path="/" element={<Home />} />

        {/* Page de connexion */}
        <Route path="/login" element={<Connexion />} />

        {/* Page d'inscription */}
        <Route path="/register" element={<Inscription />} />

         {/* Page Profil */}
         <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}
