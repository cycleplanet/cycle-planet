<template>
  <div>
    <q-banner rounded class="bg-orange-2 text-orange-10 q-mb-md"
      >All logged in users can add markers, but please make sure to follow our
      <span class="underline cursor-pointer" @click="clickGuidelines"
        >guidelines</span
      >.</q-banner
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      guidelineDialog: false,
    };
  },

  methods: {
    clickGuidelines() {
      // this.guidelineDialog=true
      this.$router.push("/guidelines");
    },
  },
};
</script>

<style></style>
