import Effect, { Constants } from '../effects/effect';
import { EffectDefinitions } from '../conditional-visibility-effect-definition';
import { i18n } from '../lib/lib';
import { CONDITIONAL_VISIBILITY_MODULE_NAME } from '../settings';
import { StatusEffectStatusFlags } from '../conditional-visibility-models';

export default {
  /** Equivalent to the VisionLevel enum in the Pathfinder 2e system */
  VISION_LEVEL: {
    BLINDED: 0,
    NORMAL: 1,
    LOW_LIGHT_VISION: 2,
    DARKVISION: 3,
    BLINDSIGHT: 4,
    TREMORSENSE: 5,
  },
  /**
   * The set of possible sensory perception types which an Actor may have.
   * @enum {string}
   */
  SENSES: [
    {
      id: 'blindsight',
      name: i18n('conditional-visibility.blindsight'),
      path: 'data.attributes.senses.blindsight',
      img: 'systems/dnd5e/icons/skills/affliction_24.jpg',
      effect: EffectDefinitions.blindsigth(0),
    },
    {
      id: 'darkvision',
      name: i18n('conditional-visibility.darkvision'),
      path: 'data.attributes.senses.darkvision',
      img: 'systems/dnd5e/icons/spells/evil-eye-red-1.jpg',
      effect: EffectDefinitions.darkvision(0),
    },
    {
      id: 'tremorsense',
      name: i18n('conditional-visibility.tremorsense'),
      path: 'data.attributes.senses.tremorsense',
      img: 'systems/dnd5e/icons/skills/ice_15.jpg',
      effect: EffectDefinitions.tremorsense(0),
    },
    {
      id: 'truesight',
      name: i18n('conditional-visibility.truesight'),
      path: 'data.attributes.senses.truesight',
      img: 'systems/dnd5e/icons/skills/emerald_11.jpg',
      effect: EffectDefinitions.truesight(0),
    },
    {
      id: 'seeinvisible',
      name: i18n('conditional-visibility.seeinvisible'),
      path: 'data.attributes.senses.seeinvisible',
      img: 'systems/dnd5e/icons/skills/shadow_11.jpg',
      effect: EffectDefinitions.seeinvisible(0),
    },
    {
      id: 'devilssight',
      name: i18n('conditional-visibility.devilssight'),
      path: 'data.attributes.senses.devilssight',
      img: 'systems/dnd5e/icons/skills/blue_17.jpg',
      effect: EffectDefinitions.devilssight(0),
    },
  ],
  CONDITIONS: [
    {
      id: CONDITIONAL_VISIBILITY_MODULE_NAME + '.invisible',
      visibilityId: StatusEffectStatusFlags.INVISIBLE, //'invisible',
      label: i18n(CONDITIONAL_VISIBILITY_MODULE_NAME + '.invisible'),
      icon: 'modules/' + CONDITIONAL_VISIBILITY_MODULE_NAME + '/icons/unknown.svg',
    },
    {
      id: CONDITIONAL_VISIBILITY_MODULE_NAME + '.obscured',
      visibilityId: StatusEffectStatusFlags.OBSCURED, //'obscured',
      label: i18n(CONDITIONAL_VISIBILITY_MODULE_NAME + '.obscured'),
      icon: 'modules/' + CONDITIONAL_VISIBILITY_MODULE_NAME + '/icons/foggy.svg',
    },
    {
      id: CONDITIONAL_VISIBILITY_MODULE_NAME + '.indarkness',
      visibilityId: StatusEffectStatusFlags.IN_DARKNESS, // 'indarkness',
      label: i18n(CONDITIONAL_VISIBILITY_MODULE_NAME + '.indarkness'),
      icon: 'modules/' + CONDITIONAL_VISIBILITY_MODULE_NAME + '/icons/moon.svg',
    },
  ],
};
