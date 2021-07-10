<template>
	<div >
	<q-select 
	:options="Object.keys(allCountries)" 
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
		...mapGetters('countries', ['allCountries']),
		}
	}
</script>