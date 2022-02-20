import { StatusEffectSenseFlags, StatusEffectConditionFlags, StatusSight } from '../conditional-visibility-models';
import CONSTANTS from '../constants';

export default {
  HP_ATTRIBUTE: 'data.attributes.hp.value',
  /**
   * The set of possible sensory perception types which an Actor may have.
   * @enum {string}
   */
  SENSES: <StatusSight[]>[
    // {
    //   id: 'stealthpassive',
    //   name: `${CONSTANTS.MODULE_NAME}.stealthpassive'),
    //   //path: 'data.skills.ste.passive',
    //   path: 'data.attributes.senses.stealthpassive',
    //   img: '',
    //   //effect: EffectDefinitions.stealthpassive(0),
    // },
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
      path: '',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/light_02.jpg`,
      //effect: undefined,
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
      id: StatusEffectSenseFlags.DARKVISION,
      name: `${CONSTANTS.MODULE_NAME}.${StatusEffectSenseFlags.DARKVISION}`,
      path: 'data.attributes.senses.darkvision',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/evil-eye-red-1.jpg`,
      //effect: EffectDefinitions.darkvision(0),
      visionLevelMin: 0,
      visionLevelMax: 3,
      checkElevation: false,
    },
    {
      id: StatusEffectSenseFlags.TREMOR_SENSE,
      name: `${CONSTANTS.MODULE_NAME}.${StatusEffectSenseFlags.TREMOR_SENSE}`,
      path: 'data.attributes.senses.tremorsense',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/ice_15.jpg`,
      //effect: EffectDefinitions.tremorsense(0),
      visionLevelMin: 0,
      visionLevelMax: 10,
      checkElevation: true,
    },
    {
      id: StatusEffectSenseFlags.SEE_INVISIBLE,
      name: `${CONSTANTS.MODULE_NAME}.${StatusEffectSenseFlags.SEE_INVISIBLE}`,
      path: 'data.attributes.senses.seeinvisible', // data.attributes.senses.special
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/shadow_11.jpg`,
      //effect: EffectDefinitions.seeinvisible(0),
      visionLevelMin: 0,
      visionLevelMax: 5,
      checkElevation: false,
    },
    {
      id: StatusEffectSenseFlags.BLIND_SIGHT,
      name: `${CONSTANTS.MODULE_NAME}.${StatusEffectSenseFlags.BLIND_SIGHT}`,
      path: 'data.attributes.senses.blindsight',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/green_18.jpg`,
      //effect: EffectDefinitions.blindsigth(0),
      visionLevelMin: 0,
      visionLevelMax: 6,
      checkElevation: false,
    },
    {
      id: StatusEffectSenseFlags.TRUE_SIGHT,
      name: `${CONSTANTS.MODULE_NAME}.${StatusEffectSenseFlags.TRUE_SIGHT}`,
      path: 'data.attributes.senses.truesight',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/emerald_11.jpg`,
      //effect: EffectDefinitions.truesight(0),
      visionLevelMin: 0,
      visionLevelMax: 7,
      checkElevation: false,
    },
    {
      id: StatusEffectSenseFlags.DEVILS_SIGHT,
      name: `${CONSTANTS.MODULE_NAME}.${StatusEffectSenseFlags.DEVILS_SIGHT}`,
      path: 'data.attributes.senses.devilssight', // data.attributes.senses.special
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/blue_17.jpg`,
      //effect: EffectDefinitions.devilssight(0),
      visionLevelMin: 0,
      visionLevelMax: 8,
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
