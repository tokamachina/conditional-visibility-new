import { game } from './settings';
// ↓ IMPORT SYSTEMS HERE ↓
import dnd5e from './systems/dnd5e';
import pf2 from './systems/pf2';
import pf1 from './systems/pf1';
import generic from './systems/generic';

// ↑ IMPORT SYSTEMS HERE ↑

/**
 * NOTE: YOUR PULL REQUEST WILL NOT BE ACCEPTED IF YOU DO NOT
 * FOLLOW THE CONVENTION IN THE D&D 5E SYSTEM FILE
 */
export const SYSTEMS = {
  get DATA() {
    return {
      // ↓ ADD SYSTEMS HERE ↓
      dnd5e,
      pf1,
      pf2,
      generic,
      // ↑ ADD SYSTEMS HERE ↑
    }?.[game.system.id];
  },
};
