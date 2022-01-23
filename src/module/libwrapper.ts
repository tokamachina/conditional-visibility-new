import API from './api.js';
import CONSTANTS from './constants.js';
import { canvas, game } from './settings';

export function registerLibwrappers() {
  // libWrapper.register(CONSTANTS.MODULE_NAME, 'Token.prototype._onClickLeft2', function (wrapped, ...args) {
  //     if (API.isValidItemPile(this.document) && game.keyboard.downKeys.has("ControlLeft")) {
  //         return API._itemPileClicked(this.document);
  //     }
  //     return wrapped(...args);
  // }, 'MIXED' /* optional, since this is the default type */);

  //@ts-ignore
  libWrapper.register(
    CONSTANTS.MODULE_NAME,
    'Token.prototype._onMovementFrame',
    _ConditionalVisibilityOnMovementFrame,
    'WRAPPER',
  );

  // maniplulation and make some assumptions about the data.
  // libWrapper.register(
  //     CONSTANTS.MODULE_NAME,
  //     "CONFIG.PF2E.Actor.documentClasses.npc.prototype.visionLevel",
  //     _npcVisionLevel,
  //     "OVERRIDE"
  // );

  // The Pathfinder 2e system and Perfect Vision both ignore NPCs for vision settings. Since the Perfect Vision
  // code effectively overrides the base system code, we'll change how we override depending on the module's presence.
  if (game.modules.get('perfect-vision')?.active) {
    //@ts-ignore
    libWrapper.register(
      CONSTANTS.MODULE_NAME,
      'CONFIG.Token.documentClass.prototype.prepareDerivedData',
      _prepareNpcDerivedDataWithPerfectVision,
      'WRAPPER',
    );
  } else {
    //@ts-ignore
    libWrapper.register(
      CONSTANTS.MODULE_NAME,
      'CONFIG.Token.documentClass.prototype.prepareDerivedData',
      _prepareNpcDerivedData,
      'WRAPPER',
    );
  }
}

function _ConditionalVisibilityOnMovementFrame(wrapped, ...args) {
  wrapped(...args);
  // Update the token copy
  //ConditionalVisibility.INSTANCE.restrictVisibility(100);
}

// function _npcVisionLevel(...args) {
//   const senses = this.data.data.traits.senses.value.split(',').map((s) => s.replace(/[\s-]+/g, '').toLowerCase());
//   return this.getCondition('blinded')
//     ? VisionLevelPF2e.BLINDED
//     : senses.includes('darkvision')
//     ? VisionLevelPF2e.DARKVISION
//     : senses.includes('lowlightvision')
//     ? VisionLevelPF2e.LOW_LIGHT_VISION
//     : VisionLevelPF2e.NORMAL;
// }

// Since the Perfect Vision code effectively overrides the base system code, we'll change how we override depending on the module's presence.
function _prepareNpcDerivedDataWithPerfectVision(wrapped, ...args) {
  wrapped(args);

  if (!(this.initialized && this.actor && this.scene)) return;

  if (this.scene.rulesBasedVision && this.actor.type === 'npc') {
    this.data.dimSight = this.data._source.dimSight = this.hasLowLightVision ? 10000 : 0;
    this.data.brightSight = this.data._source.brightSight = this.hasDarkvision ? 10000 : 0;

    const isBlinded = this.actor.visionLevel === 0;

    setProperty(this.data, 'flags.perfect-vision.sightLimit', isBlinded ? 0 : null);
    setProperty(this.data._source, 'flags.perfect-vision.sightLimit', isBlinded ? 0 : null);
  }
}

function _prepareNpcDerivedData(wrapped, ...args) {
  wrapped(args);

  if (!(this.initialized && this.actor && this.scene)) return;

  if (this.scene.rulesBasedVision && this.actor.type === 'npc') {
    const hasDarkvision = this.hasDarkvision && (this.scene.isDark || this.scene.isDimlyLit);
    const hasLowLightVision = (this.hasLowLightVision || this.hasDarkvision) && this.scene.isDimlyLit;
    const isBlinded = game;
    this.data.brightSight = this.data._source.brightSight = hasDarkvision || hasLowLightVision ? 1000 : 0;
  }
}
