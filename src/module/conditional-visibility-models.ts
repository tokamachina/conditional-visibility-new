import API from './api';
import CONSTANTS from './constants';
import Effect from './effects/effect';
import { error } from './lib/lib';

export interface StatusEffect {
  visionLevelMinIndex: number;
  visionLevelMaxIndex: number;
  checkElevation: boolean;
  statusSight: StatusSight | undefined;
  visionLevelValue: number | undefined;
  visionDistanceValue: number | undefined;
}

export interface StatusSight {
  id: string;
  name: string;
  path: string;
  img: string;
  // effect: Effect;
  visionLevelMin: number;
  visionLevelMax: number;
  checkElevation: boolean;
  pathOri?: string;
}

export enum StatusEffectSenseFlags {
  // additional generic
  NONE = 'none',
  NORMAL = 'normal',
  // additional dnd5e and pf2e
  DARKVISION = 'darkvision',
  SEE_INVISIBLE = 'seeinvisible',
  BLIND_SIGHT = 'blindsight',
  TREMOR_SENSE = 'tremorsense',
  TRUE_SIGHT = 'truesight',
  DEVILS_SIGHT = 'devilssight',
  PASSIVE_STEALTH = '_ste',
  PASSIVE_PERCEPTION = '_prc',
  // additional PF2E
  GREATER_DARKVISION = 'greaterdarkvision',
  LOW_LIGHT_VISION = 'lowlightvision',
  BLINDED = 'blinded',
}

// TODO PUT THESE IN LOCALIZATION FOR OTHER LANGUAGE
export enum StatusEffectConditionFlags {
  INVISIBLE = 'invisible',
  OBSCURED = 'obscured',
  IN_DARKNESS = 'indarkness',
  HIDDEN = 'hidden',
  IN_MAGICAL_DARKNESS = 'inmagicaldarkness',
}

/**
 * This is system indipendent utility class
 */
export class VisionCapabilities {
  seeinvisible: number;
  seeobscured: number;
  seeindarkness: number;
  seehidden: number;
  seeinmagicaldarkness: number;

  _darkvision: number;
  _seeinvisible: number;
  _blindsight: number;
  _tremorsense: number;
  _truesight: number;
  _devilssight: number;
  _passivestealth: number;
  _passiveperception: number;
  _greaterdarkvision: number;
  _lowlightvision: number;
  _blinded: number;

  token: Token;

  constructor(srcToken: Token) {
    if (srcToken) {
      this.token = srcToken;

      const _darkvisionTmp =
        <number>srcToken?.data?.document?.getFlag(CONSTANTS.MODULE_NAME, StatusEffectSenseFlags.DARKVISION) ?? 0;

      const _seeinvisibleTmp =
        <number>srcToken?.data?.document?.getFlag(CONSTANTS.MODULE_NAME, StatusEffectSenseFlags.SEE_INVISIBLE) ?? 0;

      const _blindsightTmp =
        <number>srcToken?.data?.document?.getFlag(CONSTANTS.MODULE_NAME, StatusEffectSenseFlags.BLIND_SIGHT) ?? 0;

      const _tremorsenseTmp =
        <number>srcToken?.data?.document?.getFlag(CONSTANTS.MODULE_NAME, StatusEffectSenseFlags.TREMOR_SENSE) ?? 0;

      const _truesightTmp =
        <number>srcToken?.data?.document?.getFlag(CONSTANTS.MODULE_NAME, StatusEffectSenseFlags.TRUE_SIGHT) ?? 0;

      const _devilssightTmp =
        <number>srcToken?.data?.document?.getFlag(CONSTANTS.MODULE_NAME, StatusEffectSenseFlags.DEVILS_SIGHT) ?? 0;

      const _passivestealthTmp =
        <number>srcToken?.data?.document?.getFlag(CONSTANTS.MODULE_NAME, StatusEffectSenseFlags.PASSIVE_STEALTH) ?? 0;

      const _passiveperceptionTmp =
        <number>srcToken?.data?.document?.getFlag(CONSTANTS.MODULE_NAME, StatusEffectSenseFlags.PASSIVE_PERCEPTION) ??
        0;

      const _greaterdarkvisionTmp =
        <number>srcToken?.data?.document?.getFlag(CONSTANTS.MODULE_NAME, StatusEffectSenseFlags.GREATER_DARKVISION) ??
        0;

      const _lowlightvisionTmp =
        <number>srcToken?.data?.document?.getFlag(CONSTANTS.MODULE_NAME, StatusEffectSenseFlags.LOW_LIGHT_VISION) ?? 0;

      const _blindedTmp =
        <number>srcToken?.data?.document?.getFlag(CONSTANTS.MODULE_NAME, StatusEffectSenseFlags.BLINDED) ?? 0;

      this._darkvision = _darkvisionTmp; //< 0 ? 100000 : _darkvisionTmp;
      this._seeinvisible = _seeinvisibleTmp; // < 0 ? 100000 : _seeinvisibleTmp;
      this._blindsight = _blindsightTmp; // < 0 ? 100000 : _blindsightTmp;
      this._tremorsense = _tremorsenseTmp; // < 0 ? 100000 : _tremorsenseTmp;
      this._truesight = _truesightTmp; // < 0 ? 100000 : _truesightTmp;
      this._devilssight = _devilssightTmp; // < 0 ? 100000 : _devilssightTmp;
      this._greaterdarkvision = _greaterdarkvisionTmp; // < 0 ? 100000 : _greaterdarkvisionTmp;
      this._lowlightvision = _lowlightvisionTmp; // < 0 ? 100000 : _lowlightvisionTmp;
      this._blinded = _blindedTmp; // < 0 ? 100000 : _blindedTmp;

      // this.seeinvisible = Math.max(_seeinvisible, _blindsight, _tremorsense, _truesight, _devilssight);
      // this.seeobscured = Math.max(_blindsight, _tremorsense);
      // this.seeindarkness = Math.max(_blindsight, _devilssight, _tremorsense, _truesight);

      // TODO
      this._passivestealth = _passivestealthTmp; // < 0 ? 100000 : _passivestealthTmp;
      this._passiveperception = _passiveperceptionTmp; //srcToken?.actor?.data?.data?.skills?.prc?.passive

      // //@ts-ignore
      // if (srcToken?._movement !== null) {
      //   //@ts-ignore
      //   this.visionfrom = srcToken._movement.B;
      // } else {
      //   this.visionfrom = srcToken?.position ?? { x: 0, y: 0 };
      // }
    } else {
      error('No token found for get the visual capatibilities');
    }
  }

  // canSee(statusEffectSight: StatusEffectSightFlags) {
  //   // TODO
  // }

  // canSeeInvisible() {
  //   return Math.max(this._seeinvisible, this._blindsight, this._tremorsense, this._truesight, this._devilssight);
  // }
  // canSeeObscured() {
  //   return Math.max(this._blindsight, this._tremorsense);
  // }
  // canSeeInDarkness() {
  //   return Math.max(this._blindsight, this._devilssight, this._tremorsense, this._truesight);
  // }
  // canSeeInMagicalDarkness() {
  //   return Math.max(this._blindsight, this._devilssight, this._tremorsense, this._truesight);
  // }
  // hasStealth(): boolean {
  //   return true;
  // }
  // rollStealth(): Roll {
  //   //@ts-ignore
  //   const roll = new Roll('1d20 + (' + this.token.actor.data.data.skills.ste.total + ')').roll();
  //   return roll;
  // }

  retrieveSense(statusSense: string): number | undefined {
    let sense: number | undefined = undefined;
    switch (statusSense) {
      // additional generic
      case StatusEffectSenseFlags.NONE: {
        sense = undefined;
        break;
      }
      case StatusEffectSenseFlags.NORMAL: {
        sense = undefined;
        break;
      }
      // additional dnd5e and pf2e
      case StatusEffectSenseFlags.DARKVISION: {
        sense = this._darkvision;
        break;
      }
      case StatusEffectSenseFlags.SEE_INVISIBLE: {
        sense = this._seeinvisible;
        break;
      }
      case StatusEffectSenseFlags.BLIND_SIGHT: {
        sense = this._blindsight;
        break;
      }
      case StatusEffectSenseFlags.TREMOR_SENSE: {
        sense = this._tremorsense;
        break;
      }
      case StatusEffectSenseFlags.TRUE_SIGHT: {
        sense = this._truesight;
        break;
      }
      case StatusEffectSenseFlags.DEVILS_SIGHT: {
        sense = this._devilssight;
        break;
      }
      case StatusEffectSenseFlags.PASSIVE_STEALTH: {
        sense = this._passivestealth;
        break;
      }
      case StatusEffectSenseFlags.PASSIVE_PERCEPTION: {
        sense = this._passiveperception;
        break;
      }
      // additional PF2E
      case StatusEffectSenseFlags.GREATER_DARKVISION: {
        sense = this._greaterdarkvision;
        break;
      }
      case StatusEffectSenseFlags.LOW_LIGHT_VISION: {
        sense = this._lowlightvision;
        break;
      }
      case StatusEffectSenseFlags.BLINDED: {
        sense = this._blinded;
        break;
      }
      default: {
        sense = undefined;
      }
    }
    return sense;
  }
}
