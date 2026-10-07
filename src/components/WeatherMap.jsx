import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { displayTemp, unitLabel } from "../utils/units";

// Fix default Leaflet icon paths in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function RecenterMap({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    if (lat != null && lon != null) {
      map.setView([lat, lon], 10, { animate: true });
    }
  }, [lat, lon, map]);
  return null;
}

export default function WeatherMap({ location, current, unit = "C" }) {
  const lat = location?.lat;
  const lon = location?.lon;

  if (lat == null || lon == null) return null;

  const cityName = location?.name || "Current Location";
  const tempStr = current?.temp != null ? `${displayTemp(current.temp, unit)}${unitLabel(unit)}` : "";

  return (
    <div className="glass-strong glass-3d rounded-3xl p-6 animate-fade-in-up relative overflow-hidden" role="region" aria-label="Interactive Weather Map">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white/80 flex items-center gap-2">
          <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          Weather Map
        </h3>
        <span className="text-xs text-white/40">{cityName}</span>
      </div>

      <div className="h-64 sm:h-72 w-full rounded-2xl overflow-hidden border border-white/10 shadow-inner relative z-0">
        <MapContainer
          center={[lat, lon]}
          zoom={10}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* RainViewer precipitation radar layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.rainviewer.com" target="_blank" rel="noopener noreferrer">RainViewer</a>'
            url="https://tilecache.rainviewer.com/v2/radar/nowcast_10/256/{z}/{x}/{y}/2/1_1.png"
            opacity={0.65}
          />
          <Marker position={[lat, lon]}>
            <Popup>
              <div className="text-slate-900 font-sans text-center p-1">
                <strong className="block text-sm">{cityName}</strong>
                <span className="text-lg font-bold text-sky-600">{tempStr}</span>
                {current?.condition && (
                  <span className="block text-xs text-slate-500">{current.condition}</span>
                )}
              </div>
            </Popup>
          </Marker>
          <RecenterMap lat={lat} lon={lon} />
        </MapContainer>
      </div>
      <p className="text-2xs text-white/40 mt-2 text-right">
        Radar overlay powered by RainViewer
      </p>
    </div>
  );
}
