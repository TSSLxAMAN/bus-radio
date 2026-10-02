const base = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true };

export const PlayIcon = () => (
  <svg {...base} width={24} height={24}><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></svg>
);
export const PauseIcon = () => (
  <svg {...base} width={24} height={24}><rect x="6" y="5" width="4.5" height="14" rx="1.2" /><rect x="13.5" y="5" width="4.5" height="14" rx="1.2" /></svg>
);
export const PrevIcon = () => (
  <svg {...base}><rect x="5" y="5" width="2.4" height="14" rx="1" /><path d="M19 6.2v11.6a.8.8 0 0 1-1.24.67l-8.6-5.8a.8.8 0 0 1 0-1.34l8.6-5.8A.8.8 0 0 1 19 6.2Z" /></svg>
);
export const NextIcon = () => (
  <svg {...base}><rect x="16.6" y="5" width="2.4" height="14" rx="1" /><path d="M5 6.2v11.6a.8.8 0 0 0 1.24.67l8.6-5.8a.8.8 0 0 0 0-1.34l-8.6-5.8A.8.8 0 0 0 5 6.2Z" /></svg>
);
export const VolumeIcon = () => (
  <svg {...base}><path d="M4 9.5v5h3.5l4.5 4v-13l-4.5 4H4Z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
);
export const MuteIcon = () => (
  <svg {...base}><path d="M4 9.5v5h3.5l4.5 4v-13l-4.5 4H4Z" /><path d="m16 9.5 5 5m0-5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
);
export const ListIcon = () => (
  <svg {...base}><path d="M4 7h12M4 12h12M4 17h8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M19 15.5v-6l3 1.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><circle cx="17.3" cy="16.5" r="1.7" /></svg>
);
export const CloseIcon = () => (
  <svg {...base}><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
);
