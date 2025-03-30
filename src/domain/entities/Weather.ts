import { type Location } from "./Location";

export type Weather = {
  location: Location
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  date: Date;
};
