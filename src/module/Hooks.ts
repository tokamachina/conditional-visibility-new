import { error } from '../conditional-visibility';
import CONSTANTS from './constants';
import { registerHotkeys } from './hotkeys';
import { isGMConnected } from './lib/lib';
import { registerLibwrappers } from './libwrapper';
import { checkSystem, CONDITIONAL_VISIBILITY_MODULE_NAME } from './settings';
import { canvas, game } from './settings';

const prefix =
  (str) =>
  (strs, ...exprs) =>
    `${str}-${strs.reduce((a, c, i) => a + exprs[i - 1] + c)}`;
const module = prefix(CONSTANTS.MODULE_NAME);

export const HOOKS = {
  READY: module`ready`,
  // PRE_TRANSFER_EVERYTHING: module`preTransferEverything`,
  // TRANSFER_EVERYTHING: module`transferEverything`,
  // PILE: {
  //   PRE_CREATE: module`preCreateItemPile`,
  //   CREATE: module`createItemPile`,
  //   PRE_UPDATE: module`preUpdateItemPile`,
  //   UPDATE: module`updateItemPile`,
  //   PRE_DELETE: module`preDeleteItemPile`,
  //   DELETE: module`deleteItemPile`,
  //   PRE_CLOSE: module`preCloseItemPile`,
  //   CLOSE: module`closeItemPile`,
  //   PRE_OPEN: module`preOpenItemPile`,
  //   OPEN: module`openItemPile`,
  //   PRE_LOCK: module`preLockItemPile`,
  //   LOCK: module`lockItemPile`,
  //   PRE_UNLOCK: module`preUnlockItemPile`,
  //   UNLOCK: module`unlockItemPile`,
  //   PRE_RATTLE: module`preRattleItemPile`,
  //   RATTLE: module`rattleItemPile`,
  //   PRE_TURN_INTO: module`preTurnIntoItemPiles`,
  //   TURN_INTO: module`turnIntoItemPiles`,
  //   PRE_REVERT_FROM: module`preRevertFromItemPiles`,
  //   REVERT_FROM: module`revertFromItemPiles`,
  //   PRE_OPEN_INVENTORY: module`preOpenItemPileInventory`,
  //   OPEN_INVENTORY: module`openItemPileInventory`,
  // },
  // ITEM: {
  //   PRE_DROP_DETERMINED: module`preDropItemDetermined`,
  //   PRE_DROP: module`preDropItem`,
  //   DROP: module`dropItem`,
  //   PRE_TRANSFER: module`preTransferItems`,
  //   TRANSFER: module`transferItems`,
  //   PRE_ADD: module`preAddItems`,
  //   ADD: module`addItems`,
  //   PRE_REMOVE: module`preRemoveItems`,
  //   REMOVE: module`removeItems`,
  //   PRE_TRANSFER_ALL: module`preTransferAllItems`,
  //   TRANSFER_ALL: module`transferAllItems`,
  // },
  // ATTRIBUTE: {
  //   PRE_TRANSFER: module`preTransferAttributes`,
  //   TRANSFER: module`transferAttributes`,
  //   PRE_ADD: module`preAddAttributes`,
  //   ADD: module`addAttributes`,
  //   PRE_REMOVE: module`preRemoveAttributes`,
  //   REMOVE: module`removeAttributes`,
  //   PRE_TRANSFER_ALL: module`preTransferAllAttributes`,
  //   TRANSFER_ALL: module`transferAllAttributes`,
  // },
};

export const readyHooks = async (): Promise<void> => {
  // setup all the hooks
  // const sightLayer = canvas.layers.find((layer) => {
  //   switch (game.system.id) {
  //     case 'dnd5e':
  //       //@ts-ignore
  //       return layer.__proto__.constructor.name === 'SightLayer';
  //       break;
  //     case 'pf2e':
  //       //@ts-ignore
  //       return layer.__proto__.constructor.name === 'SightLayerPF2e';
  //       break;
  //     default:
  //       //@ts-ignore
  //       return layer.__proto__.constructor.name === 'SightLayer';
  //   }
  // });

  if (!game.modules.get('lib-wrapper')?.active && game.user?.isGM) {
    let word = 'install and activate';
    if (game.modules.get('lib-wrapper')) word = 'activate';
    throw error(`Requires the 'libWrapper' module. Please ${word} it.`);
  }
  if (!game.modules.get('socketlib')?.active && game.user?.isGM) {
    let word = 'install and activate';
    if (game.modules.get('socketlib')) word = 'activate';
    throw error(`Requires the 'socketlib' module. Please ${word} it.`);
  }

  // if (!isGMConnected()) {
  //   warn(`Requires a GM to be connected for players to be able to loot item piles.`, true);
  // }

  checkSystem();
  registerHotkeys();
  Hooks.callAll(HOOKS.READY);

  //@ts-ignore
  ConditionalVisibility.initialize(sightLayer, canvas.hud?.token);

  // Add any additional hooks if necessary
  Hooks.on('renderTokenConfig', (tokenConfig, html, data) => {
    ConditionalVisibility.INSTANCE.onRenderTokenConfig(tokenConfig, html, data);
  });
  Hooks.on('renderTokenHUD', (app, html, token) => {
    ConditionalVisibility.INSTANCE.onRenderTokenHUD(app, html, token);
  });

  Hooks.on('sightRefresh', () => {
    ConditionalVisibility.INSTANCE.restrictVisibility(32);
  });
  //synthetic actors go through this
  // Hooks.on("preUpdateToken", ( token, update, options, userId) => {
  //     ConditionalVisibility.INSTANCE.onUpdateToken( token, update, options, userId);
  // });
  //real actors go through this
  Hooks.on('updateToken', (token, updates) => {
    if ('elevation' in updates || 'x' in updates || 'y' in updates || 'rotation' in updates) {
      ConditionalVisibility.INSTANCE.restrictVisibility(100);
      //token._object.visible = ConditionalVisibility.canSee(token._object);
    }
  });
  Hooks.on('createActiveEffect', (effect, options, userId) => {
    ConditionalVisibility.INSTANCE.onCreateEffect(effect, options, userId);
  });

  Hooks.on('deleteActiveEffect', (effect, options, userId) => {
    ConditionalVisibility.INSTANCE.onDeleteEffect(effect, options, userId);
  });

  Hooks.on('createItem', (effect, options, userId) => {
    ConditionalVisibility.INSTANCE.onCreateEffect(effect, options, userId);
  });

  Hooks.on('deleteItem', (effect, options, userId) => {
    ConditionalVisibility.INSTANCE.onDeleteEffect(effect, options, userId);
  });
};

export const initHooks = (): void => {
  // registerSettings();
  registerLibwrappers();

  Hooks.once('socketlib.ready', registerSocket);
  Hooks.on('canvasReady', module._canvasReady);
  Hooks.on('preCreateToken', module._preCreatePile);
  Hooks.on('createToken', module._createPile);
  Hooks.on('deleteToken', module._deletePile);
  Hooks.on('dropCanvasData', module._dropCanvasData);
  Hooks.on('updateActor', module._pileAttributeChanged);
  Hooks.on('createItem', module._pileInventoryChanged);
  Hooks.on('updateItem', module._pileInventoryChanged);
  Hooks.on('deleteItem', module._pileInventoryChanged);
  Hooks.on('getActorSheetHeaderButtons', module._insertItemPileHeaderButtons);
  Hooks.on('renderTokenHUD', module._renderPileHUD);

  if (game.settings.get(CONSTANTS.MODULE_NAME, 'debugHooks')) {
    for (let hook of Object.values(HOOKS)) {
      if (typeof hook === 'string') {
        Hooks.on(hook, (...args) => lib.debug(`Hook called: ${hook}`, ...args));
        lib.debug(`Registered hook: ${hook}`);
      } else {
        for (let innerHook of Object.values(hook)) {
          Hooks.on(innerHook, (...args) => lib.debug(`Hook called: ${innerHook}`, ...args));
          lib.debug(`Registered hook: ${innerHook}`);
        }
      }
    }
  }

  window.ItemPiles = {
    API,
  };
};
