import React, { useState } from "react";

export default function Profile() {
    const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) {
    return <h1>Vous devez vous connecter pour accéder à votre profil.</h1>;
  }

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>BIENVENUE SUR VOTRE PROFILE, {storedUser.Name} ! 🌱</h1>
      <p>Email : {storedUser.Email}</p>
    </div>
  );
   

}