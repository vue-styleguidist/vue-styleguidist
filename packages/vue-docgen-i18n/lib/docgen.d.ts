import { ComponentDoc } from 'vue-docgen-api';
interface AllTranslationsObjects {
    [component: string]: TranslationObject | AllTranslationsObjects;
}
interface TranslationObject {
    original: string;
    translation: string;
}
/**
 * Translates the given `ComponentDoc` object using provided translations
 * @param originalDoc
 * @param translations
 * @returns translated documentation
 */
export default function (originalDoc: ComponentDoc, translations: AllTranslationsObjects): ComponentDoc;
export {};
