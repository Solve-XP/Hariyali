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
  <svg {...bp(size, r)}><path d="M12 22V8"/><path d="M12 8c-2 0-4-2-4-4 2 0 4 2 4 4z"/><path d="M12 8c2 0 4-2 4-4-2 0-4 2-4 4z"/><path d="M12 14c-2 0-5-1-5-4 2 0 5 1 5 4z"/><path d="M12 14c2 0 5-1 5-4-2 0-5 1-5 4z"/></svg>
);
export const IconExpense = ({ size = 18, ...r }) => (
  <svg {...bp(size, r)}><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);
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

export const IconEdit = ({ size = 16, ...r }) => (
  <svg {...bp(size, r)}>
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>
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