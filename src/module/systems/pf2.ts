import { EffectDefinitions } from '../conditional-visibility-effect-definition';
import { i18n } from '../lib/lib';
import { CONDITIONAL_VISIBILITY_MODULE_NAME } from '../settings';

export default {
  VISION_LEVEL: {
    BLINDED: 0,
    NORMAL: 1,
    LOW_LIGHT_VISION: 2,
    DARKVISION: 3,
  },
  SENSES: [
    {
      id: 'blinded',
      name: i18n('conditional-visibility.blinded'),
      path: 'data.traits.senses.blinded',
      img: 'systems/dnd5e/icons/skills/affliction_24.jpg',
      effect: EffectDefinitions.blinded(0),
    },
    {
      id: 'lowlightvision',
      name: i18n('conditional-visibility.lowlightvision'),
      path: 'data.traits.senses.lowlightvision',
      img: 'systems/dnd5e/icons/skills/violet_09.jpg',
      effect: EffectDefinitions.lowlightvision(0),
    },
    {
      id: 'darkvision',
      name: i18n('conditional-visibility.darkvision'),
      path: 'data.traits.senses.darkvision',
      img: 'systems/dnd5e/icons/spells/evil-eye-red-1.jpg',
      effect: EffectDefinitions.darkvision(0),
    },
  ],
  CONDITIONS: [
    {
      id: CONDITIONAL_VISIBILITY_MODULE_NAME + '.invisible',
      visibilityId: 'invisible',
      label: i18n(CONDITIONAL_VISIBILITY_MODULE_NAME + '.invisible'),
      icon: 'systems/pf2e/icons/conditions/invisible.webp',
    },
  ],
};
