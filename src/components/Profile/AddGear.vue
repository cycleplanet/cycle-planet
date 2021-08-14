<template>
  <div class="bg-white" style="width: 100%;">
    <modal-header>Add gear item</modal-header>
    <q-card>
      <q-stepper
        v-model="step"
        animated
        ref="stepper"
        alternative-labels
        header-nav
        vertical
      >
        <q-step
          :name="1"
          :done="done1"
          prefix="1"
          :title="step === 1 ? 'Select categrory' : clickedItem"
        >
          <q-card-section class="q-pt-none">
            <q-list bordered separator>
              <q-item
                v-for="(item, itemKey) in items"
                :key="itemKey"
                clickable
                v-ripple
                @click="clickedItemMethod(itemKey)"
              >
                <q-item-section
                  ><b
                    >{{ itemKey }} ({{ Object.keys(item).length }})</b
                  ></q-item-section
                >
                <q-item-section side>
                  <q-icon name="arrow_right" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-step>

        <q-step
          :name="2"
          prefix="2"
          :done="done2"
          :title="step === 2 ? 'Select sub-categorie' : clickedChildItem"
        >
          <q-card-section class="q-pt-none">
            <q-list bordered separator>
              <q-item
                v-for="(item, itemKey) in items[clickedItem]"
                :key="itemKey"
                clickable
                v-ripple
                @click="clickedChildItemMethod(itemKey)"
              >
                <q-item-section
                  ><b
                    >{{ item.title }} ({{
                      Object.keys(gearUser[clickedItem][itemKey]).length
                    }})</b
                  ></q-item-section
                >
                <q-item-section side>
                  <q-icon name="arrow_right" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-step>

        <q-step
          :name="3"
          prefix="3"
          :done="done3"
          :title="step === 3 ? 'Select brand' : clickedBrandItem"
        >
          <q-card-section class="q-pt-none" v-if="gearUser[clickedItem]">
            <q-list
              bordered
              separator
              v-if="gearUser[clickedItem][clickedChildItem]"
            >
              <q-item
                v-for="(item, itemKey) in gearUser[clickedItem][
                  clickedChildItem
                ]"
                :key="itemKey"
                clickable
                v-ripple
              >
                <q-item-section @click="clickedBrandMethod(itemKey)"
                  ><b>{{ itemKey }} </b></q-item-section
                >
                <q-item-section side>
                  <div class="row">
                    <q-icon name="arrow_right" size="sm" />
                    <q-icon
                      name="delete"
                      size="sm"
                      v-if="
                        teamMember
                          ? true
                          : item.created.userId === myUserId
                          ? item.users
                            ? Object.keys(item.users).length > 5
                            : false
                          : false
                      "
                      @click="deleteBrand(itemKey)"
                    />
                  </div>
                </q-item-section>
              </q-item>

              <q-item v-if="addBrand" class="">
                <q-input
                  filled
                  v-model="addBrandString"
                  class="full-width no-padding"
                  label="Type new brand name"
                />
              </q-item>
            </q-list>
            <div class="q-mt-md">
              <q-btn
                v-if="!addBrand"
                :style="buttonStyle"
                icon="add"
                @click="addBrand = true"
                label="add brand"
              />
              <q-btn
                v-if="addBrand"
                label="cancel"
                class="buttontheme2"
                @click="addBrand = false"
              />
              <q-btn
                v-if="addBrand"
                :style="buttonStyle"
                label="add"
                @click="addBrandMethod()"
              />
            </div>
          </q-card-section>
        </q-step>

        <q-step
          :name="4"
          prefix="4"
          :done="done4"
          :title="step === 4 ? 'Select product' : ''"
          v-if="gearUser"
        >
          <q-card-section class="q-pt-none" v-if="gearUser[clickedItem]">
            <div v-if="gearUser[clickedItem][clickedChildItem]">
              <div
                v-if="gearUser[clickedItem][clickedChildItem][clickedBrandItem]"
                style="border: 1px solid LightGray;"
              >
                <q-list
                  v-for="(item, itemKey) in gearUser[clickedItem][
                    clickedChildItem
                  ][clickedBrandItem]"
                  :key="itemKey"
                >
                  <div v-if="itemKey !== 'created'">
                    <q-item clickable v-ripple>
                      <q-item-section @click="clickedProductMethod(itemKey)"
                        ><b>{{ itemKey }} </b></q-item-section
                      >

                      <q-item-section side>
                        <div class="row">
                          <q-icon
                            name="delete"
                            size="sm"
                            v-if="
                              teamMember
                                ? true
                                : item.created.userId === myUserId
                                ? item.users
                                  ? Object.keys(item.users).length > 5
                                  : false
                                : false
                            "
                            @click="deleteProduct(itemKey)"
                          />
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-separator />
                  </div>
                </q-list>
              </div>
              <div v-else>
                No products yet, be the first to add one.
              </div>
              <q-item v-if="addProduct" class="">
                <q-input
                  filled
                  v-model="addProductString"
                  class="full-width no-padding no-margin"
                  label="Type official product name"
                />
              </q-item>

              <div class="q-mt-md q-gutter-x-md">
                <q-btn
                  v-if="!addProduct"
                  :style="buttonStyle"
                  icon="add"
                  @click="addProduct = true"
                  label="add product"
                />
                <q-btn
                  v-if="addProduct"
                  class="buttontheme2"
                  label="cancel"
                  @click="addProduct = false"
                />
                <q-btn
                  v-if="addProduct"
                  :style="buttonStyle"
                  label="add"
                  @click="addProductMethod()"
                />
              </div>
            </div>
          </q-card-section>
        </q-step>
      </q-stepper>
    </q-card>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import mixinGeneral from "src/mixins/mixin-general.js";

export default {
  mixins: [mixinGeneral],
  data() {
    return {
      step: 1,
      done1: false,
      done2: false,
      done3: false,
      done4: false,

      addBrand: false,
      addProduct: false,

      addBrandString: "",
      addProductString: "",

      clickedItem: "",
      clickedChildItem: "",
      clickedBrandItem: "",
      clickedProductItem: "",

      items: {
        Bicycle: {
          Tourbike: { title: "Tourbike" },
          Bikepacking: { title: "Bikepacking" },
        },
        "Bicycle equipment": {
          "Tourbike bags": { title: "Tourbike bags" },
          "Bikepacking bags": { title: "Bikepacking bags" },
          Saddle: { title: "Saddle" },
          Hub: { title: "Hub" },
          Straps: { title: "Straps" },
          Other: { title: "Other" },
        },
        Camping: {
          Tent: { title: "Tent" },
          Airbed: { title: "Airbed" },
          "Sleeping bag": { title: "Sleeping bag" },
          "Camping accessoires": { title: "Camping accessoires" },
          Cooking: { title: "Cooking" },
          Survival: { title: "Survival" },
        },
        Electronics: {
          Camera: { title: "Camera" },
          Laptop: { title: "Laptop" },
          Powerbank: { title: "Powerbank" },
          Solar: { title: "Solar panels" },
          Transformer: { title: "Transformer" },
          Counter: { title: "Counter" },
          Drone: { title: "Drone" },
          "Electronics other": { title: "Electronics other" },
        },
        //   'Other':{},
      },
    };
  },

  computed: {
    ...mapState("other", ["gearUser"]),
  },
  methods: {
    ...mapActions("other", ["getAllGearUser", "addGearUser", "selectGearUser"]),

    clickedItemMethod(itemKey) {
      this.clickedItem = itemKey;
      this.done1 = true;
      this.step = 2;
    },
    clickedChildItemMethod(itemKey) {
      this.clickedChildItem = itemKey;
      this.done2 = true;
      this.step = 3;
    },
    clickedBrandMethod(itemKey) {
      this.clickedBrandItem = itemKey;
      this.done3 = true;
      this.step = 4;
    },
    clickedProductMethod(itemKey) {
      this.clickedProductItem = itemKey;
      this.selectGearUser({
        pathGear:
          this.clickedItem +
          "/" +
          this.clickedChildItem +
          "/" +
          this.clickedBrandItem +
          "/" +
          this.clickedProductItem,
        pathUser: this.clickedItem + "/" + this.clickedChildItem,
        string: this.clickedBrandItem + " - " + this.clickedProductItem,
      });
      this.clickedItem = "";
      this.clickedChildItem = "";
      this.clickedBrandItem = "";
      this.clickedProductItem = "";
      this.step = 1;
      this.done1 = false;
      this.done2 = false;
      this.done3 = false;
      this.done4 = false;
      this.$emit("close");
    },
    addBrandMethod() {
      this.addGearUser({
        path:
          this.clickedItem +
          "/" +
          this.clickedChildItem +
          "/" +
          this.addBrandString +
          "/created",
        payload: {
          userId: this.myUserId,
          timeStamp: this.timeStamp,
          name: this.addBrandString,
        },
      });
      this.addBrandString = "";
      this.addBrand = false;
    },
    addProductMethod() {
      this.addGearUser({
        path:
          this.clickedItem +
          "/" +
          this.clickedChildItem +
          "/" +
          this.clickedBrandItem +
          "/" +
          this.addProductString +
          "/created",
        payload: {
          userId: this.myUserId,
          timeStamp: this.timeStamp,
          name: this.addProductString,
        },
      });
      this.addProductString = "";
      this.addProduct = false;
    },
    deleteBrand(itemKey) {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Are you sure you want to delete this brand?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.deleteItemAction({
            path:
              "GearUser/" +
              this.clickedItem +
              "/" +
              this.clickedChildItem +
              "/" +
              itemKey,
          });
        })
        .onOk(() => {})
        .onCancel(() => {})
        .onDismiss(() => {});
    },
    deleteProduct(itemKey) {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Are you sure you want to delete this product?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.deleteItemAction({
            path:
              "GearUser/" +
              this.clickedItem +
              "/" +
              this.clickedChildItem +
              "/" +
              this.clickedBrandItem +
              "/" +
              "/" +
              itemKey,
          });
        })
        .onOk(() => {})
        .onCancel(() => {})
        .onDismiss(() => {});
    },
  },
  mounted() {
    this.getAllGearUser();
  },
};
</script>

<style></style>
