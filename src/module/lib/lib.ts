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

  let canYouSeeMe = false;

  // ========================================
  // 1 - Preparation of the active effect
  // =========================================

  const sourceVisionLevels = getSensesFromToken(sourceToken);
  // const sourceVisionCapabilities: VisionCapabilities = new VisionCapabilities(sourceToken);
  // prepareActiveEffectForConditionalVisibility(sourceToken, sourceVisionCapabilities, API.SENSES);

  const targetVisionLevels = getConditionsFromToken(targetToken);
  // const targetVisionCapabilities: VisionCapabilities = new VisionCapabilities(targetToken);
  // prepareActiveEffectForConditionalVisibility(targetToken, targetVisionCapabilities, API.CONDITIONS);
  // TODO manage the multi condition on target
  const targetVisionLevel = targetVisionLevels[0];

  if (!targetVisionLevel || !targetVisionLevel.statusSight) {
    canYouSeeMe = true;
  }
  if (
    targetVisionLevel.statusSight?.id == StatusEffectSenseFlags.NORMAL ||
    targetVisionLevel.statusSight?.id == StatusEffectSenseFlags.NONE
  ) {
    canYouSeeMe = true;
  }

  if (canYouSeeMe) {
    return canYouSeeMe;
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
        result =
          sourceVisionLevel.visionLevelMinIndex <= <number>targetVisionLevel.statusSight?.visionLevelMin &&
          sourceVisionLevel.visionLevelMaxIndex >= <number>targetVisionLevel.statusSight?.visionLevelMax;
      }
    } else {
      result =
        sourceVisionLevel.visionLevelMinIndex <= <number>targetVisionLevel.statusSight?.visionLevelMin &&
        sourceVisionLevel.visionLevelMaxIndex >= <number>targetVisionLevel.statusSight?.visionLevelMax;
    }
    if (result) {
      sourceVisionLevelsValid.push(sourceVisionLevel);
    }
    return result;
  });

  // if any source has vision to the token, the token is visible
  canYouSeeMe = visibleForTypeOfSenseByIndex.reduce((total, curr) => total || curr, false);

  if (!canYouSeeMe) {
    return canYouSeeMe;
  }

  // ========================================
  // 3 - Check for the correct value number
  // =========================================

  const visibleForTypeOfSenseByValue = [...sourceVisionLevelsValid].map((sourceVisionLevel: StatusEffect) => {
    let result = false;
    if (
      <number>sourceVisionLevel.visionLevelValue == -1 ||
      <number>sourceVisionLevel.visionLevelValue >= <number>targetVisionLevel.visionLevelValue
    ) {
      result = true;
    }
    return result;
  });

  // if any source has vision to the token, the token is visible
  canYouSeeMe = visibleForTypeOfSenseByValue.reduce((total, curr) => total || curr, false);

  return canYouSeeMe;
}

export async function prepareActiveEffectForConditionalVisibility(
  sourceToken: Token,
  visionCapabilities: VisionCapabilities,
) {
  if (!visionCapabilities.hasSenses()) {
    return;
  }

  const regex = /[^A-Za-z0-9]/g;
  const actor = <Actor>sourceToken.document.getActor();

  for (const [key, sense] of visionCapabilities.retrieveSenses()) {
    // // use replace() method to match and remove all the non-alphanumeric characters
    // const effectNameToCheckOnActor = <string>sense.statusSight?.name.replace(regex, '');
    // if (!(await API.hasEffectAppliedOnActor(<string>sourceToken.actor?.id, effectNameToCheckOnActor))) {
    //   await API.addEffectConditionalVisibility(
    //     actor,
    //     effectNameToCheckOnActor,
    //     sense.visionDistanceValue,
    //     sense.visionDistanceValue,
    //   );
    // }
    // use replace() method to match and remove all the non-alphanumeric characters
    const effectNameToCheckOnActor = <string>sense.statusSight?.name.replace(regex, '');
    if (!(await API.hasEffectAppliedOnActor(<string>sourceToken.actor?.id, effectNameToCheckOnActor))) {
      await API.addEffectConditionalVisibility(
        <string>sourceToken.actor?.id,
        effectNameToCheckOnActor,
        sense.visionDistanceValue,
        sense.visionDistanceValue,
      );
    } else {
      // TODO MANAGE THE UPDATE OF EFFECT INSTEAD REMOVE AND ADD
      const activeEffectToRemove = <ActiveEffect>(
        await API.findEffectByNameOnActor(<string>sourceToken.actor?.id, effectNameToCheckOnActor)
      );
      await API.removeEffectFromIdOnActor(<string>sourceToken.actor?.id, <string>activeEffectToRemove.id);
      await API.addEffectConditionalVisibility(
        <string>sourceToken.actor?.id,
        effectNameToCheckOnActor,
        sense.visionDistanceValue,
        sense.visionDistanceValue,
      );
    }
  }

  // let visionLevelValue: number | undefined;
  // let visionDistanceValue: number | undefined;
  // let statuSightToCheck: StatusSight | undefined;

  // const actor = <Actor>sourceToken.document.getActor();
  // const actorEffects = <EmbeddedCollection<typeof ActiveEffect, ActorData>>actor?.data.effects;
  // for (const effectEntity of actorEffects) {
  //   const effectNameToSet = effectEntity.name ? effectEntity.name : effectEntity.data.label;
  //   if (!effectNameToSet) {
  //     continue;
  //   }
  //   // use replace() method to match and remove all the non-alphanumeric characters
  //   const effectNameToCheckOnActor = effectNameToSet.replace(regex, '');
  //   const effectSight = Array.from(visionCapabilities.retrieveSenses().values()).find((a: StatusEffect) => {
  //     return effectNameToCheckOnActor.toLowerCase().startsWith(<string>a.statusSight?.id.toLowerCase());
  //   });
  //   // if is a AE with the label of the module (no id sorry)
  //   if (effectSight) {
  //     const distance = getDistanceFromActiveEffect(effectEntity);
  //     //Look up for ATCV to manage vision level
  //     // TODO
  //     // TODO for now every active effect can have only one ATCV key ate the time not sure if manage
  //     // TODO
  //     const atcvValue = Number(
  //       effectEntity.data.changes.find((aee) => {
  //         if (aee.key.toLowerCase().startsWith(('ATCV.' + effectSight.id).toLowerCase())) {
  //           return aee.value;
  //         }
  //       }),
  //     );
  //     visionDistanceValue = distance;
  //     visionLevelValue = atcvValue;
  //     statuSightToCheck = effectSight;
  //     break;
  //   }
  // }
  // if (statuSightToCheck) {
  //   const visionCapabilitiesVisionlevel = visionCapabilities.retrieveSenseValue(<string>statuSightToCheck?.id);
  //   if (!visionCapabilitiesVisionlevel || visionCapabilitiesVisionlevel != 0) {
  //     visionLevelValue = visionCapabilitiesVisionlevel;
  //   }

  //   if (!visionLevelValue || visionLevelValue == 0) {
  //     // use replace() method to match and remove all the non-alphanumeric characters
  //     const effectNameToCheckOnActor = <string>statuSightToCheck?.name.replace(regex, '');
  //     if (await API.hasEffectAppliedOnActor(<string>sourceToken.actor?.id, effectNameToCheckOnActor)) {
  //       const activeEffect = <ActiveEffect>(
  //         await API.findEffectByNameOnActor(<string>sourceToken.actor?.id, effectNameToCheckOnActor)
  //       );
  //       const effect = Effect.convertToEffectClass(activeEffect);
  //       const effectChangeData = effect.atcvChanges.find((k) => {
  //         return k.key == 'ATCV.' + statuSightToCheck?.id;
  //       });
  //       visionLevelValue = Number(effectChangeData?.value);
  //     }
  //   }
  // }
  // if (visionLevelValue && visionLevelValue > 0) {
  //   // use replace() method to match and remove all the non-alphanumeric characters
  //   const effectNameToCheckOnActor = <string>statuSightToCheck?.name.replace(regex, '');
  //   if (!(await API.hasEffectAppliedOnActor(<string>sourceToken.actor?.id, effectNameToCheckOnActor))) {
  //     await API.addEffectConditionalVisibility(
  //       <string>sourceToken.actor?.id,
  //       effectNameToCheckOnActor,
  //       visionDistanceValue,
  //       visionLevelValue,
  //     );
  //   } else {
  //     // TODO MANAGE THE UPDATE OF EFFECT INSTEAD REMOVE AND ADD
  //     const activeEffectToRemove = <ActiveEffect>(
  //       await API.findEffectByNameOnActor(<string>sourceToken.actor?.id, effectNameToCheckOnActor)
  //     );
  //     await API.removeEffectFromIdOnActor(<string>sourceToken.actor?.id, <string>activeEffectToRemove.id);
  //     await API.addEffectConditionalVisibility(
  //       <string>sourceToken.actor?.id,
  //       effectNameToCheckOnActor,
  //       visionDistanceValue,
  //       visionLevelValue,
  //     );
  //   }
  // }
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
  //Look up for ATCV to manage vision level
  // TODO for now every active effect can have only one ATCV key ate the time not sure if manage
  let atcvValue = 0;
  const effectNameToSet = effectEntity.name ? effectEntity.name : effectEntity.data.label;
  if (!effectNameToSet) {
    return atcvValue;
  }
  atcvValue = Number(
    effectEntity.data.changes.find((aee) => {
      if (aee.key.toLowerCase().startsWith(('ATCV.' + effectSight.id).toLowerCase())) {
        return aee.value;
      }
    }),
  );
  return atcvValue;
}

export function getDistanceFromActiveEffect(effectEntity: ActiveEffect): number {
  let distance = 0;
  const effectNameToSet = effectEntity.name ? effectEntity.name : effectEntity.data.label;
  if (!effectNameToSet) {
    return distance;
  }
  // if is a AE with the label of the module (no id sorry)
  //Look up for ATL dim and bright sight to manage distance
  const dimSight = Number(
    effectEntity.data.changes.find((aee) => {
      if (aee.key == 'ATL.dimSight') {
        return aee.value;
      }
    }),
  );
  const brightSight = Number(
    effectEntity.data.changes.find((aee) => {
      if (aee.key == 'ATL.brightSight') {
        return aee.value;
      }
    }),
  );
  if (brightSight || dimSight) {
    distance = Math.max(brightSight, dimSight);
  }
  return distance;
}

// ========================================================================================

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
