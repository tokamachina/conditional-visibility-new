import CONSTANTS from './constants';
import API from './api';
import { debug } from './lib/lib';

export const SOCKET_HANDLERS = {
  /**
   * Generic sockets
   */
  CALL_HOOK: 'callHook',
  ON_RENDER_TOKEN_CONFIG: 'onRenderTokenConfig',

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
  conditionalVisibilitySocket.register(SOCKET_HANDLERS.ON_RENDER_TOKEN_CONFIG, (...args) =>
    API._onRenderTokenConfig(...args),
  );

  /**
   * UI sockets
   */

  /**
   * Item & attribute sockets
   */

  /**
   * Effects
   */
  conditionalVisibilitySocket.register('toggleEffect', (...args) =>
    API.effectInterface._effectHandler.toggleEffectArr(...args),
  );
  conditionalVisibilitySocket.register('addEffect', (...args) =>
    API.effectInterface._effectHandler.addEffectArr(...args),
  );
  conditionalVisibilitySocket.register('removeEffect', (...args) =>
    API.effectInterface._effectHandler.removeEffectArr(...args),
  );
  // conditionalVisibilitySocket.register('addActorDataChanges', (...args) => API._actorUpdater.addActorDataChanges(...args));
  // conditionalVisibilitySocket.register('removeActorDataChanges', (...args) => API._actorUpdater.removeActorDataChanges(...args));
  conditionalVisibilitySocket.register('addEffectOnActor', (...args) =>
    API.effectInterface._effectHandler.addEffectOnActorArr(...args),
  );
  conditionalVisibilitySocket.register('removeEffectOnActor', (...args) =>
    API.effectInterface._effectHandler.removeEffectOnActorArr(...args),
  );
  conditionalVisibilitySocket.register('removeEffectFromIdOnActor', (...args) =>
    API.effectInterface._effectHandler.removeEffectFromIdOnActorArr(...args),
  );
  conditionalVisibilitySocket.register('toggleEffectByUuid', (...args) =>
    API.effectInterface._effectHandler.toggleEffectByUuidArr(...args),
  );
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
