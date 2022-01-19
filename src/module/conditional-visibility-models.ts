import Effect from './effects/effect';

export interface StatusEffect {
  id: string;
  visibilityId: string;
  label: string;
  icon: string;
}

export interface StatusSight {
  id: string;
  name: string;
  path: string;
  img: string;
  effect: Effect;
}

export enum StatusEffectSightFlags {
  DARKVISION = 'darkvision',
  SEE_INVISIBLE = 'seeinvisible',
  BLIND_SIGHT = 'blindsight',
  TREMOR_SENSE = 'tremorsense',
  TRUE_SIGHT = 'truesight',
  DEVILS_SIGHT = 'devilssight',
  PASSIVE_STEALTH = '_ste',
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

export class VisionCapabilities {
  public seeinvisible: number;
  public seeobscured: number;
  public seeindarkness: number;
  public seehidden: number;
  public seeinmagicaldarkness: number;
}
