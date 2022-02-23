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
import {
  StatusEffectConditionFlags,
  StatusEffectSenseFlags,
  VisionCapabilities,
} from './conditional-visibility-models';
import { EffectChangeData, EffectChangeDataSource } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/effectChangeData';

export const initHooks = async (): Promise<void> => {
  // registerSettings();
  registerLibwrappers();

  Hooks.once('socketlib.ready', registerSocket);

  // Hooks.on('dfreds-convenient-effects.ready', () => {
  //   const effects = EffectDefinitions.all();
  //   //@ts-ignore
  //   game.dfreds.effectInterface.createNewCustomEffectWith({
  //     activeEffects: effects,
  //   });
  // });

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

  Hooks.on("updateActiveEffect", async (effect, options) => {
    module.updateActiveEffect(effect, options);
  });
};

const module = {
  onRenderTokenConfig(tokenConfig: TokenConfig, jQuery: JQuery, data: object): void {
    const visionTab = $('div.tab[data-tab="vision"]');
    const senses = API.SENSES ?? [];
    const sensesData: any[] = [];
    for (const s of senses) {
      if (s.id != StatusEffectSenseFlags.NONE && s.id != StatusEffectSenseFlags.NORMAL) {
        const s2: any = duplicate(s);
        s2.value = tokenConfig.object.getFlag(CONSTANTS.MODULE_NAME, s.id);
        sensesData.push(s2);
      }
    }
    const conditions = API.CONDITIONS ?? [];
    const conditionsData: any[] = [];
    for (const s of conditions) {
      if (s.id != StatusEffectSenseFlags.NONE && s.id != StatusEffectSenseFlags.NORMAL) {
        const s2: any = duplicate(s);
        s2.value = tokenConfig.object.getFlag(CONSTANTS.MODULE_NAME, s.id);
        conditionsData.push(s2);
      }
    }
    renderTemplate(`modules/${CONSTANTS.MODULE_NAME}/templates/extra_senses.hbs`, {
      // flags: tokenConfig.object.data.flags[CONSTANTS.MODULE_NAME] ?? {},
      senses: sensesData,
      conditions: conditionsData,
    }).then((extraSenses) => {
      visionTab.append(extraSenses);
    });
  },
  onRenderTokenHUD(app, html, token) {
    // DO NOTHING FOR NOW
  },
  updateToken(document: TokenDocument, change, options, userId) {
    const token = <Token>document.object;
    if (change.flags && change.flags[CONSTANTS.MODULE_NAME]) {
      const sourceVisionCapabilities: VisionCapabilities = new VisionCapabilities(<Token>document.object);
      if (sourceVisionCapabilities.hasSenses() || sourceVisionCapabilities.hasConditions()) {
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
  },
  updateActiveEffect(effect:ActiveEffect, options){
    if (!effect.data.changes?.find(effect => effect.key.includes("ATCV"))){
      return;
    }
    const actor = <Actor>effect.parent;
    const totalEffects = <ActiveEffect[]>actor?.effects.contents.filter(i => !i.data.disabled)
    const ATCVeffects = totalEffects.filter(entity => !!entity.data.changes.find(effect => effect.key.includes("ATCV")))
    if (effect.data.disabled){
      ATCVeffects.push(effect);
    }
    if (ATCVeffects.length > 0) {
      const entity = <Actor>effect.parent;
      if(entity.documentName !== "Actor"){
        return;
      }
      let link = getProperty(entity, "data.token.actorLink")
      if (link === undefined){
        link = true;
      }
      let tokenArray:Token[] = []
      if (!link){
        //@ts-ignore
        tokenArray = [entity.token?.object]
      }
      else {
        tokenArray = entity.getActiveTokens();
      }
      if (tokenArray === []){
        return;
      }
      // Organize non-disabled effects by their application priority
      // const changes = <EffectChangeData[]>ATCVeffects.reduce((changes, e:ActiveEffect) => {
      //     if (e.data.disabled){
      //       return changes;
      //     }
      //     //@ts-ignore
      //     return changes.concat((<EffectChangeData[]>e.data.changes).map((c:EffectChangeData) => {
      //         const c2 = <EffectChangeData>duplicate(c);
      //         c2.effect = e;
      //         c2.priority = <number>c2.priority ?? (c2.mode * 10);
      //         return c2;
      //     }));
      // }, []);
      // changes.sort((a, b) => <number>a.priority - <number>b.priority);
      const changes = effect.data.changes;
      // Apply all changes
      for (const change of changes) {
        if (!change.key.includes("ATCV")){
          continue;
        }
        const updateKey = change.key.slice(5);
        for(const statusSight of API.getAllSensesAndConditions()){
          if (updateKey === statusSight.id) {
            // no await 
            if(actor?.token){
              actor?.token?.setFlag(CONSTANTS.MODULE_NAME, updateKey, change.value);
            }else{
              actor?.setFlag(CONSTANTS.MODULE_NAME, updateKey, change.value);
            }
            if (statusSight?.path) {
              setProperty(this.token, <string>statusSight?.path, change.value);
            }
          }
        }
      }
    }
  }
};
