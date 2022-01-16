import Effect, { Constants } from './effects/effect';

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

  static darkvision(number: number) {
    return new Effect({
      name: `Darkvision ${number && number > 0 ? `(${number} ft.)` : ''}`,
      description: `Upgrade darkvision to ${number && number > 0 ? `(${number})` : ''} for 8 hours`,
      icon: 'systems/dnd5e/icons/spells/evil-eye-red-1.jpg',
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [
        {
          key: 'data.attributes.senses.darkvision',
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: `${number}`,
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
      name: `Blindsight ${number && number > 0 ? `(${number} ft.)` : ''}`,
      description: `A monster with blindsight ${
        number && number > 0 ? `(${number} ft.)` : ''
      } can perceive its surroundings without relying on sight, within a specific radius.
      <br>Creatures without eyes, such as grimlocks and gray oozes, typically have this special sense, as do creatures with echolocation or heightened senses, such as bats and true dragons.
      <br>If a monster is naturally blind, it has a parenthetical note to this effect, indicating that the radius of its blindsight defines the maximum range of its perception`,
      icon: 'systems/dnd5e/icons/skills/affliction_24.jpg',
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [
        {
          key: 'data.attributes.senses.blindsight',
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: `${number}`,
          priority: 5,
        },
      ],
    });
  }

  static tremorsense(number: number) {
    return new Effect({
      name: `Tremorsense ${number && number > 0 ? `(${number} ft.)` : ''}`,
      description: `A monster with tremorsense can detect and pinpoint the origin of vibrations within a specific radius, provided that the monster and the source of the vibrations are in contact with the same ground or substance. Tremorsense can't be used to detect flying or incorporeal creatures. Many burrowing creatures, such as ankhegs and umber hulks, have this special sense.`,
      icon: 'systems/dnd5e/icons/skills/ice_15.jpg',
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [
        {
          key: 'data.attributes.senses.tremorsense',
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: `${number}`,
          priority: 5,
        },
      ],
    });
  }

  static truesight(number) {
    return new Effect({
      name: `Truesight ${number && number > 0 ? `(${number} ft.)` : ''}`,
      description: `The ability to see things as they actually are. For the duration, the creature has truesight, notices secret doors hidden by magic, and can see into the Ethereal Plane, all out to a range of 120 feet.`,
      icon: 'systems/dnd5e/icons/skills/emerald_11.jpg',
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [
        {
          key: 'data.attributes.senses.truesight',
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: `${number}`,
          priority: 5,
        },
      ],
    });
  }

  static seeinvisible(number) {
    return new Effect({
      name: `See Invisible ${number && number > 0 ? `(${number} ft.)` : ''}`,
      description: ``,
      icon: 'systems/dnd5e/icons/skills/shadow_11.jpg',
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [
        {
          key: 'data.attributes.senses.seeinvisible',
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: `${number}`,
          priority: 5,
        },
      ],
    });
  }

  static devilssight(number) {
    return new Effect({
      name: `Devil's sight ${number && number > 0 ? `(${number} ft.)` : ''}`,
      description: `You can see normally in darkness, both magical and nonmagical, to a distance of 120 feet.`,
      icon: 'systems/dnd5e/icons/skills/blue_17.jpg',
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [
        {
          key: 'data.attributes.senses.devilssight',
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: `${number}`,
          priority: 5,
        },
      ],
    });
  }

  static lowlightvision(number) {
    return new Effect({
      name: `Low Light vision ${number && number > 0 ? `(${number} ft.)` : ''}`,
      description: `A creature with low-light vision can see in dim light as though it were bright light, so it ignores the concealed condition due to dim light.`,
      icon: 'systems/dnd5e/icons/skills/violet_09.jpg',
      // seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      transfer: true,
      changes: [
        {
          key: 'data.attributes.senses.lowlightvision',
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: `${number}`,
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
      name: `Blinded ${number && number > 0 ? `(${number} ft.)` : ''}`,
      description: `A blinded creature can’t see and automatically fails any ability check that requires sight<br>
      Attack rolls against the creature have advantage, and the creature’s attack rolls have disadvantage.`,
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
}
