// src/infrastructure/repositories/LocationRepository.ts
import type { Location } from "@/domain/entities/Location";

const locations: Location[] = [
  {
    id: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    latitude: 38.7169,
    longitude: -9.1399,
  },
  {
    id: "funchal",
    name: "Funchal",
    country: "Portugal",
    latitude: 32.6496,
    longitude: -16.9086,
  },
];

export const LocationRepository = {
  fetchLocations(): Location[] {
    return locations;
  },

  getLocationById(id: string): Location | undefined {
    return locations.find(loc => loc.id === id);
  }
};
