// ═══════════════════════════════════════════════════════
//  JARVIS — Map & Geolocation
// ═══════════════════════════════════════════════════════

import { state } from './state.js';
import { showResp } from './ui.js';
import { jarvisSpeak } from './tts.js';

function loadLeaflet(cb) {
  if (state.leafletLoaded) { cb(); return; }
  const s = document.createElement('script');
  s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  s.onload = () => { state.leafletLoaded = true; cb(); };
  document.head.appendChild(s);
}

export function toggleMap() {
  const panel = document.getElementById('map-panel');
  state.mapVisible = !state.mapVisible;
  if (state.mapVisible) {
    panel.classList.add('show');
    loadLeaflet(initMap);
  } else {
    panel.classList.remove('show');
  }
}

export function initMap() {
  if (!navigator.geolocation) {
    document.getElementById('map-coords').textContent = 'GEOLOCATION UNAVAILABLE';
    return;
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const acc = Math.round(pos.coords.accuracy);

      document.getElementById('map-coords').textContent =
        `LAT: ${lat.toFixed(5)}  LNG: ${lng.toFixed(5)}  ACC: \u00B1${acc}m`;

      if (!state.map) {
        state.map = L.map('leafmap', { zoomControl: true, attributionControl: false });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(state.map);
      }

      // Custom HUD-style marker
      const icon = L.divIcon({
        html: '<div style="width:16px;height:16px;border:2px solid #00d4ff;border-radius:50%;background:rgba(0,212,255,0.3);box-shadow:0 0 12px #00d4ff;animation:orbP 1s ease-in-out infinite;"></div>',
        className: '',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      if (state.marker) { state.marker.remove(); }
      state.marker = L.marker([lat, lng], { icon }).addTo(state.map)
        .bindPopup('<span style="font-family:monospace;font-size:11px;color:#000">\u25C8 YOUR LOCATION</span>')
        .openPopup();

      state.map.setView([lat, lng], 15);

      // Reverse geocode and speak location
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
        .then(r => r.json())
        .then(d => {
          const addr = d.address;
          const loc = addr.city || addr.town || addr.village || addr.county || 'unknown location';
          const st = addr.state || '';
          const reply = `Your current location is ${loc}${st ? ', ' + st : ''}, sir. Coordinates locked on.`;
          showResp(reply);
          jarvisSpeak(reply);
        })
        .catch(() => {
          const reply = `Location acquired, sir. Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}.`;
          showResp(reply);
          jarvisSpeak(reply);
        });
    },
    () => {
      document.getElementById('map-coords').textContent = 'LOCATION ACCESS DENIED';
      jarvisSpeak('Location access was denied, sir. Please allow location in your browser.');
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}
