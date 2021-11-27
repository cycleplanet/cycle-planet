<template>
  <div>
    <div class="q-mb-md">
      <q-item class="no-padding">
        <q-item-section class="cp-h2">{{
          refsextra[refKey].title
        }}</q-item-section>
        <q-item-section side top>
          <div>
            <q-btn
              :style="buttonStyle"
              round
              icon="edit"
              size="sm"
              @click.native="loggedIn ? editItemMethod() : showLoginDialog()"
              v-if="!(refKey === 'Visa' && data.schengen)"
            />
            <q-btn
              flat
              @click.native="loggedIn ? editItemMethod() : showLoginDialog()"
            ></q-btn>
          </div>
        </q-item-section>
      </q-item>

      <div v-if="data">
        <div class="text-caption text-grey row">
          Last edited by
          <username-no-avatar
            clickable
            class="q-mx-xs"
            :userId="data.user_edited"
          />
          on <date-created class="q-ml-xs" :dateprop="data.date_edited" />
        </div>
      </div>
      <q-separator />
    </div>

    <div v-if="data" class="cp-p">
      <p
        v-if="refKey === 'Visa' && data.schengen"
        v-html-safe="adminData.visas.schengen.text"
      ></p>
      <p v-else v-html-safe="data.body"></p>
    </div>

    <q-dialog v-model="editItem">
      <edit-item
        :refKey="refKey"
        :countryKey="countryKey"
        :data="data"
        @close="editItem = false"
      />
    </q-dialog>
  </div>
</template>

<script>
import mixinGeneral from "src/mixins/mixin-general.js";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  mixins: [mixinGeneral],

  props: ["countryKey", "refKey", "data"],

  components: {
    "edit-item": require("components/Country/Modals/EditItem.vue").default,
  },

  data() {
    return {
      editItem: false,
    };
  },
  computed: {},
  methods: {
    editItemMethod() {
      this.editItem = true;
    },
  },
};
</script>

<style></style>
