<template>
    <q-input dense v-model="searchField" @keyup.esc="searchField = ''" v-select-all  class="col inputfield q-pl-sm" label="Search country">
        <template v-slot:append>
          <q-icon v-if="searchField !== ''" name="close" @click="searchField = ''" class="cursor-pointer" />
          <q-icon name="search" />
        </template>
    </q-input>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { selectAll } from 'src/directives/directive-select-all'

export default {
    computed: {
        ...mapState('countries', ['search']),
        searchField: {
            get() {
                return this.search
            },
            set(value) {
                this.setSearch(value)
            }
        }
    },
    methods: {
        ...mapActions('countries', ['setSearch'])
    },
    directives: {
        selectAll
    }
}
</script>
<style>
.inputfield{
    width:150px;
    background-color:white;
    border-radius:20px;
    border:1px solid black;
}
</style>
