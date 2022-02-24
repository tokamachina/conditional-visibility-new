import { EffectSupport } from './../effects/effect';
import { EffectChangeData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/effectChangeData';
import CONSTANTS from '../constants.js';
import API from '../api.js';
import { canvas, game } from '../settings';
import {
  AtcvEffect,
  AtcvEffectSenseFlags,
  AtcvEffectConditionFlags,
  SenseData,
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

// =========================================================================================

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
export function getFirstPlayerToken(): Token | null {
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
    if (sourceStatusEffect.statusSight?.id == AtcvEffectSenseFlags.BLINDED) {
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

  const sourceVisionLevelsValid: AtcvEffect[] = [];

  const visibleForTypeOfSenseByIndex = [...sourceVisionLevels].map((sourceVisionLevel: AtcvEffect) => {
    if (sourceVisionLevel?.visionElevation) {
      const tokenElevation = getElevationToken(sourceToken);
      const targetElevation = getElevationToken(targetToken);
      if (tokenElevation < targetElevation) {
        return false;
      }
    }
    const resultsOnTarget = targetVisionLevels.map((targetVisionLevel) => {
      if (!targetVisionLevel || !targetVisionLevel.statusSight) {
        sourceVisionLevelsValid.push(sourceVisionLevel);
        return true;
      }
      if (sourceVisionLevel?.visionTargets?.length > 0) {
        if (sourceVisionLevel?.visionTargets.includes(<string>targetVisionLevel.statusSight?.id)) {
          sourceVisionLevelsValid.push(sourceVisionLevel);
          return true;
        } else {
          return false;
        }
      }
      if (targetVisionLevel?.visionSources?.length > 0) {
        if (targetVisionLevel?.visionSources.includes(<string>sourceVisionLevel.statusSight?.id)) {
          sourceVisionLevelsValid.push(sourceVisionLevel);
          return true;
        } else {
          return false;
        }
      }
      if (
        targetVisionLevel.statusSight?.id == AtcvEffectSenseFlags.NORMAL ||
        targetVisionLevel.statusSight?.id == AtcvEffectSenseFlags.NONE
      ) {
        sourceVisionLevelsValid.push(sourceVisionLevel);
        return true;
      }
      const result =
        <number>sourceVisionLevel?.statusSight?.visionLevelMinIndex <=
          <number>targetVisionLevel.statusSight?.visionLevelMinIndex &&
        <number>sourceVisionLevel?.statusSight?.visionLevelMaxIndex >=
          <number>targetVisionLevel.statusSight?.visionLevelMaxIndex;
      if(result){
        sourceVisionLevelsValid.push(sourceVisionLevel);
      }
      return result;
    });
    // if any source has vision to the token, the token is visible
    const resultFinal = resultsOnTarget.reduce((total, curr) => total || curr, false);
    return resultFinal;
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

  const visibleForTypeOfSenseByValue = [...sourceVisionLevelsValid].map((sourceVisionLevel: AtcvEffect) => {
    const resultsOnTarget = targetVisionLevels.map((targetVisionLevel) => {
      if (!targetVisionLevel || !targetVisionLevel.statusSight) {
        return true;
      }
      if (
        targetVisionLevel.statusSight?.id == AtcvEffectSenseFlags.NORMAL ||
        targetVisionLevel.statusSight?.id == AtcvEffectSenseFlags.NONE
      ) {
        return true;
      }
      // the "-1" case
      if (<number>targetVisionLevel.visionLevelValue == -1) {
        return false;
      } else {
        const result =
          <number>sourceVisionLevel.visionLevelValue == -1 ||
          <number>sourceVisionLevel.visionLevelValue >= <number>targetVisionLevel.visionLevelValue;
        return result;
      }
    });
    // if any source has vision to the token, the token is visible
    const resultFinal = resultsOnTarget.reduce((total, curr) => total || curr, false);
    return resultFinal;
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

  // TODO MANAGE THE UPDATE OF EFFECT INSTEAD REMOVE AND ADD

  // REMOVE EVERY SENSES WITH THE SAME NAME

  for (const [key, sense] of visionCapabilities.retrieveSenses()) {
    // use replace() method to match and remove all the non-alphanumeric characters
    const effectNameToCheckOnActor = i18n(<string>sense.statusSight?.name);
    if (await API.hasEffectAppliedOnToken(<string>sourceToken.id, effectNameToCheckOnActor, true)) {
      const activeEffectToRemove = <ActiveEffect>(
        await API.findEffectByNameOnToken(<string>sourceToken.id, effectNameToCheckOnActor)
      );
      if (activeEffectToRemove) {
        await API.removeEffectFromIdOnToken(<string>sourceToken.id, <string>activeEffectToRemove.id);
      }
    }
  }

  // ADD THE SENSES FINALLY

  for (const [key, sense] of visionCapabilities.retrieveSenses()) {
    const effectNameToCheckOnActor = i18n(<string>sense.statusSight?.name);
    if (!(await API.hasEffectAppliedOnToken(<string>sourceToken.id, effectNameToCheckOnActor, true))) {
      if (sense.visionLevelValue && sense.visionLevelValue != 0) {
        await API.addEffectConditionalVisibilityOnToken(
          <string>sourceToken.id,
          <string>sense.statusSight?.id,
          false,
          sense.visionDistanceValue,
          sense.visionLevelValue,
        );
      }
    }
  }

  // TODO MANAGE THE UPDATE OF EFFECT INSTEAD REMOVE AND ADD

  // REMOVE EVERY CONDITIONS WITH THE SAME NAME

  for (const [key, condition] of visionCapabilities.retrieveConditions()) {
    // use replace() method to match and remove all the non-alphanumeric characters
    const effectNameToCheckOnActor = i18n(<string>condition.statusSight?.name);
    if (condition.visionLevelValue && condition.visionLevelValue != 0) {
      const activeEffectToRemove = <ActiveEffect>(
        await API.findEffectByNameOnToken(<string>sourceToken.id, effectNameToCheckOnActor)
      );
      if (activeEffectToRemove) {
        await API.removeEffectFromIdOnToken(<string>sourceToken.id, <string>activeEffectToRemove.id);
      }
    }
  }

  // ADD THE CONDITIONS FINALLY

  for (const [key, condition] of visionCapabilities.retrieveConditions()) {
    // use replace() method to match and remove all the non-alphanumeric characters
    const effectNameToCheckOnActor = i18n(<string>condition.statusSight?.name);
    if (condition.visionLevelValue && condition.visionLevelValue != 0) {
      if (!(await API.hasEffectAppliedOnToken(<string>sourceToken.id, effectNameToCheckOnActor, true))) {
        await API.addEffectConditionalVisibilityOnToken(
          <string>sourceToken.id,
          <string>condition.statusSight?.id,
          false,
          condition.visionDistanceValue,
          condition.visionLevelValue,
        );
      }
    }
  }

  // Refresh the flags (this is necessary for retrocompatibility)
  visionCapabilities.refreshSenses();
  visionCapabilities.refreshConditions();
}

export function getSensesFromToken(token: Token): AtcvEffect[] {
  return _getCVFromToken(token, API.SENSES);
}

export function getConditionsFromToken(token: Token): AtcvEffect[] {
  return _getCVFromToken(token, API.CONDITIONS);
}

function _getCVFromToken(token: Token, statusSights: SenseData[]): AtcvEffect[] {
  const actor = <Actor>token.document.getActor();
  const actorEffects = <EmbeddedCollection<typeof ActiveEffect, ActorData>>actor?.data.effects;
  //const totalEffects = <EmbeddedCollection<typeof ActiveEffect, ActorData>>actor?.data.effects.contents.filter(i => !i.data.disabled);
  const ATCVeffects = actorEffects.filter(
    (entity) => !!entity.data.changes.find((effect) => effect.key.includes('ATCV')),
  );
  let visionElevation = true;
  let conditionTargets: string[] = [];
  let conditionSources: string[] = [];
  const statusEffects: AtcvEffect[] = [];
  // regex expression to match all non-alphanumeric characters in string
  const regex = /[^A-Za-z0-9]/g;

  for (const effectEntity of ATCVeffects) {
    const effectNameToSet = effectEntity.name ? effectEntity.name : effectEntity.data.label;
    if (!effectNameToSet) {
      continue;
    }
    // use replace() method to match and remove all the non-alphanumeric characters
    const effectNameToCheckOnActor = effectNameToSet.replace(regex, '');
    const effectSight = statusSights.find((a: SenseData) => {
      return effectNameToCheckOnActor
        .replace(regex, '')
        .toLowerCase()
        .startsWith(a.id.replace(regex, '').toLowerCase());
    });
    // if is a AE with the label of the module (no id sorry)
    if (effectSight) {
      // Organize non-disabled effects by their application priority
      const changes = <EffectChangeData[]>ATCVeffects.reduce((changes, e: ActiveEffect) => {
        if (e.data.disabled) {
          return changes;
        }
        return changes.concat(
          //@ts-ignore
          (<EffectChangeData[]>e.data.changes).map((c: EffectChangeData) => {
            const c2 = <EffectChangeData>duplicate(c);
            // c2.effect = e;
            c2.priority = <number>c2.priority ?? c2.mode * 10;
            return c2;
          }),
        );
      }, []);
      changes.sort((a, b) => <number>a.priority - <number>b.priority);

      visionElevation = retrieveAtcvElevationFromActiveEffect(changes);
      conditionTargets = retrieveAtcvTargetsFromActiveEffect(changes);
      conditionSources = retrieveAtcvSourcesFromActiveEffect(changes);

      // look up if you have not basic AE and if the check elevation is not enabled
      if (
        !effectSight.conditionElevation &&
        effectSight.id != AtcvEffectSenseFlags.NONE &&
        effectSight.id != AtcvEffectSenseFlags.NORMAL &&
        effectSight.id != AtcvEffectSenseFlags.BLINDED
      ) {
        visionElevation = false;
      }
      const distance = retrieveAtcvVisionLevelDistanceFromActiveEffect(effectEntity);
      const atcvValue = retrieveAtcvVisionLevelFromActiveEffect(effectEntity, effectSight);

      statusEffects.push({
        visionElevation: visionElevation,
        visionTargets: conditionTargets,
        visionSources: conditionSources,
        statusSight: effectSight,
        visionDistanceValue: distance,
        visionLevelValue: atcvValue,
      });
    }
  }
  return statusEffects;
}

export function retrieveAtcvElevationFromActiveEffect(effectEntityChanges: EffectChangeData[]): boolean {
  let checkElevationAcvt = false;
  // Apply all changes
  for (const change of effectEntityChanges) {
    if (change.key.includes('ATCV.conditionElevation')) {
      if (change.value) {
        checkElevationAcvt = Boolean(change.value);
      }
    }
  }
  return checkElevationAcvt;
}

export function retrieveAtcvTargetsFromActiveEffect(effectEntityChanges: EffectChangeData[]): string[] {
  let checkTargetsAcvt: string[] = [];
  // Apply all changes
  for (const change of effectEntityChanges) {
    if (change.key.includes('ATCV.conditionTargets')) {
      if (change.value) {
        const inTags = <any>change.value;
        if (!(typeof inTags === 'string' || inTags instanceof RegExp || Array.isArray(inTags))) {
          error(`'ATCV.conditionTargets' must be of type string or array`);
        }
        let providedTags = typeof inTags === 'string' ? inTags.split(',') : inTags;

        if (!Array.isArray(providedTags)) providedTags = [providedTags];

        providedTags.forEach((t) => {
          if (!(typeof t === 'string' || t instanceof RegExp)) {
            error(`'ATCV.conditionTargets' in array must be of type string or regexp`);
          }
        });

        checkTargetsAcvt = providedTags.map((t) => (t instanceof RegExp ? t : t.trim()));
      }
    }
  }
  return checkTargetsAcvt;
}

export function retrieveAtcvSourcesFromActiveEffect(effectEntityChanges: EffectChangeData[]): string[] {
  let checkSourcesAcvt: string[] = [];
  // Apply all changes
  for (const change of effectEntityChanges) {
    if (change.key.includes('ATCV.conditionSources')) {
      if (change.value) {
        const inTags = <any>change.value;
        if (!(typeof inTags === 'string' || inTags instanceof RegExp || Array.isArray(inTags))) {
          error(`'ATCV.conditionSources' must be of type string or array`);
        }
        let providedTags = typeof inTags === 'string' ? inTags.split(',') : inTags;

        if (!Array.isArray(providedTags)) providedTags = [providedTags];

        providedTags.forEach((t) => {
          if (!(typeof t === 'string' || t instanceof RegExp)) {
            error(`'ATCV.conditionSources' in array must be of type string or regexp`);
          }
        });

        checkSourcesAcvt = providedTags.map((t) => (t instanceof RegExp ? t : t.trim()));
      }
    }
  }
  return checkSourcesAcvt;
}

export function retrieveAtcvVisionLevelFromActiveEffect(effectEntity: ActiveEffect, effectSight: SenseData): number {
  const regex = /[^A-Za-z0-9]/g;
  //Look up for ATCV to manage vision level
  // TODO for now every active effect can have only one ATCV key ate the time not sure if manage
  let atcvValue: any = 0;
  const effectNameToSet = effectEntity.name ? effectEntity.name : effectEntity.data.label;
  if (!effectNameToSet) {
    return atcvValue;
  }

  const atcvChanges = EffectSupport.retrieveChangesOrderedByPriorityFromAE(effectEntity);
  //atcvValue = effectEntity.data.changes.find((aee) => {
  atcvValue = atcvChanges.find((aee) => {
    if (
      aee.key
        .replace(regex, '')
        .toLowerCase()
        .startsWith(('ATCV.' + effectSight.id).replace(regex, '').toLowerCase())
    ) {
      return aee;
    }
  });
  if (!atcvValue) {
    // Ignore ???
    return 0;
  }
  return Number(atcvValue.value);
}

export function retrieveAtcvVisionLevelDistanceFromActiveEffect(effectEntity: ActiveEffect): number {
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
