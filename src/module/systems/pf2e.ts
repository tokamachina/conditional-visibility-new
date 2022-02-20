import { EffectDefinitions } from '../conditional-visibility-effect-definition';
import { StatusEffectSenseFlags, StatusEffectConditionFlags, StatusSight } from '../conditional-visibility-models';
import CONSTANTS from '../constants';

export default {
  HP_ATTRIBUTE: 'data.attributes.hp.value',
  SENSES: <StatusSight[]>[
    {
      id: StatusEffectSenseFlags.NONE,
      name: `${CONSTANTS.MODULE_NAME}.${StatusEffectSenseFlags.NONE}`,
      path: '',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/light_01.jpg`,
      //effect: undefined,
      visionLevelMin: -2,
      visionLevelMax: -1,
      checkElevation: false,
    },
    {
      id: StatusEffectSenseFlags.NORMAL,
      name: `${CONSTANTS.MODULE_NAME}.${StatusEffectSenseFlags.NORMAL}`,
      path: 'data.traits.senses.blinded',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/light_02.jpg`,
      //effect: EffectDefinitions.blinded(0),
      visionLevelMin: 0,
      visionLevelMax: 1,
      checkElevation: false,
    },
    {
      id: StatusEffectSenseFlags.BLINDED,
      name: `${CONSTANTS.MODULE_NAME}.${StatusEffectSenseFlags.BLINDED}`,
      path: 'data.traits.senses.blinded',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/affliction_24.jpg`,
      //effect: EffectDefinitions.blinded(0),
      visionLevelMin: -1,
      visionLevelMax: 0,
      checkElevation: false,
    },
    {
      id: StatusEffectSenseFlags.LOW_LIGHT_VISION,
      name: `${CONSTANTS.MODULE_NAME}.${StatusEffectSenseFlags.LOW_LIGHT_VISION}`,
      path: 'data.traits.senses.lowlightvision',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/violet_09.jpg`,
      //effect: EffectDefinitions.lowlightvision(0),
      visionLevelMin: 0,
      visionLevelMax: 2,
      checkElevation: false,
    },
    {
      id: StatusEffectSenseFlags.DARKVISION,
      name: `${CONSTANTS.MODULE_NAME}.${StatusEffectSenseFlags.DARKVISION}`,
      path: 'data.traits.senses.darkvision',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/evil-eye-red-1.jpg`,
      //effect: EffectDefinitions.darkvision(0),
      visionLevelMin: 0,
      visionLevelMax: 3,
      checkElevation: false,
    },
    {
      id: StatusEffectSenseFlags.GREATER_DARKVISION,
      name: `${CONSTANTS.MODULE_NAME}.${StatusEffectSenseFlags.GREATER_DARKVISION}`,
      path: 'data.traits.senses.greaterdarkvision',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/evil-eye-eerie-1.jpg`,
      //effect: EffectDefinitions.darkvision(120),
      visionLevelMin: 0,
      visionLevelMax: 4,
      checkElevation: false,
    },
  ],
  CONDITIONS: <StatusSight[]>[
    {
      id: StatusEffectConditionFlags.HIDDEN,
      name: `${CONSTANTS.MODULE_NAME}.${StatusEffectConditionFlags.HIDDEN}`,
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/newspaper.svg`,
    },
    {
      id: StatusEffectConditionFlags.INVISIBLE,
      name: `${CONSTANTS.MODULE_NAME}.${StatusEffectConditionFlags.INVISIBLE}`,
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/unknown.svg`,
    },
    {
      id: StatusEffectConditionFlags.OBSCURED,
      name: `${CONSTANTS.MODULE_NAME}.${StatusEffectConditionFlags.OBSCURED}`,
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/foggy.svg`,
    },
    {
      id: StatusEffectConditionFlags.IN_DARKNESS,
      name: `${CONSTANTS.MODULE_NAME}.${StatusEffectConditionFlags.IN_DARKNESS}`,
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/moon.svg`,
    },
  ],
};
