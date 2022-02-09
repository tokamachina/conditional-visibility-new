import API from './api.js';
import CONSTANTS from './constants.js';
import { getFirstPlayerTokenSelected, log, shouldIncludeVision } from './lib/lib.js';
import { canvas, game } from './settings';

export function registerLibwrappers() {
  //@ts-ignore
  libWrapper.register(
    CONSTANTS.MODULE_NAME,
    'SightLayer.prototype.testVisibility',
    sightLayerPrototypeTestVisibilityHandler,
    'WRAPPER',
  );
}

export function sightLayerPrototypeTestVisibilityHandler(wrapped, point, { tolerance = 2, object = null } = {}) {
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
    // if any active effects blocks, then the token is not visible for that sight source
    const is_visible = shouldIncludeVision(controlledToken, tokenToCheckIfIsVisible);
    // log(`terrains ${is_visible ? 'do not block' : 'do block'}`, terrains_block);
    return is_visible ?? false;
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
