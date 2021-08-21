<template>
  <div id="q-app" class="ownfont bg-grey-2">
    <router-view />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import meta from "src/utils/meta.js";

export default {
  methods: {
    ...mapActions("auth", [
      "handleAuthStateChange",
      "loadBaseData",
      "loadSecondaryData",
    ]),
  },
  mounted() {
    this.handleAuthStateChange();
    this.loadBaseData();
    this.loadSecondaryData();
  },
  meta() {
    return {
      title: "Cycle Planet",
      titleTemplate: (title) => `${title} | The bicycle touring guide`,

      // meta tags
      meta: {
        description: { name: "description", content: "Page 1" },
        keywords: {
          name: "keywords",
          content:
            "bicycle, bike, cycle, cycling, touring, visa, border, safe, information",
        },
        equiv: {
          "http-equiv": "Content-Type",
          content: "text/html; charset=UTF-8",
        },
        // note: for Open Graph type metadata you will need to use SSR, to ensure page is rendered by the server
        ogTitle: {
          name: "og:title",
          // optional; similar to titleTemplate, but allows templating with other meta properties
          template(ogTitle) {
            return `${ogTitle}`;
          },
        },
      },

      // CSS tags
      link: {
        material: {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/icon?family=Material+Icons",
        },
      },

      // JS tags
      script: {
        ldJson: {
          type: "application/ld+json",
          innerHTML: `{ "@context": "http://schema.org" }`,
        },
      },

      // <html> attributes
      htmlAttr: {
        "xmlns:cc": "http://creativecommons.org/ns#", // generates <html xmlns:cc="http://creativecommons.org/ns#">,
        empty: undefined, // generates <html empty>
      },

      // <body> attributes
      bodyAttr: {
        "action-scope": "xyz", // generates <body action-scope="xyz">
        empty: undefined, // generates <body empty>
      },

      // <noscript> tags
      noscript: {
        default: "This is content for browsers with no JS (or disabled JS)",
      },
    };
  },
};
</script>

<style>
.ownfont {
  font-family: "customfont";
}
.text-strikethrough {
  text-decoration: line-through;
}
</style>
