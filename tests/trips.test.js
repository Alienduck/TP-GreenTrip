const fs = require('fs');
const path = require('path');
const { getTrips, addTrip } = require('./../backend/trips');

const TRIPS_PATH = path.join(__dirname, '../backend', 'data', 'trips.json');

// 🔄 Réinitialise le fichier avant chaque test
beforeEach(() => {
  fs.writeFileSync(TRIPS_PATH, JSON.stringify([], null, 2));
});

test('Ajoute un trajet avec succès', () => {
  const result = addTrip(1, 'Paris', 'Lyon', 'Train', 4, 25.0);
  expect(result.success).toBe(true);
  expect(result.trip.Start).toBe('Paris');
  expect(result.trip.End).toBe('Lyon');
  expect(result.trip.TransportMode).toBe('Train');
  expect(result.trip.Places).toBe(4);
  expect(result.trip.Price).toBe(25.0);
});

test('Ajoute plusieurs trajets et vérifie les IDs', () => {
  const trip1 = addTrip(1, 'Paris', 'Lyon', 'Train', 4, 25.0).trip;
  const trip2 = addTrip(2, 'Marseille', 'Nice', 'Bus', 3, 15.0).trip;
  expect(trip2.TripId).toBe(trip1.TripId + 1);
});

test('getTrips retourne tous les trajets ajoutés', () => {
  addTrip(1, 'Paris', 'Lyon', 'Train', 4, 25.0);
  addTrip(2, 'Marseille', 'Nice', 'Bus', 3, 15.0);
  const trips = getTrips();
  expect(trips.length).toBe(2);
  expect(trips[0].Start).toBe('Paris');
  expect(trips[1].End).toBe('Nice');
});