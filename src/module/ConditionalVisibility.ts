import API from './api';
import { canvas, CONDITIONAL_VISIBILITY_MODULE_NAME, game } from './settings';
import { conditionalVisibilitySocket } from './socket';

export class ConditionalVisibility {
  static API: API;

  /**
   * Create a ConditionalVisibility with a given sightLayer and tokenHud.
   * @param sightLayer the sightLayer to use
   * @param tokenHud the tokenHud to use
   */
  constructor(sightLayer: SightLayer) {
    // this._conditionalVisibilitySystem = ConditionalVisibility.newSystem();
    // this._sightLayer = sightLayer;
    //   if (!game.modules.get('levels')?.active) {
    //     const realRestrictVisibility = sightLayer.restrictVisibility;
    //     if (this._sightLayer && this._sightLayer.restrictVisibility) {
    //       this._sightLayer.restrictVisibility = () => {
    //         this._capabilities = this._conditionalVisibilitySystem.getVisionCapabilities(this._getSrcTokens());
    //         realRestrictVisibility.call(this._sightLayer);
    //         const restricted = canvas.tokens?.placeables.filter((token) => token.visible);
    //         if (restricted && restricted.length > 0) {
    //           const srcTokens = this._getSrcTokens();
    //           if (srcTokens.length > 0) {
    //             const flags = this._conditionalVisibilitySystem.getVisionCapabilities(srcTokens);
    //             for (const t of restricted) {
    //               if (srcTokens.indexOf(t) < 0) {
    //                 t.visible = this._conditionalVisibilitySystem.canSee(t, flags);
    //               }
    //             }
    //           }
    //         }
    //       };
    //     }
    //   }
    //   this.draw();
  }

  /**
   * Called from init hook to establish the extra status effects in the main list before full game initialization.
   */
  static onInit(): void {
    // const system = ConditionalVisibility.newSystem();
    if (!game.modules.get('levels')?.active) {
      //@ts-ignore
      const realIsVisible: any = Object.getOwnPropertyDescriptor(Token.prototype, 'isVisible').get;
      Object.defineProperty(Token.prototype, 'isVisible', {
        get: function () {
          const isVisible = realIsVisible.call(this);
          if (isVisible === false) {
            return false;
          }
          if (game.user?.isGM || this.owner || !canvas.sight?.tokenVision) {
            return true;
          }
          return this.canSee(this);
        },
      });
    } else {
      //@ts-ignore
      libWrapper.ignore_conflicts(
        CONDITIONAL_VISIBILITY_MODULE_NAME,
        ['perfect-vision'],
        'Levels.prototype.overrideVisibilityTest',
      );
      //@ts-ignore
      const lw = libWrapper.register(
        CONDITIONAL_VISIBILITY_MODULE_NAME,
        'Levels.prototype.overrideVisibilityTest',
        ConditionalVisibility.overrideVisibilityTestCV,
        'MIXED',
      );
    }
    // system.initializeStatusEffects();
  }

  static overrideVisibilityTestCV(wrapped, ...args) {
    const targetToken = args[1];
    //   const flags = ConditionalVisibility.INSTANCE._conditionalVisibilitySystem.getVisionCapabilities(
    //     ConditionalVisibility.INSTANCE._getSrcTokens(),
    //   );
    const isCVVisible = this.canSee(targetToken, flags);

    return isCVVisible ? wrapped(...args) : false;
  }

  isSemvarGreater(first: string, second: string): Boolean {
    const firstSemVar = this.splitOnDot(first);
    const secondSemVar = this.splitOnDot(second);
    if (firstSemVar.length != secondSemVar.length) {
      throw new Error('bad semvar first ' + first + ', second' + second);
    }
    for (let i = 0; i < firstSemVar.length; i++) {
      if (firstSemVar[i] > secondSemVar[i]) {
        return true;
      }
    }
    return false;
  }

  splitOnDot(toSplit: string): Number[] {
    return toSplit.split('.').map((str) => (isNaN(Number(str)) ? 0 : Number(str)));
  }

  //   /**
  //    * Create a new ConditionalVisibilitySystem appropriate to the game system
  //    * @returns ConditionalVisibilitySystem
  //    */
  //   static newSystem(): ConditionalVisibilitySystem {
  //     let system;
  //     switch (game.system.id) {
  //       case 'dnd5e':
  //         system = new ConditionalVisibilitySystem5e();
  //         break;
  //       case 'pf2e':
  //         system = new ConditionalVisibilitySystemPf2e();
  //         break;
  //       default:
  //         system = new DefaultConditionalVisibilitySystem();
  //     }
  //     return system;
  //   }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onRenderTokenConfig(tokenConfig: TokenConfig, jQuery: JQuery, data: object): void {
    const visionTab = $('div.tab[data-tab="vision"]');
    renderTemplate(
      `modules/${CONDITIONAL_VISIBILITY_MODULE_NAME}/templates/extra_senses.html`,
      //@ts-ignore
      tokenConfig.object.data.flags[CONDITIONAL_VISIBILITY_MODULE_NAME] ?? {},
    ).then((extraSenses) => {
      visionTab.append(extraSenses);
    });
  }

  // // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  // onRenderTokenHUD(app: TokenHUD, html: JQuery, token: any): void {
  //   const systemEffects = this._conditionalVisibilitySystem.effectsByIcon();
  //   html.find('img.effect-control')?.each((idx, icon) => {
  //     //@ts-ignore
  //     const src = icon.attributes.src.value;
  //     if (systemEffects.has(src)) {
  //       let title;
  //       if (systemEffects.get(src)?.visibilityId === StatusEffectStatusFlags.HIDDEN) {
  //         // 'hidden'
  //         title = i18n(systemEffects.get(src)?.label ?? '');
  //         let tokenActorData;
  //         if (!token.actorData?.flags) {
  //           tokenActorData = game.actors?.get(token.actorId)?.data;
  //         } else {
  //           tokenActorData = token.actorData;
  //         }
  //         const _ste =
  //           tokenActorData?.document?.getFlag(
  //             CONDITIONAL_VISIBILITY_MODULE_NAME,
  //             StatusEffectSightFlags.PASSIVE_STEALTH,
  //           ) ??
  //           tokenActorData.flags[CONDITIONAL_VISIBILITY_MODULE_NAME]?.[StatusEffectSightFlags.PASSIVE_STEALTH] ??
  //           NaN;
  //         const hidden =
  //           <boolean>(
  //             tokenActorData?.document?.getFlag(CONDITIONAL_VISIBILITY_MODULE_NAME, StatusEffectStatusFlags.HIDDEN)
  //           ) ??
  //           <boolean>tokenActorData.flags[CONDITIONAL_VISIBILITY_MODULE_NAME]?.[StatusEffectStatusFlags.HIDDEN] ??
  //           false;
  //         if (tokenActorData && !hidden && !isNaN(parseInt(_ste))) {
  //           title += ' ' + i18n(`${CONDITIONAL_VISIBILITY_MODULE_NAME}.currentstealth`) + ': ' + _ste;
  //         }
  //       } else {
  //         title = i18n(systemEffects.get(src)?.label ?? '');
  //       }
  //       icon.setAttribute('title', title);
  //     }
  //   });
  // }

  async applyChanges(): Promise<void> {
    await conditionalVisibilitySocket.executeForEveryone('refresh');
  }

  // async draw(): Promise<void> {
  //   this.draw();
  // }

  async refresh(): Promise<void> {
    await this._sightLayer.refresh();
  }
}
