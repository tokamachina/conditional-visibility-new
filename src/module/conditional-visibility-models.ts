import CONSTANTS from './constants';
import Effect from './effects/effect';
import { error } from './lib/lib';

export interface StatusEffect {
  id: string;
  visibilityId: string;
  name: string;
  img: string;
}

export interface StatusSight {
  id: string;
  name: string;
  path: string;
  img: string;
  effect: Effect;
  pathOri?:string;
}

export enum StatusEffectSightFlags {
  DARKVISION = 'darkvision',
  SEE_INVISIBLE = 'seeinvisible',
  BLIND_SIGHT = 'blindsight',
  TREMOR_SENSE = 'tremorsense',
  TRUE_SIGHT = 'truesight',
  DEVILS_SIGHT = 'devilssight',
  PASSIVE_STEALTH = '_ste',
  PASSIVE_PERCEPTION = '_prc',
  // additional PF2E
  LOW_LIGHT_VISION = 'lowlightvision',
  BLINDED = 'blinded',
}

// TODO PUT THESE IN LOCALIZATION FOR OTHER LANGUAGE
export enum StatusEffectStatusFlags {
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

  private _darkvision: number;
  private _seeinvisible: number;
  private _blindsight: number;
  private _tremorsense: number;
  private _truesight: number;
  private _devilssight: number;
  private _passivestealth: number;
  private _passiveperception: number;
  private _lowlightvision: number;
  private _blinded: number;

  token: Token;

  constructor(srcToken: Token) {
    if (srcToken) {
      this.token = srcToken;

      const _darkvisionTmp =
        <number>(
          srcToken?.data?.document?.getFlag(CONSTANTS.MODULE_NAME, StatusEffectSightFlags.DARKVISION)
        ) ?? 0;

      const _seeinvisibleTmp =
        <number>(
          srcToken?.data?.document?.getFlag(CONSTANTS.MODULE_NAME, StatusEffectSightFlags.SEE_INVISIBLE)
        ) ?? 0;

      const _blindsightTmp =
        <number>(
          srcToken?.data?.document?.getFlag(CONSTANTS.MODULE_NAME, StatusEffectSightFlags.BLIND_SIGHT)
        ) ?? 0;

      const _tremorsenseTmp =
        <number>(
          srcToken?.data?.document?.getFlag(CONSTANTS.MODULE_NAME, StatusEffectSightFlags.TREMOR_SENSE)
        ) ?? 0;

      const _truesightTmp =
        <number>(
          srcToken?.data?.document?.getFlag(CONSTANTS.MODULE_NAME, StatusEffectSightFlags.TRUE_SIGHT)
        ) ?? 0;

      const _devilssightTmp =
        <number>(
          srcToken?.data?.document?.getFlag(CONSTANTS.MODULE_NAME, StatusEffectSightFlags.DEVILS_SIGHT)
        ) ?? 0;

      const _passivestealthTmp =
        <number>(
          srcToken?.data?.document?.getFlag(CONSTANTS.MODULE_NAME, StatusEffectSightFlags.PASSIVE_STEALTH)
        ) ?? 0;

      const _passiveperceptionTmp =
        <number>(
          srcToken?.data?.document?.getFlag(
            CONSTANTS.MODULE_NAME,
            StatusEffectSightFlags.PASSIVE_PERCEPTION,
          )
        ) ?? 0;

      const _lowlightvisionTmp =
        <number>(
          srcToken?.data?.document?.getFlag(CONSTANTS.MODULE_NAME, StatusEffectSightFlags.LOW_LIGHT_VISION)
        ) ?? 0;

      const _blindedTmp =
        <number>srcToken?.data?.document?.getFlag(CONSTANTS.MODULE_NAME, StatusEffectSightFlags.BLINDED) ??
        0;

      this._darkvision = _darkvisionTmp < 0 ? 100000 : _darkvisionTmp;
      this._seeinvisible = _seeinvisibleTmp < 0 ? 100000 : _seeinvisibleTmp;
      this._blindsight = _blindsightTmp < 0 ? 100000 : _blindsightTmp;
      this._tremorsense = _tremorsenseTmp < 0 ? 100000 : _tremorsenseTmp;
      this._truesight = _truesightTmp < 0 ? 100000 : _truesightTmp;
      this._devilssight = _devilssightTmp < 0 ? 100000 : _devilssightTmp;
      this._passivestealth = _passivestealthTmp < 0 ? 100000 : _passivestealthTmp;
      this._lowlightvision = _lowlightvisionTmp < 0 ? 100000 : _lowlightvisionTmp;
      this._blinded = _blindedTmp < 0 ? 100000 : _blindedTmp;

      // this.seeinvisible = Math.max(_seeinvisible, _blindsight, _tremorsense, _truesight, _devilssight);
      // this.seeobscured = Math.max(_blindsight, _tremorsense);
      // this.seeindarkness = Math.max(_blindsight, _devilssight, _tremorsense, _truesight);

      // TODO

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

  canSee(statusEffectSight: StatusEffectSightFlags) {
    // TODO
  }

  canSeeInvisible() {
    return Math.max(this._seeinvisible, this._blindsight, this._tremorsense, this._truesight, this._devilssight);
  }
  canSeeObscured() {
    return Math.max(this._blindsight, this._tremorsense);
  }
  canSeeInDarkness() {
    return Math.max(this._blindsight, this._devilssight, this._tremorsense, this._truesight);
  }
  canSeeInMagicalDarkness() {
    return Math.max(this._blindsight, this._devilssight, this._tremorsense, this._truesight);
  }
  hasStealth(): boolean {
    return true;
  }
  rollStealth(): Roll {
    //@ts-ignore
    const roll = new Roll('1d20 + (' + this.token.actor.data.data.skills.ste.total + ')').roll();
    return roll;
  }
}
