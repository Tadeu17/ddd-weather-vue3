export type Location = {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
};

export const HARDCODED_LOCATIONS: Location[] = [
  { id: "lisbon", name: "Lisbon", country: "Portugal", latitude: 38.7169, longitude: -9.1399 },
  { id: "funchal", name: "Funchal", country: "Portugal", latitude: 32.6496, longitude: -16.9086 },
  { id: "paris", name: "Paris", country: "France", latitude: 48.8566, longitude: 2.3522 },
] as const;
