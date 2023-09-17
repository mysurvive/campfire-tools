interface ZoneData {
  zoneDC: number;
  encounterDC: number;
  level: number;
}

export const regions = new Map<string, ZoneData>();
regions.set("Yarrin Southern Plains", {
  zoneDC: 15,
  encounterDC: 12,
  level: 1,
});
regions.set("Yarrin Northern Plains", {
  zoneDC: 16,
  encounterDC: 12,
  level: 2,
});
regions.set("Riverlands", { zoneDC: 16, encounterDC: 12, level: 2 });
regions.set("Misty Coast", { zoneDC: 19, encounterDC: 14, level: 4 });
regions.set("Norster Foothills", { zoneDC: 18, encounterDC: 14, level: 3 });
regions.set("Yarrin Middle Empire", { zoneDC: 18, encounterDC: 14, level: 3 });
regions.set("Bragga Highlands", { zoneDC: 19, encounterDC: 20, level: 5 });
regions.set("Serrarim Forest", { zoneDC: 20, encounterDC: 20, level: 5 });
regions.set("Kaldric's Span", { zoneDC: 20, encounterDC: 12, level: 5 });
regions.set("Serrarim Valley", { zoneDC: 19, encounterDC: 12, level: 4 });

interface RegionInfo {
  zoneDC: number;
  zoneLevel: number;
}

export function getRegionInfo(region: string): RegionInfo {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const zone = regions.get(region);
  const zoneDC = zone?.zoneDC ?? 14;
  const zoneLevel = zone?.level ?? 0;
  return { zoneDC, zoneLevel };
}

export type AedenirMonth =
  | "Dynin"
  | "Dursda"
  | "Comin"
  | "Drygal"
  | "Balmont"
  | "Stardan"
  | "Erbin"
  | "Mesthol"
  | "Harpal"
  | "Mynin"
  | "Kester"
  | "Lestlinth";

export interface WeatherData {
  precipitationDC: number;
  coldDC?: number;
  season: "spring" | "summer" | "fall" | "winter";
}

const weatherData = new Map<AedenirMonth, WeatherData>();
weatherData.set("Dynin", { precipitationDC: 14, season: "spring", coldDC: 20 });
weatherData.set("Dursda", { precipitationDC: 10, season: "spring" });
weatherData.set("Comin", { precipitationDC: 15, season: "spring" });
weatherData.set("Drygal", { precipitationDC: 15, season: "summer" });
weatherData.set("Balmont", { precipitationDC: 15, season: "summer" });
weatherData.set("Stardan", { precipitationDC: 20, season: "summer" });
weatherData.set("Erbin", { precipitationDC: 20, season: "fall" });
weatherData.set("Mesthol", { precipitationDC: 20, season: "fall" });
weatherData.set("Harpal", { precipitationDC: 15, season: "fall" });
weatherData.set("Mynin", { precipitationDC: 8, season: "winter", coldDC: 18 });
weatherData.set("Kester", {
  precipitationDC: 8,
  season: "winter",
  coldDC: 16,
});
weatherData.set("Lestlinth", {
  coldDC: 18,
  precipitationDC: 8,
  season: "winter",
});

export function getSeason(month: AedenirMonth): WeatherData {
  return weatherData.get(month)!;
}

export const eventLevels = new Map<string, number>();
eventLevels.set("Fog", 0);
eventLevels.set("Heavy downpour", 0);
eventLevels.set("Cold snap", 1);
eventLevels.set("Windstorm", 1);
eventLevels.set("Hailstorm, severe", 2);
eventLevels.set("Blizzard", 6);
eventLevels.set("Supernatural storm", 6);
eventLevels.set("Flash flood", 7);
eventLevels.set("Wildfire", 4);
eventLevels.set("Subsidence", 5);
eventLevels.set("Thunderstorm", 7);
eventLevels.set("Tornado", 12);
