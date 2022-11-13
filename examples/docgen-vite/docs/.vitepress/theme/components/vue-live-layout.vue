<template>
  <div class="preview-code">
    <div class="preview block">
      <slot name="preview"></slot>
    </div>
    <div :class="`language-${lang} editor block`">
      <slot name="editor"></slot>
    </div>
  </div>
</template>

<script setup>
import "prismjs/themes/prism-tomorrow.css";
import "vue-live/style.css";

defineProps({
  lang: String
})
</script>

<style>
.preview-code {
  display: flex;
  flex-flow: row-reverse wrap;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e2e2e2;
}
.vp-doc .preview-code .block {
  flex-grow: 1;
  width: 50%;
  border-radius: 0;
  margin:0;
  min-height: 300px;
}

.preview-code .editor pre {
  margin: 0;
  box-sizing: border-box;
  height: 100%;
  border-radius: 0;
  white-space: pre-wrap;
}
.preview-code .preview {
  background-color: rgb(249, 245, 245);
  text-align: center;
  box-sizing: border-box;
  padding: 12px;
}

.preview-code .prism-editor-wrapper {
  color: white;
  padding: 0;
}

.preview-code .prism-editor-wrapper .prism-editor__textarea,
.preview-code .prism-editor-wrapper .prism-editor__editor {
  padding: 20px;
}

@media only screen and (max-width: 568px) {
  .preview-code {
    display: block;
  }
  .preview-code .block {
    width: auto;
  }
}
@media only screen and (max-width: 419px) {
  .preview-code {
    margin: 0.85rem -1.5rem;
    border-radius: 0;
  }
}
</style>
