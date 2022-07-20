ni && rm -rf ../vue-live/node_modules/vue-inbrowser-* \
 && cp -Rf packages/vue-inbrowser-* ../vue-live/node_modules \
 && rm -rf ../vue-live/node_modules/vue-inbrowser-*/node_modules/ \
 && node ../vue-live/node_modules/vue-inbrowser-compiler-demi/postinstall.js