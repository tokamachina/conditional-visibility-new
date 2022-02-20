import API from './api';
import { StatusEffectSenseFlags, StatusEffectConditionFlags, StatusSight } from './conditional-visibility-models';
import CONSTANTS from './constants';
import Effect, { Constants } from './effects/effect';
import { i18n, i18nFormat, warn } from './lib/lib';
import { canvas, game } from './settings';

/**
 * Defines all of the effect definitions
 */
export class EffectDefinitions {
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
    const blinded = EffectDefinitions.blinded(distance, visionLevel);
    if (blinded) {
      effects.push(blinded);
    }
    const blindsight = EffectDefinitions.blindsigth(distance, visionLevel);
    if (blindsight) {
      effects.push(blindsight);
    }
    const darkvision = EffectDefinitions.darkvision(distance, visionLevel);
    if (darkvision) {
      effects.push(darkvision);
    }
    const devilssight = EffectDefinitions.devilssight(distance, visionLevel);
    if (devilssight) {
      effects.push(devilssight);
    }
    const lowlightvision = EffectDefinitions.lowlightvision(distance, visionLevel);
    if (lowlightvision) {
      effects.push(lowlightvision);
    }
    const seeinvisible = EffectDefinitions.seeinvisible(distance, visionLevel);
    if (seeinvisible) {
      effects.push(seeinvisible);
    }
    // EffectDefinitions.shadowEffect(distance),
    const tremorsense = EffectDefinitions.tremorsense(distance, visionLevel);
    if (tremorsense) {
      effects.push(tremorsense);
    }
    const truesight = EffectDefinitions.truesight(distance, visionLevel);
    if (truesight) {
      effects.push(truesight);
    }
    return effects;
  }

  static effect(name: string, distance = 0, visionLevel = 0): Effect | undefined {
    const effect = <Effect>EffectDefinitions.all(distance).find((effect: Effect) => {
      return effect.name.toLowerCase() === name.toLowerCase();
    });
    if (effect?.customId == StatusEffectSenseFlags.BLINDED) {
      return EffectDefinitions.blinded(distance, visionLevel);
    }
    if (effect?.customId == StatusEffectSenseFlags.BLIND_SIGHT) {
      return EffectDefinitions.blindsigth(distance, visionLevel);
    }
    if (effect?.customId == StatusEffectSenseFlags.DARKVISION) {
      return EffectDefinitions.darkvision(distance, visionLevel);
    }
    if (effect?.customId == StatusEffectSenseFlags.DEVILS_SIGHT) {
      return EffectDefinitions.devilssight(distance, visionLevel);
    }
    if (effect?.customId == StatusEffectSenseFlags.GREATER_DARKVISION) {
      return EffectDefinitions.darkvision(distance, visionLevel);
    }
    if (effect?.customId == StatusEffectSenseFlags.LOW_LIGHT_VISION) {
      return EffectDefinitions.lowlightvision(distance, visionLevel);
    }
    if (effect?.customId == StatusEffectSenseFlags.SEE_INVISIBLE) {
      return EffectDefinitions.seeinvisible(distance, visionLevel);
    }
    if (effect?.customId == StatusEffectSenseFlags.TREMOR_SENSE) {
      return EffectDefinitions.tremorsense(distance, visionLevel);
    }
    if (effect?.customId == StatusEffectSenseFlags.TRUE_SIGHT) {
      return EffectDefinitions.truesight(distance, visionLevel);
    }
    return undefined;
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
    const effectSight = API.SENSES.find((a: StatusSight) => {
      // use replace() method to match and remove all the non-alphanumeric characters
      return a.id
        .replace(EffectDefinitions.regex, '')
        .toLowerCase()
        .startsWith(StatusEffectSenseFlags.DARKVISION.replace(EffectDefinitions.regex, '').toLowerCase());
    });
    if (!effectSight) {
      warn(
        `Cannot find for system '${game.system.id}' the active effect with id '${StatusEffectSenseFlags.DARKVISION}'`,
      );
      return;
    }
    return new Effect({
      customId: StatusEffectSenseFlags.DARKVISION,
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
          value: number && number > 0 ? `${number}` : `@${effectSight.path}`,
          priority: 5,
        },
      ],
      atlChanges: [
        {
          key: EffectDefinitions._createAtlEffectKey('ATL.light.dim'),
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: `${number}`,
          priority: 5,
        },
      ],
      atcvChanges: [
        {
          key: 'ATCV.' + StatusEffectSenseFlags.DARKVISION,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: `${visionLevel}`,
          priority: 5,
        },
      ],
    });
  }

  static blindsigth(number: number, visionLevel) {
    const effectSight = API.SENSES.find((a: StatusSight) => {
      // use replace() method to match and remove all the non-alphanumeric characters
      return a.id
        .replace(EffectDefinitions.regex, '')
        .toLowerCase()
        .startsWith(StatusEffectSenseFlags.BLIND_SIGHT.replace(EffectDefinitions.regex, '').toLowerCase());
    });
    if (!effectSight) {
      warn(
        `Cannot find for system '${game.system.id}' the active effect with id '${StatusEffectSenseFlags.BLIND_SIGHT}'`,
      );
      return;
    }
    return new Effect({
      customId: StatusEffectSenseFlags.BLIND_SIGHT,
      name:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.blindsigth.name2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.blindsigth.name`),
      description:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.blindsigth.description2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.blindsigth.description`),
      icon: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/affliction_24.jpg`,
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [
        {
          key: effectSight.path,
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: number && number > 0 ? `${number}` : `@${effectSight.path}`,
          priority: 5,
        },
      ],
      atcvChanges: [
        {
          key: 'ATCV.' + StatusEffectSenseFlags.BLIND_SIGHT,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: `${visionLevel}`,
          priority: 5,
        },
      ],
    });
  }

  static tremorsense(number: number, visionLevel) {
    const effectSight = API.SENSES.find((a: StatusSight) => {
      // use replace() method to match and remove all the non-alphanumeric characters
      return a.id
        .replace(EffectDefinitions.regex, '')
        .toLowerCase()
        .startsWith(StatusEffectSenseFlags.TREMOR_SENSE.replace(EffectDefinitions.regex, '').toLowerCase());
    });
    if (!effectSight) {
      warn(
        `Cannot find for system '${game.system.id}' the active effect with id '${StatusEffectSenseFlags.TREMOR_SENSE}'`,
      );
      return;
    }
    return new Effect({
      customId: StatusEffectSenseFlags.TREMOR_SENSE,
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
          value: number && number > 0 ? `${number}` : `@${effectSight.path}`,
          priority: 5,
        },
      ],
      atcvChanges: [
        {
          key: 'ATCV.' + StatusEffectSenseFlags.TREMOR_SENSE,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: `${visionLevel}`,
          priority: 5,
        },
      ],
    });
  }

  static truesight(number, visionLevel) {
    const effectSight = API.SENSES.find((a: StatusSight) => {
      // use replace() method to match and remove all the non-alphanumeric characters
      return a.id
        .replace(EffectDefinitions.regex, '')
        .toLowerCase()
        .startsWith(StatusEffectSenseFlags.TRUE_SIGHT.replace(EffectDefinitions.regex, '').toLowerCase());
    });
    if (!effectSight) {
      warn(
        `Cannot find for system '${game.system.id}' the active effect with id '${StatusEffectSenseFlags.TRUE_SIGHT}'`,
      );
      return;
    }
    return new Effect({
      customId: StatusEffectSenseFlags.TRUE_SIGHT,
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
          value: number && number > 0 ? `${number}` : `@${effectSight.path}`,
          priority: 5,
        },
      ],
      atcvChanges: [
        {
          key: 'ATCV.' + StatusEffectSenseFlags.TRUE_SIGHT,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: `${visionLevel}`,
          priority: 5,
        },
      ],
    });
  }

  static seeinvisible(number, visionLevel) {
    const effectSight = API.SENSES.find((a: StatusSight) => {
      // use replace() method to match and remove all the non-alphanumeric characters
      return a.id
        .replace(EffectDefinitions.regex, '')
        .toLowerCase()
        .startsWith(StatusEffectSenseFlags.SEE_INVISIBLE.replace(EffectDefinitions.regex, '').toLowerCase());
    });
    if (!effectSight) {
      warn(
        `Cannot find for system '${game.system.id}' the active effect with id '${StatusEffectSenseFlags.SEE_INVISIBLE}'`,
      );
      return;
    }
    return new Effect({
      customId: StatusEffectSenseFlags.SEE_INVISIBLE,
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
          value: number && number > 0 ? `${number}` : `@${effectSight.path}`,
          priority: 5,
        },
      ],
      atcvChanges: [
        {
          key: 'ATCV.' + StatusEffectSenseFlags.SEE_INVISIBLE,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: `${visionLevel}`,
          priority: 5,
        },
      ],
    });
  }

  static devilssight(number, visionLevel) {
    const effectSight = API.SENSES.find((a: StatusSight) => {
      // use replace() method to match and remove all the non-alphanumeric characters
      return a.id
        .replace(EffectDefinitions.regex, '')
        .toLowerCase()
        .startsWith(StatusEffectSenseFlags.DEVILS_SIGHT.replace(EffectDefinitions.regex, '').toLowerCase());
    });
    if (!effectSight) {
      warn(
        `Cannot find for system '${game.system.id}' the active effect with id '${StatusEffectSenseFlags.DEVILS_SIGHT}'`,
      );
      return;
    }
    return new Effect({
      customId: StatusEffectSenseFlags.DEVILS_SIGHT,
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
          value: number && number > 0 ? `${number}` : `@${effectSight.path}`,
          priority: 5,
        },
      ],
      atcvChanges: [
        {
          key: 'ATCV.' + StatusEffectSenseFlags.DEVILS_SIGHT,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: `${visionLevel}`,
          priority: 5,
        },
      ],
    });
  }

  static lowlightvision(number, visionLevel) {
    const effectSight = API.SENSES.find((a: StatusSight) => {
      // use replace() method to match and remove all the non-alphanumeric characters
      return a.id
        .replace(EffectDefinitions.regex, '')
        .toLowerCase()
        .startsWith(StatusEffectSenseFlags.LOW_LIGHT_VISION.replace(EffectDefinitions.regex, '').toLowerCase());
    });
    if (!effectSight) {
      warn(
        `Cannot find for system '${game.system.id}' the active effect with id '${StatusEffectSenseFlags.LOW_LIGHT_VISION}'`,
      );
      return;
    }
    return new Effect({
      customId: StatusEffectSenseFlags.LOW_LIGHT_VISION,
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
          value: number && number > 0 ? `${number}` : `@${effectSight.path}`,
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
          key: EffectDefinitions._createAtlEffectKey('ATL.light.bright'),
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: `data.token.dimSight`,
          priority: 5,
        },
      ],
      atcvChanges: [
        {
          key: 'ATCV.' + StatusEffectSenseFlags.LOW_LIGHT_VISION,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: `${visionLevel}`,
          priority: 5,
        },
      ],
    });
  }

  static blinded(number, visionLevel) {
    const effectSight = API.SENSES.find((a: StatusSight) => {
      // use replace() method to match and remove all the non-alphanumeric characters
      return a.id
        .replace(EffectDefinitions.regex, '')
        .toLowerCase()
        .startsWith(StatusEffectSenseFlags.BLINDED.replace(EffectDefinitions.regex, '').toLowerCase());
    });
    if (!effectSight) {
      warn(
        `Cannot find for system '${game.system.id}' the active effect with id '${StatusEffectSenseFlags.BLINDED}'`,
      );
      return;
    }
    return new Effect({
      customId: StatusEffectSenseFlags.BLINDED,
      name:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.blinded.name2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.blinded.name`),
      description:
        number && number > 0
          ? i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.blinded.description2`, { number: number })
          : i18n(`${CONSTANTS.MODULE_NAME}.effects.blinded.description`),
      icon: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/light_01.jpg`,
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [],
      atlChanges: [
        {
          key: EffectDefinitions._createAtlEffectKey('ATL.light.dim'),
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: `0`,
          priority: 5,
        },
        {
          key: EffectDefinitions._createAtlEffectKey('ATL.light.bright'),
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: `0`,
          priority: 5,
        },
        {
          key: EffectDefinitions._createAtlEffectKey('ATL.light.animation'),
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '{ "type":"none"}',
          priority: 5,
        },
      ],
      atcvChanges: [
        {
          key: 'ATCV.' + StatusEffectSenseFlags.BLINDED,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: `${visionLevel}`,
          priority: 5,
        },
      ],
    });
  }

  // =================================================
  // The target effect
  // =================================================

  static invisible(visionLevel) {
    const effectSight = API.CONDITIONS.find((a: StatusSight) => {
      // use replace() method to match and remove all the non-alphanumeric characters
      return a.id
        .replace(EffectDefinitions.regex, '')
        .toLowerCase()
        .startsWith(StatusEffectConditionFlags.INVISIBLE.replace(EffectDefinitions.regex, '').toLowerCase());
    });
    if (!effectSight) {
      warn(`Cannot find for system '${game.system.id}' the status with id '${StatusEffectConditionFlags.INVISIBLE}'`);
      return;
    }
    return new Effect({
      customId: StatusEffectConditionFlags.INVISIBLE,
      name: i18n(`${CONSTANTS.MODULE_NAME}.effects.invisible.name`),
      description: i18n(`${CONSTANTS.MODULE_NAME}.effects.invisible.description`),
      icon: `modules/${CONSTANTS.MODULE_NAME}/icons/invisible.svg`,
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [],
      atlChanges: [],
      atcvChanges: [
        {
          key: 'ATCV.' + StatusEffectConditionFlags.INVISIBLE,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: `${visionLevel}`,
          priority: 5,
        },
      ],
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
