import CONSTANTS from '../constants.js';
import API from '../api.js';
import { canvas, CONDITIONAL_VISIBILITY_MODULE_NAME, game } from '../settings';
import { StatusEffectSightFlags, VisionCapabilities } from '../conditional-visibility-models.js';

export function isGMConnected() {
  return !!Array.from(<Users>game.users).find((user) => user.isGM && user.active);
}

export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// export let debugEnabled = 0;
// 0 = none, warnings = 1, debug = 2, all = 3

export function debug(msg, args = '') {
  if (game.settings.get(CONSTANTS.MODULE_NAME, 'debug')) {
    console.log(`DEBUG | ${CONDITIONAL_VISIBILITY_MODULE_NAME} | ${msg}`, args);
  }
  return msg;
}

export function log(message) {
  message = `${CONDITIONAL_VISIBILITY_MODULE_NAME} | ${message}`;
  console.log(message.replace('<br>', '\n'));
  return message;
}

export function notify(message) {
  message = `${CONDITIONAL_VISIBILITY_MODULE_NAME} | ${message}`;
  ui.notifications?.notify(message);
  console.log(message.replace('<br>', '\n'));
  return message;
}

export function warn(warning, notify = false) {
  warning = `${CONDITIONAL_VISIBILITY_MODULE_NAME} | ${warning}`;
  if (notify) ui.notifications?.warn(warning);
  console.warn(warning.replace('<br>', '\n'));
  return warning;
}

export function error(error, notify = true) {
  error = `${CONDITIONAL_VISIBILITY_MODULE_NAME} | ${error}`;
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

export function getTokensAtLocation(position) {
  const tokens = [...(<Token[]>canvas.tokens?.placeables)];
  return tokens.filter((token) => {
    return (
      position.x >= token.x &&
      position.x < token.x + token.data.width * <number>canvas.grid?.size &&
      position.y >= token.y &&
      position.y < token.y + token.data.height * <number>canvas.grid?.size
    );
  });
}

export function distance_between_rect(p1, p2) {
  const x1 = p1.x;
  const y1 = p1.y;
  const x1b = p1.x + p1.w;
  const y1b = p1.y + p1.h;

  const x2 = p2.x;
  const y2 = p2.y;
  const x2b = p2.x + p2.w;
  const y2b = p2.y + p2.h;

  const left = x2b < x1;
  const right = x1b < x2;
  const bottom = y2b < y1;
  const top = y1b < y2;

  if (top && left) {
    return distance_between({ x: x1, y: y1b }, { x: x2b, y: y2 });
  } else if (left && bottom) {
    return distance_between({ x: x1, y: y1 }, { x: x2b, y: y2b });
  } else if (bottom && right) {
    return distance_between({ x: x1b, y: y1 }, { x: x2, y: y2b });
  } else if (right && top) {
    return distance_between({ x: x1b, y: y1b }, { x: x2, y: y2 });
  } else if (left) {
    return x1 - x2b;
  } else if (right) {
    return x2 - x1b;
  } else if (bottom) {
    return y1 - y2b;
  } else if (top) {
    return y2 - y1b;
  }

  return 0;
}

export function distance_between(a, b) {
  return new Ray(a, b).distance;
}

export function grids_between_tokens(a, b) {
  return Math.floor(distance_between_rect(a, b) / <number>canvas.grid?.size) + 1;
}

export function tokens_close_enough(a, b, maxDistance) {
  const distance = grids_between_tokens(a, b);
  return maxDistance >= distance;
}

export function getSimilarItem(items, { itemId, itemName, itemType }) {
  for (const item of items) {
    if (item.id === itemId || (item.name === itemName && item.type === itemType)) {
      return item;
    }
  }
  return false;
}

export async function getToken(documentUuid) {
  const document = await fromUuid(documentUuid);
  //@ts-ignore
  return document?.token ?? document;
}

export function getUuid(target) {
  // If it's an actor, get its TokenDocument
  // If it's a token, get its Document
  // If it's a TokenDocument, just use it
  // Otherwise fail
  const document = target?.document ?? target;
  return document?.uuid ?? false;
}

export function is_real_number(inNumber) {
  return !isNaN(inNumber) && typeof inNumber === 'number' && isFinite(inNumber);
}

export function hasNonzeroAttribute(target, attribute) {
  const actor = target instanceof TokenDocument ? target.actor : target;
  const attributeValue = Number(getProperty(actor.data, attribute) ?? 0);
  return hasProperty(actor.data, attribute) && attributeValue > 0;
}

export function dialogWarning(message, icon = 'fas fa-exclamation-triangle') {
  return `<p class="${CONSTANTS.MODULE_NAME}-dialog">
        <i style="font-size:3rem;" class="${icon}"></i><br><br>
        <strong style="font-size:1.2rem;">Item Piles</strong>
        <br><br>${message}
    </p>`;
}

export function getVisionCapabilities(srcToken:Token, ): VisionCapabilities {
  const visionCapabilities: VisionCapabilities = new VisionCapabilities();
  if (srcToken) {
    let _seeinvisible =
      <number>(
        srcToken?.data?.document?.getFlag(CONDITIONAL_VISIBILITY_MODULE_NAME, StatusEffectSightFlags.SEE_INVISIBLE)
      ) ?? 0;

    let _blindsight =
      <number>(
        srcToken?.data?.document?.getFlag(CONDITIONAL_VISIBILITY_MODULE_NAME, StatusEffectSightFlags.BLIND_SIGHT)
      ) ?? 0;

    let _tremorsense =
      <number>(
        srcToken?.data?.document?.getFlag(CONDITIONAL_VISIBILITY_MODULE_NAME, StatusEffectSightFlags.TREMOR_SENSE)
      ) ?? 0; 

    let _truesight =
      <number>(
        srcToken?.data?.document?.getFlag(CONDITIONAL_VISIBILITY_MODULE_NAME, StatusEffectSightFlags.TRUE_SIGHT)
      ) ?? 0;

    let _devilssight =
      <number>(
        srcToken?.data?.document?.getFlag(CONDITIONAL_VISIBILITY_MODULE_NAME, StatusEffectSightFlags.DEVILS_SIGHT)
      ) ?? 0;

      if()

    _seeinvisible = _seeinvisible < 0 ? 100000 : _seeinvisible;
    _blindsight = _blindsight < 0 ? 100000 : _blindsight;
    _tremorsense = _tremorsense < 0 ? 100000 : _tremorsense;
    _truesight = _truesight < 0 ? 100000 : _truesight;
    _devilssight = _devilssight < 0 ? 100000 : _devilssight;

    visionCapabilities.seeinvisible = Math.max(_seeinvisible, _blindsight, _tremorsense, _truesight, _devilssight);
    visionCapabilities.seeobscured = Math.max(_blindsight, _tremorsense);
    visionCapabilities.seeindarkness = Math.max(_blindsight, _devilssight, _tremorsense, _truesight);
    
    //@ts-ignore
    if (srcToken?._movement !== null) {
      //@ts-ignore
      visionCapabilities.visionfrom = srcToken._movement.B;
    } else {
      visionCapabilities.visionfrom = srcToken?.position ?? { x: 0, y: 0 };
    }
  }
  return visionCapabilities;
}