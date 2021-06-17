<template>
	<div >
	<q-select 
	:options="Object.keys(countriesAll)" 
	v-model="payload" 
	label="Select country" 
	behavior="menu" filled
	:rules="[val => !!val || 'Field is required']"
	/>
	</div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'

	export default {
		props: ['payload'],
		
		computed: { 
		...mapGetters('countries', ['countriesAll']),
		}
	}
</script>