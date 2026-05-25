// src/components/LocationBadge.jsx

import "./LocationBadge.css";

export default function LocationBadge({

  village,

  taluka,

  district,

  state,

  className = "",
}) {

  const locationParts = [

    village,

    taluka,

    district,

    state,
  ].filter(Boolean);

  return (

    <div className={`
      location-badge
      ${className}
    `}>

      <span className="location-badge__icon">
        📍
      </span>

      <span className="location-badge__text">

        {locationParts.join(", ")}

      </span>

    </div>
  );
}