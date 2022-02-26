import { AtcvEffectSenseFlags, AtcvEffectConditionFlags, SenseData } from '../conditional-visibility-models';
import CONSTANTS from '../constants';

export default {
  HP_ATTRIBUTE: `data.attributes.hp.value`,
  PERCEPTION_PASSIVE_SKILL: `data.skills.prc.passive`,
  STEALTH_PASSIVE_SKILL: `data.skills.ste.passive`,
  STEALTH_ACTIVE_SKILL: `data.skills.ste.total`,
  NPC_TYPE: `npc`,
  /**
   * The set of possible sensory perception types which an Actor may have.
   * @enum {string}
   */
  SENSES: <SenseData[]>[
    // {
    //   id: `stealthpassive`,
    //   name: `${CONSTANTS.MODULE_NAME}.stealthpassive`),
    //   //path: `data.skills.ste.passive`,
    //   path: `data.attributes.senses.stealthpassive`,
    //   img: ``,
    //   //effect: EffectDefinitions.stealthpassive(0),
    // },
    {
      id: AtcvEffectSenseFlags.NONE,
      name: `${CONSTANTS.MODULE_NAME}.${AtcvEffectSenseFlags.NONE}`,
      path: ``,
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/light_01.jpg`,
      //effect: undefined,
      visionLevelMinIndex: -2,
      visionLevelMaxIndex: -1,
      conditionElevation: false,
    },
    {
      id: AtcvEffectSenseFlags.NORMAL,
      name: `${CONSTANTS.MODULE_NAME}.${AtcvEffectSenseFlags.NORMAL}`,
      path: ``,
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/light_02.jpg`,
      //effect: undefined,
      visionLevelMinIndex: 0,
      visionLevelMaxIndex: 1,
      conditionElevation: false,
    },
    {
      id: AtcvEffectSenseFlags.BLINDED,
      name: `${CONSTANTS.MODULE_NAME}.${AtcvEffectSenseFlags.BLINDED}`,
      path: `data.traits.senses.blinded`,
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/affliction_24.jpg`,
      //effect: EffectDefinitions.blinded(0),
      visionLevelMinIndex: -1,
      visionLevelMaxIndex: 0,
      conditionElevation: false,
    },
    {
      id: AtcvEffectSenseFlags.DARKVISION,
      name: `${CONSTANTS.MODULE_NAME}.${AtcvEffectSenseFlags.DARKVISION}`,
      path: `data.attributes.senses.darkvision`,
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/evil-eye-red-1.jpg`,
      //effect: EffectDefinitions.darkvision(0),
      visionLevelMinIndex: 0,
      visionLevelMaxIndex: 3,
      conditionElevation: false,
    },
    {
      id: AtcvEffectSenseFlags.TREMOR_SENSE,
      name: `${CONSTANTS.MODULE_NAME}.${AtcvEffectSenseFlags.TREMOR_SENSE}`,
      path: `data.attributes.senses.tremorsense`,
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/ice_15.jpg`,
      //effect: EffectDefinitions.tremorsense(0),
      visionLevelMinIndex: 0,
      visionLevelMaxIndex: 10,
      conditionElevation: true,
    },
    {
      id: AtcvEffectSenseFlags.SEE_INVISIBLE,
      name: `${CONSTANTS.MODULE_NAME}.${AtcvEffectSenseFlags.SEE_INVISIBLE}`,
      path: `data.attributes.senses.seeinvisible`, // data.attributes.senses.special
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/shadow_11.jpg`,
      //effect: EffectDefinitions.seeinvisible(0),
      visionLevelMinIndex: 0,
      visionLevelMaxIndex: 5,
      conditionElevation: false,
    },
    {
      id: AtcvEffectSenseFlags.BLIND_SIGHT,
      name: `${CONSTANTS.MODULE_NAME}.${AtcvEffectSenseFlags.BLIND_SIGHT}`,
      path: `data.attributes.senses.blindsight`,
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/green_18.jpg`,
      //effect: EffectDefinitions.blindsight(0),
      visionLevelMinIndex: 0,
      visionLevelMaxIndex: 6,
      conditionElevation: false,
    },
    {
      id: AtcvEffectSenseFlags.TRUE_SIGHT,
      name: `${CONSTANTS.MODULE_NAME}.${AtcvEffectSenseFlags.TRUE_SIGHT}`,
      path: `data.attributes.senses.truesight`,
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/emerald_11.jpg`,
      //effect: EffectDefinitions.truesight(0),
      visionLevelMinIndex: 0,
      visionLevelMaxIndex: 7,
      conditionElevation: false,
    },
    {
      id: AtcvEffectSenseFlags.DEVILS_SIGHT,
      name: `${CONSTANTS.MODULE_NAME}.${AtcvEffectSenseFlags.DEVILS_SIGHT}`,
      path: `data.attributes.senses.devilssight`, // data.attributes.senses.special
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/blue_17.jpg`,
      //effect: EffectDefinitions.devilssight(0),
      visionLevelMinIndex: 0,
      visionLevelMaxIndex: 8,
      conditionElevation: false,
    },
  ],
  CONDITIONS: <SenseData[]>[
    {
      id: AtcvEffectConditionFlags.NONE,
      name: `${CONSTANTS.MODULE_NAME}.${AtcvEffectConditionFlags.NONE}`,
      path: ``,
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/light_01.jpg`,
      //effect: undefined,
      visionLevelMinIndex: -2,
      visionLevelMaxIndex: -1,
      conditionElevation: false,
    },
    {
      id: AtcvEffectConditionFlags.HIDDEN,
      name: `${CONSTANTS.MODULE_NAME}.${AtcvEffectConditionFlags.HIDDEN}`,
      path: ``, //`data.skills.ste.passive`,
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/newspaper.jpg`,
      visionLevelMinIndex: 0,
      visionLevelMaxIndex: 1,
      conditionElevation: false,
    },
    {
      id: AtcvEffectConditionFlags.INVISIBLE,
      name: `${CONSTANTS.MODULE_NAME}.${AtcvEffectConditionFlags.INVISIBLE}`,
      path: undefined,
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/unknown.jpg`,
      visionLevelMinIndex: 0,
      visionLevelMaxIndex: 4,
      conditionElevation: false,
    },
    {
      id: AtcvEffectConditionFlags.OBSCURED,
      name: `${CONSTANTS.MODULE_NAME}.${AtcvEffectConditionFlags.OBSCURED}`,
      path: undefined,
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/foggy.jpg`,
      visionLevelMinIndex: 0,
      visionLevelMaxIndex: 6,
      conditionElevation: false,
    },
    {
      id: AtcvEffectConditionFlags.IN_DARKNESS,
      name: `${CONSTANTS.MODULE_NAME}.${AtcvEffectConditionFlags.IN_DARKNESS}`,
      path: undefined,
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/moon.jpg`,
      visionLevelMinIndex: 0,
      visionLevelMaxIndex: 6,
      conditionElevation: false,
    },
  ],
};
