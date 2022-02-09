import {
  StatusEffect,
  StatusEffectSightFlags,
  StatusEffectStatusFlags,
  StatusSight,
} from '../conditional-visibility-models';
import CONSTANTS from '../constants';

export default {
  HP_ATTRIBUTE: 'data.attributes.hp.value',
  /** Equivalent to the VisionLevel enum in the Pathfinder 2e system */
  // VISION_LEVEL: [
  //   'BLINDED',
  //   'NORMAL',
  //   'DARKVISION',
  //   'SUNLIGHT_SENSITIVITY',
  //   'BLINDSIGHT',
  //   'TREMORSENSE',
  // ],
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
      path: '',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/light_02.jpg`,
      //effect: undefined,
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
      id: StatusEffectSightFlags.DARKVISION,
      name: `${CONSTANTS.MODULE_NAME}.${StatusEffectSightFlags.DARKVISION}`,
      path: 'data.attributes.senses.darkvision',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/evil-eye-red-1.jpg`,
      //effect: EffectDefinitions.darkvision(0),
      visionLevelMin: 0,
      visionLevelMax: 3,
      checkElevation: false,
    },
    {
      id: StatusEffectSightFlags.TREMOR_SENSE,
      name: `${CONSTANTS.MODULE_NAME}.${StatusEffectSightFlags.TREMOR_SENSE}`,
      path: 'data.attributes.senses.tremorsense',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/ice_15.jpg`,
      //effect: EffectDefinitions.tremorsense(0),
      visionLevelMin: 0,
      visionLevelMax: 10,
      checkElevation: true,
    },
    {
      id: StatusEffectSightFlags.SEE_INVISIBLE,
      name: `${CONSTANTS.MODULE_NAME}.${StatusEffectSightFlags.SEE_INVISIBLE}`,
      path: 'data.attributes.senses.seeinvisible',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/shadow_11.jpg`,
      //effect: EffectDefinitions.seeinvisible(0),
      visionLevelMin: 0,
      visionLevelMax: 5,
      checkElevation: false,
    },
    {
      id: StatusEffectSightFlags.BLIND_SIGHT,
      name: `${CONSTANTS.MODULE_NAME}.${StatusEffectSightFlags.BLIND_SIGHT}`,
      path: 'data.attributes.senses.blindsight',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/green_18.jpg`,
      //effect: EffectDefinitions.blindsigth(0),
      visionLevelMin: 0,
      visionLevelMax: 6,
      checkElevation: false,
    },
    {
      id: StatusEffectSightFlags.TRUE_SIGHT,
      name: `${CONSTANTS.MODULE_NAME}.${StatusEffectSightFlags.TRUE_SIGHT}`,
      path: 'data.attributes.senses.truesight',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/emerald_11.jpg`,
      //effect: EffectDefinitions.truesight(0),
      visionLevelMin: 0,
      visionLevelMax: 7,
      checkElevation: false,
    },
    {
      id: StatusEffectSightFlags.DEVILS_SIGHT,
      name: `${CONSTANTS.MODULE_NAME}.${StatusEffectSightFlags.DEVILS_SIGHT}`,
      path: 'data.attributes.senses.devilssight',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/blue_17.jpg`,
      //effect: EffectDefinitions.devilssight(0),
      visionLevelMin: 0,
      visionLevelMax: 8,
      checkElevation: false,
    },
  ],
  CONDITIONS: <StatusEffect[]>[
    {
      id: StatusEffectStatusFlags.HIDDEN,
      visibilityId: StatusEffectStatusFlags.HIDDEN, //'hidden',
      name: `${CONSTANTS.MODULE_NAME}.${StatusEffectStatusFlags.HIDDEN}`,
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/newspaper.svg`,
    },
    {
      id: StatusEffectStatusFlags.INVISIBLE,
      visibilityId: StatusEffectStatusFlags.INVISIBLE, //'invisible',
      name: `${CONSTANTS.MODULE_NAME}.${StatusEffectStatusFlags.INVISIBLE}`,
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/unknown.svg`,
    },
    {
      id: StatusEffectStatusFlags.OBSCURED,
      visibilityId: StatusEffectStatusFlags.OBSCURED, //'obscured',
      name: `${CONSTANTS.MODULE_NAME}.${StatusEffectStatusFlags.OBSCURED}`,
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/foggy.svg`,
    },
    {
      id: StatusEffectStatusFlags.IN_DARKNESS,
      visibilityId: StatusEffectStatusFlags.IN_DARKNESS, // 'indarkness',
      name: `${CONSTANTS.MODULE_NAME}.${StatusEffectStatusFlags.IN_DARKNESS}`,
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/moon.svg`,
    },
  ],
  // LIGTH_VS_VISION: [
  //   { color: 'Blue', size: 'Small', sku: '123' },
  //   { color: 'Blue', size: 'Medium', sku: '124' },
  //   { color: 'Red', size: 'Medium', sku: '125' },
  //   { color: 'Blue', size: 'Large', sku: '126' },
  //   { color: 'Red', size: 'Large', sku: '127' },
  //   { color: 'Green', size: 'Large', sku: '128' }
  // ]
  //   {
  //     brightlight : {
  //       BLINDED: 'BLINDED',
  //       NORMAL: '',
  //       DARKVISION: '',
  //       SUNLIGHT_SENSITIVITY: '',
  //       BLINDSIGHT: '',
  //       TREMORSENSE: 'TREMORSENSE',
  //     },
  //     dimlight: { apples: 0, oranges: 10, bananas: 0, melons: 0 },
  //     darkness: { apples: 0, oranges: 0, bananas: 0, melons: 5 },
  //     magicaldarkness
  //   }
  // ],
};
