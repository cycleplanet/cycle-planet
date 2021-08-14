<template>
  <q-card class="bg-grey-3">
    <q-card-section class="row">
      <div class="text-h6 q-mr-md">Edit page {{ title }}</div>
      <q-btn label="Save" :style="buttonStyle" @click="saveEdit" />
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-editor
        style="height: 500px;"
        @paste.native="(evt) => pasteCapture(evt)"
        ref="editor_ref"
        v-model="dataEdit.section1"
        :toolbar="[
          ['bold', 'italic', 'underline'],
          [
            {
              label: $q.lang.editor.formatting,
              icon: $q.iconSet.editor.formatting,
              list: 'no-icons',
              options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code'],
            },
          ],
          [
            {
              label: $q.lang.editor.fontSize,
              icon: $q.iconSet.editor.fontSize,
              fixedLabel: true,
              fixedIcon: true,
              list: 'no-icons',
              options: [
                'size-1',
                'size-2',
                'size-3',
                'size-4',
                'size-5',
                'size-6',
                'size-7',
              ],
            },
          ],

          ['link'],
          ['unordered', 'ordered'],
          ['viewsource'],
        ]"
      ></q-editor>
    </q-card-section>
  </q-card>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";

export default {
  props: ["title", "data"],
  mixins: [mixinGeneral],
  data() {
    return {
      editPage: false,
      maximizedToggle: true,
      dataEdit: "",
    };
  },

  computed: {},
  methods: {
    saveEdit() {
      this.updateItemAction({
        path: "Pages/" + this.title,
        data: this.dataEdit,
      });
      this.$emit("close");
    },
  },
  mounted() {
    this.dataEdit = Object.assign({}, this.data);
  },
};
</script>

<style></style>
