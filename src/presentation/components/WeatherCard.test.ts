import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import WeatherCard from "./WeatherCard.vue";
import type { Weather } from "@/domain/entities/Weather";

const mockWeather: Weather = {
  temperature: 25,
  windSpeed: 10,
  description: "Sunny",
  date: new Date("2025-04-04T00:00:00Z"),
};

describe("WeatherCard", () => {
  it("should render weather data correctly", () => {
    const wrapper = mount(WeatherCard, {
      props: { weather: mockWeather },
    });

    expect(wrapper.find("h3 strong").text()).toBe("April 4, 2025");
    expect(wrapper.text()).toContain("25°C");
    expect(wrapper.text()).toContain("10 km/h");
    expect(wrapper.text()).toContain("Sunny");
  });
});
