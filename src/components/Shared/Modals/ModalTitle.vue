<template>
  <div class="row q-mb-sm">
    <q-input
      outlined
      :value="title"
      @input="$emit('update:title', $event)"
      :rules="[(val) => !!val || 'Field is required']"
      v-select-all
      ref="title"
      label="title"
      class="col"
    >
      <template v-slot:append>
        <q-icon
          v-if="title"
          @click="$emit('update:title', '')"
          name="close"
          class="cursor-pointer"
        />
      </template>
    </q-input>
  </div>
</template>

<script>
export default {
  props: ["title"],
};
</script>
