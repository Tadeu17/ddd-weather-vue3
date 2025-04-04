import { describe, it, expect, vi, type Mock } from "vitest";
import { getLocations } from "@/application/services/LocationService";
import { LocationRepository } from "@/infrastructure/repositories/LocationRepository";
import type { Location } from "@/domain/entities/Location";

vi.mock("@/infrastructure/repositories/LocationRepository", () => ({
  LocationRepository: {
    fetchLocations: vi.fn(),
  },
}));

describe("LocationService", () => {
  describe("getLocations", () => {
    it("returns a list of locations when fetchLocations succeeds", async () => {
      const mockLocations: Location[] = [
        { id: "1", name: "Lisbon", country: "Portugal", latitude: 38.7169, longitude: -9.1399 },
        { id: "2", name: "Madrid", country: "Spain", latitude: 40.4168, longitude: -3.7038 },
      ];

      (LocationRepository.fetchLocations as Mock).mockResolvedValue(mockLocations);

      const result = await getLocations();

      expect(result).toEqual(mockLocations);
    });

    it("returns null when fetchLocations returns null", async () => {
      (LocationRepository.fetchLocations as Mock).mockResolvedValue(null);

      const result = await getLocations();

      expect(result).toBeNull();
    });

    it("returns null and logs an error when fetchLocations throws an error", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => { });
      (LocationRepository.fetchLocations as Mock).mockRejectedValue(new Error("API Error"));

      const result = await getLocations();

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching current locations:",
        expect.any(Error)
      );

      consoleSpy.mockRestore(); // Clean up mock
    });
  });
})

