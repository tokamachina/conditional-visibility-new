import API from './api';
import CONSTANTS from './constants';
import Effect from './effects/effect';
import {
  error,
  retrieveAtcvVisionLevelDistanceFromActiveEffect,
  retrieveAtcvVisionLevelFromActiveEffect,
  i18n,
  retrieveAtcvTargetsFromActiveEffect,
  retrieveAtcvElevationFromActiveEffect,
  retrieveAtcvSourcesFromActiveEffect,
} from './lib/lib';

export interface AtcvEffect {
  visionElevation: boolean;
  statusSight: SenseData | undefined;
  visionLevelValue: number | undefined;
  visionDistanceValue: number | undefined;
  visionTargets: string[];
  visionSources: string[];
}

export interface SenseData {
  id: string; // This is the unique id used for sync all the senses and conditions (please no strange character, no whitespace and all in lowercase...)
  name: string; // This is the unique name used for sync all the senses and conditions (here you cna put any dirty character you want)
  path: string; // This is the path to the property you want to associate with this sense e.g. data.skills.prc.passive
  img: string; // [OPTIONAL] Image to associate to this sense
  visionLevelMinIndex: number; // [OPTIONAL] check a min index for filter a range of sense can see these conditions, or viceversa conditions can be seen only from this sense
  visionLevelMaxIndex: number; // [OPTIONAL] check a max index for filter a range of sense can see these conditions, or viceversa conditions can be seen only from this sense
  conditionElevation: boolean; // [OPTIONAL] force to check the elevation between the source token and the target token, useful when using module like 'Levels'
  conditionTargets: string[]; // [OPTIONAL] force to apply the check only for these sources (you can set this but is used only from sense)
  conditionSources: string[]; // [OPTIONAL] force to apply the check only for these sources (you can set this but is used only from condition)
  effectCustomId: string; // [OPTIONAL] if you use the module 'DFreds Convenient Effects', you can associate a custom active effect by using the customId string of the DFred effect
}

export enum AtcvEffectSenseFlags {
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
  // PASSIVE_STEALTH = '_ste',
  // PASSIVE_PERCEPTION = '_prc',
  // additional PF2E
  GREATER_DARKVISION = 'greaterdarkvision',
  LOW_LIGHT_VISION = 'lowlightvision',
  BLINDED = 'blinded',
}


export enum AtcvEffectConditionFlags {
  INVISIBLE = 'invisible',
  OBSCURED = 'obscured',
  IN_DARKNESS = 'indarkness',
  HIDDEN = 'hidden',
  IN_MAGICAL_DARKNESS = 'inmagicaldarkness',
}

// export enum ConditionalVisibilityFlags {
//   STEALTHED = 'stealthed'
// }

/**
 * This is system indipendent utility class
 */
export class VisionCapabilities {
  // seeinvisible: number;
  // seeobscured: number;
  // seeindarkness: number;
  // seehidden: number;
  // seeinmagicaldarkness: number;

  // _darkvision: number;
  // _seeinvisible: number;
  // _blindsight: number;
  // _tremorsense: number;
  // _truesight: number;
  // _devilssight: number;
  // _passivestealth: number;
  // _passiveperception: number;
  // _greaterdarkvision: number;
  // _lowlightvision: number;
  // _blinded: number;

  senses: Map<string, AtcvEffect>;
  conditions: Map<string, AtcvEffect>;
  token: Token;

  constructor(srcToken: Token) {
    if (srcToken) {
      this.token = srcToken;
      this.senses = new Map<string, AtcvEffect>();
      this.conditions = new Map<string, AtcvEffect>();
      // SENSES
      this.addSenses();

      // CONDITIONS
      this.addConditions();

      // this.senses.set(StatusEffectSenseFlags.DARKVISION,_darkvisionTmp);
      // this.senses.set(StatusEffectSenseFlags.SEE_INVISIBLE, _seeinvisibleTmp);
      // this.senses.set(StatusEffectSenseFlags.BLIND_SIGHT, _blindsightTmp);
      // this.senses.set(StatusEffectSenseFlags.TREMOR_SENSE,  _tremorsenseTmp);
      // this.senses.set(StatusEffectSenseFlags.TRUE_SIGHT, _truesightTmp);
      // this.senses.set(StatusEffectSenseFlags.DEVILS_SIGHT, _devilssightTmp);
      // this.senses.set(StatusEffectSenseFlags.GREATER_DARKVISION, _greaterdarkvisionTmp);
      // this.senses.set(StatusEffectSenseFlags.LOW_LIGHT_VISION, _lowlightvisionTmp);
      // this.senses.set(StatusEffectSenseFlags.BLINDED, _blindedTmp);

      // this.senses.set(StatusEffectSenseFlags.PASSIVE_STEALTH, _passivestealthTmp);
      // this.senses.set(StatusEffectSenseFlags.PASSIVE_PERCEPTION,  _passiveperceptionTmp);

      // this._darkvision = _darkvisionTmp; //< 0 ? 100000 : _darkvisionTmp;
      // this._seeinvisible = _seeinvisibleTmp; // < 0 ? 100000 : _seeinvisibleTmp;
      // this._blindsight = _blindsightTmp; // < 0 ? 100000 : _blindsightTmp;
      // this._tremorsense = _tremorsenseTmp; // < 0 ? 100000 : _tremorsenseTmp;
      // this._truesight = _truesightTmp; // < 0 ? 100000 : _truesightTmp;
      // this._devilssight = _devilssightTmp; // < 0 ? 100000 : _devilssightTmp;
      // this._greaterdarkvision = _greaterdarkvisionTmp; // < 0 ? 100000 : _greaterdarkvisionTmp;
      // this._lowlightvision = _lowlightvisionTmp; // < 0 ? 100000 : _lowlightvisionTmp;
      // this._blinded = _blindedTmp; // < 0 ? 100000 : _blindedTmp;

      // this._passivestealth = _passivestealthTmp; // < 0 ? 100000 : _passivestealthTmp;
      // this._passiveperception = _passiveperceptionTmp; //srcToken?.actor?.data?.data?.skills?.prc?.passive

      // CONDITION

      // this.seeinvisible = Math.max(_seeinvisible, _blindsight, _tremorsense, _truesight, _devilssight);
      // this.seeobscured = Math.max(_blindsight, _tremorsense);
      // this.seeindarkness = Math.max(_blindsight, _devilssight, _tremorsense, _truesight);

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
  hasSenses() {
    if (this.senses.size > 0) {
      return true;
    } else {
      return false;
    }
  }

  hasConditions() {
    if (this.conditions.size > 0) {
      return true;
    } else {
      return false;
    }
  }

  retrieveSenses() {
    const sensesTmp = new Map<string, AtcvEffect>();
    for (const [key, value] of this.senses.entries()) {
      if (value.visionLevelValue && value.visionLevelValue != 0) {
        sensesTmp.set(key, value);
      }
    }
    return sensesTmp;
  }

  async refreshSenses() {
    for (const [key, value] of this.senses.entries()) {
      const statusSight = value.statusSight;
      const visionLevelValue = value.visionLevelValue;
      await this.token.document.setFlag(CONSTANTS.MODULE_NAME, key, visionLevelValue);
      if (value.statusSight?.path) {
        setProperty(this.token, <string>value.statusSight?.path, visionLevelValue);
      }
    }
  }

  retrieveSenseValue(statusSense: string): number | undefined {
    let sense: number | undefined = undefined;
    for (const statusEffect of this.senses.values()) {
      const statusSight = <SenseData>statusEffect.statusSight;
      if (statusSense == statusSight.id) {
        sense = this.senses.get(statusSense)?.visionLevelValue;
        break;
      }
    }
    return sense;
  }

  addSenses() {
    Promise.all(
      API.SENSES.map(async (statusSight) => {
        let visionLevelValue = this.token?.document?.getFlag(CONSTANTS.MODULE_NAME, statusSight.id);
        let visionDistanceValue = 0;
        let conditionElevation = false;
        let conditionTargets: string[] = [];
        let conditionSources: string[] = [];
        if (!visionLevelValue || visionLevelValue == 0) {
          // try to serach on active effect
          if (await API.hasEffectAppliedOnToken(this.token.id, i18n(statusSight.name), true)) {
            const ae = <ActiveEffect>await API.findEffectByNameOnToken(this.token.id, i18n(statusSight.name));
            conditionElevation = retrieveAtcvElevationFromActiveEffect(ae.data.changes);
            conditionTargets = retrieveAtcvTargetsFromActiveEffect(ae.data.changes);
            conditionSources = retrieveAtcvSourcesFromActiveEffect(ae.data.changes);
            visionLevelValue = retrieveAtcvVisionLevelFromActiveEffect(ae, statusSight);
            visionDistanceValue = retrieveAtcvVisionLevelDistanceFromActiveEffect(ae);
          }
        }

        const statusEffect = <AtcvEffect>{
          visionElevation: conditionElevation ?? false,
          visionTargets: conditionTargets ?? [],
          visionSources: conditionSources ?? [],
          visionLevelValue: visionLevelValue ?? 0,
          visionDistanceValue: visionDistanceValue ?? 0,
          statusSight: statusSight,
        };
        this.senses.set(statusSight.id, statusEffect);
      }),
    );
  }

  retrieveConditions() {
    const coditionsTmp = new Map<string, AtcvEffect>();
    for (const [key, value] of this.conditions.entries()) {
      if (value.visionLevelValue && value.visionLevelValue != 0) {
        coditionsTmp.set(key, value);
      }
    }
    return coditionsTmp;
  }

  async refreshConditions() {
    for (const [key, value] of this.conditions.entries()) {
      const statusSight = value.statusSight;
      const visionLevelValue = value.visionLevelValue;
      await this.token.document.setFlag(CONSTANTS.MODULE_NAME, key, visionLevelValue);
      if (value.statusSight?.path) {
        setProperty(this.token, <string>value.statusSight?.path, visionLevelValue);
      }
    }
  }

  addConditions() {
    Promise.all(
      API.CONDITIONS.map(async (statusSight) => {
        let visionLevelValue = this.token.document?.getFlag(CONSTANTS.MODULE_NAME, statusSight.id);
        let visionDistanceValue = 0;
        let conditionElevation = false;
        let conditionTargets: string[] = [];
        let conditionSources: string[] = [];
        if (!visionLevelValue || visionLevelValue == 0) {
          // try to serach on active effect
          if (await API.hasEffectAppliedOnToken(this.token.id, i18n(statusSight.name), true)) {
            const ae = <ActiveEffect>await API.findEffectByNameOnToken(this.token.id, i18n(statusSight.name));
            conditionElevation = retrieveAtcvElevationFromActiveEffect(ae.data.changes);
            conditionTargets = retrieveAtcvTargetsFromActiveEffect(ae.data.changes);
            conditionSources = retrieveAtcvSourcesFromActiveEffect(ae.data.changes);
            visionLevelValue = retrieveAtcvVisionLevelFromActiveEffect(ae, statusSight);
            visionDistanceValue = retrieveAtcvVisionLevelDistanceFromActiveEffect(ae);
          }
        }

        const statusEffect = <AtcvEffect>{
          visionElevation: conditionElevation ?? false,
          visionTargets: conditionTargets ?? [],
          visionSources: conditionSources ?? [],
          visionLevelValue: visionLevelValue ?? 0,
          visionDistanceValue: visionDistanceValue ?? 0,
          statusSight: statusSight,
        };
        this.conditions.set(statusSight.id, statusEffect);
      }),
    );
  }

  retrieveConditionValue(statusSense: string): number | undefined {
    let sense: number | undefined = undefined;
    for (const statusEffect of this.conditions.values()) {
      const statusSight = <SenseData>statusEffect.statusSight;
      if (statusSense == statusSight.id) {
        sense = this.senses.get(statusSense)?.visionLevelValue;
        break;
      }
    }
    return sense;
  }
}
