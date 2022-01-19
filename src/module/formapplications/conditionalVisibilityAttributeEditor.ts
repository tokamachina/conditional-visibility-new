import CONSTANTS from '../constants';
import { canvas, game } from '../settings';

export class ConditionalVisibilityAttributeEditor extends FormApplication {
  resolve = false;
  attributes: any[];

  constructor(pileAttributes: any = false, resolve = false) {
    //@ts-ignore
    super();
    this.resolve = resolve;
    this.attributes = <any[]>pileAttributes || <any[]>game.settings.get(CONSTANTS.MODULE_NAME, 'dynamicAttributes');
  }

  /** @inheritdoc */
  static get defaultOptions(): any {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.AttributeEditor.Title`),
      classes: ['sheet', 'conditional-visibility-attribute-editor'],
      template: `${CONSTANTS.PATH}templates/attribute-editor.html`,
      width: 630,
      height: 'auto',
      resizable: false,
    });
  }

  static showForPile(pileAttributes) {
    let resolve;
    const promise = new Promise((_resolve) => {
      resolve = _resolve;
    });
    return [promise, new ConditionalVisibilityAttributeEditor(pileAttributes, resolve).render(true)];
  }

  async getData(options) {
    const data = super.getData(options);
    //@ts-ignore
    data.attributes = this.attributes;
    return data;
  }

  /* -------------------------------------------- */

  activateListeners(html) {
    super.activateListeners(html);
    const self = this;
    html.find('.item-pile-attribute-remove').click(function () {
      const index = Number($(this).closest('.item-pile-attribute-row').attr('data-attribute-index'));
      self.attributes.splice(index, 1);
      $(this).closest('.item-pile-attribute-row').remove();
      self.rerender();
    });
    html.find('button[name="newAttribute"]').click(function () {
      self.attributes.push({
        name: '',
        path: '',
        img: '',
      });
      self.rerender();
    });
  }

  rerender() {
    //@ts-ignore
    const self = this;
    this.element.find('.item-pile-attribute-row').each(function (index) {
      if (index === 0) return;
      self.attributes[index - 1] = {
        name: $(this).find('.item-pile-attribute-name-input').val(),
        path: $(this).find('.item-pile-attribute-path-input').val(),
        img: $(this).find('.item-pile-attribute-img-input').val(),
      };
    });
    return this.render(true);
  }

  async _updateObject(event, formData) {
    const newSettings = [];
    for (const [path, value] of Object.entries(formData)) {
      setProperty(newSettings, path, value);
    }

    if (!this.resolve) {
      game.settings.set(CONSTANTS.MODULE_NAME, 'dynamicAttributes', newSettings);
    } else {
      //@ts-ignore
      this.resolve(newSettings);
    }
  }
}
