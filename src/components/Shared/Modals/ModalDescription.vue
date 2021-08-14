<template>
  <div class="q-gutter-sm">
    <p class="cp-h2">Description:</p>

    <q-editor
      @paste.native="(evt) => pasteCapture(evt)"
      ref="editor_ref"
      v-model="editor"
      @input="$emit('update:description', $event)"
      :rules="[(val) => !!val || 'Field is required']"
      :dense="$q.screen.lt.md"
      :toolbar="[
        ['bold', 'italic', 'underline'],
        ['link'],
        ['unordered', 'ordered'],
        ['viewsource'],
      ]"
    >
    </q-editor>
  </div>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";

export default {
  mixins: [mixinGeneral],
  props: ["description"],

  data() {
    return {
      editor: "",
    };
  },
};
</script>
