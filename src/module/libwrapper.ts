import API from './api';
import CONSTANTS from './constants';
import { debug, log, shouldIncludeVision, templateTokens } from './lib/lib';
import { canvas, game } from './settings';

export function registerLibwrappers() {
  //@ts-ignore
  // libWrapper.register(CONSTANTS.MODULE_NAME, 'Token.prototype.refresh', tokenPrototypeRefreshHandler, 'MIXED');

  //@ts-ignore
  // libWrapper.register(CONSTANTS.MODULE_NAME, 'Token.prototype.draw', tokenPrototypeDrawHandler, 'MIXED');


    // ================
    // WITH NO LEVELS
    // ================

    //@ts-ignore
    libWrapper.register(
      CONSTANTS.MODULE_NAME,
      'SightLayer.prototype.testVisibility',
      sightLayerPrototypeTestVisibilityHandler,
      'WRAPPER',
    );

    //@ts-ignore
    libWrapper.register(
      CONSTANTS.MODULE_NAME,
      'SightLayer.prototype.tokenVision',
      sightLayerPrototypeTokenVisionHandlerNoLevels,
      'MIXED',
    );

  if (game.modules.get('levels')?.active) {
    // ================
    // WITH LEVELS EVERYTHING GO NUTS ???
    // ================

    // CAN'T USE THIS LEVELS IS DOING A OVERRIDE
    // //@ts-ignore
    // libWrapper.register(
    //   CONSTANTS.MODULE_NAME,
    //   'SightLayer.prototype.testVisibility',
    //   sightLayerPrototypeTestVisibilityHandler,
    //   'WRAPPER',
    // );

    // //@ts-ignore
    // libWrapper.register(
    //   CONSTANTS.MODULE_NAME,
    //   'SightLayer.prototype.tokenVision',
    //   sightLayerPrototypeTokenVisionHandlerWithLevels,
    //   'WRAPPER',
    // );

    //@ts-ignore
    libWrapper.ignore_conflicts(
      CONSTANTS.MODULE_NAME, 
      ['perfect-vision'], 
      'Levels.prototype.overrideVisibilityTest'
    );

    //@ts-ignore
    // libWrapper.register(
    //   CONSTANTS.MODULE_NAME,
    //   'Levels.prototype.overrideSightLayerLevelsTestVisibility',
    //   sightLayerPrototypeTestVisibilityHandler,
    //   'WRAPPER',
    //   { perf_mode: "FAST" }
    // );

    //@ts-ignore
    libWrapper.register(
      CONSTANTS.MODULE_NAME,
      'Levels.prototype.overrideVisibilityTest',
      overrideVisibilityTestHandler,
      'MIXED',
      { perf_mode: "FAST" }
    );

    // //@ts-ignore
    // libWrapper.register(
    //   CONSTANTS.MODULE_NAME,
    //   'Levels.prototype.advancedLosTestInLos',
    //   overrideVisibilityTestHandler,
    //   'WRAPPER',
    //   { perf_mode: "FAST" }
    // );

    //@ts-ignore
    // libWrapper.register(
    //   CONSTANTS.MODULE_NAME,
    //   'Levels.prototype.advancedLosTestInLos',
    //   overrideVisibilityTestHandler,
    //   'WRAPPER',
    // );
  }

  // This can be useful to apply active effect on template ?

  //@ts-ignore
  // libWrapper.register(CONSTANTS.MODULE_NAME,
  //   "Canvas.AbilityTemplate.prototype.refresh",
  //   "game.dnd5e.canvas.AbilityTemplate.prototype.refresh",
  //   templatePrototypeRefreshHandler,
  //   "WRAPPER"
  // );

  // ===================================================
  // EXPERIMENTAL FEATURE
  // THIS IS https://github.com/trioderegion/eagle-eye/
  // ===================================================

  if (game.settings.get(CONSTANTS.MODULE_NAME, 'useEagleEye')) {
    //@ts-ignore
    libWrapper.register(CONSTANTS.MODULE_NAME, 'Token.prototype.isVisible', isVisibleHandler, 'MIXED');

    //@ts-ignore
    libWrapper.register(CONSTANTS.MODULE_NAME, 'Token.prototype.updateToken', updateTokenHandler, 'MIXED');

    // Just as we're about to recalculate vision for this token, keep track of its vision level
    //@ts-ignore
    libWrapper.register(
      CONSTANTS.MODULE_NAME,
      'Token.prototype.updateVisionSource',
      updateVisionSourceHandler,
      'WRAPPER',
    );
  }
}

export function templatePrototypeRefreshHandler(wrapped) {
  templateTokens(this);
  return wrapped();
}

export function sightLayerPrototypeTokenVisionHandlerNoLevels(wrapped, ...args) {
  // const sightLayer = <SightLayer>this;
  // if (game.user?.isGM) {
  // 	return true;
  // }
  // return wrapped(args);
  // if(!sightLayer.tokenVision){
  //   return wrapped(args);
  // } else {
  //   return true;
  // }
  const gm = game.user?.isGM;
  if (gm) {
    return true;
  }
  let ownedTokens = <Token[]>canvas.tokens?.placeables.filter((token) => token.isOwner && (!token.data.hidden || gm));
  if (ownedTokens.length === 0 || !canvas.tokens?.controlled[0]) {
    ownedTokens = <Token[]>(
      canvas.tokens?.placeables.filter((token) => (token.observer || token.isOwner) && (!token.data.hidden || gm))
    );
  }
  for (const token of <Token[]>canvas.tokens?.placeables) {
    if (ownedTokens.includes(token)) {
      continue;
    }
    let tokenVisible = canvas.scene?.data.tokenVision ? false : gm || !token.data.hidden;
    for (const ownedToken of ownedTokens) {
      if (shouldIncludeVision(ownedToken, token)) {
        tokenVisible = true;
      } else {
        tokenVisible = false;
      }
    }
    token.visible = tokenVisible;
  }
}

export function sightLayerPrototypeTokenVisionHandlerWithLevels(wrapped, ...args) {
  // const sightLayer = <SightLayer>this;
  // if (game.user?.isGM) {
  // 	return true;
  // }
  // return wrapped(args);
  // if(!sightLayer.tokenVision){
  //   return wrapped(args);
  // } else {
  //   return true;
  // }

  if (!game.settings.get(CONSTANTS.MODULE_NAME, 'enableSightCheckForGM')) {
    const gm = game.user?.isGM;
    if (gm) {
      return wrapped(...args);
    }
    let ownedTokens = <Token[]>canvas.tokens?.placeables.filter((token) => token.isOwner && (!token.data.hidden || gm));
    if (ownedTokens.length === 0 || !canvas.tokens?.controlled[0]) {
      ownedTokens = <Token[]>(
        canvas.tokens?.placeables.filter((token) => (token.observer || token.isOwner) && (!token.data.hidden || gm))
      );
    }
    for (const token of <Token[]>canvas.tokens?.placeables) {
      if (ownedTokens.includes(token)) {
        continue;
      }
      let tokenVisible = canvas.scene?.data.tokenVision ? false : gm || !token.data.hidden;
      for (const ownedToken of ownedTokens) {
        if (shouldIncludeVision(ownedToken, token)) {
          tokenVisible = true;
        } else {
          tokenVisible = false;
        }
      }
      token.visible = tokenVisible;
    }
  } else {
    let ownedTokens = <Token[]>canvas.tokens?.placeables.filter((token) => token.isOwner && !token.data.hidden);
    if (ownedTokens.length === 0 || !canvas.tokens?.controlled[0]) {
      ownedTokens = <Token[]>(
        canvas.tokens?.placeables.filter((token) => (token.observer || token.isOwner) && !token.data.hidden)
      );
    }
    for (const token of <Token[]>canvas.tokens?.placeables) {
      if (!game.user?.isGM && ownedTokens.includes(token)) {
        continue;
      }
      let tokenVisible = canvas.scene?.data.tokenVision ? false : !token.data.hidden;
      for (const ownedToken of ownedTokens) {
        if (shouldIncludeVision(ownedToken, token)) {
          tokenVisible = true;
        } else {
          tokenVisible = false;
        }
      }
      token.visible = tokenVisible;
    }
  }
  return wrapped(...args);
}

export function overrideVisibilityTestHandler(wrapped, ...args) {
  const [sourceToken, targetToken] = args;
  const isCVVisible = shouldIncludeVision(sourceToken, targetToken);
  return isCVVisible ? wrapped(...args) : false;
}

// export function sightLayerPrototypeTestVisibilityHandler(wrapped, point, { tolerance = 2, object = null } = {}) {
export function sightLayerPrototypeTestVisibilityHandler(wrapped, ...args) {
  const [point, { tolerance = 2, object = null } = {}] = args;
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
  let mySources:Token[] = [];
  if (!this.sources || this.sources.size === 0) {
    // return res;
    mySources = <Token[]>canvas.tokens?.controlled;
  } else {
    const uniqueIds = new Set();
    this.sources.forEach((element) => {
      const isDuplicate = uniqueIds.has(element.key);
      uniqueIds.add(element.key);
      if (!isDuplicate) {
        mySources.push(<Token>element.object);
      }
    });
  }
  if (!mySources || mySources.length === 0) {
    return res;
  }
  const visible_to_sources = [...mySources].map((s) => {
    // get the token elevation
    const controlledToken = s;//<Token>s.object;
    // if any active effects blocks, then the token is not visible for that sight source
    const is_visible = shouldIncludeVision(controlledToken, tokenToCheckIfIsVisible);
    // log(`terrains ${is_visible ? 'do not block' : 'do block'}`, terrains_block);
    return is_visible ?? false;
  }); // [...this.sources].forEach

  const sourcesNames = <string[]>mySources.map((e) => {
    return e.data.name;
    //return e.object.data.name;
  });

  // if any source has vision to the token, the token is visible
  const is_visible = visible_to_sources.reduce((total, curr) => total || curr, false);
  debug(
    `target ${tokenToCheckIfIsVisible.data.name} ${
      is_visible ? 'is visible' : 'is not visible'
    } to sources ${sourcesNames.join(',')}`,
  );

  return is_visible;
}

export const tokenPrototypeRefreshHandler = function (wrapped, ...args) {
  const tokenData: Token = this as Token;
  tokenData.data.img = '';
  return wrapped(...args);
};

export const tokenPrototypeDrawHandler = function (wrapped, ...args) {
  const tokenData: Token = this as Token;
  tokenData.data.img = '';
  return wrapped(...args);
};

// ============= Eagle Eye  ==============================

/**
 * 1) Calculates vision from 4 corners of a 1x1 token's square. Shows token if any of it is visible, rather than a small area around its center.
 * 2) All owned tokens are visible at all times (hidden or not) this has been a complaint from my users and the functionality already exists with shift-click (for non-hidden tokens), so I don't see the change as negative.
 * @href https://gitlab.com/foundrynet/foundryvtt/-/issues/2547#note_413356123
 * @href https://github.com/trioderegion/eagle-eye/
 * @param wrapped
 * @param args
 * @returns
 */
export const isVisibleHandler = function (wrapped, ...args) {
  const gm = game.user?.isGM;
  // All owned tokens are visible at all times (hidden or not)
  // by tim posney
  if (this.actor?.hasPerm(game.user, 'OWNER')) {
    return true; // new code
  }

  if (this.data.hidden) {
    return gm;
  }
  if (!canvas.sight?.tokenVision) {
    return true;
  }
  if (this._controlled) {
    return true;
  }

  if (
    canvas.sight.sources.has(this.sourceId) ||
    canvas.sight.sources.has(this.sourceId + '_2') ||
    canvas.sight.sources.has(this.sourceId + '_3') ||
    canvas.sight.sources.has(this.sourceId + '_4')
  ) {
    return true;
  }

  //const tolerance = <number>canvas.grid?.size / 2;
  const tolerance = <number>canvas.dimensions?.size / 4; // from tim

  //return canvas.sight.testVisibility(this.center, { tolerance, object: this });
  return canvas.sight.testVisibility(this.center, { tolerance: tolerance, object: this }); // by tim posney
};

/**
 * 1) Calculates vision from 4 corners of a 1x1 token's square. Shows token if any of it is visible, rather than a small area around its center.
 * @href https://github.com/trioderegion/eagle-eye/
 * @param wrapped
 * @param args
 * @returns
 */
export const updateVisionSourceHandler = function (wrapped, ...args) {
  const [{ defer = false, deleted = false, skipUpdateFog = false } = {}] = args;
  if (!this.vision2) {
    //@ts-ignore
    this.vision2 = new VisionSource(this);
  }

  if (!this.vision3) {
    //@ts-ignore
    this.vision3 = new VisionSource(this);
  }

  if (!this.vision4) {
    //@ts-ignore
    this.vision4 = new VisionSource(this);
  }
  // Prepare data

  const sourceId = this.sourceId;
  const d = <Canvas.Dimensions>canvas.dimensions;
  const isVisionSource = this._isVisionSource();

  // Initialize vision source
  if (isVisionSource && !deleted) {
    this.vision.initialize({
      x: this.x + 2,
      y: this.y + 2,
      dim: Math.clamped(this.getLightRadius(this.data.dimSight), 0, d.maxR),
      bright: Math.clamped(this.getLightRadius(this.data.brightSight), 0, d.maxR),
      angle: this.data.sightAngle,
      rotation: this.data.rotation,
    });
    canvas.sight?.sources.set(sourceId, this.vision);

    this.vision2.initialize({
      x: this.x + this.w - 2,
      y: this.y + 2,
      dim: Math.clamped(this.getLightRadius(this.data.dimSight), 0, d.maxR),
      bright: Math.clamped(this.getLightRadius(this.data.brightSight), 0, d.maxR),
      angle: this.data.sightAngle,
      rotation: this.data.rotation,
    });
    canvas.sight?.sources.set(sourceId + '_2', this.vision2);

    this.vision3.initialize({
      x: this.x + this.w - 2,
      y: this.y + this.h - 2,
      dim: Math.clamped(this.getLightRadius(this.data.dimSight), 0, d.maxR),
      bright: Math.clamped(this.getLightRadius(this.data.brightSight), 0, d.maxR),
      angle: this.data.sightAngle,
      rotation: this.data.rotation,
    });
    canvas.sight?.sources.set(sourceId + '_3', this.vision3);

    this.vision4.initialize({
      x: this.x + 2,
      y: this.y + this.h - 2,
      dim: Math.clamped(this.getLightRadius(this.data.dimSight), 0, d.maxR),
      bright: Math.clamped(this.getLightRadius(this.data.brightSight), 0, d.maxR),
      angle: this.data.sightAngle,
      rotation: this.data.rotation,
    });
    canvas.sight?.sources.set(sourceId + '_4', this.vision4);
  }
  // Remove vision source
  else {
    canvas.sight?.sources.delete(sourceId);
    canvas.sight?.sources.delete(sourceId + '_2');
    canvas.sight?.sources.delete(sourceId + '_3');
    canvas.sight?.sources.delete(sourceId + '_4');
  }

  // Schedule a perception update
  if (!defer && (isVisionSource || deleted)) {
    canvas.perception.schedule({
      sight: { refresh: true, noUpdateFog: skipUpdateFog },
    });
  }
  return wrapped(...args);
};

/**
 * 1) All owned tokens are visible at all times (hidden or not) this has been a complaint from my users and the functionality already exists with shift-click (for non-hidden tokens), so I don't see the change as negative.
 * @href https://gitlab.com/foundrynet/foundryvtt/-/issues/2547#note_413356123
 * @param wrapped
 * @param args
 * @returns
 */
export const updateTokenHandler = function (wrapped, ...args) {
  const [document, change, options, userId] = args;
  // const[{defer=false, deleted=false, walls=null, forceUpdateFog=false}={}] = change;
  // const sourceId = `Token.${document.id}`;
  // this.sources.vision.delete(sourceId);
  // this.sources.lights.delete(sourceId);
  // if ( deleted ) return defer ? null : this.update();
  if (
    document.data.hidden &&
    !(
      game.user?.isGM ||
      //(<Actor>token.actor).hasPerm(game.user, "OWNER"))
      document.actor.permission == CONST.DOCUMENT_PERMISSION_LEVELS.OWNER
    )
  ) {
    return; // new code
  }
  return wrapped(...args);
};
