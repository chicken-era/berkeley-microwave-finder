const assert = require('assert');

function haversineMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// same point -> 0m
assert.strictEqual(haversineMeters(37.87, -122.26, 37.87, -122.26), 0);

// Golden Bear Cafe -> Soda Hall, known ~700m apart on campus (sanity range, not exact)
const d = haversineMeters(37.869847, -122.259739, 37.8756495, -122.2586918);
assert.ok(d > 600 && d < 800, `expected ~600-800m, got ${d}`);

// nearest-point pick: point right on top of Terrace Cafe should win over everything else
const MICROWAVES = [
  { name: "Terrace Cafe", lat: 37.874203, lon: -122.25842 },
  { name: "Soda Hall", lat: 37.8756495, lon: -122.2586918 },
];
function nearest(lat, lon) {
  let best = null, bestD = Infinity;
  for (const m of MICROWAVES) {
    const d = haversineMeters(lat, lon, m.lat, m.lon);
    if (d < bestD) { bestD = d; best = m; }
  }
  return best;
}
assert.strictEqual(nearest(37.874203, -122.25842).name, "Terrace Cafe");

console.log("ok");
