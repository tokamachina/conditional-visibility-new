import CONSTANTS from './constants';
import { error, i18n, mergeByProperty, warn } from './lib/lib';
import EffectInterface from './effects/effect-interface';
import { StatusSight } from './conditional-visibility-models';
import HOOKS from './hooks';
import { EnhancedConditions } from './cub/enhanced-conditions';
import { canvas, game } from './settings';
import Effect from './effects/effect';
import { EffectDefinitions } from './conditional-visibility-effect-definition';

export default class API {
  // static get effectInterface(): EffectInterface {
  //   return new EffectInterface(CONSTANTS.MODULE_NAME);
  // }

  static effectInterface: EffectInterface;

  static get enhancedConditions(): EnhancedConditions {
    //@ts-ignore
    return game.cub;
  }

  /**
   * The attributes used to track dynamic attributes in this system
   *
   * @returns {array}
   */
  static get SENSES(): StatusSight[] {
    return <any[]>game.settings.get(CONSTANTS.MODULE_NAME, 'senses');
  }

  /**
   * The attributes used to track dynamic attributes in this system
   *
   * @returns {array}
   */
  static get CONDITIONS(): StatusSight[] {
    return <any[]>game.settings.get(CONSTANTS.MODULE_NAME, 'conditions');
  }

  // /**
  //  * The filters for item types eligible for interaction within this system
  //  *
  //  * @returns {Array}
  //  */
  // static get ITEM_TYPE_FILTERS() {
  //   return (<string>game.settings?.get(CONSTANTS.MODULE_NAME, 'visibilityTypeFilters'))
  //     .split(',')
  //     .map((str) => str.trim().toLowerCase());
  // }

  // static async _onRenderTokenConfig(...inAttributes: any[]) {
  //   if (!Array.isArray(inAttributes)) {
  //     throw error('_onRenderTokenConfig | inAttributes must be of type array');
  //   }
  //   const [tokenConfig, html, data] = inAttributes;
  //   const hookResult = Hooks.call(HOOKS.ON_RENDER_TOKEN_CONFIG, tokenConfig, html, data);
  //   if (hookResult === false) return;
  //   return true; //conditionalVisibilitySocket.executeAsGM(SOCKET_HANDLERS.ON_RENDER_TOKEN_CONFIG, tokenConfig, html, data);
  // }

  /**
   * Sets the attributes used to track dynamic attributes in this system
   *
   * @param {array} inAttributes
   * @returns {Promise}
   */
  static async setSenses(inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw error('setSenses | inAttributes must be of type array');
    }
    inAttributes.forEach((attribute) => {
      if (typeof attribute !== 'object') {
        throw error('setSenses | each entry in the inAttributes array must be of type object');
      }
      if (typeof attribute.name !== 'string') {
        throw error('setSenses | attribute.name must be of type string');
      }
      if (typeof attribute.attribute !== 'string') {
        throw error('setSenses | attribute.path must be of type string');
      }
      if (attribute.img && typeof attribute.img !== 'string') {
        throw error('setSenses | attribute.img must be of type string');
      }
    });
    return game.settings.set(CONSTANTS.MODULE_NAME, 'senses', inAttributes);
  }

  /**
   * Sets the attributes used to track dynamic attributes in this system
   *
   * @param {array} inAttributes
   * @returns {Promise}
   */
  static async setConditions(inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw error('setConditions | inAttributes must be of type array');
    }
    inAttributes.forEach((attribute) => {
      if (typeof attribute !== 'object') {
        throw error('setConditions | each entry in the inAttributes array must be of type object');
      }
      if (typeof attribute.name !== 'string') {
        throw error('setConditions | attribute.name must be of type string');
      }
      if (typeof attribute.attribute !== 'string') {
        throw error('setConditions | attribute.path must be of type string');
      }
      if (attribute.img && typeof attribute.img !== 'string') {
        throw error('setConditions | attribute.img must be of type string');
      }
    });
    return game.settings.set(CONSTANTS.MODULE_NAME, 'conditions', inAttributes);
  }

  // ======================
  // Actor Management
  // ======================
  /*
  static async addEffectOnActor(actorId: string, effectName: string, effect: Effect) {
    const result = await API.effectInterface.addEffectOnActor(effectName, <string>actorId, effect);
    return result;
  }

  static async findEffectByNameOnActor(actorId: string, effectName: string): Promise<ActiveEffect | null> {
    const result = await API.effectInterface.findEffectByNameOnActor(effectName, <string>actorId);
    return result;
  }

  static async hasEffectAppliedOnActor(actorId: string, effectName: string, includeDisabled:boolean) {
    const result = await API.effectInterface.hasEffectAppliedOnActor(effectName, <string>actorId, includeDisabled);
    return result;
  }

  static async hasEffectAppliedFromIdOnActor(actorId: string, effectId: string, includeDisabled:boolean) {
    const result = await API.effectInterface.hasEffectAppliedFromIdOnActor(effectId, <string>actorId, includeDisabled);
    return result;
  }

  static async toggleEffectFromIdOnActor(
    actorId: string,
    effectId: string,
    alwaysDelete: boolean,
    forceEnabled?: boolean,
    forceDisabled?: boolean,
  ) {
    const result = await API.effectInterface.toggleEffectFromIdOnActor(
      effectId,
      <string>actorId,
      alwaysDelete,
      forceEnabled,
      forceDisabled,
    );
    return result;
  }

  static async addActiveEffectOnActor(actorId: string, activeEffect: ActiveEffect) {
    const result = API.effectInterface.addActiveEffectOnActor(<string>actorId, activeEffect.data);
    return result;
  }

  static async removeEffectOnActor(actorId: string, effectName: string) {
    const result = await API.effectInterface.removeEffectOnActor(effectName, <string>actorId);
    return result;
  }

  static async removeEffectFromIdOnActor(actorId: string, effectId: string) {
    const result = await API.effectInterface.removeEffectFromIdOnActor(effectId, <string>actorId);
    return result;
  }
  */
  // ======================
  // Token Management
  // ======================

  static async addEffectOnToken(tokenId: string, effectName: string, effect: Effect) {
    const result = await API.effectInterface.addEffectOnToken(effectName, <string>tokenId, effect);
    return result;
  }

  static async findEffectByNameOnToken(tokenId: string, effectName: string): Promise<ActiveEffect | null> {
    const result = await API.effectInterface.findEffectByNameOnToken(effectName, <string>tokenId);
    return result;
  }

  static async hasEffectAppliedOnToken(tokenId: string, effectName: string, includeDisabled: boolean) {
    const result = await API.effectInterface.hasEffectAppliedOnToken(effectName, <string>tokenId, includeDisabled);
    return result;
  }

  static async hasEffectAppliedFromIdOnToken(tokenId: string, effectId: string, includeDisabled: boolean) {
    const result = await API.effectInterface.hasEffectAppliedFromIdOnToken(effectId, <string>tokenId, includeDisabled);
    return result;
  }

  static async toggleEffectFromIdOnToken(
    tokenId: string,
    effectId: string,
    alwaysDelete: boolean,
    forceEnabled?: boolean,
    forceDisabled?: boolean,
  ) {
    const result = await API.effectInterface.toggleEffectFromIdOnToken(
      effectId,
      <string>tokenId,
      alwaysDelete,
      forceEnabled,
      forceDisabled,
    );
    return result;
  }

  static async addActiveEffectOnToken(tokenId: string, activeEffect: ActiveEffect) {
    const result = API.effectInterface.addActiveEffectOnToken(<string>tokenId, activeEffect.data);
    return result;
  }

  static async removeEffectOnToken(tokenId: string, effectName: string) {
    const result = await API.effectInterface.removeEffectOnToken(effectName, <string>tokenId);
    return result;
  }

  static async removeEffectFromIdOnToken(tokenId: string, effectId: string) {
    const result = await API.effectInterface.removeEffectFromIdOnToken(effectId, <string>tokenId);
    return result;
  }

  // =======================================================================================
  /*
  static async addEffectConditionalVisibilityOnActor(
    actorNameOrId: string,
    effectName: string,
    distance: number | undefined,
    visionLevel: number | undefined,
  ) {
    const actor = <Actor>game.actors?.get(actorNameOrId) || <Actor>game.actors?.getName(i18n(actorNameOrId));

    if (!actor) {
      warn(`No actor found with reference '${actorNameOrId}'`, true);
    }

    if (!distance) {
      distance = 0;
    }

    if (!visionLevel) {
      visionLevel = 0;
    }

    let effect: Effect | undefined = undefined;
    const sensesOrderByName = <StatusSight[]>API.SENSES.sort((a, b) => a.name.localeCompare(b.name));
    sensesOrderByName.forEach((a: StatusSight) => {
      if (a.id == effectName || i18n(a.name) == effectName) {
        effect = <Effect>EffectDefinitions.all(distance, visionLevel).find((e: Effect) => {
          return e.customId == a.id;
        });
      }
    });

    if (!effect) {
      warn(`No effect found with reference '${effectName}'`, true);
    }

    if (actor && effect) {
      await API.effectInterface.addEffectOnActor(effectName, <string>actor.id, effect);
    }
  }
  */

  static async setCondition(
    tokenNameOrId: string,
    effectName: string,
    disabled: boolean,
    distance: number | undefined,
    visionLevel: number | undefined,
  ) {
    return API.addEffectConditionalVisibilityOnToken(tokenNameOrId, effectName, disabled, distance, visionLevel);
  }

  static async addEffectConditionalVisibilityOnToken(
    tokenNameOrId: string,
    effectName: string,
    disabled: boolean,
    distance: number | undefined,
    visionLevel: number | undefined,
  ) {
    const tokens = <Token[]>canvas.tokens?.placeables;
    const token = <Token>tokens.find((token) => token.name == i18n(tokenNameOrId) || token.id == tokenNameOrId);

    if (!token) {
      warn(`No token found with reference '${tokenNameOrId}'`, true);
    }

    if (!distance) {
      distance = 0;
    }

    if (!visionLevel) {
      visionLevel = 0;
    }

    let allSensesAndConditions:StatusSight[] = [];
    allSensesAndConditions = mergeByProperty(allSensesAndConditions,API.SENSES,'id');
    allSensesAndConditions = mergeByProperty(allSensesAndConditions,API.CONDITIONS,'id');

    const sensesOrderByName = <StatusSight[]>allSensesAndConditions.sort((a, b) => a.name.localeCompare(b.name));

    let effect: Effect | undefined = undefined;
    for(const a of sensesOrderByName){
      if (a.id == effectName || i18n(a.name) == effectName) {
        effect = <Effect>EffectDefinitions.all(distance, visionLevel).find((e: Effect) => {
          return e.customId == a.id;
        });
        if(effect){
          effect.transfer = !disabled;
          break;
        }
      }
    }

    if (!effect) {
      warn(`No effect found with reference '${effectName}'`, true);
    }else{
      if (token && effect) {
        await API.effectInterface.addEffectOnToken(effectName, <string>token.id, effect);
        await token?.document?.setFlag(CONSTANTS.MODULE_NAME, (<Effect>effect).customId, visionLevel);
      }
    }
  }
}
