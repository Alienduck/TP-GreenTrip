export const API_BASE = "http://localhost:3000";

export function getAuthHeader() {
  const a = localStorage.getItem("auth");
  return a ? { Authorization: a } : {};
}

export async function fetchTrips() {
  const res = await fetch(`${API_BASE}/trips`);
  return res.json();
}

export async function createTrip(payload) {
  const headers = { "Content-Type": "application/json", ...getAuthHeader() };
  const res = await fetch(`${API_BASE}/trips`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function registerUser(data) {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function loginUser(data) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// --- added for reservations ---
export async function bookTrip(tripId, seats = 1) {
  const headers = { "Content-Type": "application/json", ...getAuthHeader() };
  const res = await fetch(`${API_BASE}/trips/${tripId}/book`, {
    method: "POST",
    headers,
    body: JSON.stringify({ seats }),
  });
  return res.json();
}

export async function fetchMyBookings() {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: "GET",
    headers: getAuthHeader(),
  });
  return res.json();
}