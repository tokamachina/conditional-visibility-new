import Effect, { Constants } from '../effects/effect';
import { EffectDefinitions } from '../conditional-visibility-effect-definition';
import { i18n } from '../lib/lib';
import { CONDITIONAL_VISIBILITY_MODULE_NAME } from '../settings';
import {
  StatusEffect,
  StatusEffectSightFlags,
  StatusEffectStatusFlags,
  StatusSight,
} from '../conditional-visibility-models';
import CONSTANTS from '../constants';
import ArrayMatrix from '../lib/javascript-array-matrix';

export default {
  HP: 'actorData.data.attributes.hp.value',
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
    //   name: i18n(`${CONSTANTS.MODULE_NAME}.stealthpassive'),
    //   //path: 'data.skills.ste.passive',
    //   path: 'data.attributes.senses.stealthpassive',
    //   img: '',
    //   effect: EffectDefinitions.stealthpassive(0),
    // },
    {
      id: StatusEffectSightFlags.BLIND_SIGHT,
      name: i18n(`${CONSTANTS.MODULE_NAME}.${StatusEffectSightFlags.BLIND_SIGHT}`),
      path: 'data.attributes.senses.blindsight',
      img: 'systems/dnd5e/icons/skills/affliction_24.jpg',
      effect: EffectDefinitions.blindsigth(0),
    },
    {
      id: StatusEffectSightFlags.DARKVISION,
      name: i18n(`${CONSTANTS.MODULE_NAME}.${StatusEffectSightFlags.DARKVISION}`),
      path: 'data.attributes.senses.darkvision',
      img: 'systems/dnd5e/icons/spells/evil-eye-red-1.jpg',
      effect: EffectDefinitions.darkvision(0),
    },
    {
      id: StatusEffectSightFlags.TREMOR_SENSE,
      name: i18n(`${CONSTANTS.MODULE_NAME}.${StatusEffectSightFlags.TREMOR_SENSE}`),
      path: 'data.attributes.senses.tremorsense',
      img: 'systems/dnd5e/icons/skills/ice_15.jpg',
      effect: EffectDefinitions.tremorsense(0),
    },
    {
      id: StatusEffectSightFlags.TRUE_SIGHT,
      name: i18n(`${CONSTANTS.MODULE_NAME}.${StatusEffectSightFlags.TRUE_SIGHT}`),
      path: 'data.attributes.senses.truesight',
      img: 'systems/dnd5e/icons/skills/emerald_11.jpg',
      effect: EffectDefinitions.truesight(0),
    },
    {
      id: StatusEffectSightFlags.SEE_INVISIBLE,
      name: i18n(`${CONSTANTS.MODULE_NAME}.${StatusEffectSightFlags.SEE_INVISIBLE}`),
      path: 'data.attributes.senses.seeinvisible',
      img: 'systems/dnd5e/icons/skills/shadow_11.jpg',
      effect: EffectDefinitions.seeinvisible(0),
    },
    {
      id: StatusEffectSightFlags.DEVILS_SIGHT,
      name: i18n(`${CONSTANTS.MODULE_NAME}.${StatusEffectSightFlags.DEVILS_SIGHT}`),
      path: 'data.attributes.senses.devilssight',
      img: 'systems/dnd5e/icons/skills/blue_17.jpg',
      effect: EffectDefinitions.devilssight(0),
    },
  ],
  CONDITIONS: <StatusEffect[]>[
    {
      id: StatusEffectStatusFlags.HIDDEN,
      visibilityId: StatusEffectStatusFlags.HIDDEN, //'hidden',
      name: i18n(`${CONDITIONAL_VISIBILITY_MODULE_NAME}.${StatusEffectStatusFlags.HIDDEN}`),
      img: 'modules/' + CONDITIONAL_VISIBILITY_MODULE_NAME + '/icons/newspaper.svg',
    },
    {
      id: StatusEffectStatusFlags.INVISIBLE,
      visibilityId: StatusEffectStatusFlags.INVISIBLE, //'invisible',
      name: i18n(`${CONDITIONAL_VISIBILITY_MODULE_NAME}.${StatusEffectStatusFlags.INVISIBLE}`),
      img: 'modules/' + CONDITIONAL_VISIBILITY_MODULE_NAME + '/icons/unknown.svg',
    },
    {
      id: StatusEffectStatusFlags.OBSCURED,
      visibilityId: StatusEffectStatusFlags.OBSCURED, //'obscured',
      name: i18n(`${CONDITIONAL_VISIBILITY_MODULE_NAME}.${StatusEffectStatusFlags.OBSCURED}`),
      img: 'modules/' + CONDITIONAL_VISIBILITY_MODULE_NAME + '/icons/foggy.svg',
    },
    {
      id: StatusEffectStatusFlags.IN_DARKNESS,
      visibilityId: StatusEffectStatusFlags.IN_DARKNESS, // 'indarkness',
      name: i18n(`${CONDITIONAL_VISIBILITY_MODULE_NAME}.${StatusEffectStatusFlags.IN_DARKNESS}`),
      img: 'modules/' + CONDITIONAL_VISIBILITY_MODULE_NAME + '/icons/moon.svg',
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
  hasStealth(): boolean {
    return true;
  },
  rollStealth(token: Token): Roll {
    if (token && token.actor) {
      //@ts-ignore
      const roll = new Roll('1d20 + (' + token.actor.data.data.skills.ste.total + ')').roll();
      return roll;
    } else {
      return super.rollStealth(token);
    }
  },
};
