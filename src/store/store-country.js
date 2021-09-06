import { firebase } from "boot/config";
import { showErrorMessage } from "src/functions/function-show-error-message";

const state = {
  refsextra: {
    About: {
      title: "About",
      type: "single",
      description:
        "This section should only contain about 5 lines, briefly explaining the highlights of the country, and how good this country is accessible by bicycle.",
    },
    Corona: {
      title: "Corona",
      type: "single",
      description:
        "What are the regulations of this country for corona? Are landborders open or closed? Do you need a test?",
    },
    QuickFacts: {
      title: "Quick Facts",
      type: "summarylist",
      summarylist: true,
      description: "In just a few words (not a few lines!) describe the items.",
      items: {
        climate: { title: "Climate" },
        language: { title: "Language" },
        religion: { title: "Religion" },
        sim_card: { title: "Sim card provider" },
      },
    },
    People: {
      title: "People",
      type: "single",
      description:
        "How are the people of this country? Do they like cylists? Are there any habits others should know about? Are there more than one spoken languages?",
    },
    Route: { title: "Routes", postlist: true, type: "postlist" },
    Visa: {
      title: "Visa",
      type: "single",
      description:
        "Is there a visa required for this country, and for which nationalities. Normally you can find reliable information about visa policy on Wikipedia. If there are specific requirements, you can describe them here. More information about a specific embassy should be added as a Visa marker. If there is an online visa, you can mention it here, but please add a Visa marker as well and select the option for online visa.",
    },
    Embassy: {
      title: "Where to obtain a visa of ",
      title_dialog: "Embassy",
      title_popup: "Visa",
      type: "tilelist",
      tilelist: true,
    },
    Border_item: {
      title: "Border crossings",
      title_dialog: "Border crossing",
      type: "tilelist",
      tilelist: true,
    },
    SeeDo: {
      title: "See and Do",
      title_dialog: "See and do",
      type: "tilelist",
      tilelist: true,
    },
    BikeShop: { title: "Bike shops", type: "tilelist", tilelist: true },
    Sleeping: {
      title: "Sleeping",
      type: "summarylist",
      summarylist: true,
      items: {
        body_cs_ws: {
          title: "Staying with locals",
          description:
            "Is it easy to stay with locals? How is the hosting community?",
        },
        body_formal_camping: {
          title: "(Formal) Camping",
          description:
            "Are there many official campsites? And what is typical on most campsites in these countries? Formal camping means you can camp at public places for free, like schools or chruches. How easy is it to camp formally?",
        },
        body_hostels: {
          title: "Ho(s)tels",
          description:
            "Are there things to take into account when trying to find ho(s)tels? Basically any accomodation that you need to pay for could be mentioned here.",
        },
        body_wildcamping: {
          title: "Wildcamping",
          description:
            "Is it legal to do wild camping? Is it easy to find spots? Are there any things you need to take into account when someone want to camp in the wild?",
        },
      },
    },
    Safety: {
      title: "Safety",
      type: "summarylist",
      summarylist: true,
      items: {
        body: {
          title: "General",
          description:
            "Just briefly describes the general safety of the country.",
        },
        body_traffic: {
          title: "Traffic",
          description:
            "How`s the traffic? Is it dangerous for cyclists to be on certain roads?",
        },
        // 'body_criminality':{title:'Criminality',  },
        // 'body_corruption':{title:'Corruption',  },
        body_nature: {
          title: "Nature and animals",
          description:
            "Are there any dangers when it comes to nature, such as temperatures, floods, hurricanes? And for which animals should be watched out?",
        },
      },
    },
    Transport: {
      title: "Transport",
      type: "summarylist",
      summarylist: true,
      items: {
        body_airplane: {
          title: "Airplane",
          description:
            "Especially for islands it would be nice to know what are the best connections from the nearby mainland. For non-islands, you don`t have to mention all connections, but only name a few if there are only less options. You can also mention internal flights, and if it is easy to take a bicycle on the plane.",
        },
        body_train: {
          title: "Train",
          description:
            "Could you bring the bicycle inside the national trains?",
        },
        body_bus: {
          title: "Bus",
          description:
            "Could you bring the bicycle inside the national busses?",
        },
        body_boat: {
          title: "Boat",
          description:
            "What are the important ferry connections? And could you bring a bicycle on it?",
        },
      },
    },
    FoodDrink: {
      title: "Food and Drink",
      type: "single",
      description:
        "What does the local kitchen offers? And where can you find which kind of food (supermarkets, stalls on the street, restaurants)? How can you get drinkable water?",
    },
    Health: {
      title: "Vaccinations & health",
      type: "single",
      description:
        "Which vaccinations are required, and which are recommended? Are there any other health related things to take into account when traveling this country?",
    },
    Blog: { title: "Blogs", postlist: true, type: "postlist" },
    Video: { title: "Video", postlist: true, type: "postlist" },
    Other: {
      title: "Other",
      type: "single",
      description:
        "Basically, if you want to share something that doesn`t fit in one of the above sections, you can write it down here. For example: Best time to cycle, spare parts, nice routes (preferably make a gpx and add it as a gpx post), tips.",
    },
  },
  refs: [],
  sort: "title",
  countryData: {},
  borderItem: {},
  blogDataCountry: {},
  videoDataCountry: {},
  singleItemDataState: {},
  visaData: {},
};

const mutations = {
  setSort(state, value) {
    state.sort = value;
  },

  addSingleItemDataOnce(state, payload) {
    Object.assign(state.singleItemDataState, payload);
  },
  addSingleItemData(state, payload) {
    state.singleItemDataState[payload.itemId] = payload.itemDetails;
  },

  addCountryDataNew(state, payload) {
    state.countryData[payload.itemId] = payload.itemDetails;
  },
  addBorderData(state, payload) {
    state.borderItem[payload.itemId] = payload.itemDetails;
  },
  addBlogCountryData(state, payload) {
    state.blogDataCountry[payload.itemId] = payload.itemDetails;
  },
  addVideoCountryData(state, payload) {
    state.videoDataCountry[payload.itemId] = payload.itemDetails;
  },
  clearCountryData(state) {
    state.countryData = {};
    state.singleItemDataState = {};
    state.borderItem = {};
  },

  addVisaData(state, payload) {
    state.visaData[payload.itemId] = payload.itemDetails;
  },
};

const actions = {
  firebaseGetCountryDataNew({ commit }, countryKey) {
    firebase.db
      .ref("Country_data/" + countryKey)
      .on("child_added", (snapshot) => {
        let itemId = snapshot.key;
        let itemDetails = snapshot.val();
        commit("addCountryDataNew", { itemId, itemDetails });
      });
    firebase.db
      .ref("Country_data/" + countryKey)
      .on("child_changed", (snapshot) => {
        let itemId = snapshot.key;
        let itemDetails = snapshot.val();
        commit("addCountryDataNew", { itemId, itemDetails });
      });
  },

  getVisaData({ commit }, countries) {
    countries.forEach((itemId) => {
      firebase.db
        .ref("Country_data/" + itemId + "/Visa")
        .once("value")
        .then((snapshot) => {
          let itemDetails = snapshot.val();
          commit("addVisaData", { itemId, itemDetails });
        });
    });
  },

  destroyData({ commit }) {
    commit("clearCountryData");
  },
};

const getters = {
  countryData: (state) => {
    return state.countryData;
  },
  singleItemData: (state) => {
    return state.singleItemData;
  },
  blogPostsSortedCountry: (state) => {
    let blogPostsSortedCountry = {},
      keysOrdered = Object.keys(state.blogDataCountry);

    keysOrdered.sort((a, b) => {
      let AProp = state.blogDataCountry[a].likes
        ? Object.keys(state.blogDataCountry[a].likes).length
        : 0;
      let BProp = state.blogDataCountry[b].likes
        ? Object.keys(state.blogDataCountry[b].likes).length
        : 0;

      if (AProp < BProp) return 1;
      else if (AProp > BProp) return -1;
      else return 0;
    });

    keysOrdered.forEach((key) => {
      blogPostsSortedCountry[key] = state.blogDataCountry[key];
    });

    return blogPostsSortedCountry;
  },
  blogPostsSortedByDateCountry: (state) => {
    let blogPostsSortedByDateCountry = {},
      keysOrdered = Object.keys(state.blogDataCountry);

    keysOrdered.sort((a, b) => {
      let AProp = state.blogDataCountry[a].date_created;
      let BProp = state.blogDataCountry[b].date_created;

      if (AProp < BProp) return 1;
      else if (AProp > BProp) return -1;
      else return 0;
    });

    keysOrdered.forEach((key) => {
      blogPostsSortedByDateCountry[key] = state.blogDataCountry[key];
    });

    return blogPostsSortedByDateCountry;
  },
  videoPostsSortedCountry: (state) => {
    let videoPostsSortedCountry = {},
      keysOrdered = Object.keys(state.videoDataCountry);

    keysOrdered.sort((a, b) => {
      let AProp = state.videoDataCountry[a].likes
        ? Object.keys(state.videoDataCountry[a].likes).length
        : 0;
      let BProp = state.videoDataCountry[b].likes
        ? Object.keys(state.videoDataCountry[b].likes).length
        : 0;

      if (AProp < BProp) return 1;
      else if (AProp > BProp) return -1;
      else return 0;
    });

    keysOrdered.forEach((key) => {
      videoPostsSortedCountry[key] = state.videoDataCountry[key];
    });

    return videoPostsSortedCountry;
  },
  videoPostsSortedByDateCountry: (state) => {
    let videoPostsSortedByDateCountry = {},
      keysOrdered = Object.keys(state.videoDataCountry);

    keysOrdered.sort((a, b) => {
      let AProp = state.videoDataCountry[a].date_created;
      let BProp = state.videoDataCountry[b].date_created;

      if (AProp < BProp) return 1;
      else if (AProp > BProp) return -1;
      else return 0;
    });

    keysOrdered.forEach((key) => {
      videoPostsSortedByDateCountry[key] = state.videoDataCountry[key];
    });

    return videoPostsSortedByDateCountry;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
