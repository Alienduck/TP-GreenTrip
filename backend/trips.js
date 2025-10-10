const fs = require('fs');
const path = require('path');

const TRIPS_PATH = path.join(__dirname, 'data', 'trips.json');

function getTrips() {
  return JSON.parse(fs.readFileSync(TRIPS_PATH));
}

function getTripCount(trips) {
  const maxId = trips.reduce((max, t) => Math.max(max, t.TripId || 0), 0);
  return maxId + 1;
}

function createTrip(trips, userId, start, end, transportMode, places, price) {
  return {
    TripId: getTripCount(trips),
    UserId: userId,
    Start: start,
    End: end,
    TransportMode: transportMode,
    Places: places,
    Price: price
  };
}

function addTrip(userId, start, end, transportMode, places, price) {
  const trips = getTrips();
  const newTrip = createTrip(trips, userId, start, end, transportMode, places, price);
  trips.push(newTrip);
  fs.writeFileSync(TRIPS_PATH, JSON.stringify(trips, null, 2));
  return { success: true, trip: newTrip };
}

module.exports = { getTrips, addTrip };