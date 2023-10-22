import {
  dayHasChanged,
  onPreUpdateScene,
  onUpdateScene,
  toggleSheltered,
  toggleWeather,
} from "./weather/weather";
import { sceneWeatherSettingsDialog } from "./weather/dialogs/scene-weather-settings";
import { setCurrentWeatherDialog } from "./weather/dialogs/set-current-weather";
import { isFirstGm } from "./utils";
import { toTimeOfDayMacro } from "./time/app";
import { getBooleanSetting, getStringSetting /*setSetting*/ } from "./settings";
import { rollKingmakerWeather } from "./weather/roll-weather";
import { rollExplorationSkillCheck, rollSkillDialog } from "./skill-checks";
import { openCampingSheet } from "./camping/sheet";
import { bindCampingChatEventListeners } from "./camping/chat";
import { getDiffListeners } from "./camping/effect-syncing";
import { getCamping, getCampingActor } from "./camping/storage";
import {
  addDiscoverSpecialMealResult,
  addHuntAndGatherResult,
} from "./camping/eating";
import { getActorByUuid } from "./camping/actor";
//import "./types";
//import {migrate} from './migrations';

Hooks.on("ready", async () => {
  console.log("Game is Ready");
  console.log("Is game instanceof Game?", game instanceof Game);
  if (game instanceof Game) {
    const gameInstance = game;
    gameInstance.pf2eKingmakerTools = {
      macros: {
        toggleWeatherMacro: toggleWeather.bind(null, game),
        toggleShelteredMacro: toggleSheltered.bind(null, game),
        setCurrentWeatherMacro: setCurrentWeatherDialog.bind(null, game),
        sceneWeatherSettingsMacro: (): void => {
          const scene = gameInstance?.scenes?.current;
          if (scene) {
            sceneWeatherSettingsDialog(gameInstance, scene);
          }
        },
        toTimeOfDayMacro: toTimeOfDayMacro.bind(null, game),
        rollKingmakerWeatherMacro: rollKingmakerWeather.bind(null, game),
        /* eslint-disable @typescript-eslint/no-explicit-any */
        openCampingSheet: (): void => openCampingSheet(gameInstance),
        rollExplorationSkillCheck: async (
          skill: string,
          effect: string,
        ): Promise<void> => {
          const actors =
            canvas?.scene?.tokens
              ?.filter(
                (t) =>
                  t !== null &&
                  t.actor !== null &&
                  (t.actor.type === "character" || t.actor.type === "familiar"),
              )
              ?.map((t) => t.actor!) ?? [];
          await rollExplorationSkillCheck(actors, skill, effect);
        },
        rollSkillDialog: async (): Promise<void> => {
          const configuredActors =
            getStringSetting(gameInstance, "skillCheckMacroCharacterNames")
              ?.split("||")
              ?.map((s) => s.trim())
              ?.filter((s) => s !== "") ?? [];
          if (configuredActors.length === 0) {
            ui?.notifications?.error(
              "No actor names configured! Configure actor names first in settings",
            );
          } else {
            const actorNames = new Set(configuredActors);
            const actors =
              gameInstance?.actors?.filter(
                (actor) =>
                  (actor.type === "character" || actor.type === "familiar") &&
                  actor.name !== null &&
                  actorNames.has(actor.name),
              ) ?? [];
            await rollSkillDialog(actors);
          }
        },
      },
    };
    const rollModeChoices = {
      publicroll: "Public Roll",
      gmroll: "Private GM Roll",
      blindroll: "Blind GM Roll",
      selfroll: "Self Roll",
    };
    gameInstance.settings.register<string, string, number>(
      "campfire-tools",
      "averagePartyLevel",
      {
        name: "Average Party Level",
        default: 1,
        config: true,
        type: Number,
        scope: "world",
      },
    );
    gameInstance.settings.register<string, string, boolean>(
      "campfire-tools",
      "enableWeather",
      {
        name: "Enable Weather",
        default: true,
        config: true,
        type: Boolean,
        scope: "world",
      },
    );
    gameInstance.settings.register<string, string, boolean>(
      "campfire-tools",
      "enableSheltered",
      {
        name: "Enabled Sheltered",
        default: false,
        config: false,
        type: Boolean,
        scope: "world",
      },
    );
    gameInstance.settings.register<string, string, boolean>(
      "campfire-tools",
      "autoRollWeather",
      {
        name: "Automatically roll Weather",
        hint: "When a new day begins (00:00), automatically roll weather",
        default: true,
        config: true,
        type: Boolean,
        scope: "world",
      },
    );
    gameInstance.settings.register<string, string, string>(
      "campfire-tools",
      "weatherRollMode",
      {
        name: "Weather Roll Mode",
        scope: "world",
        config: true,
        default: "gmroll",
        type: String,
        choices: rollModeChoices,
      },
    );
    gameInstance.settings.register<string, string, number>(
      "campfire-tools",
      "weatherHazardRange",
      {
        name: "Weather Hazard Range",
        hint: "Maximum Level of Weather Event that can occur. Added to Average Party Level.",
        default: 4,
        config: true,
        type: Number,
        scope: "world",
      },
    );
    gameInstance.settings.register("campfire-tools", "currentWeatherFx", {
      name: "Current Weather FX",
      hint: "Based on the current value of the roll table",
      scope: "world",
      config: false,
      default: "sunny",
      type: String,
    });
    gameInstance.settings.register("campfire-tools", "proxyEncounterTable", {
      name: "Proxy Random Encounter Table",
      hint: 'Name of the in world roll table that is rolled first to check what kind of encounter is rolled. Use the string "Creature" to roll on the region roll table in the proxy roll table or link another roll table of your choice. Leave blank to always roll on the region random encounter tables.',
      scope: "world",
      config: true,
      default: "",
      type: String,
    });
    gameInstance.settings.register<string, string, string>(
      "campfire-tools",
      "randomEncounterRollMode",
      {
        name: "Random Encounter Roll Mode",
        scope: "world",
        config: true,
        default: "gmroll",
        type: String,
        choices: rollModeChoices,
      },
    );
    gameInstance.settings.register(
      "campfire-tools",
      "skillCheckMacroCharacterNames",
      {
        name: "Skill Check Macro Character Names",
        hint: "A string of character names separated by ||, e.g. Jake||John||The Undertaker",
        scope: "world",
        config: true,
        default: "",
        type: String,
      },
    );
    gameInstance.settings.register<string, string, number>(
      "campfire-tools",
      "schemaVersion",
      {
        name: "Schema Version",
        default: 1,
        config: false,
        type: Number,
        scope: "world",
      },
    );
    gameInstance.settings.register<string, string, string>(
      "campfire-tools",
      "latestMigrationBackup",
      {
        name: "Schema Version",
        default: "",
        config: false,
        type: String,
        scope: "world",
      },
    );

    // hooks
    Hooks.on("updateWorldTime", async (_, delta) => {
      if (
        getBooleanSetting(gameInstance, "autoRollWeather") &&
        isFirstGm(gameInstance) &&
        dayHasChanged(gameInstance, delta)
      ) {
        await rollKingmakerWeather(gameInstance);
      }
    });

    Hooks.on(
      "preUpdateScene",
      async (scene: StoredDocument<Scene>, update: Partial<Scene>) => {
        await onPreUpdateScene(gameInstance, scene, update);
      },
    );
    Hooks.on(
      "updateScene",
      async (scene: StoredDocument<Scene>, update: Partial<Scene>) => {
        await onUpdateScene(gameInstance, scene, update);
      },
    );
    checkCampingErrors(gameInstance);

    // listen for camping sheet open
    const listeners = getDiffListeners(gameInstance);
    gameInstance.socket!.on(
      "module.campfire-tools",
      async (data: { action: string; data: any }) => {
        if (data.action === "openCampingSheet") {
          openCampingSheet(gameInstance);
        } else if (
          data.action === "addDiscoverSpecialMealResult" &&
          isFirstGm(gameInstance)
        ) {
          const recipe = data.data.recipe as string | null;
          const criticalFailUuids = data.data.critFailUuids as string[];
          const actor = await getActorByUuid(data.data.actorUuid);
          const { specialIngredients, basicIngredients } = data.data;
          if (actor) {
            const actorAndIngredients = {
              actor,
              specialIngredients,
              basicIngredients,
            };
            await addDiscoverSpecialMealResult(
              gameInstance,
              actorAndIngredients,
              recipe,
              criticalFailUuids,
            );
          }
        } else if (
          data.action === "addHuntAndGatherResult" &&
          isFirstGm(gameInstance)
        ) {
          const actor = await getActorByUuid(data.data.actorUuid);
          const { specialIngredients, basicIngredients } = data.data;
          if (actor) {
            await addHuntAndGatherResult(gameInstance, {
              actor,
              basicIngredients,
              specialIngredients,
            });
          }
        } else {
          // players changed data and GM needs to sync effects
          const sheetActor = getCampingActor(gameInstance);
          if (sheetActor && isFirstGm(gameInstance)) {
            const camping = getCamping(sheetActor);
            for (const listener of listeners) {
              if (listener.canHandle(data.action)) {
                listener.onReceive(camping);
              }
            }
          }
        }
      },
    );
  }
});

Hooks.on("init", async () => {
  await loadTemplates([
    "modules/campfire-tools/templates/camping/activity.partial.hbs",
    "modules/campfire-tools/templates/camping/eating.partial.hbs",
  ]);
});

Hooks.on("renderChatLog", () => {
  if (game instanceof Game) {
    const gameInstance = game;
    bindCampingChatEventListeners(gameInstance);
  }
});

function checkCampingErrors(game: Game): void {
  const actor = getCampingActor(game);
  if (actor && !actor.getFlag("campfire-tools", "camping-sheet")) {
    ui.notifications?.error(
      'Found an Actor with name "Camping Sheet" that has not been imported using the "Camping" Macro! Please delete the actor and re-import it.',
    );
  }
}
