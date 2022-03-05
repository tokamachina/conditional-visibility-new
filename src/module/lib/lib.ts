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
import {
  ActorData,
  TokenData,
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs';
import Effect from '../effects/effect.js';
import StatusEffects from '../effects/status-effects.js';
import { ConditionalVisibilityEffectDefinitions } from '../conditional-visibility-effect-definition';

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

export function info(info, notify = false) {
  info = `${CONSTANTS.MODULE_NAME} | ${info}`;
  if (notify) ui.notifications?.info(info);
  console.log(info.replace('<br>', '\n'));
  return info;
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
  return game.i18n.localize(key)?.trim();
};

export const i18nFormat = (key: string, data = {}): string => {
  return game.i18n.format(key, data)?.trim();
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

export function cleanUpString(stringToCleanUp: string) {
  // regex expression to match all non-alphanumeric characters in string
  const regex = /[^A-Za-z0-9]/g;
  if (stringToCleanUp) {
    return i18n(stringToCleanUp).replace(regex, '').toLowerCase();
  } else {
    return stringToCleanUp;
  }
}

export function isStringEquals(stringToCheck1: string, stringToCheck2: string, startsWith = true): boolean {
  if (stringToCheck1 && stringToCheck2) {
    if (startsWith) {
      return cleanUpString(stringToCheck1).startsWith(cleanUpString(stringToCheck2));
    } else {
      return cleanUpString(stringToCheck1) === cleanUpString(stringToCheck2);
    }
  } else {
    return stringToCheck1 === stringToCheck2;
  }
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

async function updateAtcvVisionLevel(
  tokenToSet: Token,
  ATCVeffect: ActiveEffect,
  statusSightId: string,
  statusSightPath: string,
  valueExplicit: number,
) {
  const ATCVeffects = [ATCVeffect];
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
  // const changes = effect.data.changes;
  // Apply all changes
  for (const change of changes) {
    if (!change.key.includes('ATCV')) {
      continue;
    }
    const updateKey = change.key.slice(5);
    const sensesData = await API.getAllSensesAndConditions();
    if (updateKey === statusSightId) {
      setProperty(tokenToSet.document, `data.flags.${CONSTANTS.MODULE_NAME}.${statusSightId}`, valueExplicit);
      if (statusSightPath) {
        setProperty(tokenToSet.document, <string>statusSightPath, valueExplicit);
      }
      // setProperty(change,`value`,String(valueExplicit));
    }
  }
}

function isTokenInside(token, wallsBlockTargeting) {
  const grid = canvas.scene?.data.grid,
    templatePos = { x: this.data.x, y: this.data.y };
  // Check for center of  each square the token uses.
  // e.g. for large tokens all 4 squares
  const startX = token.width >= 1 ? 0.5 : token.width / 2;
  const startY = token.height >= 1 ? 0.5 : token.height / 2;
  // console.error(grid, templatePos, startX, startY, token.width, token.height, token)
  for (let x = startX; x < token.width; x++) {
    for (let y = startY; y < token.height; y++) {
      const currGrid = {
        x: token.x + x * <number>grid - templatePos.x,
        y: token.y + y * <number>grid - templatePos.y,
      };
      let contains = this.shape?.contains(currGrid.x, currGrid.y);
      if (contains && wallsBlockTargeting) {
        const r = new Ray({ x: currGrid.x + templatePos.x, y: currGrid.y + templatePos.y }, templatePos);
        contains = !canvas.walls?.checkCollision(r);
      }
      if (contains) return true;
    }
  }
  return false;
}

export function templateTokens(template) {
  const wallsBlockTargeting = true;
  const tokens = <TokenData[]>canvas.tokens?.placeables.map((t) => t.data);
  const targets: string[] = [];
  const tokenInside = isTokenInside.bind(template);
  for (const tokenData of tokens) {
    if (tokenInside(tokenData, wallsBlockTargeting)) {
      targets.push(<string>tokenData._id);
    }
  }
  //game.user?.updateTokenTargets(targets);
  // TODO APPLY EFFECT
}

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

  // ===============================================
  // 0 - Checkout the ownership of the target and the disposition of the target
  // friendly, neutral, hostile
  // =================================================

  // If you are owner of the token you can see him
  const isPlayerOwned = <boolean>targetToken.actor?.hasPlayerOwner;
  // If I'm an owner of the token; remain visible
  if (!game.user?.isGM && (isPlayerOwned || targetToken.owner)) {
    return true;
  }

  let targetActorDisposition;
  if (targetToken && targetToken.data?.disposition) {
    targetActorDisposition = targetToken.data.disposition;
  } else {
    // no token to use so make a guess
    targetActorDisposition =
      targetToken.actor?.type === API.NPC_TYPE ? CONST.TOKEN_DISPOSITIONS.HOSTILE : CONST.TOKEN_DISPOSITIONS.FRIENDLY;
  }
  let sourceActorDisposition;
  if (sourceToken && sourceToken.data?.disposition) {
    sourceActorDisposition = sourceToken.data.disposition;
  } else {
    // no token to use so make a guess
    sourceActorDisposition =
      sourceToken.actor?.type === API.NPC_TYPE ? CONST.TOKEN_DISPOSITIONS.HOSTILE : CONST.TOKEN_DISPOSITIONS.FRIENDLY;
  }

  // If both are hostile return true
  if (
    sourceActorDisposition == CONST.TOKEN_DISPOSITIONS.HOSTILE &&
    targetActorDisposition == CONST.TOKEN_DISPOSITIONS.HOSTILE
  ) {
    return true;
  }

  if (game.settings.get(CONSTANTS.MODULE_NAME, 'disableForNonHostileNpc')) {
    if (
      targetActorDisposition === CONST.TOKEN_DISPOSITIONS.FRIENDLY ||
      targetActorDisposition === CONST.TOKEN_DISPOSITIONS.NEUTRAL
    ) {
      return true;
    }
  }
  // ========================================
  // 1 - Preparation of the active effect
  // =========================================

  const sourceVisionLevels = getSensesFromToken(sourceToken) ?? [];
  const targetVisionLevels = getConditionsFromToken(targetToken) ?? [];

  if (!sourceVisionLevels || sourceVisionLevels.length == 0) {
    // If at least a condition is present on target it should be false
    if (targetVisionLevels && targetVisionLevels.length > 0) {
      return false;
    } else {
      return true; // default vaue
    }
  }

  for (const sourceStatusEffect of sourceVisionLevels) {
    if (sourceStatusEffect.statusSight?.id == AtcvEffectSenseFlags.BLINDED) {
      // Someone is blind
      return false;
    }
  }

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
      if (result) {
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
      if (<number>targetVisionLevel.visionLevelValue <= -1) {
        return false;
      } else {
        const result =
          <number>sourceVisionLevel.visionLevelValue <= -1 ||
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
  // Make sure to remove anything wiith value 0
  for (const senseData of await API.getAllSensesAndConditions()) {
    const effectNameToCheckOnActor = i18n(<string>senseData?.name);
    if (await API.hasEffectAppliedOnToken(<string>sourceToken.id, effectNameToCheckOnActor, true)) {
      const activeEffectToRemove = <ActiveEffect>(
        await API.findEffectByNameOnToken(<string>sourceToken.id, effectNameToCheckOnActor)
      );
      // const actve = retrieveAtcvVisionLevelFromActiveEffect(activeEffectToRemove,senseData);
      const actve = sourceToken.document?.getFlag(CONSTANTS.MODULE_NAME, senseData.id);
      if (actve == 0 || actve == null || actve == undefined) {
        await API.removeEffectFromIdOnToken(<string>sourceToken.id, <string>activeEffectToRemove.id);
      }
    }
  }

  // const actor = <Actor>sourceToken.document.getActor();

  // TODO MANAGE THE UPDATE OF EFFECT INSTEAD REMOVE AND ADD

  // REMOVE EVERY SENSES WITH THE SAME NAME
  // const keysSensesFirstTime: string[] = [];
  for (const [key, sense] of visionCapabilities.retrieveSenses()) {
    const effectNameToCheckOnActor = i18n(<string>sense.statusSight?.name);
    if (sense.visionLevelValue && sense.visionLevelValue != 0) {
      if (await API.hasEffectAppliedOnToken(<string>sourceToken.id, effectNameToCheckOnActor, true)) {
        const activeEffectToRemove = <ActiveEffect>(
          await API.findEffectByNameOnToken(<string>sourceToken.id, effectNameToCheckOnActor)
        );
        if (activeEffectToRemove) {
          const actve = retrieveAtcvVisionLevelFromActiveEffect(activeEffectToRemove, key);
          if (sense.visionLevelValue != actve) {
            // if (keysSensesFirstTime.includes(key)) {
            await API.removeEffectFromIdOnToken(<string>sourceToken.id, <string>activeEffectToRemove.id);
            // } else {
            //   keysSensesFirstTime.push(key);
            // }
          }
        }
      }
    } else {
      if (await API.hasEffectAppliedOnToken(<string>sourceToken.id, effectNameToCheckOnActor, true)) {
        const activeEffectToRemove = <ActiveEffect>(
          await API.findEffectByNameOnToken(<string>sourceToken.id, effectNameToCheckOnActor)
        );
        const actve = retrieveAtcvVisionLevelFromActiveEffect(activeEffectToRemove, key);
        if (sense.visionLevelValue != actve) {
          await API.removeEffectFromIdOnToken(<string>sourceToken.id, <string>activeEffectToRemove.id);
        }
      }
    }
  }

  // ADD THE SENSES FINALLY

  for (const [key, sense] of visionCapabilities.retrieveSenses()) {
    if (sense.visionLevelValue && sense.visionLevelValue != 0) {
      const effectNameToCheckOnActor = i18n(<string>sense.statusSight?.name);
      if (!(await API.hasEffectAppliedOnToken(<string>sourceToken.id, effectNameToCheckOnActor, true))) {
        await API.addEffectConditionalVisibilityOnToken(
          <string>sourceToken.id,
          <string>sense.statusSight?.id,
          false,
          sense.visionDistanceValue,
          sense.visionLevelValue,
        );
      }
      //else {
      //   const ae = <ActiveEffect>await API.findEffectByNameOnToken(<string>sourceToken.id, effectNameToCheckOnActor);
      //   updateAtcvVisionLevel(
      //     sourceToken,
      //     ae,
      //     <string>sense.statusSight?.id,
      //     <string>sense.statusSight?.path,
      //     sense.visionLevelValue,
      //   );
      // }
    }
  }

  // TODO MANAGE THE UPDATE OF EFFECT INSTEAD REMOVE AND ADD

  // REMOVE EVERY CONDITIONS WITH THE SAME NAME

  // const keysConditionsFirstTime: string[] = [];
  for (const [key, condition] of visionCapabilities.retrieveConditions()) {
    const effectNameToCheckOnActor = i18n(<string>condition.statusSight?.name);
    if (condition.visionLevelValue && condition.visionLevelValue != 0) {
      const activeEffectToRemove = <ActiveEffect>(
        await API.findEffectByNameOnToken(<string>sourceToken.id, effectNameToCheckOnActor)
      );
      if (activeEffectToRemove) {
        const actve = retrieveAtcvVisionLevelFromActiveEffect(activeEffectToRemove, key);
        if (condition.visionLevelValue != actve) {
          // if (keysConditionsFirstTime.includes(key)) {
          await API.removeEffectFromIdOnToken(<string>sourceToken.id, <string>activeEffectToRemove.id);
          // } else {
          //   keysConditionsFirstTime.push(key);
          // }
        }
      }
    } else {
      if (await API.hasEffectAppliedOnToken(<string>sourceToken.id, effectNameToCheckOnActor, true)) {
        const activeEffectToRemove = <ActiveEffect>(
          await API.findEffectByNameOnToken(<string>sourceToken.id, effectNameToCheckOnActor)
        );
        const actve = retrieveAtcvVisionLevelFromActiveEffect(activeEffectToRemove, key);
        if (condition.visionLevelValue != actve) {
          await API.removeEffectFromIdOnToken(<string>sourceToken.id, <string>activeEffectToRemove.id);
        }
      }
    }
  }

  // ADD THE CONDITIONS FINALLY

  for (const [key, condition] of visionCapabilities.retrieveConditions()) {
    if (condition.visionLevelValue && condition.visionLevelValue != 0) {
      const effectNameToCheckOnActor = i18n(<string>condition.statusSight?.name);
      if (!(await API.hasEffectAppliedOnToken(<string>sourceToken.id, effectNameToCheckOnActor, true))) {
        await API.addEffectConditionalVisibilityOnToken(
          <string>sourceToken.id,
          <string>condition.statusSight?.id,
          false,
          condition.visionDistanceValue,
          condition.visionLevelValue,
        );
      }
      //else {
      //   const ae = <ActiveEffect>await API.findEffectByNameOnToken(<string>sourceToken.id, effectNameToCheckOnActor);
      //   updateAtcvVisionLevel(
      //     sourceToken,
      //     ae,
      //     <string>condition.statusSight?.id,
      //     <string>condition.statusSight?.path,
      //     condition.visionLevelValue,
      //   );
      // }
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
  if(!token){
    warn(`No token found`, true);
    return [];
  }
  const actor = <Actor>token.document?.getActor() ||  <Actor>token.document?.actor || <Actor>token?.actor;
  if(!actor){
    warn(`No actor found for token '${token.name}'`, true);
    return [];
  }
  const actorEffects = <EmbeddedCollection<typeof ActiveEffect, ActorData>>actor?.data.effects;
  //const totalEffects = <EmbeddedCollection<typeof ActiveEffect, ActorData>>actor?.data.effects.contents.filter(i => !i.data.disabled);
  const ATCVeffects = actorEffects.filter(
    (entity) => !!entity.data.changes.find((effect) => effect.key.includes('ATCV')),
  );
  let visionElevation = true;
  let conditionTargets: string[] = [];
  let conditionSources: string[] = [];
  const statusEffects: AtcvEffect[] = [];

  for (const effectEntity of ATCVeffects) {
    const effectNameToSet = effectEntity.name ? effectEntity.name : effectEntity.data.label;
    if (!effectNameToSet) {
      continue;
    }
    const effectSight = statusSights.find((a: SenseData) => {
      return isStringEquals(effectNameToSet, a.id) || isStringEquals(effectNameToSet, a.name);
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
      const atcvValue = retrieveAtcvVisionLevelFromActiveEffect(effectEntity, effectSight.id);
      const atcvTargetImage = retrieveAtcvVisionTargetImageFromActiveEffect(effectEntity);

      statusEffects.push({
        visionElevation: visionElevation,
        visionTargets: conditionTargets,
        visionSources: conditionSources,
        statusSight: effectSight,
        visionDistanceValue: distance,
        visionLevelValue: atcvValue,
        visionTargetImage: atcvTargetImage,
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

export function retrieveAtcvVisionLevelFromActiveEffect(effectEntity: ActiveEffect, effectSightId: string): number {
  //Look up for ATCV to manage vision level
  // TODO for now every active effect can have only one ATCV key ate the time not sure if is manageable
  let atcvValue: any = 0;
  const effectNameToSet = effectEntity.name ? effectEntity.name : effectEntity.data.label;
  if (!effectNameToSet) {
    return atcvValue;
  }

  const atcvChanges = EffectSupport.retrieveChangesOrderedByPriorityFromAE(effectEntity);
  //atcvValue = effectEntity.data.changes.find((aee) => {
  atcvValue = atcvChanges.find((aee) => {
    if (isStringEquals(aee.key, 'ATCV.' + effectSightId)) {
      return aee;
    }
  });
  if (!atcvValue) {
    // Ignore ???
    return 0;
  }
  return Number(atcvValue.value);
}

export function retrieveAtcvVisionTargetImageFromActiveEffect(effectEntity: ActiveEffect): string {
  //Look up for ATCV to manage vision level
  // TODO for now every active effect can have only one ATCV key ate the time not sure if is manageable
  let atcvValue: any = '';
  const effectNameToSet = effectEntity.name ? effectEntity.name : effectEntity.data.label;
  if (!effectNameToSet) {
    return atcvValue;
  }

  const atcvChanges = EffectSupport.retrieveChangesOrderedByPriorityFromAE(effectEntity);
  //atcvValue = effectEntity.data.changes.find((aee) => {
  atcvValue = atcvChanges.find((aee) => {
    if (isStringEquals(aee.key, 'ATCV.conditionTargetImage')) {
      return aee;
    }
  });
  if (!atcvValue) {
    // Ignore ???
    return '';
  }
  return String(atcvValue.value);
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

export async function toggleStealth(event) {
  const stealthedWithHiddenConditionOri =
    this.object.document.getFlag(CONSTANTS.MODULE_NAME, AtcvEffectConditionFlags.HIDDEN) ?? 0;
  let stealthedWithHiddenCondition = duplicate(stealthedWithHiddenConditionOri);
  if (stealthedWithHiddenCondition == 0 && getProperty(this.object.document, `data.${API.STEALTH_PASSIVE_SKILL}`)) {
    stealthedWithHiddenCondition = getProperty(this.object.document, `data.${API.STEALTH_PASSIVE_SKILL}`);
  }

  // Senses
  // const optionsSenses: string[] = [];
  const sensesOrderByName = <SenseData[]>API.SENSES; //.sort((a, b) => a.name.localeCompare(b.name));
  // sensesOrderByName.forEach((a: SenseData) => {
  //   if (a.id == AtcvEffectSenseFlags.NONE) {
  //     optionsSenses.push(`<option selected="selected" data-image="${a.img}" value="">${i18n(a.name)}</option>`);
  //   } else {
  //     optionsSenses.push(`<option data-image="${a.img}" value="${a.id}">${i18n(a.name)}</option>`);
  //   }
  // });
  // Conditions
  // const optionsConditions: string[] = [];
  const conditionsOrderByName = <SenseData[]>API.CONDITIONS; //.sort((a, b) => a.name.localeCompare(b.name));
  // conditionsOrderByName.forEach((a: SenseData) => {
  //   if (a.id == AtcvEffectConditionFlags.HIDDEN) {
  //     optionsConditions.push(`<option selected="selected" data-image="${a.img}" value="">${i18n(a.name)}</option>`);
  //   } else {
  //     optionsConditions.push(`<option data-image="${a.img}" value="${a.id}">${i18n(a.name)}</option>`);
  //   }
  // });

  const result = await API.rollStealth(this.object);
  const content = await renderTemplate(`modules/${CONSTANTS.MODULE_NAME}/templates/stealth_hud.html`, {
    currentstealth: stealthedWithHiddenCondition,
    stealthroll: result,
    senses: sensesOrderByName,
    conditions: conditionsOrderByName,
  });
  const hud = new Dialog({
    title: i18n(CONSTANTS.MODULE_NAME + '.dialogs.title.hidden'),
    content: content,
    buttons: {
      one: {
        icon: '<i class="fas fa-check"></i>',
        label: 'OK',
        callback: async (html: JQuery<HTMLElement>) => {
          //@ts-ignore
          const valCurrentstealth = parseInt(html.find('div.form-group').children()[1]?.value);
          //@ts-ignore
          let valStealthRoll = parseInt(html.find('div.form-group').children()[3]?.value);
          if (isNaN(valStealthRoll)) {
            valStealthRoll = 0;
          }
          //@ts-ignore
          const senseId = String(html.find('div.form-group').children()[6]?.value);
          //@ts-ignore
          const conditionId = String(html.find('div.form-group').children()[10]?.value);

          let selectedTokens = <Token[]>canvas.tokens?.controlled;
          if (!selectedTokens || selectedTokens.length == 0) {
            selectedTokens = [this.object];
          }
          for (const selectedToken of selectedTokens) {
            if (senseId != AtcvEffectSenseFlags.NONE && senseId != AtcvEffectSenseFlags.NORMAL) {
              if (valStealthRoll == 0) {
                const effect = await ConditionalVisibilityEffectDefinitions.effect(senseId);
                await API.removeEffectOnToken(selectedToken.id, i18n(<string>effect?.name));
              }
              await selectedToken.document.setFlag(CONSTANTS.MODULE_NAME, senseId, valStealthRoll);
            }
            if (conditionId != AtcvEffectConditionFlags.NONE) {
              if (valStealthRoll == 0) {
                const effect = await ConditionalVisibilityEffectDefinitions.effect(conditionId);
                await API.removeEffectOnToken(selectedToken.id, i18n(<string>effect?.name));
              }
              await selectedToken.document.setFlag(CONSTANTS.MODULE_NAME, conditionId, valStealthRoll);
            }
          }
          event.currentTarget.classList.toggle('active', valStealthRoll && valStealthRoll != 0);
        },
      },
    },
    close: async (html: JQuery<HTMLElement>) => {
      event.currentTarget.classList.toggle(
        'active',
        stealthedWithHiddenConditionOri && stealthedWithHiddenConditionOri != 0,
      );
    },
    default: 'close',
  });
  hud.render(true);
}

// ========================================================================================
