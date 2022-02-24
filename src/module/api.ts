import CONSTANTS from './constants';
import { dialogWarning, error, i18n, mergeByProperty, warn } from './lib/lib';
import EffectInterface from './effects/effect-interface';
import { SenseData } from './conditional-visibility-models';
import HOOKS from './hooks';
import { EnhancedConditions } from './cub/enhanced-conditions';
import { canvas, game } from './settings';
import Effect from './effects/effect';
import { ConditionalVisibilityEffectDefinitions } from './conditional-visibility-effect-definition';

const API = {
  effectInterface:EffectInterface,

  get CUB(): EnhancedConditions {
    //@ts-ignore
    return game.cub;
  },

  /**
   * The attributes used to track dynamic attributes in this system
   *
   * @returns {array}
   */
  get SENSES(): SenseData[] {
    return <SenseData[]>game.settings.get(CONSTANTS.MODULE_NAME, 'senses');
  },

  /**
   * The attributes used to track dynamic attributes in this system
   *
   * @returns {array}
   */
  get CONDITIONS(): SenseData[] {
    return <SenseData[]>game.settings.get(CONSTANTS.MODULE_NAME, 'conditions');
  },

  /**
   * The attribute used to track the quantity of items in this system
   *
   * @returns {String}
   */
  get PERCEPTION_PASSIVE_SKILL() {
    return game.settings.get(CONSTANTS.MODULE_NAME, 'passivePerceptionSkill');
  },

  /**
   * The attribute used to track the quantity of items in this system
   *
   * @returns {String}
   */
  get STEALTH_PASSIVE_SKILL() {
    return game.settings.get(CONSTANTS.MODULE_NAME, 'passiveStealthSkill');
  },

  /**
   * Sets the inAttribute used to track the passive perceptions in this system
   *
   * @param {String} inAttribute
   * @returns {Promise}
   */
  async setPassivePerceptionSkill(inAttribute) {
    if (typeof inAttribute !== 'string') {
      throw error('setPassivePerceptionSkill | inAttribute must be of type string');
    }
    await game.settings.set(CONSTANTS.MODULE_NAME, 'preconfiguredSystem', true);
    return game.settings.set(CONSTANTS.MODULE_NAME, 'passivePerceptionSkill', inAttribute);
  },

  /**
   * Sets the inAttribute used to track the passive perceptions in this system
   *
   * @param {String} inAttribute
   * @returns {Promise}
   */
  async setPassiveStealthSkill(inAttribute) {
    if (typeof inAttribute !== 'string') {
      throw error('setPassiveStealthSkill | inAttribute must be of type string');
    }
    await game.settings.set(CONSTANTS.MODULE_NAME, 'preconfiguredSystem', true);
    return game.settings.set(CONSTANTS.MODULE_NAME, 'passiveStealthSkill', inAttribute);
  },

  /**
   * Sets the attributes used to track dynamic attributes in this system
   *
   * @param {array} inAttributes
   * @returns {Promise}
   */
  async setSenses(inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw error('setSenses | inAttributes must be of type array');
    }
    inAttributes.forEach((attribute) => {
      if (typeof attribute !== 'object') {
        throw error('setSenses | each entry in the inAttributes array must be of type object');
      }
      if (typeof attribute.name !== 'string') {
        throw error('setSenses | attribute.name must be of type string');
      }
      if (typeof attribute.attribute !== 'string') {
        throw error('setSenses | attribute.path must be of type string');
      }
      if (attribute.img && typeof attribute.img !== 'string') {
        throw error('setSenses | attribute.img must be of type string');
      }
    });
    return game.settings.set(CONSTANTS.MODULE_NAME, 'senses', inAttributes);
  },

  /**
   * Sets the attributes used to track dynamic attributes in this system
   *
   * @param {array} inAttributes
   * @returns {Promise}
   */
  async setConditions(inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw error('setConditions | inAttributes must be of type array');
    }
    inAttributes.forEach((attribute) => {
      if (typeof attribute !== 'object') {
        throw error('setConditions | each entry in the inAttributes array must be of type object');
      }
      if (typeof attribute.name !== 'string') {
        throw error('setConditions | attribute.name must be of type string');
      }
      if (typeof attribute.attribute !== 'string') {
        throw error('setConditions | attribute.path must be of type string');
      }
      if (attribute.img && typeof attribute.img !== 'string') {
        throw error('setConditions | attribute.img must be of type string');
      }
    });
    return game.settings.set(CONSTANTS.MODULE_NAME, 'conditions', inAttributes);
  },

  // ======================
  // Effect Management
  // ======================

  async removeEffectArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('removeEffectArr | inAttributes must be of type array');
    }
    const [params] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.removeEffect(params);
    return result;
  },

  async toggleEffectArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('toggleEffectArr | inAttributes must be of type array');
    }
    const [effectName, params] = inAttributes;
    const result = await this.effectInterface.toggleEffect(effectName, params);
    return result;
  },

  async addEffectArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('addEffectArr | inAttributes must be of type array');
    }
    const [params] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.addEffect(params);
    return result;
  },

  async hasEffectAppliedArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('hasEffectAppliedArr | inAttributes must be of type array');
    }
    const [effectName, uuid] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.hasEffectApplied(effectName, uuid);
    return result;
  },

  async addEffectOnActorArr(...inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw error('addEffectOnActorArr | inAttributes must be of type array');
    }
    const [effectName, uuid, origin, overlay, effect] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.addEffectOnActor(effectName, uuid, origin, overlay, effect);
    return result;
  },

  async removeEffectOnActorArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('removeEffectOnActorArr | inAttributes must be of type array');
    }
    const [effectName, uuid] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.removeEffectOnActor(effectName, uuid);
    return result;
  },

  async removeEffectFromIdOnActorArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('removeEffectFromIdOnActor | inAttributes must be of type array');
    }
    const [effectId, uuid] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.removeEffectFromIdOnActor(effectId, uuid);
    return result;
  },

  async toggleEffectFromIdOnActorArr(...inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw error('addEffectOnActorArr | inAttributes must be of type array');
    }
    const [effectId, uuid, alwaysDelete, forceEnabled, forceDisabled] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.toggleEffectFromIdOnActor(
      effectId,
      uuid,
      alwaysDelete,
      forceEnabled,
      forceDisabled,
    );
    return result;
  },

  async findEffectByNameOnActorArr(...inAttributes: any[]): Promise<ActiveEffect | null> {
    if (!Array.isArray(inAttributes)) {
      throw error('findEffectByNameOnActorArr | inAttributes must be of type array');
    }
    const [effectName, uuid] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.findEffectByNameOnActor(effectName, uuid);
    return result;
  },

  async addEffectOnTokenArr(...inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw error('addEffectOnTokenArr | inAttributes must be of type array');
    }
    const [effectName, uuid, origin, overlay, effect] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.addEffectOnToken(effectName, uuid, origin, overlay, effect);
    return result;
  },

  async removeEffectOnTokenArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('removeEffectOnTokenArr | inAttributes must be of type array');
    }
    const [effectName, uuid] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.removeEffectOnToken(effectName, uuid);
    return result;
  },

  async removeEffectFromIdOnTokenArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('removeEffectFromIdOnToken | inAttributes must be of type array');
    }
    const [effectId, uuid] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.removeEffectFromIdOnToken(effectId, uuid);
    return result;
  },

  async toggleEffectFromIdOnTokenArr(...inAttributes) {
    if (!Array.isArray(inAttributes)) {
      throw error('addEffectOnTokenArr | inAttributes must be of type array');
    }
    const [effectId, uuid, alwaysDelete, forceEnabled, forceDisabled] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.toggleEffectFromIdOnToken(
      effectId,
      uuid,
      alwaysDelete,
      forceEnabled,
      forceDisabled,
    );
    return result;
  },

  async findEffectByNameOnTokenArr(...inAttributes: any[]): Promise<ActiveEffect | null> {
    if (!Array.isArray(inAttributes)) {
      throw error('findEffectByNameOnTokenArr | inAttributes must be of type array');
    }
    const [effectName, uuid] = inAttributes;
    const result = await (<EffectInterface>this.effectInterface)._effectHandler.findEffectByNameOnToken(effectName, uuid);
    return result;
  },

  // ======================
  // Effect Actor Management
  // ======================
  /*
  async addEffectOnActor(actorId: string, effectName: string, effect: Effect) {
    const result = await API.effectInterface.addEffectOnActor(effectName, <string>actorId, effect);
    return result;
  }.

  async findEffectByNameOnActor(actorId: string, effectName: string): Promise<ActiveEffect | null> {
    const result = await API.effectInterface.findEffectByNameOnActor(effectName, <string>actorId);
    return result;
  },

  async hasEffectAppliedOnActor(actorId: string, effectName: string, includeDisabled:boolean) {
    const result = await API.effectInterface.hasEffectAppliedOnActor(effectName, <string>actorId, includeDisabled);
    return result;
  },

  async hasEffectAppliedFromIdOnActor(actorId: string, effectId: string, includeDisabled:boolean) {
    const result = await API.effectInterface.hasEffectAppliedFromIdOnActor(effectId, <string>actorId, includeDisabled);
    return result;
  },

  async toggleEffectFromIdOnActor(
    actorId: string,
    effectId: string,
    alwaysDelete: boolean,
    forceEnabled?: boolean,
    forceDisabled?: boolean,
  ) {
    const result = await API.effectInterface.toggleEffectFromIdOnActor(
      effectId,
      <string>actorId,
      alwaysDelete,
      forceEnabled,
      forceDisabled,
    );
    return result;
  },

  async addActiveEffectOnActor(actorId: string, activeEffect: ActiveEffect) {
    const result = API.effectInterface.addActiveEffectOnActor(<string>actorId, activeEffect.data);
    return result;
  },

  static async removeEffectOnActor(actorId: string, effectName: string) {
    const result = await API.effectInterface.removeEffectOnActor(effectName, <string>actorId);
    return result;
  }

  async removeEffectFromIdOnActor(actorId: string, effectId: string) {
    const result = await API.effectInterface.removeEffectFromIdOnActor(effectId, <string>actorId);
    return result;
  },
  */
  // ======================
  // Effect Token Management
  // ======================

  async addEffectOnToken(tokenId: string, effectName: string, effect: Effect) {
    const result = await this.effectInterface.addEffectOnToken(effectName, <string>tokenId, effect);
    return result;
  },

  async findEffectByNameOnToken(tokenId: string, effectName: string): Promise<ActiveEffect | null> {
    const result = await this.effectInterface.findEffectByNameOnToken(effectName, <string>tokenId);
    return result;
  },

  async hasEffectAppliedOnToken(tokenId: string, effectName: string, includeDisabled: boolean) {
    const result = await this.effectInterface.hasEffectAppliedOnToken(effectName, <string>tokenId, includeDisabled);
    return result;
  },

  async hasEffectAppliedFromIdOnToken(tokenId: string, effectId: string, includeDisabled: boolean) {
    const result = await this.effectInterface.hasEffectAppliedFromIdOnToken(effectId, <string>tokenId, includeDisabled);
    return result;
  },

  async toggleEffectFromIdOnToken(
    tokenId: string,
    effectId: string,
    alwaysDelete: boolean,
    forceEnabled?: boolean,
    forceDisabled?: boolean,
  ) {
    const result = await this.effectInterface.toggleEffectFromIdOnToken(
      effectId,
      <string>tokenId,
      alwaysDelete,
      forceEnabled,
      forceDisabled,
    );
    return result;
  },

  async addActiveEffectOnToken(tokenId: string, activeEffect: ActiveEffect) {
    const result = this.effectInterface.addActiveEffectOnToken(<string>tokenId, activeEffect.data);
    return result;
  },

  async removeEffectOnToken(tokenId: string, effectName: string) {
    const result = await this.effectInterface.removeEffectOnToken(effectName, <string>tokenId);
    return result;
  },

  async removeEffectFromIdOnToken(tokenId: string, effectId: string) {
    const result = await this.effectInterface.removeEffectFromIdOnToken(effectId, <string>tokenId);
    return result;
  },

  // =======================================================================================
  /*
  static async addEffectConditionalVisibilityOnActor(
    actorNameOrId: string,
    effectName: string,
    distance: number | undefined,
    visionLevel: number | undefined,
  ) {
    const actor = <Actor>game.actors?.get(actorNameOrId) || <Actor>game.actors?.getName(i18n(actorNameOrId));

    if (!actor) {
      warn(`No actor found with reference '${actorNameOrId}'`, true);
    }

    if (!distance) {
      distance = 0;
    }

    if (!visionLevel) {
      visionLevel = 0;
    }

    let effect: Effect | undefined = undefined;
    const sensesOrderByName = <StatusSight[]>API.SENSES.sort((a, b) => a.name.localeCompare(b.name));
    sensesOrderByName.forEach((a: StatusSight) => {
      if (a.id == effectName || i18n(a.name) == effectName) {
        effect = <Effect>EffectDefinitions.all(distance, visionLevel).find((e: Effect) => {
          return e.customId == a.id;
        });
      }
    });

    if (!effect) {
      warn(`No effect found with reference '${effectName}'`, true);
    }

    if (actor && effect) {
      await API.effectInterface.addEffectOnActor(effectName, <string>actor.id, effect);
    }
  }
  */

  async setCondition(
    tokenNameOrId: string,
    senseDataId: string,
    disabled: boolean,
    distance: number | undefined,
    visionLevel: number | undefined,
  ) {
    return API.addEffectConditionalVisibilityOnToken(tokenNameOrId, senseDataId, disabled, distance, visionLevel);
  },

  async addEffectConditionalVisibilityOnToken(
    tokenNameOrId: string,
    senseDataId: string,
    disabled: boolean,
    distance: number | undefined,
    visionLevel: number | undefined,
  ) {
    const tokens = <Token[]>canvas.tokens?.placeables;
    const token = <Token>tokens.find((token) => token.name == i18n(tokenNameOrId) || token.id == tokenNameOrId);

    if (!token) {
      warn(`No token found with reference '${tokenNameOrId}'`, true);
    }

    if (!distance) {
      distance = 0;
    }

    if (!visionLevel) {
      visionLevel = 0;
    }

    const sensesOrderByName = <SenseData[]>await this.getAllSensesAndConditions();
    const effectsDefinition = <Effect[]>ConditionalVisibilityEffectDefinitions.all(distance, visionLevel);

    let effect: Effect | undefined = undefined;
    let senseData: SenseData | undefined = undefined;

    for (const a of sensesOrderByName) {
      // Check for dfred convenient effect and retrieve the effect with the specific name
      // https://github.com/DFreds/dfreds-convenient-effects/issues/110
      //@ts-ignore
      if (a.effectCustomId && game.dfreds) {
        //@ts-ignore
        effect = <Effect>await game.dfreds.effectInterface.findCustomEffectByName(a.name);
        effect.transfer = !disabled;
        senseData = a;
        break;
      }
      if(senseDataId == a.id){
        effect = <Effect>effectsDefinition.find((e: Effect) => {
          return e.customId == a.id || i18n(e.name) == i18n(a.name);
        });
        senseData = a;
        break;
      }
    }

    if (effect) {
      const isSense = API.SENSES.find((s: SenseData) => {
        return s.id == (<SenseData>senseData).id || i18n(s.name) == i18n((<SenseData>senseData).name);
      });
      if(isSense){
        effect.isTemporary = false; // passive ae
      }
      effect.transfer = !disabled;
    }

    if (!effect) {
      warn(`No effect found with reference '${senseDataId}'`, true);
    } else {
      if (token && effect) {
        const nameToUse = senseData?.name ? senseData?.name : effect?.name;
        await this.effectInterface.addEffectOnToken(nameToUse, <string>token.id, effect);
        await token?.document?.setFlag(CONSTANTS.MODULE_NAME, (<Effect>effect).customId, visionLevel);
      }
    }
  },

  async getAllSensesAndConditions(): Promise<SenseData[]> {
    let allSensesAndConditions: SenseData[] = [];
    const senses = API.SENSES;
    const conditions = API.CONDITIONS;
    allSensesAndConditions = mergeByProperty(allSensesAndConditions, senses, 'id');
    allSensesAndConditions = mergeByProperty(allSensesAndConditions, conditions, 'id');

    const sensesOrderByName = <SenseData[]>allSensesAndConditions.sort((a, b) => a.name.localeCompare(b.name));
    return sensesOrderByName;
  },

  async registerSense(senseData: SenseData) {
    const sensesData = <SenseData[]>game.settings.get(CONSTANTS.MODULE_NAME, 'senses');
    const newSensesData = await this._registerSenseData(senseData, sensesData, 'sense', false);
    if (newSensesData && newSensesData.length > 0) {
      await game.settings.set(CONSTANTS.MODULE_NAME, 'senses', newSensesData);
    }
  },

  async registerCondition(senseData: SenseData) {
    const sensesData = <SenseData[]>game.settings.get(CONSTANTS.MODULE_NAME, 'conditions');
    const newSensesData = await this._registerSenseData(senseData, sensesData, 'condition', false);
    if (newSensesData && newSensesData.length > 0) {
      await game.settings.set(CONSTANTS.MODULE_NAME, 'conditions', newSensesData);
    }
  },

  async unRegisterSense(senseData: SenseData) {
    const sensesData = <SenseData[]>game.settings.get(CONSTANTS.MODULE_NAME, 'senses');
    const newSensesData = await this._registerSenseData(senseData, sensesData, 'sense', true);
    if (newSensesData && newSensesData.length > 0) {
      await game.settings.set(CONSTANTS.MODULE_NAME, 'senses', newSensesData);
    }
  },

  async unRegisterCondition(senseData: SenseData) {
    const sensesData = <SenseData[]>game.settings.get(CONSTANTS.MODULE_NAME, 'conditions');
    const newSensesData = await this._registerSenseData(senseData, sensesData, 'condition', true);
    if (newSensesData && newSensesData.length > 0) {
      await game.settings.set(CONSTANTS.MODULE_NAME, 'conditions', newSensesData);
    }
  },

  async _registerOrUnregisterSenseData(
    senseData: SenseData,
    sensesDataList: SenseData[],
    valueComment: string,
    unregister: boolean,
  ) {
    if (!senseData.id) {
      if (unregister) {
        dialogWarning(`Cannot unregister the ${valueComment} with id empty or null`);
      } else {
        dialogWarning(`Cannot register the ${valueComment} with id empty or null`);
      }
      return;
    }
    if (!senseData.name) {
      if (unregister) {
        dialogWarning(`Cannot unregister the ${valueComment} with name empty or null`);
      } else {
        dialogWarning(`Cannot register the ${valueComment} with name empty or null`);
      }
      return;
    }
    // if(!senseData.visionLevelMinIndex){
    //   dialogWarning(`Cannot register the ${valueComment} with visionLevelMinIndex empty or null`);
    //   return;
    // }
    // if(!senseData.visionLevelMaxIndex){
    //   dialogWarning(`Cannot register the ${valueComment} with visionLevelMaxIndex empty or null`);
    //   return;
    // }

    const sensesAndConditionDataList = <SenseData[]>await this.getAllSensesAndConditions();

    const senseAlreadyExistsId = sensesAndConditionDataList.filter((a: SenseData) => (a.id = senseData.id));
    const senseAlreadyExistsName = sensesAndConditionDataList.find((a: SenseData) => a.name == senseData.name);

    if (!unregister && senseAlreadyExistsId) {
      dialogWarning(`Cannot register the ${valueComment} with id '${senseData.id}' because already exists`);
      return;
    }
    if (!unregister && senseAlreadyExistsName) {
      dialogWarning(`Cannot register the ${valueComment} with name '${senseData.name}' because already exists`);
      return;
    }
    if (unregister && !senseAlreadyExistsId) {
      dialogWarning(`Cannot unregister the ${valueComment} with id '${senseData.id}' because is not exists exists`);
      return;
    }
    if (unregister && !senseAlreadyExistsName) {
      dialogWarning(`Cannot unregister the ${valueComment} with id '${senseData.name}' because is not exists`);
      return;
    }
    if (unregister) {
      sensesDataList = sensesDataList.filter(function (el) {
        return el.id != senseData.id;
      });
    } else {
      sensesDataList.push(senseData);
    }
    return sensesDataList;
  },
};

export default API;
