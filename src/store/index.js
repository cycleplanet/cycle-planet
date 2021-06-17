import Vue from 'vue'
import Vuex from 'vuex'

import settings from './store-settings'
import auth from './store-auth'
import countries from './store-countries'
import country from './store-country'
import chat from './store-chat'
import post from './store-post'
import profile from './store-profile'
import other from './store-other'
import admin from './store-admin'
import markers from './store-markers'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      settings,
      auth,
      countries,
      country,
      chat,
      post,
      profile,
      other,
      admin,
      markers,
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  })

  return Store
}
