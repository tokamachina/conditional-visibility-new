import { registerLibwrappers } from './libwrapper';
import { registerSocket, conditionalVisibilitySocket } from './socket';
import { canvas, checkSystem, game } from './settings';
import CONSTANTS from './constants';
import { HOOKS } from './hooks';
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
  // async _pileAttributeChanged(actor, changes) {
  //   const target = actor?.token ?? actor;
  //   if (!lib.isValidItemPile(target)) return;
  //   const sourceAttributes = API.getItemPileAttributes(target);
  //   const validProperty = sourceAttributes.find((attribute) => {
  //     return hasProperty(changes, attribute.path);
  //   });
  //   if (!validProperty) return;
  //   const deleted = await API._checkItemPileShouldBeDeleted(target.uuid);
  //   await API._rerenderItemPileInventoryApplication(target.uuid, deleted);
  //   if (deleted || !game.user.isGM) return;
  //   return API._refreshItemPile(target.uuid);
  // },
  // async _pileInventoryChanged(item) {
  //   let target = item?.parent;
  //   if (!target) return;
  //   target = target?.token ?? target;
  //   if (!lib.isValidItemPile(target)) return;
  //   const deleted = await API._checkItemPileShouldBeDeleted(target.uuid);
  //   await API._rerenderItemPileInventoryApplication(target.uuid, deleted);
  //   if (deleted || !game.user.isGM) return;
  //   return API._refreshItemPile(target.uuid);
  // },
  // async _canvasReady(canvas) {
  //   const tokens = [...canvas.tokens.placeables].map((token) => token.document);
  //   for (const doc of tokens) {
  //     await API._initializeItemPile(doc);
  //     if (game.user.isGM) {
  //       await API._refreshItemPile(doc.uuid);
  //     }
  //   }
  // },
  // async _preCreatePile(token) {
  //   if (!lib.isValidItemPile(token)) return;
  //   token.data.update({
  //     img: lib.getItemPileTokenImage(token),
  //     scale: lib.getItemPileTokenScale(token),
  //   });
  // },
  // async _createPile(doc) {
  //   if (!lib.isValidItemPile(doc)) return;
  //   Hooks.callAll(HOOKS.PILE.CREATE, doc, lib.getItemPileData(doc));
  //   await API._initializeItemPile(doc);
  // },
  // async _deletePile(doc) {
  //   if (!lib.isValidItemPile(doc)) return;
  //   Hooks.callAll(HOOKS.PILE.DELETE, doc);
  //   return API._rerenderItemPileInventoryApplication(doc.uuid, true);
  // },
  // _renderPileHUD(app, html) {
  //   const document = app?.object?.document;
  //   if (!document) return;
  //   if (!lib.isValidItemPile(document)) return;
  //   const pileData = lib.getItemPileData(document);
  //   const container = $(`<div class="col right" style="right:-130px;"></div>`);
  //   if (pileData.isContainer) {
  //     const lock_button = $(
  //       `<div class="control-icon item-piles" title="${game.i18n.localize(
  //         'ITEM-PILES.HUD.ToggleLocked',
  //       )}"><i class="fas fa-lock${pileData.locked ? '' : '-open'}"></i></div>`,
  //     );
  //     lock_button.click(async function () {
  //       $(this).find('.fas').toggleClass('fa-lock').toggleClass('fa-lock-open');
  //       await API.toggleItemPileLocked(document);
  //     });
  //     container.append(lock_button);
  //     const open_button = $(
  //       `<div class="control-icon item-piles" title="${game.i18n.localize(
  //         'ITEM-PILES.HUD.ToggleClosed',
  //       )}"><i class="fas fa-box${pileData.closed ? '' : '-open'}"></i></div>`,
  //     );
  //     open_button.click(async function () {
  //       $(this).find('.fas').toggleClass('fa-box').toggleClass('fa-box-open');
  //       await API.toggleItemPileClosed(document);
  //     });
  //     container.append(open_button);
  //   }
  //   const configure_button = $(
  //     `<div class="control-icon item-piles" title="${game.i18n.localize(
  //       'ITEM-PILES.HUD.Configure',
  //     )}"><i class="fas fa-toolbox"></i></div>`,
  //   );
  //   configure_button.click(async function () {
  //     ItemPileConfig.show(document);
  //   });
  //   container.append(configure_button);
  //   html.append(container);
  // },
  // _insertItemPileHeaderButtons(actorSheet, buttons) {
  //   if (!game.user.isGM) return;
  //   let obj = actorSheet.object;
  //   buttons.unshift({
  //     label: 'ITEM-PILES.Defaults.Configure',
  //     icon: 'fas fa-box-open',
  //     class: 'item-piles-config',
  //     onclick: () => {
  //       ItemPileConfig.show(obj);
  //     },
  //   });
  // },
  // async _dropCanvasData(canvas, data) {
  //   return API._dropDataOnCanvas(canvas, data);
  // },
};
