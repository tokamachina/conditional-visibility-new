import CONSTANTS from '../constants.js';
import API from '../api.js';
import { canvas, game } from '../settings';
import {
  StatusEffect,
  StatusEffectSenseFlags,
  StatusEffectConditionFlags,
  StatusSight,
  VisionCapabilities,
} from '../conditional-visibility-models.js';
import EmbeddedCollection from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs';
import { ActorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs';
import Effect from '../effects/effect.js';
import StatusEffects from '../effects/status-effects.js';

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
        <strong style="font-size:1.2rem;">${CONSTANTS.MODULE_NAME}</strong>
        <br><br>${message}
    </p>`;
}

/**
 *
 * @param obj Little helper for loop enum element on typescript
 * @href https://www.petermorlion.com/iterating-a-typescript-enum/
 * @returns
 */
export function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
}

/**
 * @href https://stackoverflow.com/questions/7146217/merge-2-arrays-of-objects
 * @param target
 * @param source
 * @param prop
 */
export function mergeByProperty(target: any[], source: any[], prop: any) {
  source.forEach((sourceElement) => {
    const targetElement = target.find((targetElement) => {
      return sourceElement[prop] === targetElement[prop];
    });
    targetElement ? Object.assign(targetElement, sourceElement) : target.push(sourceElement);
  });
  return target;
}

// =========================================================================================

// /**
//  * Returns the first selected token
//  */
// export function getFirstPlayerTokenSelected(): Token | null {
//   // Get first token ownted by the player
//   const selectedTokens = <Token[]>canvas.tokens?.controlled;
//   if (selectedTokens.length > 1) {
//     //iteractionFailNotification(i18n("foundryvtt-arms-reach.warningNoSelectMoreThanOneToken"));
//     return null;
//   }
//   if (!selectedTokens || selectedTokens.length == 0) {
//     //if(game.user.character.data.token){
//     //  //@ts-ignore
//     //  return game.user.character.data.token;
//     //}else{
//     return null;
//     //}
//   }
//   return selectedTokens[0];
// }

// /**
//  * Returns a list of selected (or owned, if no token is selected)
//  * note: ex getSelectedOrOwnedToken
//  */
// function getFirstPlayerToken(): Token | null {
//   // Get controlled token
//   let token: Token;
//   const controlled: Token[] = <Token[]>canvas.tokens?.controlled;
//   // Do nothing if multiple tokens are selected
//   if (controlled.length && controlled.length > 1) {
//     //iteractionFailNotification(i18n("foundryvtt-arms-reach.warningNoSelectMoreThanOneToken"));
//     return null;
//   }
//   // If exactly one token is selected, take that
//   token = controlled[0];
//   if (!token) {
//     if (!controlled.length || controlled.length == 0) {
//       // If no token is selected use the token of the users character
//       token = <Token>canvas.tokens?.placeables.find((token) => token.data._id === game.user?.character?.data?._id);
//     }
//     // If no token is selected use the first owned token of the users character you found
//     if (!token) {
//       token = <Token>canvas.tokens?.ownedTokens[0];
//     }
//   }
//   return token;
// }

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
    typeof _levels !== 'undefined' &&
    //@ts-ignore
    _levels?.advancedLOS &&
    (placeableObject instanceof Token || placeableObject instanceof TokenDocument)
      ? //@ts-ignore
        _levels.getTokenLOSheight(token)
      : base.elevation ??
        base.flags['levels']?.elevation ??
        base.flags['levels']?.rangeBottom ??
        base.flags['wallHeight']?.wallHeightBottom ??
        0;
  return base_elevation;
}

// =============================
// Module specific function
// =============================

export function shouldIncludeVision(sourceToken: Token, targetToken: Token): boolean | null {
  // if (!sourceToken) {
  //   sourceToken = <Token>getFirstPlayerTokenSelected();
  // }
  // if (!sourceToken) {
  //   sourceToken = <Token>getFirstPlayerToken();
  // }
  if (!sourceToken || !targetToken) {
    return true;
  }

  // let canYouSeeMe = true;

  // ========================================
  // 1 - Preparation of the active effect
  // =========================================

  const sourceVisionLevels = getSensesFromToken(sourceToken) ?? [];
  if (!sourceVisionLevels || sourceVisionLevels.length == 0) {
    return true; // default vaue
  }
  for (const sourceStatusEffect of sourceVisionLevels) {
    if (sourceStatusEffect.statusSight?.id == StatusEffectSenseFlags.BLINDED) {
      // Someone is blind
      return false;
    }
  }

  const targetVisionLevels = getConditionsFromToken(targetToken);
  if (!targetVisionLevels || targetVisionLevels.length == 0) {
    return true;
  }

  // ========================================
  // 2 - Check for the correct status sight
  // =========================================

  const sourceVisionLevelsValid: StatusEffect[] = [];

  const visibleForTypeOfSenseByIndex = [...sourceVisionLevels].map((sourceVisionLevel: StatusEffect) => {
    let result = false;
    if (sourceVisionLevel?.checkElevation) {
      const tokenElevation = getElevationToken(sourceToken);
      const targetElevation = getElevationToken(targetToken);
      if (tokenElevation < targetElevation) {
        result = false;
      } else {
        const resultsOnTarget = targetVisionLevels.map((targetVisionLevel) => {
          if (!targetVisionLevel || !targetVisionLevel.statusSight) {
            result = true;
          }
          if (
            targetVisionLevel.statusSight?.id == StatusEffectSenseFlags.NORMAL ||
            targetVisionLevel.statusSight?.id == StatusEffectSenseFlags.NONE
          ) {
            result = true;
          }
          result =
            sourceVisionLevel.visionLevelMinIndex <= <number>targetVisionLevel.statusSight?.visionLevelMin &&
            sourceVisionLevel.visionLevelMaxIndex >= <number>targetVisionLevel.statusSight?.visionLevelMax;
          return result;
        });
        // if any source has vision to the token, the token is visible
        result = resultsOnTarget.reduce((total, curr) => total || curr, false);
      }
    } else {
      const resultsOnTarget = targetVisionLevels.map((targetVisionLevel) => {
        if (!targetVisionLevel || !targetVisionLevel.statusSight) {
          result = true;
        }
        if (
          targetVisionLevel.statusSight?.id == StatusEffectSenseFlags.NORMAL ||
          targetVisionLevel.statusSight?.id == StatusEffectSenseFlags.NONE
        ) {
          result = true;
        }
        result =
          sourceVisionLevel.visionLevelMinIndex <= <number>targetVisionLevel.statusSight?.visionLevelMin &&
          sourceVisionLevel.visionLevelMaxIndex >= <number>targetVisionLevel.statusSight?.visionLevelMax;
        return result;
      });
      // if any source has vision to the token, the token is visible
      result = resultsOnTarget.reduce((total, curr) => total || curr, false);
    }
    if (result) {
      sourceVisionLevelsValid.push(sourceVisionLevel);
    }
    return result;
  });

  let canYouSeeMeByLevelIndex = false;
  // if any source has vision to the token, the token is visible
  canYouSeeMeByLevelIndex = visibleForTypeOfSenseByIndex.reduce((total, curr) => total || curr, false);

  if (!canYouSeeMeByLevelIndex) {
    return canYouSeeMeByLevelIndex;
  }

  // ========================================
  // 3 - Check for the correct value number
  // =========================================

  const visibleForTypeOfSenseByValue = [...sourceVisionLevelsValid].map((sourceVisionLevel: StatusEffect) => {
    let result = false;
    const resultsOnTarget = targetVisionLevels.map((targetVisionLevel) => {
      if (!targetVisionLevel || !targetVisionLevel.statusSight) {
        result = true;
      }
      if (
        targetVisionLevel.statusSight?.id == StatusEffectSenseFlags.NORMAL ||
        targetVisionLevel.statusSight?.id == StatusEffectSenseFlags.NONE
      ) {
        result = true;
      }
      result =
        <number>sourceVisionLevel.visionLevelValue == -1 ||
        <number>sourceVisionLevel.visionLevelValue >= <number>targetVisionLevel.visionLevelValue;
      return result;
    });
    // if any source has vision to the token, the token is visible
    result = resultsOnTarget.reduce((total, curr) => total || curr, false);
    return result;
  });

  let canYouSeeMeByLevelValue = false;
  // if any source has vision to the token, the token is visible
  canYouSeeMeByLevelValue = visibleForTypeOfSenseByValue.reduce((total, curr) => total || curr, false);

  return canYouSeeMeByLevelValue;
}

export async function prepareActiveEffectForConditionalVisibility(
  sourceToken: Token,
  visionCapabilities: VisionCapabilities,
) {
  // if (!visionCapabilities.hasSenses() && !visionCapabilities.hasConditions()) {
  //   return;
  // }

  // const actor = <Actor>sourceToken.document.getActor();

  for (const [key, sense] of visionCapabilities.retrieveSenses()) {
    // use replace() method to match and remove all the non-alphanumeric characters
    const effectNameToCheckOnActor = i18n(<string>sense.statusSight?.name);
    if (sense.visionLevelValue && sense.visionLevelValue != 0) {
      if (!(await API.hasEffectAppliedOnToken(<string>sourceToken.id, effectNameToCheckOnActor, true))) {
        await API.addEffectConditionalVisibilityOnToken(
          <string>sourceToken.id,
          effectNameToCheckOnActor,
          false,
          sense.visionDistanceValue,
          sense.visionLevelValue,
        );
      } else {
        // TODO MANAGE THE UPDATE OF EFFECT INSTEAD REMOVE AND ADD
        const activeEffectToRemove = <ActiveEffect>(
          await API.findEffectByNameOnToken(<string>sourceToken.id, effectNameToCheckOnActor)
        );
        if (activeEffectToRemove) {
          await API.removeEffectFromIdOnToken(<string>sourceToken.id, <string>activeEffectToRemove.id);
        }
        await API.addEffectConditionalVisibilityOnToken(
          <string>sourceToken.id,
          effectNameToCheckOnActor,
          false,
          sense.visionDistanceValue,
          sense.visionLevelValue,
        );
      }
    } else {
      if (await API.hasEffectAppliedOnToken(<string>sourceToken.id, effectNameToCheckOnActor, true)) {
        const activeEffectToRemove = <ActiveEffect>(
          await API.findEffectByNameOnToken(<string>sourceToken.id, effectNameToCheckOnActor)
        );
        await API.removeEffectFromIdOnToken(<string>sourceToken.id, <string>activeEffectToRemove.id);
      }
    }
  }

  for (const [key, condition] of visionCapabilities.retrieveConditions()) {
    // use replace() method to match and remove all the non-alphanumeric characters
    const effectNameToCheckOnActor = i18n(<string>condition.statusSight?.name);
    if (condition.visionLevelValue && condition.visionLevelValue != 0) {
      if (!(await API.hasEffectAppliedOnToken(<string>sourceToken.id, effectNameToCheckOnActor, true))) {
        await API.addEffectConditionalVisibilityOnToken(
          <string>sourceToken.id,
          effectNameToCheckOnActor,
          false,
          condition.visionDistanceValue,
          condition.visionLevelValue,
        );
      } else {
        // TODO MANAGE THE UPDATE OF EFFECT INSTEAD REMOVE AND ADD
        const activeEffectToRemove = <ActiveEffect>(
          await API.findEffectByNameOnToken(<string>sourceToken.id, effectNameToCheckOnActor)
        );
        if (activeEffectToRemove) {
          await API.removeEffectFromIdOnToken(<string>sourceToken.id, <string>activeEffectToRemove.id);
        }
        await API.addEffectConditionalVisibilityOnToken(
          <string>sourceToken.id,
          effectNameToCheckOnActor,
          false,
          condition.visionDistanceValue,
          condition.visionLevelValue,
        );
      }
    } else {
      if (await API.hasEffectAppliedOnToken(<string>sourceToken.id, effectNameToCheckOnActor, true)) {
        const activeEffectToRemove = <ActiveEffect>(
          await API.findEffectByNameOnToken(<string>sourceToken.id, effectNameToCheckOnActor)
        );
        await API.removeEffectFromIdOnToken(<string>sourceToken.id, <string>activeEffectToRemove.id);
      }
    }
  }
  // Refresh the flags (this is necessary for retrocompatibility)
  visionCapabilities.refreshSenses();
  visionCapabilities.refreshConditions();
}

export function getSensesFromToken(token: Token): StatusEffect[] {
  return _getActiveEffectsFromToken(token, API.SENSES);
}

export function getConditionsFromToken(token: Token): StatusEffect[] {
  return _getActiveEffectsFromToken(token, API.CONDITIONS);
}

function _getActiveEffectsFromToken(token: Token, statusSights: StatusSight[]): StatusEffect[] {
  const actor = <Actor>token.document.getActor();
  const actorEffects = <EmbeddedCollection<typeof ActiveEffect, ActorData>>actor?.data.effects;
  let min = 0;
  let max = 0;
  let hasOnlyEffectsWithCheckElevationTrue = true;
  const statusEffects: StatusEffect[] = [];
  // regex expression to match all non-alphanumeric characters in string
  const regex = /[^A-Za-z0-9]/g;

  for (const effectEntity of actorEffects) {
    const effectNameToSet = effectEntity.name ? effectEntity.name : effectEntity.data.label;
    if (!effectNameToSet) {
      continue;
    }
    // use replace() method to match and remove all the non-alphanumeric characters
    const effectNameToCheckOnActor = effectNameToSet.replace(regex, '');
    const effectSight = statusSights.find((a: StatusSight) => {
      return effectNameToCheckOnActor
        .replace(regex, '')
        .toLowerCase()
        .startsWith(a.id.replace(regex, '').toLowerCase());
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
        effectSight.id != StatusEffectSenseFlags.NONE &&
        effectSight.id != StatusEffectSenseFlags.NORMAL &&
        effectSight.id != StatusEffectSenseFlags.BLINDED
      ) {
        hasOnlyEffectsWithCheckElevationTrue = false;
      }
      const distance = getDistanceFromActiveEffect(effectEntity);
      const atcvValue = getVisionLevelFromActiveEffect(effectEntity, effectSight);

      statusEffects.push({
        visionLevelMinIndex: min,
        visionLevelMaxIndex: max,
        checkElevation: hasOnlyEffectsWithCheckElevationTrue,
        statusSight: effectSight,
        visionDistanceValue: distance,
        visionLevelValue: atcvValue,
      });
    }
  }
  return statusEffects;
}

export function getVisionLevelFromActiveEffect(effectEntity: ActiveEffect, effectSight: StatusSight): number {
  const regex = /[^A-Za-z0-9]/g;
  //Look up for ATCV to manage vision level
  // TODO for now every active effect can have only one ATCV key ate the time not sure if manage
  let atcvValue: any = 0;
  const effectNameToSet = effectEntity.name ? effectEntity.name : effectEntity.data.label;
  if (!effectNameToSet) {
    return atcvValue;
  }
  atcvValue = effectEntity.data.changes.find((aee) => {
    if (
      aee.key
        .replace(regex, '')
        .toLowerCase()
        .startsWith(('ATCV.' + effectSight.id).replace(regex, '').toLowerCase())
    ) {
      return aee;
    }
  });
  if(!atcvValue){
    // Ignore ???
    return 0;
  }
  return Number(atcvValue.value);
}

export function getDistanceFromActiveEffect(effectEntity: ActiveEffect): number {
  const regex = /[^A-Za-z0-9]/g;
  let distance = 0;
  const effectNameToSet = effectEntity.name ? effectEntity.name : effectEntity.data.label;
  if (!effectNameToSet) {
    return distance;
  }
  // if is a AE with the label of the module (no id sorry)
  //Look up for ATL dim and bright sight to manage distance
  const dimSightAE = effectEntity.data.changes.find((aee) => aee.key == 'ATL.dimSight');
  const brightSightAE = effectEntity.data.changes.find((aee) => aee.key == 'ATL.brightSight');
  const brightSight = Number(brightSightAE?.value);
  const dimSight = Number(dimSightAE?.value);
  if (brightSight || dimSight) {
    distance = Math.max(brightSight, dimSight);
  }
  return distance;
}

// ========================================================================================
