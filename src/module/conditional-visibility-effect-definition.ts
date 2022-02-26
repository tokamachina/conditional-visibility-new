import API from './api';
import { AtcvEffectSenseFlags, AtcvEffectConditionFlags, SenseData } from './conditional-visibility-models';
import CONSTANTS from './constants';
import Effect, { Constants } from './effects/effect';
import { debug, i18n, i18nFormat, warn } from './lib/lib';
import { canvas, game } from './settings';

/**
 * Defines all of the effect definitions
 */
export class ConditionalVisibilityEffectDefinitions {
  constructor() {}

  // regex expression to match all non-alphanumeric characters in string
  private static regex = /[^A-Za-z0-9]/g;

  /**
   * Get all effects
   *
   * @returns {Effect[]} all the effects
   */
  static all(distance = 0, visionLevel = 0): Effect[] {
    const effects: Effect[] = [];

    // EffectDefinitions.shadowEffect(distance),

    // SENSES
    const blinded = ConditionalVisibilityEffectDefinitions.blinded(distance, visionLevel);
    if (blinded) {
      effects.push(blinded);
    }
    const blindsight = ConditionalVisibilityEffectDefinitions.blindsight(distance, visionLevel);
    if (blindsight) {
      effects.push(blindsight);
    }
    const darkvision = ConditionalVisibilityEffectDefinitions.darkvision(distance, visionLevel);
    if (darkvision) {
      effects.push(darkvision);
    }
    const devilssight = ConditionalVisibilityEffectDefinitions.devilssight(distance, visionLevel);
    if (devilssight) {
      effects.push(devilssight);
    }
    const lowlightvision = ConditionalVisibilityEffectDefinitions.lowlightvision(distance, visionLevel);
    if (lowlightvision) {
      effects.push(lowlightvision);
    }
    const seeinvisible = ConditionalVisibilityEffectDefinitions.seeinvisible(distance, visionLevel);
    if (seeinvisible) {
      effects.push(seeinvisible);
    }
    const tremorsense = ConditionalVisibilityEffectDefinitions.tremorsense(distance, visionLevel);
    if (tremorsense) {
      effects.push(tremorsense);
    }
    const truesight = ConditionalVisibilityEffectDefinitions.truesight(distance, visionLevel);
    if (truesight) {
      effects.push(truesight);
    }
    // CONDITIONS
    const hidden = ConditionalVisibilityEffectDefinitions.hidden(visionLevel);
    if (hidden) {
      effects.push(hidden);
    }
    const invisible = ConditionalVisibilityEffectDefinitions.invisible(visionLevel);
    if (invisible) {
      effects.push(invisible);
    }
    const obscured = ConditionalVisibilityEffectDefinitions.obscured(visionLevel);
    if (obscured) {
      effects.push(obscured);
    }
    const indarkness = ConditionalVisibilityEffectDefinitions.indarkness(visionLevel);
    if (indarkness) {
      effects.push(indarkness);
    }

    // for (const effectExternal of API.EFFECTS) {
    //   const effectFounded = <Effect>effects.find((effect: Effect) => {
    //     return (
    //       effect.name.toLowerCase() === effectExternal.name.toLowerCase() ||
    //       effect.customId.toLowerCase() === effectExternal.customId.toLowerCase()
    //     );
    //   });
    //   if (!effectFounded && effectExternal) {
    //     effects.push(effectExternal);
    //   }
    // }
    return effects;
  }

  static async effect(nameOrCustomId: string, distance = 0, visionLevel = 0): Promise<Effect | undefined> {
    const effect = <Effect>ConditionalVisibilityEffectDefinitions.all(distance, visionLevel).find((effect: Effect) => {
      return (
        effect.name.toLowerCase() === nameOrCustomId.toLowerCase() ||
        effect.customId.toLowerCase() === nameOrCustomId.toLowerCase()
      );
    });
    if (!effect) {
      warn(`Not founded effect with name ${nameOrCustomId}`, true);
      return undefined;
    }
    const senses = await API.getAllSensesAndConditions();
    let effectFounded: Effect | undefined = undefined;
    for (const senseData of senses) {
      if (effect?.customId == senseData.id || i18n(effect.name) == i18n(senseData.name)) {
        effectFounded = effect;
        break;
      }
    }
    return effectFounded;
  }

  // ===========================================
  // The source effect
  // =============================================

  // static stealthpassive(number: number) {
  //   return new Effect({
  //     name: i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.stealthpassive.name`, { number : number}),
  //     description: i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.stealthpassive.description`, { number : number}),
  //     icon: '',
  //     // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
  //     transfer: true,
  //     changes: [
  //       {
  //         key: 'data.attributes.senses.stealthpassive',
  //         mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
  //         value: number && number > 0 ? `${number}` : `@data.skills.ste.passive`,
  //         priority: 5,
  //       },
  //     ],
  //   });
  // }

  static darkvision(number: number, visionLevel) {
    const effectSight = API.SENSES.find((a: SenseData) => {
      // use replace() method to match and remove all the non-alphanumeric characters
      return a.id
        .replace(ConditionalVisibilityEffectDefinitions.regex, '')
        .toLowerCase()
        .startsWith(
          AtcvEffectSenseFlags.DARKVISION.replace(ConditionalVisibilityEffectDefinitions.regex, '').toLowerCase(),
        );
    });
    if (!effectSight) {
      debug(
        `Cannot find for system '${game.system.id}' the active effect with id '${AtcvEffectSenseFlags.DARKVISION}'`,
      );
      return;
    }
    return new Effect({
      customId: AtcvEffectSenseFlags.DARKVISION,
      name:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.darkvision.name2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.darkvision.name`),
      description:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.darkvision.description2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.darkvision.description`),
      icon: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/evil-eye-red-1.jpg`,
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [
        {
          key: effectSight.path,
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: number && number > 0 ? `${number}` : `${effectSight.path}`,
          priority: 5,
        },
      ],
      atlChanges: [
        {
          key: ConditionalVisibilityEffectDefinitions._createAtlEffectKey('ATL.light.dim'),
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: `${number}`,
          priority: 5,
        },
      ],
      atcvChanges: [
        {
          key: 'ATCV.' + AtcvEffectSenseFlags.DARKVISION,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: `${visionLevel}`,
          priority: 5,
        },
      ],
      isTemporary: false,
    });
  }

  static blindsight(number: number, visionLevel) {
    const effectSight = API.SENSES.find((a: SenseData) => {
      // use replace() method to match and remove all the non-alphanumeric characters
      return a.id
        .replace(ConditionalVisibilityEffectDefinitions.regex, '')
        .toLowerCase()
        .startsWith(
          AtcvEffectSenseFlags.BLIND_SIGHT.replace(ConditionalVisibilityEffectDefinitions.regex, '').toLowerCase(),
        );
    });
    if (!effectSight) {
      debug(
        `Cannot find for system '${game.system.id}' the active effect with id '${AtcvEffectSenseFlags.BLIND_SIGHT}'`,
      );
      return;
    }
    return new Effect({
      customId: AtcvEffectSenseFlags.BLIND_SIGHT,
      name:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.blindsight.name2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.blindsight.name`),
      description:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.blindsight.description2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.blindsight.description`),
      icon: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/green_18.jpg`,
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [
        {
          key: effectSight.path,
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: number && number > 0 ? `${number}` : `${effectSight.path}`,
          priority: 5,
        },
      ],
      atcvChanges: [
        {
          key: 'ATCV.' + AtcvEffectSenseFlags.BLIND_SIGHT,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: `${visionLevel}`,
          priority: 5,
        },
      ],
      isTemporary: false,
    });
  }

  static tremorsense(number: number, visionLevel) {
    const effectSight = API.SENSES.find((a: SenseData) => {
      // use replace() method to match and remove all the non-alphanumeric characters
      return a.id
        .replace(ConditionalVisibilityEffectDefinitions.regex, '')
        .toLowerCase()
        .startsWith(
          AtcvEffectSenseFlags.TREMOR_SENSE.replace(ConditionalVisibilityEffectDefinitions.regex, '').toLowerCase(),
        );
    });
    if (!effectSight) {
      debug(
        `Cannot find for system '${game.system.id}' the active effect with id '${AtcvEffectSenseFlags.TREMOR_SENSE}'`,
      );
      return;
    }
    return new Effect({
      customId: AtcvEffectSenseFlags.TREMOR_SENSE,
      name:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.tremorsense.name2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.tremorsense.name`),
      description:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.tremorsense.description2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.tremorsense.description`),
      icon: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/ice_15.jpg`,
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [
        {
          key: effectSight.path,
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: number && number > 0 ? `${number}` : `${effectSight.path}`,
          priority: 5,
        },
      ],
      atcvChanges: [
        {
          key: 'ATCV.' + AtcvEffectSenseFlags.TREMOR_SENSE,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: `${visionLevel}`,
          priority: 5,
        },
      ],
      isTemporary: false,
    });
  }

  static truesight(number, visionLevel) {
    const effectSight = API.SENSES.find((a: SenseData) => {
      // use replace() method to match and remove all the non-alphanumeric characters
      return a.id
        .replace(ConditionalVisibilityEffectDefinitions.regex, '')
        .toLowerCase()
        .startsWith(
          AtcvEffectSenseFlags.TRUE_SIGHT.replace(ConditionalVisibilityEffectDefinitions.regex, '').toLowerCase(),
        );
    });
    if (!effectSight) {
      debug(
        `Cannot find for system '${game.system.id}' the active effect with id '${AtcvEffectSenseFlags.TRUE_SIGHT}'`,
      );
      return;
    }
    return new Effect({
      customId: AtcvEffectSenseFlags.TRUE_SIGHT,
      name:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.truesight.name2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.truesight.name`),
      description:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.truesight.description2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.truesight.description`),
      icon: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/emerald_11.jpg`,
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [
        {
          key: effectSight.path,
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: number && number > 0 ? `${number}` : `${effectSight.path}`,
          priority: 5,
        },
      ],
      atcvChanges: [
        {
          key: 'ATCV.' + AtcvEffectSenseFlags.TRUE_SIGHT,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: `${visionLevel}`,
          priority: 5,
        },
      ],
      isTemporary: false,
    });
  }

  static seeinvisible(number, visionLevel) {
    const effectSight = API.SENSES.find((a: SenseData) => {
      // use replace() method to match and remove all the non-alphanumeric characters
      return a.id
        .replace(ConditionalVisibilityEffectDefinitions.regex, '')
        .toLowerCase()
        .startsWith(
          AtcvEffectSenseFlags.SEE_INVISIBLE.replace(ConditionalVisibilityEffectDefinitions.regex, '').toLowerCase(),
        );
    });
    if (!effectSight) {
      debug(
        `Cannot find for system '${game.system.id}' the active effect with id '${AtcvEffectSenseFlags.SEE_INVISIBLE}'`,
      );
      return;
    }
    return new Effect({
      customId: AtcvEffectSenseFlags.SEE_INVISIBLE,
      name:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.seeinvisible.name2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.seeinvisible.name`),
      description:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.seeinvisible.description2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.seeinvisible.description`),
      icon: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/shadow_11.jpg`,
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [
        {
          key: effectSight.path,
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: number && number > 0 ? `${number}` : `${effectSight.path}`,
          priority: 5,
        },
      ],
      atcvChanges: [
        {
          key: 'ATCV.' + AtcvEffectSenseFlags.SEE_INVISIBLE,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: `${visionLevel}`,
          priority: 5,
        },
      ],
      isTemporary: false,
    });
  }

  static devilssight(number, visionLevel) {
    const effectSight = API.SENSES.find((a: SenseData) => {
      // use replace() method to match and remove all the non-alphanumeric characters
      return a.id
        .replace(ConditionalVisibilityEffectDefinitions.regex, '')
        .toLowerCase()
        .startsWith(
          AtcvEffectSenseFlags.DEVILS_SIGHT.replace(ConditionalVisibilityEffectDefinitions.regex, '').toLowerCase(),
        );
    });
    if (!effectSight) {
      debug(
        `Cannot find for system '${game.system.id}' the active effect with id '${AtcvEffectSenseFlags.DEVILS_SIGHT}'`,
      );
      return;
    }
    return new Effect({
      customId: AtcvEffectSenseFlags.DEVILS_SIGHT,
      name:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.devilssight.name2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.devilssight.name`),
      description:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.devilssight.description2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.devilssight.description`),
      icon: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/blue_17.jpg`,
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [
        {
          key: effectSight.path,
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: number && number > 0 ? `${number}` : `${effectSight.path}`,
          priority: 5,
        },
      ],
      atcvChanges: [
        {
          key: 'ATCV.' + AtcvEffectSenseFlags.DEVILS_SIGHT,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: `${visionLevel}`,
          priority: 5,
        },
      ],
      isTemporary: false,
    });
  }

  static lowlightvision(number, visionLevel) {
    const effectSight = API.SENSES.find((a: SenseData) => {
      // use replace() method to match and remove all the non-alphanumeric characters
      return a.id
        .replace(ConditionalVisibilityEffectDefinitions.regex, '')
        .toLowerCase()
        .startsWith(
          AtcvEffectSenseFlags.LOW_LIGHT_VISION.replace(ConditionalVisibilityEffectDefinitions.regex, '').toLowerCase(),
        );
    });
    if (!effectSight) {
      debug(
        `Cannot find for system '${game.system.id}' the active effect with id '${AtcvEffectSenseFlags.LOW_LIGHT_VISION}'`,
      );
      return;
    }
    return new Effect({
      customId: AtcvEffectSenseFlags.LOW_LIGHT_VISION,
      name:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.lowlightvision.name2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.lowlightvision.name`),
      description:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.lowlightvision.description2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.lowlightvision.description`),
      icon: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/violet_09.jpg`,
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [
        {
          key: effectSight.path,
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: number && number > 0 ? `${number}` : `${effectSight.path}`,
          priority: 5,
        },
      ],
      atlChanges: [
        // {
        //   key: EffectDefinitions._createAtlEffectKey('ATL.light.dim'),
        //   mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
        //   value: `data.token.dimSight`,
        //   priority: 5,
        // },
        {
          key: ConditionalVisibilityEffectDefinitions._createAtlEffectKey('ATL.light.bright'),
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: `data.token.dimSight`,
          priority: 5,
        },
      ],
      atcvChanges: [
        {
          key: 'ATCV.' + AtcvEffectSenseFlags.LOW_LIGHT_VISION,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: `${visionLevel}`,
          priority: 5,
        },
      ],
      isTemporary: false,
    });
  }

  static blinded(number, visionLevel) {
    const effectSight = API.SENSES.find((a: SenseData) => {
      // use replace() method to match and remove all the non-alphanumeric characters
      return a.id
        .replace(ConditionalVisibilityEffectDefinitions.regex, '')
        .toLowerCase()
        .startsWith(
          AtcvEffectSenseFlags.BLINDED.replace(ConditionalVisibilityEffectDefinitions.regex, '').toLowerCase(),
        );
    });
    if (!effectSight) {
      debug(`Cannot find for system '${game.system.id}' the active effect with id '${AtcvEffectSenseFlags.BLINDED}'`);
      return;
    }
    return new Effect({
      customId: AtcvEffectSenseFlags.BLINDED,
      name:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.blinded.name2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.blinded.name`),
      description:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.blinded.description2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.blinded.description`),
      icon: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/affliction_24.jpg`,
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [],
      atlChanges: [
        {
          key: ConditionalVisibilityEffectDefinitions._createAtlEffectKey('ATL.light.dim'),
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: `0`,
          priority: 5,
        },
        {
          key: ConditionalVisibilityEffectDefinitions._createAtlEffectKey('ATL.light.bright'),
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: `0`,
          priority: 5,
        },
        {
          key: ConditionalVisibilityEffectDefinitions._createAtlEffectKey('ATL.light.animation'),
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '{ "type":"none"}',
          priority: 5,
        },
      ],
      atcvChanges: [
        {
          key: 'ATCV.' + AtcvEffectSenseFlags.BLINDED,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: `${visionLevel}`,
          priority: 5,
        },
      ],
      isTemporary: false,
    });
  }

  // =================================================
  // The target effect
  // =================================================

  static hidden(visionLevel = 0) {
    const effectSight = API.CONDITIONS.find((a: SenseData) => {
      // use replace() method to match and remove all the non-alphanumeric characters
      return a.id
        .replace(ConditionalVisibilityEffectDefinitions.regex, '')
        .toLowerCase()
        .startsWith(
          AtcvEffectConditionFlags.HIDDEN.replace(ConditionalVisibilityEffectDefinitions.regex, '').toLowerCase(),
        );
    });
    if (!effectSight) {
      debug(`Cannot find for system '${game.system.id}' the status with id '${AtcvEffectConditionFlags.HIDDEN}'`);
      return;
    }
    return new Effect({
      customId: AtcvEffectConditionFlags.HIDDEN,
      name: i18n(`${CONSTANTS.MODULE_NAME}.effects.hidden.name`),
      description: i18n(`${CONSTANTS.MODULE_NAME}.effects.hidden.description`),
      icon: `modules/${CONSTANTS.MODULE_NAME}/icons/hidden.jpg`,
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [],
      atlChanges: [],
      atcvChanges: [
        {
          key: 'ATCV.' + AtcvEffectConditionFlags.HIDDEN,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: `${visionLevel}`,
          priority: 5,
        },
      ],
      isTemporary: true,
    });
  }

  static invisible(visionLevel = 0) {
    const effectSight = API.CONDITIONS.find((a: SenseData) => {
      // use replace() method to match and remove all the non-alphanumeric characters
      return a.id
        .replace(ConditionalVisibilityEffectDefinitions.regex, '')
        .toLowerCase()
        .startsWith(
          AtcvEffectConditionFlags.INVISIBLE.replace(ConditionalVisibilityEffectDefinitions.regex, '').toLowerCase(),
        );
    });
    if (!effectSight) {
      debug(`Cannot find for system '${game.system.id}' the status with id '${AtcvEffectConditionFlags.INVISIBLE}'`);
      return;
    }
    return new Effect({
      customId: AtcvEffectConditionFlags.INVISIBLE,
      name: i18n(`${CONSTANTS.MODULE_NAME}.effects.invisible.name`),
      description: i18n(`${CONSTANTS.MODULE_NAME}.effects.invisible.description`),
      icon: `modules/${CONSTANTS.MODULE_NAME}/icons/invisible.jpg`,
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [],
      atlChanges: [],
      atcvChanges: [
        {
          key: 'ATCV.' + AtcvEffectConditionFlags.INVISIBLE,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: `${visionLevel}`,
          priority: 5,
        },
      ],
      isTemporary: true,
    });
  }

  static obscured(visionLevel = 0) {
    const effectSight = API.CONDITIONS.find((a: SenseData) => {
      // use replace() method to match and remove all the non-alphanumeric characters
      return a.id
        .replace(ConditionalVisibilityEffectDefinitions.regex, '')
        .toLowerCase()
        .startsWith(
          AtcvEffectConditionFlags.OBSCURED.replace(ConditionalVisibilityEffectDefinitions.regex, '').toLowerCase(),
        );
    });
    if (!effectSight) {
      debug(`Cannot find for system '${game.system.id}' the status with id '${AtcvEffectConditionFlags.OBSCURED}'`);
      return;
    }
    return new Effect({
      customId: AtcvEffectConditionFlags.OBSCURED,
      name: i18n(`${CONSTANTS.MODULE_NAME}.effects.obscured.name`),
      description: i18n(`${CONSTANTS.MODULE_NAME}.effects.obscured.description`),
      icon: `modules/${CONSTANTS.MODULE_NAME}/icons/obscured.jpg`,
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [],
      atlChanges: [],
      atcvChanges: [
        {
          key: 'ATCV.' + AtcvEffectConditionFlags.OBSCURED,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: `${visionLevel}`,
          priority: 5,
        },
      ],
      isTemporary: true,
    });
  }

  static indarkness(visionLevel = 0) {
    const effectSight = API.CONDITIONS.find((a: SenseData) => {
      // use replace() method to match and remove all the non-alphanumeric characters
      return a.id
        .replace(ConditionalVisibilityEffectDefinitions.regex, '')
        .toLowerCase()
        .startsWith(
          AtcvEffectConditionFlags.IN_DARKNESS.replace(ConditionalVisibilityEffectDefinitions.regex, '').toLowerCase(),
        );
    });
    if (!effectSight) {
      debug(`Cannot find for system '${game.system.id}' the status with id '${AtcvEffectConditionFlags.IN_DARKNESS}'`);
      return;
    }
    return new Effect({
      customId: AtcvEffectConditionFlags.OBSCURED,
      name: i18n(`${CONSTANTS.MODULE_NAME}.effects.indarkness.name`),
      description: i18n(`${CONSTANTS.MODULE_NAME}.effects.indarkness.description`),
      icon: `modules/${CONSTANTS.MODULE_NAME}/icons/indarkness.jpg`,
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [],
      atlChanges: [],
      atcvChanges: [
        {
          key: 'ATCV.' + AtcvEffectConditionFlags.IN_DARKNESS,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: `${visionLevel}`,
          priority: 5,
        },
      ],
      isTemporary: true,
    });
  }

  // ===========================================
  // Utility Effect
  // =============================================

  static _createAtlEffectKey(key) {
    let result = key;
    //@ts-ignore
    const version = (game.version ?? game.data.version).charAt(0);

    if (version == '9') {
      switch (key) {
        case 'ATL.preset':
          break;
        case 'ATL.brightSight':
          break;
        case 'ATL.light.dim':
          break;
        case 'ATL.height':
          break;
        case 'ATl.img':
          break;
        case 'ATL.mirrorX':
          break;
        case 'ATL.mirrorY':
          break;
        case 'ATL.rotation':
          break;
        case 'ATL.scale':
          break;
        case 'ATL.width':
          break;
        case 'ATL.dimLight':
          result = 'ATL.light.dim';
          break;
        case 'ATL.brightLight':
          result = 'ATL.light.bright';
          break;
        case 'ATL.lightAnimation':
          result = 'ATL.light.animation';
          break;
        case 'ATL.lightColor':
          result = 'ATL.light.color';
          break;
        case 'ATL.lightAlpha':
          result = 'ATL.light.alpha';
          break;
        case 'ATL.lightAngle':
          result = 'ATL.light.angle';
          break;
      }
    }
    return result;
  }

  // /**
  //  * This also includes automatic shadow creation for token elevation.
  //  * This section requires Token Magic Fx to function.
  //  * Changing the elevation of a token over 5ft will automatically set a shadow effect "below" the token,
  //  * this is change in distance based on the elevation value.
  //  * @param tokenInstance
  //  * @param elevation
  //  */
  // static async shadowEffect(tokenInstance: Token) {
  //   //const elevation: number = getProperty(tokenInstance.data, 'elevation');
  //   const elevation: number = getElevationToken(tokenInstance);
  //   //const tokenInstance = canvas.tokens?.get(tokenID);
  //   const tokenMagicEffectId = CONSTANTS.MODULE_NAME + '-Shadows';
  //   const twist = {
  //     filterType: 'transform',
  //     filterId: tokenMagicEffectId,
  //     twRadiusPercent: 100,
  //     padding: 10,
  //     animated: {
  //       twRotation: {
  //         animType: 'sinOscillation',
  //         val1: -(elevation / 10),
  //         val2: +(elevation / 10),
  //         loopDuration: 5000,
  //       },
  //     },
  //   };
  //   const shadow = {
  //     filterType: 'shadow',
  //     filterId: tokenMagicEffectId,
  //     rotation: 35,
  //     blur: 2,
  //     quality: 5,
  //     distance: elevation * 1.5,
  //     alpha: Math.min(1 / ((elevation - 10) / 10), 0.7),
  //     padding: 10,
  //     shadowOnly: false,
  //     color: 0x000000,
  //     zOrder: 6000,
  //     animated: {
  //       blur: {
  //         active: true,
  //         loopDuration: 5000,
  //         animType: 'syncCosOscillation',
  //         val1: 2,
  //         val2: 2.5,
  //       },
  //       rotation: {
  //         active: true,
  //         loopDuration: 5000,
  //         animType: 'syncSinOscillation',
  //         val1: 33,
  //         val2: 33 + elevation * 0.8,
  //       },
  //     },
  //   };
  //   //const shadowSetting = game.settings.get('condition-automation', 'shadows');
  //   // let params = [shadow];
  //   //if (shadowSetting === 'bulge'){
  //   // params = [shadow, twist];
  //   //}
  //   const params = [shadow, twist];
  //   const filter = elevation > 5 ? true : false;
  //   //@ts-ignore
  //   await tokenInstance.TMFXdeleteFilters(tokenMagicEffectId);
  //   if (filter) {
  //     //@ts-ignore
  //     await TokenMagic.addUpdateFilters(tokenInstance, params);
  //   }
  // }
}
