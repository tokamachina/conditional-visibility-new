import { error } from '../lib/lib';
import { canvas, game } from '../settings';
import Effect from './effect';

export default class EffectHandler {
  _customEffects: Effect[];
  moduleName: string;

  constructor(moduleName: string) {
    //@ts-ignore
    if (!game[moduleName].effects) {
      game[moduleName].effects = {};
    }
    if (!game[moduleName].effects.customEffects) {
      game[moduleName].effects.customEffects = [];
    }
    this._customEffects = <Effect[]>game[moduleName].effects.customEffects;
    this.moduleName = moduleName;
  }

  log(...args: any[]): void {
    console.log(`${this.moduleName} | `, ...args);
  }

  /**
   * Searches through the list of available effects and returns one matching the
   * effect name. Prioritizes finding custom effects first.
   *
   * @param {string} effectName - the effect name to search for
   * @returns {Effect} the found effect
   */
  findEffectByName(effectName): Effect {
    const effect = <Effect>this._customEffects.find((effect: Effect) => effect.name == effectName);

    return effect;
    // if (effect) return effect;
    // //@ts-ignore
    // return game[moduleName].effects.all.find((effect: Effect) => effect.name == effectName);
  }

  /**
   * Searches through the list of available effects and returns one matching the
   * effect name. Prioritizes finding custom effects first.
   *
   * @param {string} effectName - the effect name to search for
   * @returns {Effect} the found effect
   */
  findEffectByNameArr(inAttributes: any[]): Effect {
    if (!Array.isArray(inAttributes)) {
      throw error('findEffectByNameArr | inAttributes must be of type array');
    }
    const [effectName] = inAttributes;
    return this.findEffectByName(effectName);
  }

  /**
   * Toggles an effect on or off by name on an actor by UUID
   *
   * @param {string} effectName - name of the effect to toggle
   * @param {string[]} uuids - uuids to apply the effect to
   */
  async toggleEffect(effectName, ...uuids) {
    const effect = this.findEffectByName(effectName);

    for (const uuid of uuids) {
      if (await this.hasEffectApplied(effectName, uuid)) {
        await this.removeEffect(effect.name, uuid);
      } else {
        await this.addEffect(effect.name, uuid);
      }
    }
  }

  /**
   * Toggles an effect on or off by name on an actor by UUID
   *
   * @param {string} effectName - name of the effect to toggle
   * @param {string[]} uuids - uuids to apply the effect to
   */
  async toggleEffectArr(inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('toggleEffectArr | inAttributes must be of type array');
    }
    const [effectName, ...uuids] = inAttributes;
    return this.toggleEffect(effectName, ...uuids);
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
  async hasEffectApplied(effectName, uuid) {
    const actor = await this.getActorByUuid(uuid);
    return actor?.data?.effects?.some(
      (activeEffect) =>
        <boolean>activeEffect?.data?.flags?.isConvenient && <string>activeEffect?.data?.label == effectName,
    );
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
  async hasEffectAppliedArr(inAttributes: any[]) {
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
   * @param {string} effectName - the name of the effect to remove
   * @param {string} uuid - the uuid of the actor to remove the effect from
   */
  async removeEffect(effectName, uuid) {
    const actor = <Actor>await this.getActorByUuid(uuid);
    const effectToRemove = <any>(
      actor.data.effects.find(
        (activeEffect: ActiveEffect) =>
          <boolean>activeEffect?.data?.flags?.isConvenient && <string>activeEffect?.data?.label == effectName,
      )
    );

    if (effectToRemove) {
      await actor.deleteEmbeddedDocuments('ActiveEffect', [<string>effectToRemove.id]);
      this.log(`Removed effect ${effectName} from ${actor.name} - ${actor.id}`);
    }
  }

  /**
   * Removes the effect with the provided name from an actor matching the
   * provided UUID
   *
   * @param {string} effectName - the name of the effect to remove
   * @param {string} uuid - the uuid of the actor to remove the effect from
   */
  async removeEffectArr(inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('removeEffectArr | inAttributes must be of type array');
    }
    const [effectName, uuid] = inAttributes;
    return this.removeEffect(effectName, uuid);
  }

  /**
   * Adds the effect with the provided name to an actor matching the provided
   * UUID
   *
   * @param {string} effectName - the name of the effect to add
   * @param {string} uuid - the uuid of the actor to add the effect to
   */
  async addEffect(effectName: string, uuid: string, origin?: string) {
    const effect = this.findEffectByName(effectName);
    const actor = await this.getActorByUuid(uuid);

    if (!origin) {
      origin = `Actor.${actor.data._id}`;
    }

    // if (effect.name.startsWith('Exhaustion')) {
    //   await this._removeAllExhaustionEffects(uuid);
    // }

    // if (effect.isDynamic) {
    //   await this._dynamicEffectsAdder.addDynamicEffects(effect, actor);
    // }

    this._handleIntegrations(effect);

    const activeEffectData = effect.convertToActiveEffectData(origin);
    await actor.createEmbeddedDocuments('ActiveEffect', [activeEffectData]);

    this.log(`Added effect ${effect.name} to ${actor.name} - ${actor.id}`);
  }

  /**
   * Adds the effect with the provided name to an actor matching the provided
   * UUID
   *
   * @param {string} effectName - the name of the effect to add
   * @param {string} uuid - the uuid of the actor to add the effect to
   */
  async addEffectArr(inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('addEffectArr | inAttributes must be of type array');
    }
    const [effectName, uuid, origin] = inAttributes;
    return this.addEffect(effectName, uuid, origin);
  }

  _handleIntegrations(effect) {
    if (effect.atlChanges.length > 0) {
      this._addAtlChangesToEffect(effect);
    }

    if (effect.tokenMagicChanges.length > 0) {
      this._addTokenMagicChangesToEffect(effect);
    }
  }

  _addAtlChangesToEffect(effect) {
    effect.changes.push(...effect.atlChanges);
  }

  _addTokenMagicChangesToEffect(effect) {
    effect.changes.push(...effect.tokenMagicChanges);
  }

  // Additional

  convertToEffectClass(effect: ActiveEffect): Effect {
    const atlChanges = effect.data.changes.filter((changes) => changes.key.startsWith('ATL'));
    const tokenMagicChanges = effect.data.changes.filter((changes) => changes.key === 'macro.tokenMagic');
    const changes = effect.data.changes.filter(
      (change) => !change.key.startsWith('ATL') && change.key !== 'macro.tokenMagic',
    );

    return new Effect({
      customId: <string>effect.id,
      name: effect.data.label,
      description: <string>effect.data.flags.customEffectDescription,
      icon: <string>effect.data.icon,
      tint: <string>effect.data.tint,
      seconds: effect.data.duration.seconds,
      rounds: effect.data.duration.rounds,
      turns: effect.data.duration.turns,
      flags: effect.data.flags,
      changes,
      atlChanges,
      tokenMagicChanges,
    });
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
  async findEffectByNameOnActor(effectName: string, uuid: string): Promise<ActiveEffect> {
    const actor = <Actor>await this.getActorByUuid(uuid);
    return await (<ActiveEffect>(
      actor?.data?.effects?.find((activeEffect) => <string>activeEffect?.data?.label == effectName)
    ));
  }

  /**
   * Searches through the list of available effects and returns one matching the
   * effect name. Prioritizes finding custom effects first.
   *
   * @param {string} effectName - the effect name to search for
   * @returns {Effect} the found effect
   */
  async findEffectByNameOnActorArr(inAttributes: any[]): Promise<ActiveEffect> {
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
   * @param {string} uuid - the uuid of the actor to see if the effect is
   * applied to
   * @returns {boolean} true if the effect is applied, false otherwise
   */
  async hasEffectAppliedOnActor(effectName: string, uuid: string): Promise<boolean> {
    const actor = await this.getActorByUuid(uuid);
    return actor?.data?.effects?.some(
      (activeEffect) =>
        <boolean>activeEffect?.data?.flags?.isConvenient && <string>activeEffect?.data?.label == effectName,
    );
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
  async hasEffectAppliedOnActorArr(inAttributes: any[]): Promise<boolean> {
    if (!Array.isArray(inAttributes)) {
      throw error('hasEffectAppliedOnActorArr | inAttributes must be of type array');
    }
    const [effectName, uuid] = inAttributes;
    return this.hasEffectAppliedOnActor(effectName, uuid);
  }

  /**
   * Checks to see if any of the current active effects applied to the actor
   * with the given UUID match the effect name and are a convenient effect
   *
   * @param {string} effectId - the id of the effect to check
   * @param {string} uuid - the uuid of the actor to see if the effect is
   * applied to
   * @returns {boolean} true if the effect is applied, false otherwise
   */
  async hasEffectAppliedFromIdOnActor(effectId: string, uuid: string): Promise<boolean> {
    const actor = await this.getActorByUuid(uuid);
    return actor?.data?.effects?.some(
      (activeEffect) => <boolean>activeEffect?.data?.flags?.isConvenient && <string>activeEffect?.data?._id == effectId,
    );
  }

  /**
   * Checks to see if any of the current active effects applied to the actor
   * with the given UUID match the effect name and are a convenient effect
   *
   * @param {string} effectId - the id of the effect to check
   * @param {string} uuid - the uuid of the actor to see if the effect is
   * applied to
   * @returns {boolean} true if the effect is applied, false otherwise
   */
  async hasEffectAppliedFromIdOnActorArr(inAttributes: any[]): Promise<boolean> {
    if (!Array.isArray(inAttributes)) {
      throw error('hasEffectAppliedFromIdOnActorArr | inAttributes must be of type array');
    }
    const [effectId, uuid] = inAttributes;
    return this.hasEffectAppliedFromIdOnActor(effectId, uuid);
  }

  /**
   * Removes the effect with the provided name from an actor matching the
   * provided UUID
   *
   * @param {string} effectName - the name of the effect to remove
   * @param {string} uuid - the uuid of the actor to remove the effect from
   */
  async removeEffectOnActor(effectName: string, uuid: string) {
    const actor = <Actor>await this.getActorByUuid(uuid);
    const effectToRemove = <ActiveEffect>(
      actor.data.effects.find(
        (activeEffect) =>
          <boolean>activeEffect?.data?.flags?.isConvenient && <string>activeEffect?.data?.label == effectName,
      )
    );

    if (effectToRemove) {
      // actor.deleteEmbeddedDocuments('ActiveEffect', [<string>effectToRemove.id]);
      // Why i need this ??? for avoid the double AE
      await effectToRemove.update({ disabled: true });
      await effectToRemove.delete();
      this.log(`Removed effect ${effectName} from ${actor.name} - ${actor.id}`);
    }
  }

  /**
   * Removes the effect with the provided name from an actor matching the
   * provided UUID
   *
   * @param {string} effectName - the name of the effect to remove
   * @param {string} uuid - the uuid of the actor to remove the effect from
   */
  async removeEffectOnActorArr(inAttributes: any[]) {
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
  async removeEffectFromIdOnActor(effectToRemoveId: string, uuid: string) {
    if (effectToRemoveId) {
      const actor = <Actor>await this.getActorByUuid(uuid);
      //actor.deleteEmbeddedDocuments('ActiveEffect', [<string>effectToRemoveId]);
      // Why i need this ??? for avoid the double AE
      const effectToRemove = <ActiveEffect>(
        actor.data.effects.find(
          (activeEffect) =>
            <boolean>activeEffect?.data?.flags?.isConvenient && <string>activeEffect.id == effectToRemoveId,
        )
      );
      await effectToRemove.update({ disabled: true });
      await effectToRemove.delete();
      this.log(`Removed effect ${effectToRemove?.data?.label} from ${actor.name} - ${actor.id}`);
    }
  }

  /**
   * Removes the effect with the provided name from an actor matching the
   * provided UUID
   *
   * @param {string} effectId - the id of the effect to remove
   * @param {string} uuid - the uuid of the actor to remove the effect from
   */
  async removeEffectFromIdOnActorArr(inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('removeEffectFromIdOnActor | inAttributes must be of type array');
    }
    const [effectToRemoveId, uuid] = inAttributes;
    return this.removeEffectFromIdOnActor(effectToRemoveId, uuid);
  }

  /**
   * Adds the effect with the provided name to an actor matching the provided
   * UUID
   *
   * @param {string} effectName - the name of the effect to add
   * @param {string} uuid - the uuid of the actor to add the effect to
   */
  async addEffectOnActor(effectName: string, uuid: string, effect: Effect | null) {
    if (effect) {
      const actor = <Actor>await this.getActorByUuid(uuid);
      const origin = `Actor.${actor.data._id}`;
      const activeEffectData = effect.convertToActiveEffectData(origin);
      actor.createEmbeddedDocuments('ActiveEffect', [activeEffectData]);
      this.log(`Added effect ${effect.name ? effect.name : effectName} to ${actor.name} - ${actor.id}`);
    }
  }

  /**
   * Adds the effect with the provided name to an actor matching the provided
   * UUID
   *
   * @param {string} effectName - the name of the effect to add
   * @param {string} uuid - the uuid of the actor to add the effect to
   */
  async addEffectOnActorArr(inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw error('addEffectOnActorArr | inAttributes must be of type array');
    }
    const [effectName, uuid, effect] = inAttributes;
    return this.addEffectOnActor(effectName, uuid, effect);
  }

  // =========================
  // FoundryHelper for retrocompatibility
  // =========================

  /**
   * Gets all UUIDs for selected or targeted tokens, depending on if priortize
   * targets is enabled
   *
   * @returns {string[]} actor uuids for selected or targeted tokens
   */
  getActorUuidsFromCanvas() {
    if (canvas.tokens?.controlled.length == 0 && game.user?.targets.size == 0) {
      return [];
    }

    // if (this._settings.prioritizeTargets && getGame().user?.targets.size !== 0) {
    //   return Array.from(<UserTargets>getGame().user?.targets).map((token) => token.actor?.uuid);
    // } else {
    return canvas.tokens?.controlled.map((token) => token.actor?.uuid);
    // }
  }

  /**
   * Gets the actor object by the actor UUID
   *
   * @param {string} uuid - the actor UUID
   * @returns {Actor5e} the actor that was found via the UUID
   */
  async getActorByUuid(uuid: string) {
    //const actorToken = <TokenDocument>await fromUuid(uuid);
    //const actor = actorToken?.actor ? actorToken?.actor : actorToken;
    const actor = <Actor>game.actors?.get(uuid);
    return actor;
  }
}
