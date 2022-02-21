import { EffectDefinitions } from './conditional-visibility-effect-definition';
import { registerLibwrappers, updateTokenHandler } from './libwrapper';
import { registerSocket, conditionalVisibilitySocket } from './socket';

import CONSTANTS from './constants';
import HOOKS from './hooks';
import {
  debug,
  getConditionsFromToken,
  getSensesFromToken,
  prepareActiveEffectForConditionalVisibility,
} from './lib/lib';
import API from './api';
import EffectInterface from './effects/effect-interface';
import { registerHotkeys } from './hotkeys';
import { canvas, game } from './settings';
import { checkSystem } from './settings';
import { VisionCapabilities } from './conditional-visibility-models';

export const initHooks = async (): Promise<void> => {
  // registerSettings();
  registerLibwrappers();

  Hooks.once('socketlib.ready', registerSocket);

  Hooks.on('dfreds-convenient-effects.ready', () => {
    const effects = EffectDefinitions.all();
    //@ts-ignore
    game.dfreds.effectInterface.createNewCustomEffectWith({
      activeEffects: effects,
    });
  });

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

  // Deprecated to remove soon....
  //@ts-ignore
  window.ConditionalVisibility.setCondition = ConditionalVisibility.API.setCondition;

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
    module.onRenderTokenConfig(tokenConfig, html, data);
  });
  Hooks.on('renderTokenHUD', (app, html, token) => {
    module.onRenderTokenHUD(app, html, token);
  });

  Hooks.on('updateToken', (document: TokenDocument, change, options, userId) => {
    module.updateToken(document, change, options, userId);
  });
};

const module = {
  onRenderTokenConfig(tokenConfig: TokenConfig, jQuery: JQuery, data: object): void {
    const visionTab = $('div.tab[data-tab="vision"]');
    const senses = API.SENSES ?? [];

    const sensesData:any[] = [];
    for(const s of senses){
      const s2:any = duplicate(s);
      s2.value = tokenConfig.object.getFlag(CONSTANTS.MODULE_NAME, s.id);
      sensesData.push(s2);
    }
    const conditions = API.CONDITIONS ?? [];
    const conditionsData:any[] = [];
    for(const s of conditions){
      const s2:any = duplicate(s);
      s2.value = tokenConfig.object.getFlag(CONSTANTS.MODULE_NAME, s.id);
      conditionsData.push(s2);
    }
    renderTemplate(
      `modules/${CONSTANTS.MODULE_NAME}/templates/extra_senses.hbs`, {
        // flags: tokenConfig.object.data.flags[CONSTANTS.MODULE_NAME] ?? {},
        senses: sensesData,
        conditions:conditionsData
      }
    ).then((extraSenses) => {
      visionTab.append(extraSenses);
    });
  },
  onRenderTokenHUD(app, html, token){
    // DO NOTHING FOR NOW
  },
  updateToken(document: TokenDocument, change, options, userId){
    const token = <Token>document.object;
    if(change.flags && change.flags[CONSTANTS.MODULE_NAME]){
      const sourceVisionCapabilities: VisionCapabilities = new VisionCapabilities(<Token>document.object);
      if (sourceVisionCapabilities.hasSenses()) {
        // const sourceVisionLevels = getSensesFromToken(<Token>document.object);
        prepareActiveEffectForConditionalVisibility(token, sourceVisionCapabilities);
        // const sourceVisionLevels = getSensesFromToken(<Token>document.object);
      }
    }
    // TODO to analyze
    // If Using Stealth Mode for Player Tokens
    // if (game.settings.get(CONSTANTS.MODULE_NAME, "playerTokenStealthMode").valueOf()){
    //   if (change.disposition == 1 || change.disposition == 2){ // If friendly or Neutral
    //       if (options.hidden == true && game.user?.isGM == false){
    //           for (const placed_token of <Token[]>canvas.tokens?.placeables) {
    //               if (placed_token.id == options._id){ // Find the Token in Question
    //                   if (game.user.id in <Partial<Record<string, 0 | 1 | 2 | 3>>>placed_token?.actor?.data?.permission){ // If I'm an owner of the token; remain visible
    //                       placed_token.data.hidden = false;
    //                   } else {
    //                       placed_token.data.hidden = true;
    //                   }
    //               }
    //           }
    //       }
    //   }
    // }
  }
};
