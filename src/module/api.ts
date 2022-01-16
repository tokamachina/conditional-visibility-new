import { CONSTANTS } from './constants';
import { conditionalVisibilitySocket, SOCKET_HANDLERS } from './socket';
import { canvas, game } from './settings';
import { error } from './lib/lib';

export default class API {
  /**
   * The actor class type used for the original item pile actor in this system
   *
   * @returns {string}
   */
  static get ACTOR_CLASS_TYPE() {
    return game.settings.get(CONSTANTS.MODULE_NAME, 'actorClassType');
  }

  /**
   * The attributes used to track dynamic attributes in this system
   *
   * @returns {array}
   */
  static get DYNAMIC_ATTRIBUTES() {
    return game.settings.get(CONSTANTS.MODULE_NAME, 'dynamicAttributes');
  }

  /**
   * The attribute used to track the quantity of items in this system
   *
   * @returns {string}
   */
  static get ITEM_QUANTITY_ATTRIBUTE() {
    return game.settings.get(CONSTANTS.MODULE_NAME, 'itemQuantityAttribute');
  }

  /**
   * The attribute used to track the item type in this system
   *
   * @returns {string}
   */
  static get ITEM_TYPE_ATTRIBUTE() {
    return game.settings.get(CONSTANTS.MODULE_NAME, 'itemTypeAttribute');
  }

  /**
   * The filters for item types eligible for interaction within this system
   *
   * @returns {Array}
   */
  static get ITEM_TYPE_FILTERS() {
    return (<string>game.settings?.get(CONSTANTS.MODULE_NAME, 'visibilityTypeFilters'))
      .split(',')
      .map((str) => str.trim().toLowerCase());
  }

  /**
   * Sets the actor class type used for the original item pile actor in this system
   *
   * @param {string} inClassType
   * @returns {Promise}
   */
  static async setActorClassType(inClassType) {
    if (typeof inClassType !== 'string') {
      throw error('setActorTypeClass | inClassType must be of type string');
    }
    return game.settings.set(CONSTANTS.MODULE_NAME, 'actorClassType', inClassType);
  }

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

  /**
   * Sets the inAttribute used to track the quantity of items in this system
   *
   * @param {string} inAttribute
   * @returns {Promise}
   */
  static async setItemQuantityAttribute(inAttribute) {
    if (typeof inAttribute !== 'string') {
      throw error('setItemQuantityAttribute | inAttribute must be of type string');
    }
    return game.settings.set(CONSTANTS.MODULE_NAME, 'itemQuantityAttribute', inAttribute);
  }

  /**
   * Sets the attribute used to track the item type in this system
   *
   * @param {string} inAttribute
   * @returns {string}
   */
  static async setVisibilityTypeAttribute(inAttribute) {
    if (typeof inAttribute !== 'string') {
      throw error('setVisibilityTypeAttribute | inAttribute must be of type string');
    }
    return game.settings.set(CONSTANTS.MODULE_NAME, 'itemTypeAttribute', inAttribute);
  }

  /**
   * Sets the filters for item types eligible for interaction within this system
   *
   * @param {string/array} inFilters
   * @returns {Promise}
   */
  static async setVisibilityTypeFilters(inFilters) {
    if (!Array.isArray(inFilters)) {
      if (typeof inFilters !== 'string') {
        throw error('setVisibilityTypeFilters | inFilters must be of type string or array');
      }
      inFilters = inFilters.split(',');
    } else {
      inFilters.forEach((filter) => {
        if (typeof filter !== 'string') {
          throw error('setVisibilityTypeFilters | each entry in inFilters must be of type string');
        }
      });
    }
    return game.settings.set(CONSTANTS.MODULE_NAME, 'itemTypeFilters', inFilters.join(','));
  }
}
