import API from './api.js';
import { CONSTANTS } from './constants.js';

export function registerLibwrappers() {
  // libWrapper.register(CONSTANTS.MODULE_NAME, 'Token.prototype._onClickLeft2', function (wrapped, ...args) {
  //     if (API.isValidItemPile(this.document) && game.keyboard.downKeys.has("ControlLeft")) {
  //         return API._itemPileClicked(this.document);
  //     }
  //     return wrapped(...args);
  // }, 'MIXED' /* optional, since this is the default type */);

  //@ts-ignore
  libWrapper.register(
    CONSTANTS.MODULE_NAME,
    'Token.prototype._onMovementFrame',
    _ConditionalVisibilityOnMovementFrame,
    'WRAPPER',
  );
}

function _ConditionalVisibilityOnMovementFrame(wrapped, ...args) {
  wrapped(...args);
  // Update the token copy
  //ConditionalVisibility.INSTANCE.restrictVisibility(100);
}
