<template>
  <div>
    <q-expansion-item
      expand-separator
      class="bg-white"
      :label="'Users (' + Object.keys(users).length + ')'"
    >
      <q-card class="q-my-md q-pa-md">
        Sorted by last login, red has no coordinates.
        <div v-for="(user, itemKey) in usersSortedByLastLogin" :key="itemKey">
          <q-list bordered separator class="full-width">
            <q-expansion-item>
              <template v-slot:header>
                <q-item-section avatar>
                  <q-avatar>
                    <img :src="user.imageurl" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ user.fullname }}</q-item-label>
                  <q-item-label caption>{{ user.userId }}</q-item-label>
                  <q-item-label caption
                    >last login {{ user.online_date }}</q-item-label
                  >
                  <q-item-label caption>
                    <q-chip
                      outlined
                      :class="
                        user.coordinates
                          ? 'bg-green-2 text-green-10'
                          : 'bg-red-2 text-red-10'
                      "
                      :icon="
                        user.coordinates ? 'check_circle' : 'highlight_off'
                      "
                      label="Coordinates"
                    />
                    <q-chip
                      outlined
                      :class="
                        user.points
                          ? 'bg-green-2 text-green-10'
                          : 'bg-red-2 text-red-10'
                      "
                      :icon="user.points ? 'check_circle' : 'highlight_off'"
                      :label="
                        user.points
                          ? 'Points(' +
                            (user.points.score ? user.points.score : 0) +
                            ')'
                          : 'no points node in firebase'
                      "
                    />
                  </q-item-label>
                </q-item-section>
              </template>

              <q-card>
                <q-card-section>
                  <div v-for="(item, key) in user">
                    <b>{{ key }}:</b> {{ item }}
                  </div>
                  <div class="row">
                    <q-btn flat dense icon="chat" :to="/chat/ + user.userId" />
                    <q-btn
                      flat
                      dense
                      :to="/user/ + user.userId"
                      icon="fas fa-address-card"
                    />
                    <q-btn
                      flat
                      dense
                      icon="edit"
                      @click="editProfileMethod(user.userId)"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </div>
      </q-card>
    </q-expansion-item>

    <q-dialog v-model="editProfile">
      <edit-profile :userData="this.userData" @close="editProfile = false" />
    </q-dialog>
  </div>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  mixins: [mixinGeneral],
  data() {
    return {
      editProfile: false,
      userData: {},
    };
  },
  components: {
    "modal-follow-button": require("components/Shared/Modals/FollowButton.vue")
      .default,
    "edit-profile": require("components/Admin/EditProfile.vue").default,
  },
  computed: {
    ...mapGetters("auth", ["usersSortedByLastLogin"]),
  },
  methods: {
    editProfileMethod(userKey) {
      this.userData = this.users[userKey];
      this.editProfile = true;
    },
  },
};
</script>

<style></style>
