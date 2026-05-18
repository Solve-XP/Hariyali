const bp = (size, rest) => ({
  width: size, height: size, viewBox: "0 0 24 24",
  fill: "none", stroke: "currentColor", strokeWidth: 2,
  strokeLinecap: "round", strokeLinejoin: "round", ...rest,
});

export const IconDashboard = ({ size = 18, ...r }) => (
  <svg {...bp(size, r)}><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
);
export const IconFarm = ({ size = 18, ...r }) => (
  <svg {...bp(size, r)} viewBox="0 0 24 24" fill="none">
    {/* Sun */}
    <circle cx="18" cy="6" r="2" />

    {/* Mountains / background */}
    <path d="M3 14l4-4 3 3 4-5 7 8" />

    {/* Farm land rows */}
    <path d="M3 18c2-1 4-1 6 0s4 1 6 0 4-1 6 0" />
    <path d="M3 21c2-1 4-1 6 0s4 1 6 0 4-1 6 0" />
  </svg>
);
export const IconCrop = ({ size = 18, ...r }) => (
  <svg
    {...bp(size, r)}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Stem */}
    <path d="M12 20V10" />

    {/* Left leaf */}
    <path d="M12 14C9 14 7 12 7 9C10 9 12 11 12 14Z" />

    {/* Right leaf */}
    <path d="M12 11C15 11 17 9 17 6C14 6 12 8 12 11Z" />

    {/* Ground */}
    <path d="M5 20H19" />
  </svg>
);

export const IconFarmYear = ({ size = 18, ...r }) => (
  <svg
    {...bp(size, r)}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Calendar */}
    <rect x="4" y="5" width="16" height="15" rx="2" />
    <path d="M8 3V7" />
    <path d="M16 3V7" />
    <path d="M4 9H20" />

    {/* Crop / leaf */}
    <path d="M12 17V12" />
    <path d="M12 15C10 15 8.5 13.5 8.5 11.5C10.5 11.5 12 13 12 15Z" />
    <path d="M12 13.5C14 13.5 15.5 12 15.5 10C13.5 10 12 11.5 12 13.5Z" />

    {/* Circular year arrow */}
    <path d="M17 17.5A6 6 0 0 1 7 18" />
    <path d="M7 18V15.8" />
    <path d="M7 18H9.2" />
  </svg>
);


export const IconSeason = ({ size = 18, ...r }) => (
  <svg
    {...bp(size, r)}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Rain cloud for Kharif */}
    <path d="M6 9.5C6 7.6 7.6 6 9.5 6C10.7 6 11.8 6.6 12.4 7.5C12.8 7.2 13.4 7 14 7C15.7 7 17 8.3 17 10C18.2 10 19 10.8 19 12C19 13.2 18.2 14 17 14H7.5C6.1 14 5 12.9 5 11.5C5 10.5 5.4 9.8 6 9.5Z" />

    {/* Rain drops */}
    <path d="M8 16L7.5 17" />
    <path d="M11 16L10.5 17" />
    <path d="M14 16L13.5 17" />

    {/* Crop / wheat for Rabi */}
    <path d="M18 20V15" />
    <path d="M18 15C17 15 16 14 16 13C17 13 18 14 18 15Z" />
    <path d="M18 17C19 17 20 16 20 15C19 15 18 16 18 17Z" />

    {/* Ground */}
    <path d="M4 20H20" />
  </svg>
);
// export const IconExpense = ({ size = 18, ...r }) => (
//   <svg {...bp(size, r)}><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
// );
export const IconRental = ({ size = 18, ...r }) => (
  <svg {...bp(size, r)}><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/><path d="M3 17.5h2M9 17.5h6M20 17.5h1"/><path d="M5 12V7h6l3 4h5v6"/></svg>
);
export const IconUsers = ({ size = 18, ...r }) => (
  <svg {...bp(size, r)}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
export const IconAdmin = ({ size = 18, ...r }) => (
  <svg {...bp(size, r)}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
export const IconPlus = ({ size = 16, ...r }) => (
  <svg {...bp(size, r)}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
export const IconTrash = ({ size = 16, ...r }) => (
  <svg {...bp(size, r)}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
);
export const IconPhone = ({ size = 14, ...r }) => (
  <svg {...bp(size, r)}><path d="M22 16.92V21a1 1 0 0 1-1.11 1A19 19 0 0 1 2 4.11 1 1 0 0 1 3 3h4.09a1 1 0 0 1 1 .75c.18.7.42 1.38.72 2.04a1 1 0 0 1-.23 1.06L7.21 8.21a16 16 0 0 0 8.58 8.58l1.36-1.36a1 1 0 0 1 1.06-.23c.66.3 1.34.54 2.04.72a1 1 0 0 1 .75 1z"/></svg>
);
export const IconMessage = ({ size = 14, ...r }) => (
  <svg {...bp(size, r)}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);
export const IconLocation = ({ size = 14, ...r }) => (
  <svg {...bp(size, r)}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
);
export const IconLogout = ({ size = 16, ...r }) => (
  <svg {...bp(size, r)}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);
export const IconMenu = ({ size = 22, ...r }) => (
  <svg {...bp(size, r)}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
);
export const IconEye = ({ size = 16, ...r }) => (
  <svg {...bp(size, r)}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);
export const IconEyeOff = ({ size = 16, ...r }) => (
  <svg {...bp(size, r)}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
);
export const IconFertilizer = ({ size = 16, ...r }) => (
  <svg {...bp(size, r)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Bag */}
    <path d="M7 8h10l1 12H6L7 8z" />
    
    {/* Top fold */}
    <path d="M9 4h6l1 4H8l1-4z" />
    
    {/* Leaf symbol */}
    <path d="M12 12c1.5-2 4-2 4-2s0 2.5-2 4-4 2-4 2 0-2 2-4z" />
    <path d="M12 12c-1.5-2-4-2-4-2s0 2.5 2 4 4 2 4 2" />
  </svg>
);
export const IconIncome = ({ size = 16, ...r }) => (
  <svg
    {...bp(size, r)}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Coin */}
    <circle cx="12" cy="12" r="9" />

    {/* Rupee / income arrow */}
    <path d="M9 8h6" />
    <path d="M9 11h5" />
    <path d="M10 16l5-5" />
    <path d="M15 11v5h-5" />
  </svg>
);
export const IconEdit = ({ size = 16, ...r }) => (
  <svg {...bp(size, r)}>
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>
  </svg>
);
export const IconExpense = ({ size = 18, ...r }) => (
  <svg
    {...bp(size, r)}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Coin */}
    <circle cx="12" cy="12" r="9" />

    {/* Downward expense arrow */}
    <path d="M9 8h6" />
    <path d="M9 11h5" />
    <path d="M14 13l-5 5" />
    <path d="M9 18v-5h5" />
  </svg>
);
export const IconSearch = ({ size = 16, ...r }) => (
  <svg {...bp(size, r)}>
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

export const IconField = ({ size = 18, ...r }) => (
  <svg {...bp(size, r)}>
    <path d="M3 20h18"/>
    <path d="M5 16h14"/>
    <path d="M7 12h10"/>
    <path d="M9 8h6"/>
  </svg>
);

export const IconPlant = ({ size = 18, ...r }) => (
  <svg {...bp(size, r)}>
    <path d="M12 22V11"/>
    <path d="M8 7c0-2 2-4 4-4"/>
    <path d="M16 7c0-2-2-4-4-4"/>
    <path d="M7 13c0-2 2-4 5-4"/>
    <path d="M17 13c0-2-2-4-5-4"/>
  </svg>
);

export const IconSoil = ({ size = 18, ...r }) => (
  <svg {...bp(size, r)}>
    <path d="M4 20c2-2 4-2 6 0s4 2 6 0 4-2 4-2"/>
    <path d="M7 14c1.5-1.5 3-1.5 4.5 0S14.5 15.5 16 14"/>
    <path d="M12 11V4"/>
    <path d="M9 7c0-2 1.5-3 3-3"/>
    <path d="M15 7c0-2-1.5-3-3-3"/>
  </svg>
);