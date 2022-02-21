import { error, i18n, log } from '../lib/lib';
import FoundryHelpers from './foundry-helpers';
import { canvas, game } from '../settings';
import Effect from './effect';
import EmbeddedCollection from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs';
import {
  ActiveEffectData,
  ActorData,
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs';
import { PropertiesToSource } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes';
import { ActiveEffectDataProperties } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/activeEffectData';

export default class EffectHandler {
  _customEffects: Effect[];
  moduleName: string;
  _foundryHelpers: FoundryHelpers;

  constructor(moduleName: string) {
    if (!game[moduleName]) {
      game[moduleName] = {};
    }
    if (!game[moduleName]?.effects) {
      game[moduleName].effects = {};
    }
    if (!game[moduleName].effects.customEffects) {
      game[moduleName].effects.customEffects = [];
    }
    this._customEffects = <Effect[]>game[moduleName].effects.customEffects || [];
    this.moduleName = moduleName;
    this._foundryHelpers = new FoundryHelpers();
  }

  /**
   * Toggles an effect on or off by name on an actor by UUID
   *
   * @param {string} effectName - name of the effect to toggle
   * @param {object} params - the effect parameters
   * @param {string} params.overlay - name of the effect to toggle
   * @param {string[]} params.uuids - UUIDS of the actors to toggle the effect on
   */
  async toggleEffect(effectName, { overlay, uuids }) {
    for (const uuid of uuids) {
      if (await this.hasEffectApplied(effectName, uuid)) {
        await this.removeEffect({ effectName, uuid });
      } else {
        const actor = <Actor>await this._foundryHelpers.getActorByUuid(uuid);
        const origin = `Actor.${actor.id}`;
        await this.addEffect({ effectName, effectData: null, uuid, origin, overlay });
      }
    }
  }

  /**
   * Toggles an effect on or off by name on an actor by UUID
   *
   * @param {string} effectName - name of the effect to toggle
   * @param {object} params - the effect parameters
   * @param {string} params.overlay - name of the effect to toggle
   * @param {string[]} params.uuids - UUIDS of the actors to toggle the effect on
   */
  async toggleEffectArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('toggleEffectArr | inAttributes must be of type array');
    }
    const [effectName, params] = inAttributes;
    return this.toggleEffect(effectName, params);
  }

  /**
   * Checks to see if any of the current active effects applied to the actor
   * with the given UUID match the effect name and are a convenient effect
   *
   * @param {string} effectName - the name of the effect to check
   * @param {string} uuid - the uuid of the actor to see if the effect is
   * applied to
   * @returns {boolean} true if the effect is applied, false otherwise
   */
  async hasEffectApplied(effectName: string, uuid: string) {
    const actor = await this._foundryHelpers.getActorByUuid(uuid);
    const regex = /[^A-Za-z0-9]/g;
    const isApplied = actor?.data?.effects?.some(
      // (activeEffect) => <boolean>activeEffect?.data?.flags?.isConvenient && <string>activeEffect?.data?.label == effectName,
      (activeEffect) => {
        if (
          (activeEffect?.data?.label.toLowerCase() == effectName.toLowerCase() ||
            activeEffect?.data?.label.replace(regex, '').toLowerCase().startsWith(effectName.replace(regex, '').toLowerCase()))
          && !activeEffect?.data?.disabled
        ) {
          return true;
        } else {
          return false;
        }
      },
    );
    return isApplied;
  }

  /**
   * Checks to see if any of the current active effects applied to the actor
   * with the given UUID match the effect name and are a convenient effect
   *
   * @param {string} effectName - the name of the effect to check
   * @param {string} uuid - the uuid of the actor to see if the effect is
   * applied to
   * @returns {boolean} true if the effect is applied, false otherwise
   */
  async hasEffectAppliedArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('removeEffectArr | inAttributes must be of type array');
    }
    const [effectName, uuid] = inAttributes;
    return this.hasEffectApplied(effectName, uuid);
  }

  /**
   * Removes the effect with the provided name from an actor matching the
   * provided UUID
   *
   * @param {object} params - the effect parameters
   * @param {string} params.effectName - the name of the effect to remove
   * @param {string} params.uuid - the uuid of the actor to remove the effect from
   */
  async removeEffect({ effectName, uuid }) {
    const actor = await this._foundryHelpers.getActorByUuid(uuid);
    const effectToRemove = actor.data.effects.find(
      //(activeEffect) => <boolean>activeEffect?.data?.flags?.isConvenient && activeEffect?.data?.label == effectName,
      (activeEffect) => activeEffect?.data?.label == effectName,
    );

    if (!effectToRemove) return;

    await actor.deleteEmbeddedDocuments('ActiveEffect', [<string>effectToRemove.id]);
    log(`Removed effect ${effectName} from ${actor.name} - ${actor.id}`);
  }

  /**
   * Removes the effect with the provided name from an actor matching the
   * provided UUID
   *
   * @param {string} effectName - the name of the effect to remove
   * @param {string} uuid - the uuid of the actor to remove the effect from
   */
  async removeEffectArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('removeEffectArr | inAttributes must be of type array');
    }
    const [params] = inAttributes;
    return this.removeEffect(params);
  }

  /**
   * Adds the effect with the provided name to an actor matching the provided
   * UUID
   *
   * @param {object} params - the effect parameters
   * @param {string} params.effectName - the name of the effect to add
   * @param {object} params.effectData - the effect data to add if effectName is not provided
   * @param {string} params.uuid - the uuid of the actor to add the effect to
   * @param {string} params.origin - the origin of the effect
   * @param {boolean} params.overlay - if the effect is an overlay or not
   */
  async addEffect({ effectName, effectData, uuid, origin, overlay }) {
    const actor = await this._foundryHelpers.getActorByUuid(uuid);
    let effect = <Effect>this._findEffectByName(effectName, actor);

    if (!effect && effectData) {
      effect = new Effect(effectData);
    }

    if (!origin) {
      origin = `Actor.${actor.id}`;
    }
    effect.origin = origin;
    effect.overlay = overlay;

    // let effect = game.dfreds.effectInterface.findEffectByName(effectName);

    // if (!effect && effectData) {
    //   effect = new Effect(effectData);
    // }

    // const actor = await this._foundryHelpers.getActorByUuid(uuid);

    // if (effect.name.startsWith('Exhaustion')) {
    //   await this._removeAllExhaustionEffects(uuid);
    // }

    // if (effect.isDynamic) {
    //   await this._dynamicEffectsAdder.addDynamicEffects(effect, actor);
    // }

    this._handleIntegrations(effect);

    const activeEffectData = effect.convertToActiveEffectData({
      origin,
      overlay,
    });
    await actor.createEmbeddedDocuments('ActiveEffect', [activeEffectData]);

    log(`Added effect ${effect.name} to ${actor.name} - ${actor.id}`);
  }

  // async _removeAllExhaustionEffects(uuid) {
  //   await this.removeEffect({ effectName: 'Exhaustion 1', uuid });
  //   await this.removeEffect({ effectName: 'Exhaustion 2', uuid });
  //   await this.removeEffect({ effectName: 'Exhaustion 3', uuid });
  //   await this.removeEffect({ effectName: 'Exhaustion 4', uuid });
  //   await this.removeEffect({ effectName: 'Exhaustion 5', uuid });
  // }

  /**
   * Adds the effect with the provided name to an actor matching the provided
   * UUID
   *
   * @param {object} params - the effect parameters
   * @param {string} params.effectName - the name of the effect to add
   * @param {string} params.uuid - the uuid of the actor to add the effect to
   * @param {string} params.origin - the origin of the effect
   * @param {boolean} params.overlay - if the effect is an overlay or not
   */
  async addEffectArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('addEffectArr | inAttributes must be of type array');
    }
    const [params] = inAttributes;
    return this.addEffect(params);
  }

  _handleIntegrations(effect) {
    if (effect.atlChanges.length > 0) {
      this._addAtlChangesToEffect(effect);
    }

    if (effect.tokenMagicChanges.length > 0) {
      this._addTokenMagicChangesToEffect(effect);
    }
  }

  _addAtlChangesToEffect(effect: Effect) {
    effect.changes.push(...effect.atlChanges);
  }

  _addTokenMagicChangesToEffect(effect: Effect) {
    effect.changes.push(...effect.tokenMagicChanges);
  }

  // ============================================================
  // Additional feature for retrocompatibility
  // ============================================================

  /**
   * Searches through the list of available effects and returns one matching the
   * effect name. Prioritizes finding custom effects first.
   *
   * @param {string} effectName - the effect name to search for
   * @returns {Effect} the found effect
   */
  _findEffectByName(effectName: string, actor: Actor) {
    if (!effectName) {
      return null;
    }
    // const effect = this._customEffectsHandler
    //   .getCustomEffects()
    //   .find((effect) => effect.name == effectName);

    // if (effect) return effect;

    // return game.dfreds.effects.all.find((effect) => effect.name == effectName);
    let effect = <Effect>this._customEffects.find((effect: Effect) => effect.name == effectName);
    if (!effect) {
      const actorEffects = <EmbeddedCollection<typeof ActiveEffect, ActorData>>actor?.data.effects;
      // regex expression to match all non-alphanumeric characters in string
      const regex = /[^A-Za-z0-9]/g;
      for (const effectEntity of actorEffects) {
        const effectNameToSet = effectEntity.name ? effectEntity.name : effectEntity.data.label;
        if (!effectNameToSet) {
          continue;
        }
        // use replace() method to match and remove all the non-alphanumeric characters
        if (effectNameToSet.replace(regex, '').toLowerCase().startsWith(effectName.replace(regex, '').toLowerCase())) {
          effect = Effect.convertActiveEffectToEffect(effectEntity);
        }
      }
    }
    return effect;
  }

  // convertToEffectClass(effect: ActiveEffect): Effect {
  //   const atlChanges = effect.data.changes.filter((changes) => changes.key.startsWith('ATL'));
  //   const tokenMagicChanges = effect.data.changes.filter((changes) => changes.key === 'macro.tokenMagic');
  //   const changes = effect.data.changes.filter(
  //     (change) => !change.key.startsWith('ATL') && change.key !== 'macro.tokenMagic',
  //   );

  //   return new Effect({
  //     customId: <string>effect.id,
  //     name: effect.data.label,
  //     description: <string>effect.data.flags.customEffectDescription,
  //     icon: <string>effect.data.icon,
  //     tint: <string>effect.data.tint,
  //     seconds: effect.data.duration.seconds,
  //     rounds: effect.data.duration.rounds,
  //     turns: effect.data.duration.turns,
  //     flags: effect.data.flags,
  //     changes,
  //     atlChanges,
  //     tokenMagicChanges,
  //   });
  // }

  // ====================================================================
  // ACTOR MANAGEMENT
  // ====================================================================

  /**
   * Searches through the list of available effects and returns one matching the
   * effect name. Prioritizes finding custom effects first.
   *
   * @param {string} effectName - the effect name to search for
   * @returns {Effect} the found effect
   */
  async findEffectByNameOnActor(effectName: string, uuid: string): Promise<ActiveEffect | null> {
    if (effectName) {
      effectName = i18n(effectName);
    }
    const actor = <Actor>await this._foundryHelpers.getActorByUuid(uuid);
    // return await (<ActiveEffect>(
    //   actor?.data?.effects?.find((activeEffect) => <string>activeEffect?.data?.label == effectName)
    // ));
    let effect: ActiveEffect | null = null;
    if (!effectName) {
      return effect;
    }
    const actorEffects = <EmbeddedCollection<typeof ActiveEffect, ActorData>>actor?.data.effects;
    // regex expression to match all non-alphanumeric characters in string
    const regex = /[^A-Za-z0-9]/g;
    for (const effectEntity of actorEffects) {
      const effectNameToSet = effectEntity.name ? effectEntity.name : effectEntity.data.label;
      if (!effectNameToSet) {
        continue;
      }
      // use replace() method to match and remove all the non-alphanumeric characters
      if (effectNameToSet.replace(regex, '').toLowerCase().startsWith(effectName.replace(regex, '').toLowerCase())) {
        // effect = this.convertToEffectClass(effectEntity);
        effect = effectEntity;
        break;
      }
    }
    return effect;
  }

  /**
   * Searches through the list of available effects and returns one matching the
   * effect name. Prioritizes finding custom effects first.
   *
   * @param {string} effectName - the effect name to search for
   * @returns {Effect} the found effect
   */
  async findEffectByNameOnActorArr(...inAttributes: any[]): Promise<ActiveEffect | null> {
    if (!Array.isArray(inAttributes)) {
      throw error('findEffectByNameOnActorArr | inAttributes must be of type array');
    }
    const [effectName, uuid] = inAttributes;
    return this.findEffectByNameOnActor(effectName, uuid);
  }

  /**
   * Checks to see if any of the current active effects applied to the actor
   * with the given UUID match the effect name and are a convenient effect
   *
   * @param {string} effectName - the name of the effect to check
   * @param {string} uuid - the uuid of the actor to see if the effect is applied to
   * @param {string} includeDisabled - if true include the applied disabled effect
   * @returns {boolean} true if the effect is applied, false otherwise
   */
  async hasEffectAppliedOnActor(effectName, uuid, includeDisabled = false): Promise<boolean> {
    if (effectName) {
      effectName = i18n(effectName);
    }
    const actor = await this._foundryHelpers.getActorByUuid(uuid);
    const actorEffects = <EmbeddedCollection<typeof ActiveEffect, ActorData>>actor?.data.effects;
    const regex = /[^A-Za-z0-9]/g;
    const isApplied = actorEffects.some(
      // (activeEffect) => <boolean>activeEffect?.data?.flags?.isConvenient && <string>activeEffect?.data?.label == effectName,
      (activeEffect) => {
        if(includeDisabled){
          if (
            (activeEffect?.data?.label.replace(regex, '').toLowerCase() == effectName.replace(regex, '').toLowerCase() ||
              activeEffect?.data?.label.replace(regex, '').toLowerCase().startsWith(effectName.replace(regex, '').toLowerCase()))
            // && !activeEffect?.data?.disabled
          ) {
            return true;
          } else {
            return false;
          }
        }else{
          if (
            (activeEffect?.data?.label.replace(regex, '').toLowerCase() == effectName.replace(regex, '').toLowerCase() ||
              activeEffect?.data?.label.replace(regex, '').toLowerCase().startsWith(effectName.replace(regex, '').toLowerCase()))
            && !activeEffect?.data?.disabled
          ) {
            return true;
          } else {
            return false;
          }
        }
      },
    );
    return isApplied;
  }

  /**
   * Checks to see if any of the current active effects applied to the actor
   * with the given UUID match the effect name and are a convenient effect
   *
   * @param {string} effectName - the name of the effect to check
   * @param {string} uuid - the uuid of the actor to see if the effect is applied to
   * @param {string} includeDisabled - if true include the applied disabled effect
   * @returns {boolean} true if the effect is applied, false otherwise
   */
  async hasEffectAppliedOnActorArr(...inAttributes: any[]): Promise<boolean> {
    if (!Array.isArray(inAttributes)) {
      throw error('hasEffectAppliedOnActorArr | inAttributes must be of type array');
    }
    const [effectName, uuid, includeDisabled] = inAttributes;
    return this.hasEffectAppliedOnActor(effectName, uuid, includeDisabled);
  }

  /**
   * Checks to see if any of the current active effects applied to the actor
   * with the given UUID match the effect name and are a convenient effect
   *
   * @param {string} effectId - the id of the effect to check
   * @param {string} uuid - the uuid of the actor to see if the effect is applied to
   * @param {string} includeDisabled - if true include the applied disabled effect
   * @returns {boolean} true if the effect is applied, false otherwise
   */
  async hasEffectAppliedFromIdOnActor(effectId, uuid, includeDisabled= false): Promise<boolean> {
    const actor = await this._foundryHelpers.getActorByUuid(uuid);
    const actorEffects = <EmbeddedCollection<typeof ActiveEffect, ActorData>>actor?.data.effects;
    const isApplied = actorEffects.some(
      // (activeEffect) => <boolean>activeEffect?.data?.flags?.isConvenient && <string>activeEffect?.data?._id == effectId,
      (activeEffect) => {
        if(includeDisabled){
          if(<string>activeEffect?.id == effectId){
            return true;
          }else{
            return false;
          }
        }else{
          if(<string>activeEffect?.id == effectId && !activeEffect.data.disabled){
            return true;
          }else{
            return false;
          }
        }
      }
    );
    return isApplied;
  }

  /**
   * Checks to see if any of the current active effects applied to the actor
   * with the given UUID match the effect name and are a convenient effect
   *
   * @param {string} effectId - the id of the effect to check
   * @param {string} uuid - the uuid of the actor to see if the effect is applied to
   * @param {string} includeDisabled - if true include the applied disabled effect
   * @returns {boolean} true if the effect is applied, false otherwise
   */
  async hasEffectAppliedFromIdOnActorArr(...inAttributes: any[]): Promise<boolean> {
    if (!Array.isArray(inAttributes)) {
      throw error('hasEffectAppliedFromIdOnActorArr | inAttributes must be of type array');
    }
    const [effectId, uuid, includeDisabled] = inAttributes;
    return this.hasEffectAppliedFromIdOnActor(effectId, uuid, includeDisabled);
  }

  /**
   * Removes the effect with the provided name from an actor matching the
   * provided UUID
   *
   * @param {string} effectName - the name of the effect to remove
   * @param {string} uuid - the uuid of the actor to remove the effect from
   */
  async removeEffectOnActor(effectName, uuid) {
    if (effectName) {
      effectName = i18n(effectName);
    }
    const actor = <Actor>await this._foundryHelpers.getActorByUuid(uuid);
    const actorEffects = <EmbeddedCollection<typeof ActiveEffect, ActorData>>actor?.data.effects;
    const effectToRemove = <ActiveEffect>actorEffects.find(
      // (activeEffect) => <boolean>activeEffect?.data?.flags?.isConvenient && <string>activeEffect?.data?.label == effectName,
      (activeEffect) => <string>activeEffect?.data?.label == effectName,
    );

    if (!effectToRemove) return;

    // actor.deleteEmbeddedDocuments('ActiveEffect', [<string>effectToRemove.id]);
    // Why i need this ??? for avoid the double AE
    await effectToRemove.update({ disabled: true });
    await effectToRemove.delete();
    log(`Removed effect ${effectName} from ${actor.name} - ${actor.id}`);
  }

  /**
   * Removes the effect with the provided name from an actor matching the
   * provided UUID
   *
   * @param {string} effectName - the name of the effect to remove
   * @param {string} uuid - the uuid of the actor to remove the effect from
   */
  async removeEffectOnActorArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('removeEffectOnActorArr | inAttributes must be of type array');
    }
    const [effectName, uuid] = inAttributes;
    return this.removeEffectOnActor(effectName, uuid);
  }

  /**
   * Removes the effect with the provided name from an actor matching the
   * provided UUID
   *
   * @param {string} effectId - the id of the effect to remove
   * @param {string} uuid - the uuid of the actor to remove the effect from
   */
  async removeEffectFromIdOnActor(effectId, uuid) {
    if (effectId) {
      const actor = <Actor>await this._foundryHelpers.getActorByUuid(uuid);
      const actorEffects = <EmbeddedCollection<typeof ActiveEffect, ActorData>>actor?.data.effects;
      //actor.deleteEmbeddedDocuments('ActiveEffect', [<string>effectToRemoveId]);
      // Why i need this ??? for avoid the double AE
      const effectToRemove = <ActiveEffect>actorEffects.find(
        //(activeEffect) => <boolean>activeEffect?.data?.flags?.isConvenient && <string>activeEffect.id == effectId,
        (activeEffect) => <string>activeEffect.id == effectId,
      );
      await effectToRemove.update({ disabled: true });
      await effectToRemove.delete();
      log(`Removed effect ${effectToRemove?.data?.label} from ${actor.name} - ${actor.id}`);
    }
  }

  /**
   * Removes the effect with the provided name from an actor matching the
   * provided UUID
   *
   * @param {string} effectId - the id of the effect to remove
   * @param {string} uuid - the uuid of the actor to remove the effect from
   */
  async removeEffectFromIdOnActorArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('removeEffectFromIdOnActor | inAttributes must be of type array');
    }
    const [effectId, uuid] = inAttributes;
    return this.removeEffectFromIdOnActor(effectId, uuid);
  }

  /**
   * Adds the effect with the provided name to an actor matching the provided
   * UUID
   *
   * @param {object} params - the effect parameters
   * @param {string} params.effectName - the name of the effect to add
   * @param {string} params.uuid - the uuid of the actor to add the effect to
   * @param {string} params.origin - the origin of the effect
   * @param {boolean} params.overlay - if the effect is an overlay or not
   */
  async addEffectOnActor(effectName, uuid, origin, overlay, effect: Effect | null) {
    if (effectName) {
      effectName = i18n(effectName);
    }
    if (effect) {
      const actor = <Actor>await this._foundryHelpers.getActorByUuid(uuid);
      if (!origin) {
        origin = `Actor.${actor.id}`;
      }
      const activeEffectData = effect.convertToActiveEffectData({
        origin,
        overlay,
      });
      actor.createEmbeddedDocuments('ActiveEffect', [activeEffectData]);
      log(`Added effect ${effect.name ? effect.name : effectName} to ${actor.name} - ${actor.id}`);
    }
  }

  /**
   * Adds the effect with the provided name to an actor matching the provided
   * UUID
   *
   * @param {string} effectName - the name of the effect to add
   * @param {string} uuid - the uuid of the actor to add the effect to
   */
  async addEffectOnActorArr(...inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw error('addEffectOnActorArr | inAttributes must be of type array');
    }
    const [effectName, uuid, origin, overlay, effect] = inAttributes;
    return this.addEffectOnActor(effectName, uuid, origin, overlay, effect);
  }

  /**
   * @href https://github.com/ElfFriend-DnD/foundryvtt-temp-effects-as-statuses/blob/main/scripts/temp-effects-as-statuses.js
   */
  async toggleEffectFromIdOnActor(
    effectId: string,
    uuid: string,
    alwaysDelete: boolean,
    forceEnabled?: boolean,
    forceDisabled?: boolean,
  ) {
    const actor = <Actor>await this._foundryHelpers.getActorByUuid(uuid);
    const actorEffects = <EmbeddedCollection<typeof ActiveEffect, ActorData>>actor?.data.effects;
    const effect = <ActiveEffect>actorEffects.find((entity: ActiveEffect) => {
      return <string>entity.id == effectId;
    });
    // nuke it if it has a statusId
    // brittle assumption
    // provides an option to always do this
    if (effect.getFlag('core', 'statusId') || alwaysDelete) {
      const deleted = await effect.delete();
      return !!deleted;
    }
    let updated;
    if (forceEnabled && effect.data.disabled) {
      updated = await effect.update({
        disabled: false,
      });
    } else if (forceDisabled && !effect.data.disabled) {
      updated = await effect.update({
        disabled: true,
      });
    } else {
      // otherwise toggle its disabled status
      updated = await effect.update({
        disabled: !effect.data.disabled,
      });
    }

    return !!updated;
  }

  async toggleEffectFromIdOnActorArr(...inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw error('addEffectOnActorArr | inAttributes must be of type array');
    }
    const [effectId, uuid, alwaysDelete, forceEnabled, forceDisabled] = inAttributes;
    return this.toggleEffectFromIdOnActor(effectId, uuid, alwaysDelete, forceEnabled, forceDisabled);
  }

  /**
   * Adds the effect with the provided name to an actor matching the provided
   * UUID
   *
   * @param {string} uuid - the uuid of the actor to add the effect to
   * @param {string} activeEffectData - the name of the effect to add
   */
  async addActiveEffectOnActor(uuid, activeEffectData: ActiveEffectData) {
    if (activeEffectData) {
      const actor = <Actor>await this._foundryHelpers.getActorByUuid(uuid);
      activeEffectData.origin = `Actor.${actor.id}`;
      actor.createEmbeddedDocuments('ActiveEffect', [<Record<string, any>>activeEffectData]);
      log(`Added effect ${activeEffectData.label} to ${actor.name} - ${actor.id}`);
    }
  }

  async addActiveEffectOnActorArr(...inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw error('addActiveEffectOnActorArr | inAttributes must be of type array');
    }
    const [uuid, activeEffectData] = inAttributes;
    return this.addActiveEffectOnActor(uuid, activeEffectData);
  }

  // ====================================================================
  // TOKEN MANAGEMENT
  // ====================================================================

  /**
   * Searches through the list of available effects and returns one matching the
   * effect name. Prioritizes finding custom effects first.
   *
   * @param {string} effectName - the effect name to search for
   * @returns {Effect} the found effect
   */
  async findEffectByNameOnToken(effectName: string, uuid: string): Promise<ActiveEffect | null> {
    if (effectName) {
      effectName = i18n(effectName);
    }
    const token = <Token>await this._foundryHelpers.getTokenByUuid(uuid);
    const tokenEffects = <PropertiesToSource<ActiveEffectDataProperties>[]>token?.data.actorData.effects;
    let effect: ActiveEffect | null = null;
    if (!effectName) {
      return effect;
    }
    // regex expression to match all non-alphanumeric characters in string
    const regex = /[^A-Za-z0-9]/g;
    for (const effectEntity of tokenEffects) {
      const effectNameToSet = effectEntity.label;
      if (!effectNameToSet) {
        continue;
      }
      // use replace() method to match and remove all the non-alphanumeric characters
      if (effectNameToSet.replace(regex, '').toLowerCase().startsWith(effectName.replace(regex, '').toLowerCase())) {
        effect = Effect.convertActiveEffectDataPropertiesToActiveEffect(effectEntity);
        break;
      }
    }
    return effect;
  }

  /**
   * Searches through the list of available effects and returns one matching the
   * effect name. Prioritizes finding custom effects first.
   *
   * @param {string} effectName - the effect name to search for
   * @returns {Effect} the found effect
   */
  async findEffectByNameOnTokenArr(...inAttributes: any[]): Promise<ActiveEffect | null> {
    if (!Array.isArray(inAttributes)) {
      throw error('findEffectByNameOnTokenArr | inAttributes must be of type array');
    }
    const [effectName, uuid] = inAttributes;
    return this.findEffectByNameOnToken(effectName, uuid);
  }

  /**
   * Checks to see if any of the current active effects applied to the token
   * with the given UUID match the effect name and are a convenient effect
   *
   * @param {string} effectName - the name of the effect to check
   * @param {string} uuid - the uuid of the token to see if the effect is applied to
   * @param {string} includeDisabled - if true include the applied disabled effect
   * @returns {boolean} true if the effect is applied, false otherwise
   */
  async hasEffectAppliedOnToken(effectName, uuid, includeDisabled=false): Promise<boolean> {
    if (effectName) {
      effectName = i18n(effectName);
    }
    const token = await this._foundryHelpers.getTokenByUuid(uuid);
    const tokenEffects = <PropertiesToSource<ActiveEffectDataProperties>[]>token?.data.actorData.effects;
    const regex = /[^A-Za-z0-9]/g;
    const isApplied = tokenEffects.some(
      // (activeEffect) => <boolean>activeEffect?.data?.flags?.isConvenient && <string>activeEffect?.data?.label == effectName,
      (activeEffect) => {
        if(includeDisabled){
          if (
            (activeEffect?.label.replace(regex, '').toLowerCase() == effectName.replace(regex, '').toLowerCase() ||
              activeEffect?.label.replace(regex, '').toLowerCase().startsWith(effectName.replace(regex, '').toLowerCase()))
            // && !activeEffect.disabled
          ) {
            return true;
          } else {
            return false;
          }
        }else{
          if (
            (activeEffect?.label.replace(regex, '').toLowerCase() == effectName.replace(regex, '').toLowerCase() ||
              activeEffect?.label.replace(regex, '').toLowerCase().startsWith(effectName.replace(regex, '').toLowerCase()))
              && !activeEffect.disabled
          ) {
            return true;
          } else {
            return false;
          }
        }
      },
    );
    return isApplied;
  }

  /**
   * Checks to see if any of the current active effects applied to the token
   * with the given UUID match the effect name and are a convenient effect
   *
   * @param {string} effectName - the name of the effect to check
   * @param {string} uuid - the uuid of the token to see if the effect is applied to
   * @param {string} includeDisabled - if true include the applied disabled effect
   * @returns {boolean} true if the effect is applied, false otherwise
   */
  async hasEffectAppliedOnTokenArr(...inAttributes: any[]): Promise<boolean> {
    if (!Array.isArray(inAttributes)) {
      throw error('hasEffectAppliedOnTokenArr | inAttributes must be of type array');
    }
    const [effectName, uuid, includeDisabled] = inAttributes;
    return this.hasEffectAppliedOnToken(effectName, uuid, includeDisabled);
  }

  /**
   * Checks to see if any of the current active effects applied to the token
   * with the given UUID match the effect name and are a convenient effect
   *
   * @param {string} effectId - the id of the effect to check
   * @param {string} uuid - the uuid of the token to see if the effect is applied to
   * @param {string} includeDisabled - if true include the applied disabled effect
   * @returns {boolean} true if the effect is applied, false otherwise
   */
  async hasEffectAppliedFromIdOnToken(effectId, uuid, includeDisabled = false): Promise<boolean> {
    const token = await this._foundryHelpers.getTokenByUuid(uuid);
    const tokenEffects = <PropertiesToSource<ActiveEffectDataProperties>[]>token?.data.actorData.effects;
    const isApplied = tokenEffects.some(
      // (activeEffect) => <boolean>activeEffect?.data?.flags?.isConvenient && <string>activeEffect?.data?.label == effectName,
      (activeEffect) => {
        if(includeDisabled){
          if (
            activeEffect._id == effectId
            // && !activeEffect.disabled
          ) {
            return true;
          } else {
            return false;
          }
        } else {
          if (
            activeEffect._id == effectId
            && !activeEffect.disabled
          ) {
            return true;
          } else {
            return false;
          }
        }
      },
    );
    return isApplied;
  }

  /**
   * Checks to see if any of the current active effects applied to the token
   * with the given UUID match the effect name and are a convenient effect
   *
   * @param {string} effectId - the id of the effect to check
   * @param {string} uuid - the uuid of the token to see if the effect is applied to
   * @param {string} includeDisabled - if true include the applied disabled effect
   * @returns {boolean} true if the effect is applied, false otherwise
   */
  async hasEffectAppliedFromIdOnTokenArr(...inAttributes: any[]): Promise<boolean> {
    if (!Array.isArray(inAttributes)) {
      throw error('hasEffectAppliedFromIdOnTokenArr | inAttributes must be of type array');
    }
    const [effectId, uuid, includeDisabled] = inAttributes;
    return this.hasEffectAppliedFromIdOnToken(effectId, uuid, includeDisabled);
  }

  /**
   * Removes the effect with the provided name from an token matching the
   * provided UUID
   *
   * @param {string} effectName - the name of the effect to remove
   * @param {string} uuid - the uuid of the token to remove the effect from
   */
  async removeEffectOnToken(effectName, uuid) {
    if (effectName) {
      effectName = i18n(effectName);
    }
    const token = await this._foundryHelpers.getTokenByUuid(uuid);
    const tokenEffects = <PropertiesToSource<ActiveEffectDataProperties>[]>token?.data.actorData.effects;
    const effectsToRemove = <PropertiesToSource<ActiveEffectDataProperties>[]>tokenEffects.map(
      // (activeEffect) => <boolean>activeEffect?.data?.flags?.isConvenient && <string>activeEffect?.data?.label == effectName,
      (activeEffect) => {
        if(<string>activeEffect?.label == effectName){
          return activeEffect;
        }
      }
    );

    if (!effectsToRemove) return;

    const effectToRemove = <ActiveEffect>await fromUuid(<string>effectsToRemove[0]._id);

    if (!effectToRemove) return;

    // token.deleteEmbeddedDocuments('ActiveEffect', [<string>effectToRemove.id]);
    // Why i need this ??? for avoid the double AE
    await effectToRemove.update({ disabled: true });
    await effectToRemove.delete();
    log(`Removed effect ${effectName} from ${token.name} - ${token.id}`);
  }

  /**
   * Removes the effect with the provided name from an token matching the
   * provided UUID
   *
   * @param {string} effectName - the name of the effect to remove
   * @param {string} uuid - the uuid of the token to remove the effect from
   */
  async removeEffectOnTokenArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('removeEffectOnTokenArr | inAttributes must be of type array');
    }
    const [effectName, uuid] = inAttributes;
    return this.removeEffectOnToken(effectName, uuid);
  }

  /**
   * Removes the effect with the provided name from an token matching the
   * provided UUID
   *
   * @param {string} effectId - the id of the effect to remove
   * @param {string} uuid - the uuid of the token to remove the effect from
   */
  async removeEffectFromIdOnToken(effectId, uuid) {
    if (effectId) {
      const token = <Token>await this._foundryHelpers.getTokenByUuid(uuid);
      const tokenEffects = <PropertiesToSource<ActiveEffectDataProperties>[]>token?.data.actorData.effects;
      //token.deleteEmbeddedDocuments('ActiveEffect', [<string>effectToRemoveId]);
      // Why i need this ??? for avoid the double AE
      const effectsToRemove = <PropertiesToSource<ActiveEffectDataProperties>[]>tokenEffects.map(
        //(activeEffect) => <boolean>activeEffect?.data?.flags?.isConvenient && <string>activeEffect.id == effectId,
        (activeEffect) => {
          if(<string>activeEffect?._id == effectId){
            return activeEffect;
          }
        }
      );

      if (!effectsToRemove) return;

      const effectToRemove = <ActiveEffect>await fromUuid(<string>effectsToRemove[0]._id);

      if (!effectToRemove) return;

      await effectToRemove.update({ disabled: true });
      await effectToRemove.delete();
      log(`Removed effect ${effectToRemove?.data?.label} from ${token.name} - ${token.id}`);
    }
  }

  /**
   * Removes the effect with the provided name from an token matching the
   * provided UUID
   *
   * @param {string} effectId - the id of the effect to remove
   * @param {string} uuid - the uuid of the token to remove the effect from
   */
  async removeEffectFromIdOnTokenArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('removeEffectFromIdOnToken | inAttributes must be of type array');
    }
    const [effectId, uuid] = inAttributes;
    return this.removeEffectFromIdOnToken(effectId, uuid);
  }

  /**
   * Adds the effect with the provided name to an token matching the provided
   * UUID
   *
   * @param {object} params - the effect parameters
   * @param {string} params.effectName - the name of the effect to add
   * @param {string} params.uuid - the uuid of the token to add the effect to
   * @param {string} params.origin - the origin of the effect
   * @param {boolean} params.overlay - if the effect is an overlay or not
   */
  async addEffectOnToken(effectName, uuid, origin, overlay, effect: Effect | null) {
    if (effectName) {
      effectName = i18n(effectName);
    }
    if (effect) {
      const token = <Token>await this._foundryHelpers.getTokenByUuid(uuid);
      if (!origin) {
        origin = `Token.${token.id}`;
      }
      const activeEffectData = effect.convertToActiveEffectData({
        origin,
        overlay,
      });
      token.document.createEmbeddedDocuments('ActiveEffect', [activeEffectData]);
      log(`Added effect ${effect.name ? effect.name : effectName} to ${token.name} - ${token.id}`);
    }
  }

  /**
   * Adds the effect with the provided name to an token matching the provided
   * UUID
   *
   * @param {string} effectName - the name of the effect to add
   * @param {string} uuid - the uuid of the token to add the effect to
   */
  async addEffectOnTokenArr(...inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw error('addEffectOnTokenArr | inAttributes must be of type array');
    }
    const [effectName, uuid, origin, overlay, effect] = inAttributes;
    return this.addEffectOnToken(effectName, uuid, origin, overlay, effect);
  }

  /**
   * @href https://github.com/ElfFriend-DnD/foundryvtt-temp-effects-as-statuses/blob/main/scripts/temp-effects-as-statuses.js
   */
  async toggleEffectFromIdOnToken(
    effectId: string,
    uuid: string,
    alwaysDelete: boolean,
    forceEnabled?: boolean,
    forceDisabled?: boolean,
  ) {
    const token = <Token>await this._foundryHelpers.getTokenByUuid(uuid);
    const tokenEffects = <PropertiesToSource<ActiveEffectDataProperties>[]>token?.data.actorData.effects;
    // const effect = <ActiveEffect>tokenEffects.find((entity: ActiveEffect) => {
    //   return <string>entity.id == effectId;
    // });
    const effects = <PropertiesToSource<ActiveEffectDataProperties>[]>tokenEffects.map(
      //(activeEffect) => <boolean>activeEffect?.data?.flags?.isConvenient && <string>activeEffect.id == effectId,
      (activeEffect) => {
        if(<string>activeEffect?._id == effectId){
          return activeEffect;
        }
      }
    );

    if (!effects) return;

    const effect = <ActiveEffect>await fromUuid(<string>effects[0]._id);

    if (!effect) return;
    // nuke it if it has a statusId
    // brittle assumption
    // provides an option to always do this
    if (effect.getFlag('core', 'statusId') || alwaysDelete) {
      const deleted = await effect.delete();
      return !!deleted;
    }
    let updated;
    if (forceEnabled && effect.data.disabled) {
      updated = await effect.update({
        disabled: false,
      });
    } else if (forceDisabled && !effect.data.disabled) {
      updated = await effect.update({
        disabled: true,
      });
    } else {
      // otherwise toggle its disabled status
      updated = await effect.update({
        disabled: !effect.data.disabled,
      });
    }

    return !!updated;
  }

  async toggleEffectFromIdOnTokenArr(...inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw error('addEffectOnTokenArr | inAttributes must be of type array');
    }
    const [effectId, uuid, alwaysDelete, forceEnabled, forceDisabled] = inAttributes;
    return this.toggleEffectFromIdOnToken(effectId, uuid, alwaysDelete, forceEnabled, forceDisabled);
  }

  /**
   * Adds the effect with the provided name to an token matching the provided
   * UUID
   *
   * @param {string} uuid - the uuid of the token to add the effect to
   * @param {string} activeEffectData - the name of the effect to add
   */
  async addActiveEffectOnToken(uuid, activeEffectData: ActiveEffectData) {
    if (activeEffectData) {
      const token = <Token>await this._foundryHelpers.getTokenByUuid(uuid);
      activeEffectData.origin = `Token.${token.id}`;
      token.document.createEmbeddedDocuments('ActiveEffect', [<Record<string, any>>activeEffectData]);
      log(`Added effect ${activeEffectData.label} to ${token.name} - ${token.id}`);
    }
  }

  async addActiveEffectOnTokenArr(...inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw error('addActiveEffectOnTokenArr | inAttributes must be of type array');
    }
    const [uuid, activeEffectData] = inAttributes;
    return this.addActiveEffectOnToken(uuid, activeEffectData);
  }
}
