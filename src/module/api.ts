import CONSTANTS from './constants';
import { error } from './lib/lib';
import EffectInterface from './effects/effect-interface';
import { StatusSight } from './conditional-visibility-models';
import HOOKS from './hooks';
import { EnhancedConditions } from './cub/enhanced-conditions';
import { canvas, game } from './settings';
import Effect from './effects/effect';

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

  static async _onRenderTokenConfig(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('_onRenderTokenConfig | inAttributes must be of type array');
    }
    const [tokenConfig, html, data] = inAttributes;
    const hookResult = Hooks.call(HOOKS.ON_RENDER_TOKEN_CONFIG, tokenConfig, html, data);
    if (hookResult === false) return;
    return true; //conditionalVisibilitySocket.executeAsGM(SOCKET_HANDLERS.ON_RENDER_TOKEN_CONFIG, tokenConfig, html, data);
  }

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

  static async addEffect(actorId: string, effectName: string, effect: Effect) {
    const result = await API.effectInterface.addEffectOnActor(effectName, <string>actorId, effect);
    return result;
  }

  static async findEffectByNameOnActor(actorId: string, effectName: string): Promise<ActiveEffect | null> {
    return await API.effectInterface.findEffectByNameOnActor(effectName, <string>actorId);
  }

  static async hasEffectAppliedOnActor(actorId: string, effectName: string) {
    return await API.effectInterface.hasEffectAppliedOnActor(effectName, <string>actorId);
  }

  static async hasEffectAppliedFromIdOnActor(actorId: string, effectId: string) {
    return await API.effectInterface.hasEffectAppliedFromIdOnActor(effectId, <string>actorId);
  }

  static async toggleEffectOnActor(
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
}
