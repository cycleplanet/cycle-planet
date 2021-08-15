const routes = [
  {
    path: "/",
    component: () => import("layouts/Layout.vue"),
    children: [
      { path: "/map", component: () => import("pages/PageHome.vue") },
      { path: "/", component: () => import("pages/Other/PageWelcome.vue") },
      { path: "/admin", component: () => import("pages/PageAdminPanel.vue") },
      { path: "/chat", component: () => import("pages/PageChatlist.vue") },
      {
        path: "/chat/:otherUserId",
        component: () => import("pages/PageChat.vue"),
      },
      {
        path: "/user/:otherUserId",
        component: () => import("pages/PageUser.vue"),
      },
      { path: "/auth", component: () => import("pages/PageAuth.vue") },
      {
        path: "/country/:countryKey",
        component: () => import("pages/PageCountry.vue"),
      },
      { path: "/trips", component: () => import("pages/PageTripsGeneral.vue") },
      {
        path: "/trips/:tripId",
        component: () => import("pages/PageTripsGeneralSingle.vue"),
      },
      {
        path: "/trip/:userId/:tripId",
        component: () => import("pages/PageTrip.vue"),
      },

      { path: "item/:itemKey", component: () => import("pages/PageItem.vue") },
      { path: "post/:postKey", component: () => import("pages/PagePost.vue") },

      {
        path: "/donate",
        component: () => import("pages/Other/PageSupport.vue"),
      },
      {
        path: "/get-inspired",
        component: () => import("pages/Other/PageGetInspired.vue"),
      },
      {
        path: "/collections",
        component: () => import("pages/Other/PageCollection.vue"),
      },
      {
        path: "/resources",
        component: () => import("pages/Other/PageResources.vue"),
      },
      { path: "/gear", component: () => import("pages/Other/PageGear.vue") },

      { path: "/stats", component: () => import("pages/PageStats.vue") },
      {
        path: "/settings",
        component: () => import("pages/Other/PageSettings.vue"),
      },
      { path: "/faq", component: () => import("pages/Other/PageFaq.vue") },
      {
        path: "/contact",
        component: () => import("pages/Other/PageContact.vue"),
      },
      {
        path: "/our-story",
        component: () => import("pages/Other/PageOurStory.vue"),
      },
      {
        path: "/learn-more",
        component: () => import("pages/Other/PageLearnMore.vue"),
      },
      { path: "/team", component: () => import("pages/Other/PageTeam.vue") },
      {
        path: "/credits",
        component: () => import("pages/Other/PageCredits.vue"),
      },
      {
        path: "/guidelines",
        component: () => import("pages/Other/PageGuidelines.vue"),
      },
      {
        path: "/houserules",
        component: () => import("pages/Other/PageHouserules.vue"),
      },
      {
        path: "/privacy-policy",
        component: () => import("pages/Other/PagePrivacyPolicy.vue"),
      },
      {
        path: "/terms-of-use",
        component: () => import("pages/Other/PageTerms.vue"),
      },
      {
        path: "/cookie-policy",
        component: () => import("pages/Other/PageCookiePolicy.vue"),
      },
      {
        path: "/thanks",
        component: () => import("pages/Other/PageThanks.vue"),
      },
      {
        path: "/codebook",
        component: () => import("pages/Other/PageCodeBook.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
