import type { Location } from "@/domain/entities/Location";
import { locations } from "./mock-data";

export const LocationRepository = {
  fetchLocations(): Location[] {
    return locations;
  },

  getLocationById(id: string): Location | undefined {
    return locations.find(loc => loc.id === id);
  }
};
