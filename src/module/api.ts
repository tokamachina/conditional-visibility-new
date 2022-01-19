import CONSTANTS from './constants';
import { conditionalVisibilitySocket, SOCKET_HANDLERS } from './socket';
import { canvas, game } from './settings';
import { error } from './lib/lib';
import EffectInterface from './effects/effect-interface';
import EffectHandler from './effects/effect-handler';
import Effect from './effects/effect';

export default class API {
  static effectInterface: EffectInterface;

  /**
   * The attributes used to track dynamic attributes in this system
   *
   * @returns {array}
   */
  static get SENSES(): { id: string; name: string; path: string; img: string; effect: Effect }[] {
    return <any[]>game.settings.get(CONSTANTS.MODULE_NAME, 'senses');
  }

  /**
   * The attributes used to track dynamic attributes in this system
   *
   * @returns {array}
   */
  static get CONDITIONS(): { id: string; visibilityId: string; label: string; icon: string }[] {
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
}
