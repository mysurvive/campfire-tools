interface ZoneData {
  zoneDC: number;
  encounterDC: number;
  level: number;
}

export const regions = new Map<string, ZoneData>();
regions.set("Yarrin Southern Plains", {
  zoneDC: 14,
  encounterDC: 12,
  level: 0,
});
regions.set("Yarrin Middle Empire", { zoneDC: 15, encounterDC: 12, level: 1 });
regions.set("Norster Foothills", { zoneDC: 16, encounterDC: 14, level: 2 });
regions.set("Bragga Lowlands", { zoneDC: 18, encounterDC: 12, level: 3 });
regions.set("Yarrin Midlands", { zoneDC: 19, encounterDC: 14, level: 4 });
regions.set("Serrarim Valley", { zoneDC: 19, encounterDC: 14, level: 4 });
regions.set("Serrarim Forest", { zoneDC: 20, encounterDC: 12, level: 5 });
/*regions.set("Sellen Hills", { zoneDC: 20, encounterDC: 12, level: 6 });
regions.set("Dunsward", { zoneDC: 18, encounterDC: 12, level: 7 });
regions.set("Nomen Heights", { zoneDC: 24, encounterDC: 12, level: 8 });
regions.set("Tors of Levenies", { zoneDC: 28, encounterDC: 16, level: 9 });
regions.set("Hooktongue", { zoneDC: 32, encounterDC: 14, level: 10 });
regions.set("Drelev", { zoneDC: 28, encounterDC: 12, level: 11 });
regions.set("Tiger Lords", { zoneDC: 28, encounterDC: 12, level: 12 });
regions.set("Rushlight", { zoneDC: 26, encounterDC: 12, level: 13 });
regions.set("Glenebon Lowlands", { zoneDC: 30, encounterDC: 12, level: 14 });
regions.set("Pitax", { zoneDC: 29, encounterDC: 12, level: 15 });
regions.set("Glenebon Uplands", { zoneDC: 35, encounterDC: 12, level: 16 });
regions.set("Numeria", { zoneDC: 36, encounterDC: 12, level: 17 });
regions.set("Thousand Voices", { zoneDC: 43, encounterDC: 14, level: 18 });
regions.set("Branthlend Mountains", { zoneDC: 41, encounterDC: 16, level: 19 });*/

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
