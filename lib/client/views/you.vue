<template lang="pug">
  .you-container
    .editor(contenteditable="true")
</template>

<script>
import inherit from 'learn/inherit.js'

export default {
  data() {
    return {
      
    }
  },
  mounted() {
    inherit();
  }
}
</script>
<style lang="less">
.you-container {
  .editor {
    border: 1px solid grey;
    min-height: 400px;
    outline: none;
    padding: 10px;
  }
}
</style>