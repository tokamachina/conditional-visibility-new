import { CONSTANTS } from './constants';
import { dialogWarning, warn } from './lib/lib';
import { SYSTEMS } from './systems';

export const game = getGame();
export const canvas = getCanvas();

/**
 * Because typescript doesn't know when in the lifecycle of foundry your code runs, we have to assume that the
 * canvas is potentially not yet initialized, so it's typed as declare let canvas: Canvas | {ready: false}.
 * That's why you get errors when you try to access properties on canvas other than ready.
 * In order to get around that, you need to type guard canvas.
 * Also be aware that this will become even more important in 0.8.x because no canvas mode is being introduced there.
 * So you will need to deal with the fact that there might not be an initialized canvas at any point in time.
 * @returns
 */
function getCanvas(): Canvas {
  if (!(canvas instanceof Canvas) || !canvas.ready) {
    throw new Error('Canvas Is Not Initialized');
  }
  return canvas;
}

/**
 * Because typescript doesn't know when in the lifecycle of foundry your code runs, we have to assume that the
 * canvas is potentially not yet initialized, so it's typed as declare let canvas: Canvas | {ready: false}.
 * That's why you get errors when you try to access properties on canvas other than ready.
 * In order to get around that, you need to type guard canvas.
 * Also be aware that this will become even more important in 0.8.x because no canvas mode is being introduced there.
 * So you will need to deal with the fact that there might not be an initialized canvas at any point in time.
 * @returns
 */
function getGame(): Game {
  if (!(game instanceof Game)) {
    throw new Error('Game Is Not Initialized');
  }
  return game;
}

export const CONDITIONAL_VISIBILITY_MODULE_NAME = CONSTANTS.MODULE_NAME;
// export const CONDITIONAL_VISIBILITY_DEFAULT_STEALTH = 10;

function defaultSettings(apply = false) {
  return {
    dynamicAttributes: {
      scope: 'world',
      config: false,
      //@ts-ignore
      default: apply && SYSTEMS.DATA ? SYSTEMS.DATA.SENSES : [],
      type: Array,
    },
    // actorClassType: {
    //   name: `${CONDITIONAL_VISIBILITY_MODULE_NAME}.Setting.ActorClass.name`,
    //   hint: `${CONDITIONAL_VISIBILITY_MODULE_NAME}.Setting.ActorClass.hint`,
    //   scope: 'world',
    //   config: true,
    //   default: apply && SYSTEMS.DATA ? SYSTEMS.DATA.ACTOR_CLASS_TYPE : game.system.template.Actor?.types[0],
    //   type: String,
    // },
    // itemQuantityAttribute: {
    //   name: `${CONDITIONAL_VISIBILITY_MODULE_NAME}.Setting.Quantity.name`,
    //   hint: `${CONDITIONAL_VISIBILITY_MODULE_NAME}.Setting.Quantity.hint`,
    //   scope: 'world',
    //   config: true,
    //   default: apply && SYSTEMS.DATA ? SYSTEMS.DATA.ITEM_QUANTITY_ATTRIBUTE : '',
    //   type: String,
    // },
    // visibilityTypeAttribute: {
    //   name: `${CONDITIONAL_VISIBILITY_MODULE_NAME}.setting.visibilityType.name`,
    //   hint: `${CONDITIONAL_VISIBILITY_MODULE_NAME}.setting.visibilityType.hint`,
    //   scope: 'world',
    //   config: true,
    //   default: apply && SYSTEMS.DATA ? SYSTEMS.DATA.ITEM_TYPE_ATTRIBUTE : '',
    //   type: String,
    // },
    // visibilityTypeFilters: {
    //   name: `${CONDITIONAL_VISIBILITY_MODULE_NAME}.setting.visibilityTypeFilters.name`,
    //   hint: `${CONDITIONAL_VISIBILITY_MODULE_NAME}.setting.visibilityTypeFilters.hint`,
    //   scope: 'world',
    //   config: true,
    //   default: apply && SYSTEMS.DATA ? SYSTEMS.DATA.ITEM_TYPE_FILTERS : '',
    //   type: String,
    // },
    visibilityDefaultValue: {
      name: `${CONDITIONAL_VISIBILITY_MODULE_NAME}.setting.visibilityDefaultValue.name`,
      hint: `${CONDITIONAL_VISIBILITY_MODULE_NAME}.setting.visibilityDefaultValue.hint`,
      scope: 'world',
      config: true,
      default: 10,
      type: Number,
    },
  };
}

export const registerSettings = function (): void {
  game.settings.registerMenu(CONSTANTS.MODULE_NAME, 'resetAllSettings', {
    name: `${CONDITIONAL_VISIBILITY_MODULE_NAME}.Setting.Reset.name`,
    hint: `${CONDITIONAL_VISIBILITY_MODULE_NAME}.Setting.Reset.hint`,
    icon: 'fas fa-coins',
    type: ResetSettingsDialog,
    restricted: true,
  });

  // game.settings.registerMenu(CONSTANTS.MODULE_NAME, "openDynamicAttributesEditor", {
  //     name: `${CONDITIONAL_VISIBILITY_MODULE_NAME}.Setting.Attributes.name`,
  //     hint: `${CONDITIONAL_VISIBILITY_MODULE_NAME}.Setting.Attributes.hint`,
  //     icon: "fas fa-coins",
  //     type: ItemPileAttributeEditor,
  //     restricted: true
  // });

  const settings = defaultSettings();
  for (const [name, data] of Object.entries(settings)) {
    //@ts-ignore
    game.settings.register(CONSTANTS.MODULE_NAME, name, data);
  }

  game.settings.register(CONSTANTS.MODULE_NAME, 'deleteEmptyPiles', {
    name: `${CONDITIONAL_VISIBILITY_MODULE_NAME}.Setting.DeleteEmptyPiles.name`,
    hint: `${CONDITIONAL_VISIBILITY_MODULE_NAME}.Setting.DeleteEmptyPiles.hint`,
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'preloadFiles', {
    name: `${CONDITIONAL_VISIBILITY_MODULE_NAME}.Setting.PreloadFiles.name`,
    hint: `${CONDITIONAL_VISIBILITY_MODULE_NAME}.Setting.PreloadFiles.hint`,
    scope: 'client',
    config: true,
    default: true,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'defaultItemPileActorID', {
    scope: 'world',
    config: false,
    default: '',
    type: String,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'debug', {
    name: `${CONDITIONAL_VISIBILITY_MODULE_NAME}.Setting.Debug.name`,
    hint: `${CONDITIONAL_VISIBILITY_MODULE_NAME}.Setting.Debug.hint`,
    scope: 'client',
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'debugHooks', {
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'systemFound', {
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'systemNotFoundWarningShown', {
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  //   game.settings.register(CONSTANTS.MODULE_NAME, 'monksActiveTilesDropItemWarning', {
  //     scope: 'world',
  //     config: false,
  //     default: false,
  //     type: Boolean,
  //   });
};

class ResetSettingsDialog extends FormApplication {
  constructor(...args: any[]) {
    super(args);
    //@ts-ignore
    return new Dialog({
      title: game.i18n.localize(`${CONDITIONAL_VISIBILITY_MODULE_NAME}.Dialogs.ResetSettings.Title`),
      content:
        '<p style="margin-bottom:1rem;">' +
        game.i18n.localize(`${CONDITIONAL_VISIBILITY_MODULE_NAME}.Dialogs.ResetSettings.Content`) +
        '</p>',
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize(`${CONDITIONAL_VISIBILITY_MODULE_NAME}.Dialogs.ResetSettings.Confirm`),
          callback: async () => {
            await applyDefaultSettings();
            window.location.reload();
          },
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize(`${CONDITIONAL_VISIBILITY_MODULE_NAME}.Dialogs.Cancel`),
        },
      },
      default: 'cancel',
    });
  }

  async _updateObject(event: Event, formData?: object): Promise<any> {
    // do nothing
  }
}

async function applyDefaultSettings() {
  const settings = defaultSettings(true);
  for (const [name, data] of Object.entries(settings)) {
    await game.settings.set(CONSTANTS.MODULE_NAME, name, data.default);
  }
}

export async function checkSystem() {
  if (!SYSTEMS.DATA) {
    if (game.settings.get(CONSTANTS.MODULE_NAME, 'systemNotFoundWarningShown')) return;

    await game.settings.set(CONSTANTS.MODULE_NAME, 'systemNotFoundWarningShown', true);

    return Dialog.prompt({
      title: game.i18n.localize(`${CONDITIONAL_VISIBILITY_MODULE_NAME}.Dialogs.NoSystemFound.Title`),
      content: dialogWarning(game.i18n.localize(`${CONDITIONAL_VISIBILITY_MODULE_NAME}.Dialogs.NoSystemFound.Content`)),
      callback: () => {},
    });
  }

  if (game.settings.get(CONSTANTS.MODULE_NAME, 'systemFound')) return;

  game.settings.set(CONSTANTS.MODULE_NAME, 'systemFound', true);

  if (game.settings.get(CONSTANTS.MODULE_NAME, 'systemNotFoundWarningShown')) {
    return new Dialog({
      title: game.i18n.localize(`${CONDITIONAL_VISIBILITY_MODULE_NAME}.Dialogs.SystemFound.Title`),
      content: warn(game.i18n.localize(`${CONDITIONAL_VISIBILITY_MODULE_NAME}.Dialogs.SystemFound.Content`), true),
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize(`${CONDITIONAL_VISIBILITY_MODULE_NAME}.Dialogs.SystemFound.Confirm`),
          callback: () => {
            applyDefaultSettings();
          },
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize('No'),
        },
      },
      default: 'cancel',
    }).render(true);
  }

  return applyDefaultSettings();
}
