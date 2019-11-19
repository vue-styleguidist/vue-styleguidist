"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isTranslationObject(o) {
    return !!o.original;
}
var translateOneLayer = function (layer, translations) {
    Object.keys(layer).forEach(function (p) {
        var currentTrans = translations[p];
        if (typeof layer[p] === 'object' && !isTranslationObject(currentTrans)) {
            translateOneLayer(layer[p], currentTrans);
        }
        else if (isTranslationObject(currentTrans) &&
            layer[p].description === currentTrans.original) {
            layer[p].description = currentTrans.translation;
        }
    }, {});
};
/**
 * Translates the given `ComponentDoc` object using provided translations
 * @param originalDoc
 * @param translations
 * @returns translated documentation
 */
function default_1(originalDoc, translations) {
    return originalDoc;
}
exports.default = default_1;
