export const allWeatherNames = [
  "snow",
  "rain",
  "sunny",
  "leaves",
  "rainStorm",
  "fog",
  "blizzard",
  "",
] as const;
export type WeatherEffectName = (typeof allWeatherNames)[number];

interface SceneWeatherSettings {
  syncWeather: boolean;
  syncWeatherPlaylist: boolean;
}

export function getWeatherSettings(scene: Scene): SceneWeatherSettings {
  const weather = scene.getFlag(
    "campfire-tools",
    "weather",
  ) as SceneWeatherSettings | null;
  return {
    syncWeather: weather?.syncWeather ?? true,
    syncWeatherPlaylist: weather?.syncWeatherPlaylist ?? true,
  };
}

export async function setWeatherSettings(
  scene: Scene,
  weather: SceneWeatherSettings,
): Promise<void> {
  await scene.setFlag("campfire-tools", "weather", weather);
}
