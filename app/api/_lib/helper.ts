export function generateTransactionId(): string {
  return `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
}


function deg2rad(deg : number) {
  return deg * (Math.PI / 180);
}


export function getDistanceFromLatLonInKm(lat1 : number, lon1 : number, lat2 : number, lon2: number) : number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

// Example usage:
// const distance = getDistanceFromLatLonInKm(23.2599, 77.4126, 28.6139, 77.2090);
// console.log("Distance:", distance.toFixed(2), "km");
