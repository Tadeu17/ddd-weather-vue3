import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { mount } from "@vue/test-utils";
import WeatherDashboard from "./TheDashboard.vue";
import { getLocations } from "@/application/services/LocationService";
import { get7daysBeforeAndAfterWeather } from "@/application/services/WeatherService";
import type { ComponentPublicInstance } from "vue";
import type { Location } from "@/domain/entities/Location";

vi.mock("@/application/services/LocationService", () => ({
  getLocations: vi.fn(),
}));

vi.mock("@/application/services/WeatherService", () => ({
  get7daysBeforeAndAfterWeather: vi.fn(),
}));

const mockLocations = [
  { id: "1", name: "Lisbon", country: "Portugal", latitude: 38.7169, longitude: -9.1399 },
  { id: "2", name: "Madrid", country: "Spain", latitude: 40.4168, longitude: -3.7038 },
];

const mockWeatherData = [
  { temperature: 25, windSpeed: 10, description: "Sunny", date: new Date("2025-04-04") },
  { temperature: 20, windSpeed: 5, description: "Cloudy", date: new Date("2025-04-03") },
];

let wrapper: ReturnType<typeof mount>;

interface IVM extends ComponentPublicInstance {
  isLoading: boolean;
  selectedLocation: Location
  fetchLocations: () => Promise<void>;
  fetchWeather: () => Promise<void>;
}

let vm: IVM

beforeEach(() => {
  wrapper = mount(WeatherDashboard);

  vm = wrapper.vm as IVM

  vi.resetAllMocks();
});

describe("WeatherDashboard", () => {
  it("should render correctly with default state", () => {
    expect(wrapper.find("#location-select").exists()).toBe(true);
    expect(wrapper.find("button").text()).toBe("Get Weather");
    expect(wrapper.findAllComponents({ name: "WeatherCard" }).length).toBe(0);
  });

  it("should fetch and populate locations on mount", async () => {
    (getLocations as Mock).mockResolvedValue(mockLocations);

    await vm.fetchLocations(); // Simulate fetching locations

    // Assert locations dropdown
    const options = wrapper.findAll("#location-select option");
    expect(options.length).toBe(mockLocations.length);
    expect(options[0].text()).toContain("Lisbon (Portugal)");
    expect(options[1].text()).toContain("Madrid (Spain)");

    // Assert default selected location
    expect(vm.selectedLocation).toEqual(mockLocations[0]);
  });

  it("should display an error message if locations fail to load", async () => {
    // Mock failed location fetch
    (getLocations as Mock).mockRejectedValue(new Error("Failed to fetch locations"));

    await vm.fetchLocations(); // Simulate fetching locations

    // Assert error message
    expect(wrapper.find("[role='alert']").text()).toBe(
      "Failed to load locations. Please try again later."
    );
  });

  it("should fetch and render weather data when 'Get Weather' is clicked", async () => {
    // Mock successful location and weather fetch
    (getLocations as Mock).mockResolvedValue(mockLocations);
    (get7daysBeforeAndAfterWeather as Mock).mockResolvedValue(mockWeatherData);

    await vm.fetchLocations(); // Fetch locations
    await vm.fetchWeather(); // Fetch weather data

    // Assert rendered weather cards
    const weatherCards = wrapper.findAllComponents({ name: "WeatherCard" });
    expect(weatherCards.length).toBe(mockWeatherData.length);

    // Assert today's weather is highlighted
    expect(weatherCards[0].classes()).toContain("bg-blue-200");
  });

  it("should display an error message if weather data fails to fetch", async () => {
    // Mock failed weather fetch
    (get7daysBeforeAndAfterWeather as Mock).mockRejectedValue(new Error("Failed to fetch weather"));

    await vm.fetchLocations(); // Fetch locations
    await vm.fetchWeather(); // Attempt to fetch weather

    // Assert error message
    expect(wrapper.find("[role='alert']").text()).toBe(
      "An unexpected error occurred while fetching weather."
    );
  });

  it("should disable button and show loading state during fetch", async () => {
    // Mock successful location and weather fetch
    (getLocations as Mock).mockResolvedValue(mockLocations);

    await vm.fetchLocations(); // Fetch locations

    vm.isLoading = true; // Simulate loading state

    await Promise.resolve();

    const button = wrapper.find("button");

    // Assert button disabled and loading state
    expect(button.attributes("disabled")).toBeDefined();
    expect(button.text()).toBe("Fetching...");
  });
});
