import { describe, expect, it } from "vitest";
import { LocationRepository } from "./LocationRepository";
import { locations } from "./mock-data";

describe('LocationRepository', () => {
  it('getLocationById', () => {
    const location = LocationRepository.getLocationById(locations[0].id)

    expect(location).toEqual(locations[0])
  })
})
