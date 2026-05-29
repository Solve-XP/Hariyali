import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  reverseGeocode,
} from "../utils/geocoding";

import Button from "./Button";
import { getCurrentLocation } from "../utils/location";
import "./MapPickerModal.css";

/* ==========================================
    FIX LEAFLET DEFAULT MARKER ICONS
========================================== */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ==========================================
    FLY TO
========================================== */

function FlyToPosition({ position }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, 15, { animate: true, duration: 1.0 });
  }, [position, map]);

  return null;
}

/* ==========================================
    MARKER
========================================== */

function LocationMarker({ position, label, setPosition }) {
  useMapEvents({
    click(event) {
      setPosition([event.latlng.lat, event.latlng.lng], null);
    },
  });

  return (
    <Marker
      position={position}
      draggable
      eventHandlers={{
        dragend: (event) => {
          const pos = event.target.getLatLng();
          setPosition([pos.lat, pos.lng], null);
        },
      }}
    >
      {label && <Popup>{label}</Popup>}
    </Marker>
  );
}

/* ==========================================
    MODAL
========================================== */

export default function MapPickerModal({
  open,
  onClose,
  latitude,
  longitude,
  onConfirm,
}) {
  const DEFAULT_LAT = 18.5204;
  const DEFAULT_LNG = 73.8567;

  const [position, setPositionState] = useState([
    latitude || DEFAULT_LAT,
    longitude || DEFAULT_LNG,
  ]);
  const [pinLabel, setPinLabel]           = useState(null);
  const [search, setSearch]               = useState("");
  const [results, setResults]             = useState([]);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState("");
  const [showResults, setShowResults] = useState(false);
  const [ locationLoading,setLocationLoading] = useState(false);

  const debounceTimer = useRef(null);
  const searchRef     = useRef(null);

  const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_KEY;
  

  function setPosition(coords, label) {
    setPositionState(coords);
    setPinLabel(label);
  }

  useEffect(() => {
    setPosition([latitude || DEFAULT_LAT, longitude || DEFAULT_LNG], null);
  }, [latitude, longitude]);

  useEffect(() => {
    return () => clearTimeout(debounceTimer.current);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearchChange(e) {
    const query = e.target.value;
    setSearch(query);
    setError("");
    clearTimeout(debounceTimer.current);

    if (!query || query.trim().length < 3) {
      setResults([]);
      setShowResults(false);
      return;
    }

    debounceTimer.current = setTimeout(() => {
      fetchResults(query.trim());
    }, 400);
  }

  async function fetchResults(query) {
    if (!GEOAPIFY_KEY) {
      setError("Add VITE_GEOAPIFY_KEY to your .env file.");
      return;
    }

    try {
      setLoading(true);
      setResults([]);

      const url = new URL("https://api.geoapify.com/v1/geocode/autocomplete");
      url.searchParams.set("text",   query);
      url.searchParams.set("apiKey", GEOAPIFY_KEY);
      url.searchParams.set("filter", "countrycode:in");
      url.searchParams.set("lang",   "en");
      url.searchParams.set("limit",  "7");

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data     = await res.json();
      const features = data?.features ?? [];

      setResults(features);
      setShowResults(true);

      if (features.length === 0) {
        setError("No results found. Try a different name.");
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      setError("Search failed. Check your internet connection.");
    } finally {
      setLoading(false);
    }
  }

  function pickResult(item) {
    const [lng, lat] = item.geometry.coordinates;
    const p          = item.properties;
    const label      = p.village || p.town || p.city || p.county || p.name || p.formatted;

    setPosition([lat, lng], label);
    setSearch(p.formatted);
    setResults([]);
    setShowResults(false);
    setError("");
  }

  // async function handleUseCurrentLocation() {
  //   try {
  //     const loc = await getCurrentLocation();
  //     setPosition([loc.latitude, loc.longitude], "Your location");
  //   } catch {
  //     alert("Unable to fetch location. Please allow location access.");
  //   }
  // }

  async function handleUseCurrentLocation() {

    if (locationLoading)
      return;

    try {

      setLocationLoading(true);

      const loc =
        await getCurrentLocation();

      setPosition(
        [
          loc.latitude,
          loc.longitude,
        ],
        "Your location"
      );

      setSearch(
        "Current Location"
      );

      setResults([]);

      setShowResults(false);

      setError("");

    } catch {

      alert(
        "Unable to fetch location. Please allow location access."
      );

    } finally {

      setLocationLoading(false);
    }
  }
  function handleClearSearch() {
    setSearch("");
    setResults([]);
    setShowResults(false);
    setError("");
  }

  if (!open) return null;

  return (
    <div className="map-modal" role="dialog" aria-modal="true">
      <div className="map-modal__content">

        {/* HEADER */}
        <div className="map-modal__header">
          <h3 className="map-modal__title">Select Exact Location</h3>
          <button
            type="button"
            className="map-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* SEARCH */}
        <div className="map-search" ref={searchRef}>
          <div className="map-search__input-wrap">
            <span className="map-search__icon" aria-hidden="true">🔍</span>
            <input
              type="text"
              className="map-search__input"
              placeholder="Search village, taluka, district, city..."
              value={search}
              onChange={handleSearchChange}
              onFocus={() => results.length > 0 && setShowResults(true)}
              autoComplete="off"
              spellCheck="false"
            />
            {loading && (
              <span className="map-search__spinner" aria-label="Searching" />
            )}
            {search && !loading && (
              <button
                type="button"
                className="map-search__clear"
                onClick={handleClearSearch}
                aria-label="Clear"
              >
                ✕
              </button>
            )}
          </div>

          {error && !loading && (
            <p className="map-search__error" role="alert">{error}</p>
          )}

          {showResults && results.length > 0 && (
            <ul className="map-search__results" role="listbox">
              {results.map((item, index) => {
                const p       = item.properties;
                const primary =
                  p.village || p.town || p.city ||
                  p.county  || p.name || p.formatted;

                return (
                  <li key={p.place_id ?? index} role="option">
                    <button
                      type="button"
                      className="map-search__result-btn"
                      onClick={() => pickResult(item)}
                    >
                      <span className="map-search__result-icon" aria-hidden="true">📍</span>
                      <span className="map-search__result-text">
                        <span className="map-search__result-primary">{primary}</span>
                        <span className="map-search__result-secondary">{p.formatted}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* HINT */}
        <p className="map-modal__hint">
          Click anywhere on the map or drag the pin to adjust
        </p>

        {/* MAP */}
        <div className="map-modal__map-wrap">
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={true}
            className="map-modal__map"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FlyToPosition position={position} />
            <LocationMarker
              position={position}
              label={pinLabel}
              setPosition={setPosition}
            />
          </MapContainer>
        </div>

        {/* FOOTER */}
        <div className="map-modal__footer">
          <div className="map-modal__coords">
            <div className="map-modal__coord-item">
              <span className="map-modal__coord-label">Latitude</span>
              <span className="map-modal__coord-value">
                {position[0]?.toFixed(6)}
              </span>
            </div>
            <div className="map-modal__coord-divider" />
            <div className="map-modal__coord-item">
              <span className="map-modal__coord-label">Longitude</span>
              <span className="map-modal__coord-value">
                {position[1]?.toFixed(6)}
              </span>
            </div>
          </div>

          <div className="map-modal__actions">
            <Button
              type="button"
              variant="secondary"
              onClick={handleUseCurrentLocation}
              disabled={locationLoading}
            >
              {locationLoading
                ? "Getting Location..."
                : "📍 Use Current Location"}
            </Button>
            <Button
              type="button"
              onClick={async () => {

                const address =
                  await reverseGeocode(
                    position[0],
                    position[1]
                  );

                onConfirm({

                  latitude:
                    position[0],

                  longitude:
                    position[1],

                  village:
                    address.village,

                  taluka:
                    address.taluka,

                  district:
                    address.district,

                  state:
                    address.state,

                  pincode:
                    address.pincode,
                });
                // console.log(address);

                onClose();
              }}
            >
              Confirm Location
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}