import { CONDITIONAL_VISIBILITY_MODULE_NAME } from './settings';

export const preloadTemplates = async function (): Promise<Handlebars.TemplateDelegate<any>[]> {
  const templatePaths = [
    // Add paths to "modules/senses/templates"
    `modules/${CONDITIONAL_VISIBILITY_MODULE_NAME}/templates/extra_senses.html`,
    `modules/${CONDITIONAL_VISIBILITY_MODULE_NAME}/templates/stealth_hud.html`,
    `modules/${CONDITIONAL_VISIBILITY_MODULE_NAME}/templates/help_dialog.html`,
  ];
  return loadTemplates(templatePaths);
};
