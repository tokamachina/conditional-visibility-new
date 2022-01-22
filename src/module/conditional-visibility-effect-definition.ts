import CONSTANTS from './constants';
import Effect, { Constants } from './effects/effect';
import { i18nFormat } from './lib/lib';
import { canvas } from './settings';

/**
 * Defines all of the effect definitions
 */
export class EffectDefinitions {
  constructor() {}

  //   /**
  //    * Get all effects
  //    *
  //    * @returns {Effect[]} all the effects
  //    */
  //   get all() {
  //     return [this._darkvision];
  //   }

  //   effect(name: string) {
  //     return <Effect>this.all.find((effect: Effect) => {
  //       return effect.name.toLowerCase() === name.toLowerCase();
  //     });
  //   }

  // ===========================================
  // The source effect
  // =============================================

  // static stealthpassive(number: number) {
  //   return new Effect({
  //     name: i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.stealthpassive.name`, number),
  //     description: i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.stealthpassive.description`, number),
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

  static darkvision(number: number) {
    return new Effect({
      name: i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.darkvision.name`, number),
      description: i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.darkvision.description`, number),
      icon: 'systems/dnd5e/icons/spells/evil-eye-red-1.jpg',
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [
        {
          key: 'data.attributes.senses.darkvision',
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: number && number > 0 ? `${number}` : `@data.attributes.senses.darkvision`,
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
    });
  }

  static blindsigth(number: number) {
    return new Effect({
      name: i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.blindsigth.name`, number),
      description: i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.blindsigth.description`, number),
      icon: 'systems/dnd5e/icons/skills/affliction_24.jpg',
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [
        {
          key: 'data.attributes.senses.blindsight',
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: number && number > 0 ? `${number}` : `@data.attributes.senses.blindsight`,
          priority: 5,
        },
      ],
    });
  }

  static tremorsense(number: number) {
    return new Effect({
      name: i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.tremorsense.name`, number),
      description: i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.tremorsense.description`, number),
      icon: 'systems/dnd5e/icons/skills/ice_15.jpg',
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [
        {
          key: 'data.attributes.senses.tremorsense',
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: number && number > 0 ? `${number}` : `@data.attributes.senses.tremorsense`,
          priority: 5,
        },
      ],
    });
  }

  static truesight(number) {
    return new Effect({
      name: i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.truesight.name`, number),
      description: i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.truesight.description`, number),
      icon: 'systems/dnd5e/icons/skills/emerald_11.jpg',
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [
        {
          key: 'data.attributes.senses.truesight',
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: number && number > 0 ? `${number}` : `@data.attributes.senses.truesight`,
          priority: 5,
        },
      ],
    });
  }

  static seeinvisible(number) {
    return new Effect({
      name: i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.seeinvisible.name`, number),
      description: i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.seeinvisible.description`, number),
      icon: 'systems/dnd5e/icons/skills/shadow_11.jpg',
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [
        {
          key: 'data.attributes.senses.seeinvisible',
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: number && number > 0 ? `${number}` : `@data.attributes.senses.seeinvisible`,
          priority: 5,
        },
      ],
    });
  }

  static devilssight(number) {
    return new Effect({
      name: i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.devilssight.name`, number),
      description: i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.devilssight.description`, number),
      icon: 'systems/dnd5e/icons/skills/blue_17.jpg',
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [
        {
          key: 'data.attributes.senses.devilssight',
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: number && number > 0 ? `${number}` : `@data.attributes.senses.devilssight`,
          priority: 5,
        },
      ],
    });
  }

  static lowlightvision(number) {
    return new Effect({
      name: i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.lowlightvision.name`, number),
      description: i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.lowlightvision.description`, number),
      icon: 'systems/dnd5e/icons/skills/violet_09.jpg',
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [
        {
          key: 'data.attributes.senses.lowlightvision',
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: number && number > 0 ? `${number}` : `@data.attributes.senses.lowlightvision`,
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
    });
  }

  static blinded(number) {
    return new Effect({
      name: i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.blinded.name`, number),
      description: i18nFormat(`${CONSTANTS.MODULE_NAME}.effects.blinded.description`, number),
      icon: 'systems/dnd5e/icons/skills/light_01.jpg',
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
    });
  }

  // ===========================================
  // The target effect
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

  /**
   * This also includes automatic shadow creation for token elevation.
   * This section requires Token Magic Fx to function.
   * Changing the elevation of a token over 5ft will automatically set a shadow effect "below" the token,
   * this is change in distance based on the elevation value.
   * @param tokenInstance
   * @param elevation
   */
  static async shadowEffect(tokenInstance: Token) {
    const elevation: number = getProperty(tokenInstance.data, 'elevation');
    //const tokenInstance = canvas.tokens?.get(tokenID);
    const tokenMagicEffectId = CONSTANTS.MODULE_NAME + '-Shadows';
    const twist = {
      filterType: 'transform',
      filterId: tokenMagicEffectId,
      twRadiusPercent: 100,
      padding: 10,
      animated: {
        twRotation: {
          animType: 'sinOscillation',
          val1: -(elevation / 10),
          val2: +(elevation / 10),
          loopDuration: 5000,
        },
      },
    };
    const shadow = {
      filterType: 'shadow',
      filterId: tokenMagicEffectId,
      rotation: 35,
      blur: 2,
      quality: 5,
      distance: elevation * 1.5,
      alpha: Math.min(1 / ((elevation - 10) / 10), 0.7),
      padding: 10,
      shadowOnly: false,
      color: 0x000000,
      zOrder: 6000,
      animated: {
        blur: {
          active: true,
          loopDuration: 5000,
          animType: 'syncCosOscillation',
          val1: 2,
          val2: 2.5,
        },
        rotation: {
          active: true,
          loopDuration: 5000,
          animType: 'syncSinOscillation',
          val1: 33,
          val2: 33 + elevation * 0.8,
        },
      },
    };
    //const shadowSetting = game.settings.get('condition-automation', 'shadows');
    // let params = [shadow];
    //if (shadowSetting === 'bulge'){
    // params = [shadow, twist];
    //}
    const params = [shadow, twist];
    const filter = elevation > 5 ? true : false;
    //@ts-ignore
    await tokenInstance.TMFXdeleteFilters(tokenMagicEffectId);
    if (filter) {
      //@ts-ignore
      await TokenMagic.addUpdateFilters(tokenInstance, params);
    }
  }
}
