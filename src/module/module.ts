import { registerLibwrappers } from './libwrapper';
import { registerSocket, conditionalVisibilitySocket } from './socket';

import CONSTANTS from './constants';
import HOOKS from './hooks';
import {
  debug,
  getConditionsFromToken,
  getSensesFromToken,
  prepareActiveEffectForConditionalVisibility,
} from './lib/lib';
import API from './api.js';
import EffectInterface from './effects/effect-interface';
import { registerHotkeys } from './hotkeys';
import { canvas, game } from './settings';
import { checkSystem } from './settings';
import { VisionCapabilities } from './conditional-visibility-models';

export const initHooks = async (): Promise<void> => {
  // registerSettings();
  registerLibwrappers();

  Hooks.once('socketlib.ready', registerSocket);

  if (game.settings.get(CONSTANTS.MODULE_NAME, 'debugHooks')) {
    for (const hook of Object.values(HOOKS)) {
      if (typeof hook === 'string') {
        Hooks.on(hook, (...args) => debug(`Hook called: ${hook}`, ...args));
        debug(`Registered hook: ${hook}`);
      } else {
        for (const innerHook of Object.values(hook)) {
          Hooks.on(<string>innerHook, (...args) => debug(`Hook called: ${innerHook}`, ...args));
          debug(`Registered hook: ${innerHook}`);
        }
      }
    }
  }

  //@ts-ignore
  window.ConditionalVisibility = {
    API,
  };
};

export const setupHooks = async (): Promise<void> => {
  // setup all the hooks

  //@ts-ignore
  window.ConditionalVisibility.API.effectInterface = new EffectInterface(CONSTANTS.MODULE_NAME);
  //@ts-ignore
  window.ConditionalVisibility.API.effectInterface.initialize();

  if (game[CONSTANTS.MODULE_NAME]) {
    game[CONSTANTS.MODULE_NAME] = {};
  }
  if (game[CONSTANTS.MODULE_NAME].API) {
    game[CONSTANTS.MODULE_NAME].API = {};
  }
  //@ts-ignore
  game[CONSTANTS.MODULE_NAME].API = window.ConditionalVisibility.API;
};

export const readyHooks = async (): Promise<void> => {
  checkSystem();
  registerHotkeys();
  Hooks.callAll(HOOKS.READY);

  // ConditionalVisibility.initialize(sightLayer, canvas.hud?.token);
  // Add any additional hooks if necessary
  Hooks.on('renderTokenConfig', (tokenConfig, html, data) => {
    // ConditionalVisibility.INSTANCE.onRenderTokenConfig(tokenConfig, html, data);
    module.onRenderTokenConfig(tokenConfig, html, data);
  });
  // Hooks.on('renderTokenHUD', (app, html, token) => {
  //   // ConditionalVisibility.INSTANCE.onRenderTokenHUD(app, html, token);
  // });

  Hooks.on('updateToken', (document: TokenDocument, change, options, userId) => {
    if(change.flags && change.flags[CONSTANTS.MODULE_NAME]){
      const sourceVisionCapabilities: VisionCapabilities = new VisionCapabilities(<Token>document.object);
      if (sourceVisionCapabilities.hasSenses()) {
        const sourceVisionLevels = getSensesFromToken(<Token>document.object);
        prepareActiveEffectForConditionalVisibility(<Token>document.object, sourceVisionCapabilities);
      }
    }
  });
};

const module = {
  onRenderTokenConfig(tokenConfig: TokenConfig, jQuery: JQuery, data: object): void {
    const visionTab = $('div.tab[data-tab="vision"]');
    renderTemplate(
      `modules/${CONSTANTS.MODULE_NAME}/templates/extra_senses.html`,
      //@ts-ignore
      tokenConfig.object.data.flags[CONSTANTS.MODULE_NAME] ?? {},
    ).then((extraSenses) => {
      visionTab.append(extraSenses);
    });
  },
};
