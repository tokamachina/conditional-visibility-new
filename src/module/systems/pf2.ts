import { EffectDefinitions } from '../conditional-visibility-effect-definition';
import { i18n } from '../lib/lib';

export default {
  VISION_LEVEL: {
    BLINDED: 0,
    NORMAL: 1,
    LOW_LIGHT_VISION: 2,
    DARKVISION: 3,
  },
  SENSES: {
    blinded: {
      name: i18n('conditional-visibility.blinded'),
      path: 'data.attributes.senses.blindsight',
      img: 'systems/dnd5e/icons/skills/affliction_24.jpg',
      effect: EffectDefinitions.blinded(0),
    },
    lowlightvision: {
      name: i18n('conditional-visibility.lowlightvision'),
      path: 'data.attributes.senses.darkvision',
      img: 'systems/dnd5e/icons/skills/violet_09.jpg',
      effect: EffectDefinitions.lowlightvision(0),
    },
    darkvision: {
      name: i18n('conditional-visibility.darkvision'),
      path: 'data.attributes.senses.darkvision',
      img: 'systems/dnd5e/icons/spells/evil-eye-red-1.jpg',
      effect: EffectDefinitions.darkvision(0),
    },
  },
};
