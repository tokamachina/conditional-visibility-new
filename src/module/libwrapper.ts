import API from './api.js';
import CONSTANTS from './constants.js';
import { getFirstPlayerTokenSelected, log, shouldIncludeVision } from './lib/lib.js';
import { canvas, game } from './settings';

export function registerLibwrappers() {
  // libWrapper.register(CONSTANTS.MODULE_NAME, 'Token.prototype._onClickLeft2', function (wrapped, ...args) {
  //     if (API.isValidItemPile(this.document) && game.keyboard.downKeys.has("ControlLeft")) {
  //         return API._itemPileClicked(this.document);
  //     }
  //     return wrapped(...args);
  // }, 'MIXED' /* optional, since this is the default type */);

  // //@ts-ignore
  // libWrapper.register(
  //   CONSTANTS.MODULE_NAME,
  //   'Token.prototype._onMovementFrame',
  //   _ConditionalVisibilityOnMovementFrame,
  //   'WRAPPER',
  // );

  // maniplulation and make some assumptions about the data.
  // libWrapper.register(
  //     CONSTANTS.MODULE_NAME,
  //     "CONFIG.PF2E.Actor.documentClasses.npc.prototype.visionLevel",
  //     _npcVisionLevel,
  //     "OVERRIDE"
  // );

  // // The Pathfinder 2e system and Perfect Vision both ignore NPCs for vision settings. Since the Perfect Vision
  // // code effectively overrides the base system code, we'll change how we override depending on the module's presence.
  // if (game.modules.get('perfect-vision')?.active) {
  //   //@ts-ignore
  //   libWrapper.register(
  //     CONSTANTS.MODULE_NAME,
  //     'CONFIG.Token.documentClass.prototype.prepareDerivedData',
  //     _prepareNpcDerivedDataWithPerfectVision,
  //     'WRAPPER',
  //   );
  // } else {
  //   //@ts-ignore
  //   libWrapper.register(
  //     CONSTANTS.MODULE_NAME,
  //     'CONFIG.Token.documentClass.prototype.prepareDerivedData',
  //     _prepareNpcDerivedData,
  //     'WRAPPER',
  //   );
  // }

  //@ts-ignore
  libWrapper.register(CONSTANTS.MODULE_NAME, 'SightLayer.prototype.testVisibility', evTestVisibility, 'WRAPPER');
}

export function evTestVisibility(wrapped, point, { tolerance = 2, object = null } = {}) {
  const res = wrapped(point, { tolerance: tolerance, object: object });
  // need a token object
  if (!object) {
    return res;
  }
  // Assume for the moment that the base function tests only infinite walls based on fov / los.
  // If so, then if a token is not seen, elevation will not change that.
  if (!res) {
    return res;
  }
  const tokenToCheckIfIsVisible = <Token>object;
  // this.sources is a map of selected tokens (may be size 0) all tokens
  // contribute to the vision so iterate through the tokens
  if (!this.sources || this.sources.size === 0) {
    return res;
  }
  const visible_to_sources = [...this.sources].map((s) => {
    // get the token elevation
    const controlledToken = <Token>s.object;
    // if any terrain blocks, then the token is not visible for that sight source
    // const is_visible = !terrains_block.reduce((total, curr) => total || curr, false);
    const is_visible = shouldIncludeVision(controlledToken, tokenToCheckIfIsVisible);
    // log(`terrains ${is_visible ? 'do not block' : 'do block'}`, terrains_block);
    return is_visible;
  }); // [...this.sources].forEach

  const sourcesNames = <string[]>this.sources.contents.map((e) => {
    return e.object.data.name;
  });

  // if any source has vision to the token, the token is visible
  const is_visible = visible_to_sources.reduce((total, curr) => total || curr, false);
  log(
    `target ${tokenToCheckIfIsVisible.data.name} ${
      is_visible ? 'is visible' : 'is not visible'
    } to sources ${sourcesNames.join(',')}`,
  );

  return is_visible;
}
