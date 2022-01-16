/**
 * This is your TypeScript entry file for Foundry VTT.
 * Register custom settings, sheets, and constants using the Foundry API.
 * Change this heading to be more descriptive to your module, or remove it.
 * Author: [your name]
 * Content License: [copyright and-or license] If using an existing system
 * 					you may want to put a (link to a) license or copyright
 * 					notice here (e.g. the OGL).
 * Software License: [your license] Put your desired license here, which
 * 					 determines how others may use and modify your module
 */
// Import TypeScript modules
import { checkSystem, CONDITIONAL_VISIBILITY_MODULE_NAME, registerSettings } from './module/settings';
import { readyHooks } from './module/Hooks';
import { canvas, game } from './module/settings';
import { preloadTemplates } from './module/preloadTemplates';
import { registerHotkeys } from './module/hotkeys';
import { CONSTANTS } from './module/constants';
import { error } from './module/lib/lib';

// declare global {
//   interface Window {
//     Senses: ConditionalVisibility;
//   }
// }

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once('init', async function () {
  log(' init ' + CONDITIONAL_VISIBILITY_MODULE_NAME);
  // Assign custom classes and constants here

  // Register custom module settings
  registerSettings();

  // Preload Handlebars templates
  await preloadTemplates();

  // Register custom sheets (if any)
});

Hooks.once('socketlib.ready', () => {
  //@ts-ignore
  ConditionalVisibility.SOCKET = socketlib.registerModule(CONDITIONAL_VISIBILITY_MODULE_NAME);
});

/* ------------------------------------ */
/* Setup module							*/
/* ------------------------------------ */
Hooks.once('setup', function () {});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once('ready', async function () {
  if (!game.modules.get('lib-wrapper')?.active && game.user?.isGM) {
    let word = 'install and activate';
    if (game.modules.get('lib-wrapper')) word = 'activate';
    throw error(`Requires the 'libWrapper' module. Please ${word} it.`);
  }
  if (!game.modules.get('socketlib')?.active && game.user?.isGM) {
    let word = 'install and activate';
    if (game.modules.get('socketlib')) word = 'activate';
    throw error(`Requires the 'socketlib' module. Please ${word} it.`);
  }

  // if (!isGMConnected()) {
  //   warn(`Requires a GM to be connected for players to be able to loot item piles.`, true);
  // }

  checkSystem();
  registerHotkeys();
  // Do anything once the module is ready
  readyHooks();
});

Hooks.once('libChangelogsReady', function () {
  //@ts-ignore
  libChangelogs.register(
    CONDITIONAL_VISIBILITY_MODULE_NAME,
    `Big update integration levelc. perfect vision, shared vision`,
  );
});
