import { CONSTANTS } from './constants';
import { conditionalVisibilitySocket, SOCKET_HANDLERS } from './socket';
import { canvas, game } from './settings';
import { error } from './lib/lib';

export default class API {
  /**
   * The attributes used to track dynamic attributes in this system
   *
   * @returns {array}
   */
  static get DYNAMIC_ATTRIBUTES() {
    return game.settings.get(CONSTANTS.MODULE_NAME, 'dynamicAttributes');
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
  static async setDynamicAttributes(inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw error('setDynamicAttributes | inAttributes must be of type array');
    }
    inAttributes.forEach((attribute) => {
      if (typeof attribute !== 'object') {
        throw error('setDynamicAttributes | each entry in the inAttributes array must be of type object');
      }
      if (typeof attribute.name !== 'string') {
        throw error('setDynamicAttributes | attribute.name must be of type string');
      }
      if (typeof attribute.attribute !== 'string') {
        throw error('setDynamicAttributes | attribute.path must be of type string');
      }
      if (attribute.img && typeof attribute.img !== 'string') {
        throw error('setDynamicAttributes | attribute.img must be of type string');
      }
    });
    return game.settings.set(CONSTANTS.MODULE_NAME, 'dynamicAttributes', inAttributes);
  }
}
