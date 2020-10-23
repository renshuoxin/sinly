<template lang="pug">
  .editor-wrap
    editor(:content="content", :auto-height="false", :height="height")
</template>

<script>
const options = {
  showModuleName: true,
  visibleModules: [
    "text",
    "color",
    "font",
    "align",
    "list",
    "link",
    "unlink",
    "image",
    "undo",
    "info",
  ]
}
import VueHtml5Editor from 'vue-html5-editor'
const editor = new VueHtml5Editor(options)

export default {
  data() {
    return {
      content: '',
      height: window.outerHeight
    }
  },
  components: {
    editor
  }
}
</script>
<style lang="less">
.editor-wrap {
  height: 100%;
  .vue-html5-editor {
    height: 100%;
  }
}
</style>