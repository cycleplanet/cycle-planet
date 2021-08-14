<template>
  <div class="row q-mb-sm">
    <q-input
      filled
      :value="dueTime"
      class="col"
      label="Due Time"
      @input="$emit('update:dueTime', $event)"
    >
      <template v-slot:append>
        <q-icon
          v-if="dueTime"
          name="close"
          @click="$emit('update:dueTime', '')"
          class="cursor-pointer"
        />

        <q-icon name="access_time" class="cursor-pointer">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-time :value="dueTime" @input="$emit('update:dueTime', $event)">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" :style="buttonStyle" flat />
              </div>
            </q-time>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script>
export default {
  props: ["dueTime"],
};
</script>

<style></style>
