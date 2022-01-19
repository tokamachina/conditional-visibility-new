import CONSTANTS from './constants';
import API from './api';
import { debug } from './lib/lib';

export const SOCKET_HANDLERS = {
  /**
   * Generic sockets
   */
  CALL_HOOK: 'callHook',

  // /**
  //  * Item pile sockets
  //  */
  // CREATE_PILE: 'createItemPile',
  // UPDATE_PILE: 'updateItemPile',
  // UPDATED_PILE: 'updatedPile',
  // DELETE_PILE: 'deleteItemPile',
  // TURN_INTO_PILE: 'turnIntoPiles',
  // REVERT_FROM_PILE: 'revertFromPiles',
  // REFRESH_PILE: 'refreshItemPile',

  // /**
  //  * UI sockets
  //  */
  // RERENDER_TOKEN_HUD: 'rerenderTokenHud',
  // RERENDER_PILE_INVENTORY: 'rerenderPileInventory',
  // QUERY_PILE_INVENTORY_OPEN: 'queryPileInventoryOpen',
  // RESPOND_PILE_INVENTORY_OPEN: 'responsePileInventoryOpen',

  // /**
  //  * Item & attribute sockets
  //  */
  // DROP_ITEMS: 'dropItems',
  // ADD_ITEMS: 'addItems',
  // REMOVE_ITEMS: 'removeItems',
  // TRANSFER_ITEMS: 'transferItems',
  // TRANSFER_ALL_ITEMS: 'transferAllItems',
  // ADD_ATTRIBUTE: 'addAttributes',
  // REMOVE_ATTRIBUTES: 'removeAttributes',
  // TRANSFER_ATTRIBUTES: 'transferAttributes',
  // TRANSFER_ALL_ATTRIBUTES: 'transferAllAttributes',
  // TRANSFER_EVERYTHING: 'transferEverything',
};

export let conditionalVisibilitySocket;

export function registerSocket() {
  debug('Registered conditionalVisibilitySocket');
  //@ts-ignore
  conditionalVisibilitySocket = socketlib.registerModule(CONSTANTS.MODULE_NAME);

  /**
   * Generic socket
   */
  conditionalVisibilitySocket.register(SOCKET_HANDLERS.CALL_HOOK, (hook, ...args) => callHook(hook, ...args));

  // /**
  //  * Conditional Visibility sockets
  //  */
  // conditionalVisibilitySocket.register(SOCKET_HANDLERS.CREATE_PILE, (...args) => API._createItemPile(...args));
  // conditionalVisibilitySocket.register(SOCKET_HANDLERS.UPDATE_PILE, (...args) => API._updateItemPile(...args));
  // conditionalVisibilitySocket.register(SOCKET_HANDLERS.UPDATED_PILE, (...args) => API._updatedItemPile(...args));
  // conditionalVisibilitySocket.register(SOCKET_HANDLERS.DELETE_PILE, (...args) => API._deleteItemPile(...args));
  // conditionalVisibilitySocket.register(SOCKET_HANDLERS.TURN_INTO_PILE, (...args) => API._turnTokensIntoItemPiles(...args));
  // conditionalVisibilitySocket.register(SOCKET_HANDLERS.REVERT_FROM_PILE, (...args) => API._revertTokensFromItemPiles(...args));
  // conditionalVisibilitySocket.register(SOCKET_HANDLERS.REFRESH_PILE, (...args) => API._refreshItemPile(...args));

  // /**
  //  * UI sockets
  //  */
  // conditionalVisibilitySocket.register(SOCKET_HANDLERS.RERENDER_TOKEN_HUD, (...args) => API._rerenderTokenHud(...args));
  // conditionalVisibilitySocket.register(SOCKET_HANDLERS.RERENDER_PILE_INVENTORY, (...args) =>
  //   API._rerenderItemPileInventoryApplication(...args),
  // );
  // conditionalVisibilitySocket.register(SOCKET_HANDLERS.QUERY_PILE_INVENTORY_OPEN, (...args) =>
  //   isPileInventoryOpenForOthers.respond(...args),
  // );
  // conditionalVisibilitySocket.register(SOCKET_HANDLERS.RESPOND_PILE_INVENTORY_OPEN, (...args) =>
  //   isPileInventoryOpenForOthers.handleResponse(...args),
  // );

  // /**
  //  * Item & attribute sockets
  //  */
  // conditionalVisibilitySocket.register(SOCKET_HANDLERS.DROP_ITEMS, (args) => API._dropItems(args));
  // conditionalVisibilitySocket.register(SOCKET_HANDLERS.ADD_ITEMS, (...args) => API._addItems(...args));
  // conditionalVisibilitySocket.register(SOCKET_HANDLERS.REMOVE_ITEMS, (...args) => API._removeItems(...args));
  // conditionalVisibilitySocket.register(SOCKET_HANDLERS.TRANSFER_ITEMS, (...args) => API._transferItems(...args));
  // conditionalVisibilitySocket.register(SOCKET_HANDLERS.TRANSFER_ALL_ITEMS, (...args) => API._transferAllItems(...args));
  // conditionalVisibilitySocket.register(SOCKET_HANDLERS.ADD_ATTRIBUTE, (...args) => API._addAttributes(...args));
  // conditionalVisibilitySocket.register(SOCKET_HANDLERS.REMOVE_ATTRIBUTES, (...args) => API._removeAttributes(...args));
  // conditionalVisibilitySocket.register(SOCKET_HANDLERS.TRANSFER_ATTRIBUTES, (...args) => API._transferAttributes(...args));
  // conditionalVisibilitySocket.register(SOCKET_HANDLERS.TRANSFER_ALL_ATTRIBUTES, (...args) => API._transferAllAttributes(...args));
  // conditionalVisibilitySocket.register(SOCKET_HANDLERS.TRANSFER_EVERYTHING, (...args) => API._transferEverything(...args));
}

async function callHook(inHookName, ...args) {
  const newArgs: any[] = [];
  for (let arg of args) {
    if (typeof arg === 'string') {
      const testArg = await fromUuid(arg);
      if (testArg) {
        arg = testArg;
      }
    }
    newArgs.push(arg);
  }
  return Hooks.callAll(inHookName, ...newArgs);
}

// export const isPileInventoryOpenForOthers = {
//   query(inPile) {
//     const promise = new Promise((resolve) => {
//       this.resolve = resolve;
//     });

//     this.usersToRespond = new Set(
//       game.users.filter((user) => user.active && user !== game.user).map((user) => user.id),
//     );
//     this.isOpen = false;

//     conditionalVisibilitySocket.executeForOthers(SOCKET_HANDLERS.QUERY_PILE_INVENTORY_OPEN, game.user.id, lib.getUuid(inPile));

//     setTimeout(this.resolve, 200);

//     return promise;
//   },

//   async respond(inUserId, inPileUuid) {
//     const app = ItemPileInventory.getActiveAppFromPile(inPileUuid);
//     return conditionalVisibilitySocket.executeAsUser(SOCKET_HANDLERS.RESPOND_PILE_INVENTORY_OPEN, inUserId, game.user.id, !!app);
//   },

//   handleResponse(inUserId, appOpen) {
//     this.usersToRespond.delete(inUserId);
//     this.isOpen = this.isOpen || appOpen;
//     if (this.usersToRespond.size > 0) return;
//     this.resolve(this.isOpen);
//     this.usersToRespond = new Set();
//     this.isOpen = false;
//     this.resolve = () => {};
//   },
// };
