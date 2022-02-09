import { EffectDefinitions } from '../conditional-visibility-effect-definition';
import {
  StatusEffect,
  StatusEffectSightFlags,
  StatusEffectStatusFlags,
  StatusSight,
} from '../conditional-visibility-models';
import CONSTANTS from '../constants';

export default {
  HP_ATTRIBUTE: 'data.attributes.hp.value',
  SENSES: <StatusSight[]>[
    {
      id: StatusEffectSightFlags.NONE,
      name: `${CONSTANTS.MODULE_NAME}.${StatusEffectSightFlags.NONE}`,
      path: '',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/light_01.jpg`,
      //effect: undefined,
      visionLevelMin: -2,
      visionLevelMax: -1,
      checkElevation: false,
    },
    {
      id: StatusEffectSightFlags.NORMAL,
      name: `${CONSTANTS.MODULE_NAME}.${StatusEffectSightFlags.NORMAL}`,
      path: 'data.traits.senses.blinded',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/light_02.jpg`,
      //effect: EffectDefinitions.blinded(0),
      visionLevelMin: 0,
      visionLevelMax: 1,
      checkElevation: false,
    },
    {
      id: StatusEffectSightFlags.BLINDED,
      name: `${CONSTANTS.MODULE_NAME}.${StatusEffectSightFlags.BLINDED}`,
      path: 'data.traits.senses.blinded',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/affliction_24.jpg`,
      //effect: EffectDefinitions.blinded(0),
      visionLevelMin: -1,
      visionLevelMax: 0,
      checkElevation: false,
    },
    {
      id: StatusEffectSightFlags.LOW_LIGHT_VISION,
      name: `${CONSTANTS.MODULE_NAME}.${StatusEffectSightFlags.LOW_LIGHT_VISION}`,
      path: 'data.traits.senses.lowlightvision',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/violet_09.jpg`,
      //effect: EffectDefinitions.lowlightvision(0),
      visionLevelMin: 0,
      visionLevelMax: 2,
      checkElevation: false,
    },
    {
      id: StatusEffectSightFlags.DARKVISION,
      name: `${CONSTANTS.MODULE_NAME}.${StatusEffectSightFlags.DARKVISION}`,
      path: 'data.traits.senses.darkvision',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/evil-eye-red-1.jpg`,
      //effect: EffectDefinitions.darkvision(0),
      visionLevelMin: 0,
      visionLevelMax: 3,
      checkElevation: false,
    },
    {
      id: StatusEffectSightFlags.GREATER_DARKVISION,
      name: `${CONSTANTS.MODULE_NAME}.${StatusEffectSightFlags.GREATER_DARKVISION}`,
      path: 'data.traits.senses.greaterdarkvision',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/evil-eye-eerie-1.jpg`,
      //effect: EffectDefinitions.darkvision(120),
      visionLevelMin: 0,
      visionLevelMax: 4,
      checkElevation: false,
    },
  ],
};
