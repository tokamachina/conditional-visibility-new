import CONSTANTS from './constants.js';
import registerSettings, { checkSystem } from './settings.js';
import { registerSocket } from './socket.js';
import API from './api.js';
import * as lib from './lib/lib.js';
import { ItemPileConfig } from './formapplications/itemPileConfig.js';
import { registerLibwrappers } from './libwrapper.js';
import { HOOKS } from './hooks.js';
import { registerHotkeys } from './hotkeys.js';

Hooks.once('init', () => {});

Hooks.once('ready', () => {});

const module = {
  async _pileAttributeChanged(actor, changes) {
    const target = actor?.token ?? actor;
    if (!lib.isValidItemPile(target)) return;
    const sourceAttributes = API.getItemPileAttributes(target);
    const validProperty = sourceAttributes.find((attribute) => {
      return hasProperty(changes, attribute.path);
    });
    if (!validProperty) return;
    const deleted = await API._checkItemPileShouldBeDeleted(target.uuid);
    await API._rerenderItemPileInventoryApplication(target.uuid, deleted);
    if (deleted || !game.user.isGM) return;
    return API._refreshItemPile(target.uuid);
  },

  async _pileInventoryChanged(item) {
    let target = item?.parent;
    if (!target) return;
    target = target?.token ?? target;
    if (!lib.isValidItemPile(target)) return;
    const deleted = await API._checkItemPileShouldBeDeleted(target.uuid);
    await API._rerenderItemPileInventoryApplication(target.uuid, deleted);
    if (deleted || !game.user.isGM) return;
    return API._refreshItemPile(target.uuid);
  },

  async _canvasReady(canvas) {
    const tokens = [...canvas.tokens.placeables].map((token) => token.document);
    for (const doc of tokens) {
      await API._initializeItemPile(doc);
      if (game.user.isGM) {
        await API._refreshItemPile(doc.uuid);
      }
    }
  },

  async _preCreatePile(token) {
    if (!lib.isValidItemPile(token)) return;
    token.data.update({
      img: lib.getItemPileTokenImage(token),
      scale: lib.getItemPileTokenScale(token),
    });
  },

  async _createPile(doc) {
    if (!lib.isValidItemPile(doc)) return;
    Hooks.callAll(HOOKS.PILE.CREATE, doc, lib.getItemPileData(doc));
    await API._initializeItemPile(doc);
  },

  async _deletePile(doc) {
    if (!lib.isValidItemPile(doc)) return;
    Hooks.callAll(HOOKS.PILE.DELETE, doc);
    return API._rerenderItemPileInventoryApplication(doc.uuid, true);
  },

  _renderPileHUD(app, html) {
    const document = app?.object?.document;

    if (!document) return;

    if (!lib.isValidItemPile(document)) return;

    const pileData = lib.getItemPileData(document);

    const container = $(`<div class="col right" style="right:-130px;"></div>`);

    if (pileData.isContainer) {
      const lock_button = $(
        `<div class="control-icon item-piles" title="${game.i18n.localize(
          'ITEM-PILES.HUD.ToggleLocked',
        )}"><i class="fas fa-lock${pileData.locked ? '' : '-open'}"></i></div>`,
      );
      lock_button.click(async function () {
        $(this).find('.fas').toggleClass('fa-lock').toggleClass('fa-lock-open');
        await API.toggleItemPileLocked(document);
      });
      container.append(lock_button);

      const open_button = $(
        `<div class="control-icon item-piles" title="${game.i18n.localize(
          'ITEM-PILES.HUD.ToggleClosed',
        )}"><i class="fas fa-box${pileData.closed ? '' : '-open'}"></i></div>`,
      );
      open_button.click(async function () {
        $(this).find('.fas').toggleClass('fa-box').toggleClass('fa-box-open');
        await API.toggleItemPileClosed(document);
      });
      container.append(open_button);
    }

    const configure_button = $(
      `<div class="control-icon item-piles" title="${game.i18n.localize(
        'ITEM-PILES.HUD.Configure',
      )}"><i class="fas fa-toolbox"></i></div>`,
    );
    configure_button.click(async function () {
      ItemPileConfig.show(document);
    });
    container.append(configure_button);

    html.append(container);
  },

  _insertItemPileHeaderButtons(actorSheet, buttons) {
    if (!game.user.isGM) return;

    let obj = actorSheet.object;

    buttons.unshift({
      label: 'ITEM-PILES.Defaults.Configure',
      icon: 'fas fa-box-open',
      class: 'item-piles-config',
      onclick: () => {
        ItemPileConfig.show(obj);
      },
    });
  },

  async _dropCanvasData(canvas, data) {
    return API._dropDataOnCanvas(canvas, data);
  },
};
