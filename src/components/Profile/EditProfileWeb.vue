<template>
  <div class="bg-white" style="height: 100%; min-width: 100%;">
    <q-layout view="hHh Lpr lff" container class="shadow-2 rounded-borders">
      <q-header class="bg-black">
        <q-toolbar class="bg-amber text-black">
          <q-toolbar-title>Edit profile</q-toolbar-title>
          <q-space></q-space>
          <q-btn flat round icon="close" @click="$emit('close')"></q-btn>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="drawer"
        show-if-above
        :width="200"
        :breakpoint="500"
        bordered
        content-class="bg-grey-3"
      >
        <q-scroll-area class="fit">
          <q-list>
            <template v-for="(menuItem, index) in menuList">
              <q-item
                :key="index"
                clickable
                @click="activelabel = menuItem.label"
                :active="menuItem.label === activelabel"
                v-ripple
                active-class="bg-blue-2 text-grey-8"
              >
                <q-item-section avatar>
                  <q-icon :name="menuItem.icon" />
                </q-item-section>
                <q-item-section>
                  {{ menuItem.label }}
                </q-item-section>
              </q-item>
              <q-separator :key="'sep' + index" v-if="menuItem.separator" />
            </template>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <div v-if="activelabel === 'About'">
          <edit-about :userData.sync="userData" />
        </div>
        <div v-if="activelabel === 'Hosting'">
          <edit-hosting :userData.sync="userData" />
        </div>

        <div v-if="activelabel === 'Social profiles'">
          <edit-social :userData.sync="userData" />
        </div>

        <div v-if="activelabel === 'Account details'">
          <edit-account :userData.sync="userData" />
        </div>
      </q-page-container>
      <q-footer class="bg-white q-pa-sm">
        <q-separator></q-separator>
        <q-toolbar bordered>
          <q-space />
          <q-btn :style="buttonStyle" label="Save" @click="editProfileSubmit" />
        </q-toolbar>
      </q-footer>
    </q-layout>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import mixinGeneral from "src/mixins/mixin-general.js";

const menuList = [
  { icon: "account_circle", label: "About", separator: false },
  { icon: "bed", label: "Hosting", separator: true },
  { icon: "share", label: "Social profiles", separator: false },
  { icon: "fingerprint", label: "Account details", separator: false },
];
export default {
  mixins: [mixinGeneral],
  // props:['userData'],
  components: {
    "edit-about": require("components/Profile/EditTabs/About.vue").default,
    "edit-social": require("components/Profile/EditTabs/Social.vue").default,
    "edit-hosting": require("components/Profile/EditTabs/Hosting.vue").default,
    "edit-account": require("components/Profile/EditTabs/Account.vue").default,
  },
  data() {
    return {
      drawer: true,
      activelabel: "About",
      menuList,
    };
  },
  computed: {
    userId() {
      return this.$route.params.otherUserId;
    },
    userData() {
      return this.users[this.userId];
    },
  },
  methods: {
    editProfileSubmit() {
      this.updateItemAction({
        data: this.userData,
        path: "Users/" + this.userId,
      });
      this.$emit("close");
    },
  },
};
</script>

<style></style>
