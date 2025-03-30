import type { Location } from "@/domain/entities/Location";
import { LocationRepository } from "@/infrastructure/repositories/LocationRepository";

export const getLocations = async (): Promise<Location[] | null> => {
  try {
    const result = await LocationRepository.fetchLocations();

    if (!result) {
      throw new Error('No locations available');
    }

    return result;
  } catch (error) {
    console.error("Error fetching current locations:", error);
    return null;
  }
};
