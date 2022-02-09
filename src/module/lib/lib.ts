import CONSTANTS from '../constants.js';
import API from '../api.js';
import { canvas, game } from '../settings';
import { StatusEffectSightFlags, StatusSight, VisionCapabilities } from '../conditional-visibility-models.js';
import EmbeddedCollection from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs';
import { ActorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs';

// =============================
// Module Generic function
// =============================

export function isGMConnected(): boolean {
  return Array.from(<Users>game.users).find((user) => user.isGM && user.active) ? true : false;
}

export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// export let debugEnabled = 0;
// 0 = none, warnings = 1, debug = 2, all = 3

export function debug(msg, args = '') {
  if (game.settings.get(CONSTANTS.MODULE_NAME, 'debug')) {
    console.log(`DEBUG | ${CONSTANTS.MODULE_NAME} | ${msg}`, args);
  }
  return msg;
}

export function log(message) {
  message = `${CONSTANTS.MODULE_NAME} | ${message}`;
  console.log(message.replace('<br>', '\n'));
  return message;
}

export function notify(message) {
  message = `${CONSTANTS.MODULE_NAME} | ${message}`;
  ui.notifications?.notify(message);
  console.log(message.replace('<br>', '\n'));
  return message;
}

export function warn(warning, notify = false) {
  warning = `${CONSTANTS.MODULE_NAME} | ${warning}`;
  if (notify) ui.notifications?.warn(warning);
  console.warn(warning.replace('<br>', '\n'));
  return warning;
}

export function error(error, notify = true) {
  error = `${CONSTANTS.MODULE_NAME} | ${error}`;
  if (notify) ui.notifications?.error(error);
  return new Error(error.replace('<br>', '\n'));
}

export function timelog(message): void {
  warn(Date.now(), message);
}

export const i18n = (key: string): string => {
  return game.i18n.localize(key).trim();
};

export const i18nFormat = (key: string, data = {}): string => {
  return game.i18n.format(key, data).trim();
};

// export const setDebugLevel = (debugText: string): void => {
//   debugEnabled = { none: 0, warn: 1, debug: 2, all: 3 }[debugText] || 0;
//   // 0 = none, warnings = 1, debug = 2, all = 3
//   if (debugEnabled >= 3) CONFIG.debug.hooks = true;
// };

export function dialogWarning(message, icon = 'fas fa-exclamation-triangle') {
  return `<p class="${CONSTANTS.MODULE_NAME}-dialog">
        <i style="font-size:3rem;" class="${icon}"></i><br><br>
        <strong style="font-size:1.2rem;">Item Piles</strong>
        <br><br>${message}
    </p>`;
}

// =============================
// Module specific function
// =============================

export function shouldIncludeVision(currentToken: Token, placeableObjectTarget: PlaceableObject): boolean | null {
  // if (!currentToken) {
  //   currentToken = <Token>getFirstPlayerTokenSelected();
  // }
  // if (!currentToken) {
  //   currentToken = <Token>getFirstPlayerToken();
  // }
  if (!currentToken) {
    return true;
  }
  const tokenVisionLevel = getVisionLevelToken(currentToken);
  const targetVisionLevel = <string>placeableObjectTarget.document.getFlag(CONSTANTS.MODULE_NAME, 'visionLevel');

  const statusSight = <StatusSight>API.SENSES.find((a: StatusSight) => {
    return a.id == targetVisionLevel;
  });
  if (!statusSight) {
    return true;
  }
  if (statusSight.id == StatusEffectSightFlags.NORMAL || statusSight.id == StatusEffectSightFlags.NONE) {
    return true;
  }
  if (tokenVisionLevel?.checkElevation) {
    const tokenElevation = getElevationToken(currentToken);
    const targetElevation = getElevationPlaceableObject(placeableObjectTarget);
    if (tokenElevation < targetElevation) {
      return null;
    }
  }

  const result =
    tokenVisionLevel.min <= <number>statusSight?.visionLevelMin &&
    tokenVisionLevel.max >= <number>statusSight?.visionLevelMax;
  if (result) {
    return null;
  } else {
    return true;
  }
}

// export function getVisionCapabilities(srcToken: Token): VisionCapabilities {
//   const visionCapabilities: VisionCapabilities = new VisionCapabilities();
//   if (srcToken) {
//     let _seeinvisible =
//       <number>(
//         srcToken?.data?.document?.getFlag(CONSTANTS.MODULE_NAME, StatusEffectSightFlags.SEE_INVISIBLE)
//       ) ?? 0;

//     let _blindsight =
//       <number>(
//         srcToken?.data?.document?.getFlag(CONSTANTS.MODULE_NAME, StatusEffectSightFlags.BLIND_SIGHT)
//       ) ?? 0;

//     let _tremorsense =
//       <number>(
//         srcToken?.data?.document?.getFlag(CONSTANTS.MODULE_NAME, StatusEffectSightFlags.TREMOR_SENSE)
//       ) ?? 0;

//     let _truesight =
//       <number>(
//         srcToken?.data?.document?.getFlag(CONSTANTS.MODULE_NAME, StatusEffectSightFlags.TRUE_SIGHT)
//       ) ?? 0;

//     let _devilssight =
//       <number>(
//         srcToken?.data?.document?.getFlag(CONSTANTS.MODULE_NAME, StatusEffectSightFlags.DEVILS_SIGHT)
//       ) ?? 0;

//     _seeinvisible = _seeinvisible < 0 ? 100000 : _seeinvisible;
//     _blindsight = _blindsight < 0 ? 100000 : _blindsight;
//     _tremorsense = _tremorsense < 0 ? 100000 : _tremorsense;
//     _truesight = _truesight < 0 ? 100000 : _truesight;
//     _devilssight = _devilssight < 0 ? 100000 : _devilssight;

//     visionCapabilities.seeinvisible = Math.max(_seeinvisible, _blindsight, _tremorsense, _truesight, _devilssight);
//     visionCapabilities.seeobscured = Math.max(_blindsight, _tremorsense);
//     visionCapabilities.seeindarkness = Math.max(_blindsight, _devilssight, _tremorsense, _truesight);

//     // //@ts-ignore
//     // if (srcToken?._movement !== null) {
//     //   //@ts-ignore
//     //   visionCapabilities.visionfrom = srcToken._movement.B;
//     // } else {
//     //   visionCapabilities.visionfrom = srcToken?.position ?? { x: 0, y: 0 };
//     // }
//   } else {
//     error('NO token found for get the visual capatibilities');
//   }
//   return visionCapabilities;
// }

// ========================================================================================

/**
 * Returns the first selected token
 */
export function getFirstPlayerTokenSelected(): Token | null {
  // Get first token ownted by the player
  const selectedTokens = <Token[]>canvas.tokens?.controlled;
  if (selectedTokens.length > 1) {
    //iteractionFailNotification(i18n("foundryvtt-arms-reach.warningNoSelectMoreThanOneToken"));
    return null;
  }
  if (!selectedTokens || selectedTokens.length == 0) {
    //if(game.user.character.data.token){
    //  //@ts-ignore
    //  return game.user.character.data.token;
    //}else{
    return null;
    //}
  }
  return selectedTokens[0];
}

/**
 * Returns a list of selected (or owned, if no token is selected)
 * note: ex getSelectedOrOwnedToken
 */
function getFirstPlayerToken(): Token | null {
  // Get controlled token
  let token: Token;
  const controlled: Token[] = <Token[]>canvas.tokens?.controlled;
  // Do nothing if multiple tokens are selected
  if (controlled.length && controlled.length > 1) {
    //iteractionFailNotification(i18n("foundryvtt-arms-reach.warningNoSelectMoreThanOneToken"));
    return null;
  }
  // If exactly one token is selected, take that
  token = controlled[0];
  if (!token) {
    if (!controlled.length || controlled.length == 0) {
      // If no token is selected use the token of the users character
      token = <Token>canvas.tokens?.placeables.find((token) => token.data._id === game.user?.character?.data?._id);
    }
    // If no token is selected use the first owned token of the users character you found
    if (!token) {
      token = <Token>canvas.tokens?.ownedTokens[0];
    }
  }
  return token;
}

function getElevationToken(token: Token): number {
  const base = token.document.data;
  return getElevationPlaceableObject(base);
}

function getElevationWall(wall: Wall): number {
  const base = wall.document.data;
  return getElevationPlaceableObject(base);
}

function getElevationPlaceableObject(placeableObject: any): number {
  let base = placeableObject;
  if (base.document) {
    base = base.document.data;
  }
  const base_elevation =
    //@ts-ignore
    typeof _levels !== 'undefined' && _levels?.advancedLOS
      ? //@ts-ignore
        _levels.getTokenLOSheight(token)
      : base.elevation ??
        base.flags['levels']?.elevation ??
        base.flags['levels']?.rangeBottom ??
        base.flags['wallHeight']?.wallHeightBottom ??
        0;
  return base_elevation;
}

function getVisionLevelToken(token: Token): { min: number; max: number; checkElevation: boolean } {
  const actor = <Actor>token.document.getActor();
  const actorEffects = <EmbeddedCollection<typeof ActiveEffect, ActorData>>actor?.data.effects;
  let min = 0;
  let max = 0;
  let hasOnlyEffectsWithCheckElevationTrue = true;

  // regex expression to match all non-alphanumeric characters in string
  const regex = /[^A-Za-z0-9]/g;

  for (const effectEntity of actorEffects) {
    const effectNameToSet = effectEntity.name ? effectEntity.name : effectEntity.data.label;
    if (!effectNameToSet) {
      continue;
    }
    // use replace() method to match and remove all the non-alphanumeric characters
    const effectNameToCheckOnActor = effectNameToSet.replace(regex, '');
    const effectSight = API.SENSES.find((a: StatusSight) => {
      return effectNameToCheckOnActor.toLowerCase().startsWith(a.id.toLowerCase());
    });
    // if is a AE with the label of the module (no id sorry)
    if (effectSight) {
      if (min < <number>effectSight?.visionLevelMin) {
        min = <number>effectSight?.visionLevelMin;
      }
      if (max < <number>effectSight?.visionLevelMax) {
        max = <number>effectSight?.visionLevelMax;
      }
      // look up if you have not basic AE and if the check elevation is not enabled
      if (
        !effectSight.checkElevation &&
        effectSight.id != StatusEffectSightFlags.NONE &&
        effectSight.id != StatusEffectSightFlags.NORMAL &&
        effectSight.id != StatusEffectSightFlags.BLINDED
      ) {
        hasOnlyEffectsWithCheckElevationTrue = false;
      }
    }
  }
  return { min: min, max: max, checkElevation: hasOnlyEffectsWithCheckElevationTrue };
}
