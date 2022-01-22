import { registerLibwrappers } from './libwrapper';
import { registerSocket, conditionalVisibilitySocket } from './socket';
import { canvas, checkSystem, game } from './settings';
import CONSTANTS from './constants';
import HOOKS from './hooks';
import { debug } from './lib/lib';
import API from './api.js';
import EffectInterface from './effects/effect-interface';
import { registerHotkeys } from './hotkeys';

export const initHooks = async (): Promise<void> => {
  // registerSettings();
  registerLibwrappers();

  Hooks.once('socketlib.ready', registerSocket);
  // Hooks.on('canvasReady', module._canvasReady);
  // Hooks.on('preCreateToken', module._preCreatePile);
  // Hooks.on('createToken', module._createPile);
  // Hooks.on('deleteToken', module._deletePile);
  // Hooks.on('dropCanvasData', module._dropCanvasData);
  // Hooks.on('updateActor', module._pileAttributeChanged);
  // Hooks.on('createItem', module._pileInventoryChanged);
  // Hooks.on('updateItem', module._pileInventoryChanged);
  // Hooks.on('deleteItem', module._pileInventoryChanged);
  // Hooks.on('getActorSheetHeaderButtons', module._insertItemPileHeaderButtons);
  // Hooks.on('renderTokenHUD', module._renderPileHUD);

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
  const sightLayer = canvas.layers.find((layer) => {
    switch (game.system.id) {
      case 'dnd5e':
        //@ts-ignore
        return layer.__proto__.constructor.name === 'SightLayer';
        break;
      case 'pf2e':
        //@ts-ignore
        return layer.__proto__.constructor.name === 'SightLayerPF2e';
        break;
      default:
        //@ts-ignore
        return layer.__proto__.constructor.name === 'SightLayer';
    }
  });

  //@ts-ignore
  window.ConditionalVisibility.API.effectInterface = new EffectInterface(
    CONSTANTS.MODULE_NAME,
    conditionalVisibilitySocket,
  );

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

  //@ts-ignore
  //ConditionalVisibility.initialize(sightLayer, canvas.hud?.token);

  // Add any additional hooks if necessary
  Hooks.on('renderTokenConfig', (tokenConfig, html, data) => {
    // ConditionalVisibility.INSTANCE.onRenderTokenConfig(tokenConfig, html, data);
    module.onRenderTokenConfig(tokenConfig, html, data);
  });
  Hooks.on('renderTokenHUD', (app, html, token) => {
    // ConditionalVisibility.INSTANCE.onRenderTokenHUD(app, html, token);
  });

  Hooks.on('sightRefresh', () => {
    // ConditionalVisibility.INSTANCE.restrictVisibility(32);
  });
  //synthetic actors go through this
  // Hooks.on("preUpdateToken", ( token, update, options, userId) => {
  //     ConditionalVisibility.INSTANCE.onUpdateToken( token, update, options, userId);
  // });
  //real actors go through this
  Hooks.on('updateToken', (token, updates) => {
    // if ('elevation' in updates || 'x' in updates || 'y' in updates || 'rotation' in updates) {
    //   ConditionalVisibility.INSTANCE.restrictVisibility(100);
    //   //token._object.visible = ConditionalVisibility.canSee(token._object);
    // }
  });
  Hooks.on('createActiveEffect', (effect, options, userId) => {
    // ConditionalVisibility.INSTANCE.onCreateEffect(effect, options, userId);
  });

  Hooks.on('deleteActiveEffect', (effect, options, userId) => {
    // ConditionalVisibility.INSTANCE.onDeleteEffect(effect, options, userId);
  });

  Hooks.on('createItem', (effect, options, userId) => {
    // ConditionalVisibility.INSTANCE.onCreateEffect(effect, options, userId);
  });

  Hooks.on('deleteItem', (effect, options, userId) => {
    // ConditionalVisibility.INSTANCE.onDeleteEffect(effect, options, userId);
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
