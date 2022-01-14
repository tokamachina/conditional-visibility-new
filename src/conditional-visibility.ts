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
import { CONDITIONAL_VISIBILITY_MODULE_NAME, registerSettings } from './module/settings';
import { readyHooks } from './module/Hooks';
import { canvas, game } from './module/settings';

// declare global {
//   interface Window {
//     Senses: ConditionalVisibility;
//   }
// }

export function isGMConnected(){
  return !!Array.from(game.users).find(user => user.isGM && user.active);
}

export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export let debugEnabled = 0;
// 0 = none, warnings = 1, debug = 2, all = 3

export function debug(msg, args = "") {
  if (debugEnabled > 1){
    console.log(`DEBUG | ${CONDITIONAL_VISIBILITY_MODULE_NAME} | ${msg}`, args)
  }
}

export function log(message) {
  message = `${CONDITIONAL_VISIBILITY_MODULE_NAME} | ${message}`;
  console.log(message.replace("<br>", "\n"));
}

export function notify(message) {
  message = `${CONDITIONAL_VISIBILITY_MODULE_NAME} | ${message}`;
  ui.notifications?.notify(message);
  console.log(message.replace("<br>", "\n"));
}

export function warn(warning, notify = false) {
  warning = `${CONDITIONAL_VISIBILITY_MODULE_NAME} | ${warning}`;
  if (notify) ui.notifications?.warn(warning);
  console.warn(warning.replace("<br>", "\n"));
}

export function custom_error(error, notify = true) {
  error = `${CONDITIONAL_VISIBILITY_MODULE_NAME} | ${error}`;
  if (notify) ui.notifications?.error(error);
  return new Error(error.replace("<br>", "\n"));
}

export function timelog(message): void {
  warn(Date.now(), message);
}

export const i18n = (key: string): string => {
  return game.i18n.localize(key);
};

export const i18nFormat = (key: string, data = {}): string => {
  return game.i18n.format(key, data);
};

export const setDebugLevel = (debugText: string): void => {
  debugEnabled = { none: 0, warn: 1, debug: 2, all: 3 }[debugText] || 0;
  // 0 = none, warnings = 1, debug = 2, all = 3
  if (debugEnabled >= 3) CONFIG.debug.hooks = true;
};

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
