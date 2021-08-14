import Vue from 'vue'
import { firebase } from 'boot/config'
import {showErrorMessage} from 'src/functions/function-show-error-message'
import { countryConstants } from 'app/firebase-functions/shared/src/country-constants.js'

const state = {
	allCountryData:{},
	search: '',

	whatsappgroups:{
		africa1:{name:'West Africa', link:'https://chat.whatsapp.com/GWfNH4Jk7nnJzSF1ZJBghO'},
		africa2:{name:'East Africa', link:'https://chat.whatsapp.com/Ks1O8OSBaoFAxgzmJsXEQX'},
		middleEast:{name:'Middle East', link:'https://chat.whatsapp.com/KlmFjR8cbEl2oTqxBjAvm1'},
		cnAsia:{name:'Central & North Asia', link:'https://chat.whatsapp.com/KFPOAcBzNd9LnLHBpEf0S5'},
		seAsia:{name:'South East Asia', link:'https://chat.whatsapp.com/KSnACNW1N2gJzyCg34volO'},
		oceania:{name:'Oceania', link:'https://chat.whatsapp.com/KuTZdaERWYk9x7SErsQMJr'},
		nAmerica:{name:'North America', link:'https://chat.whatsapp.com/LZY4a9oPVu3Jr8bRbV1yqy'},
		sAmerica:{name:'South America', link:'https://chat.whatsapp.com/Km3UpBk5Cvc66GarXoaFlm'},
		europe:{name:'Europe', link:'https://chat.whatsapp.com/ITxb9OzZHBhGHNCXK9wK3r'},
	  },

	continentAdapter:{
		'Australia & New Zealand':{continent:'Oceania', whatsappgroups:['oceania']},
		'Melanesia':{continent:'Oceania',whatsappgroups:['oceania']},
		'Micronesia':{continent:'Oceania',whatsappgroups:['oceania']},
		'Polynesia':{continent:'Oceania',whatsappgroups:['oceania']},

		'Caribbean':{continent:'North America',whatsappgroups:['nAmerica','sAmerica']},
		'Central America':{continent:'North America',whatsappgroups:['nAmerica','sAmerica']},
		'Northern America':{continent:'North America',whatsappgroups:['nAmerica']},
		'South America':{continent:'South America',whatsappgroups:['sAmerica']},

		'Central Asia':{continent:'Asia',whatsappgroups:['cnAsia']},
		'Eastern Asia':{continent:'Asia',whatsappgroups:['seAsia']},
		'Western Asia':{continent:'Asia',whatsappgroups:['middleEast']},
		'Southern Asia':{continent:'Asia',whatsappgroups:['seAsia']},
		'South-Eastern Asia':{continent:'Asia',whatsappgroups:['seAsia']},

		'Eastern Africa':{continent:'Africa',whatsappgroups:['africa2']},
		'Middle Africa':{continent:'Africa',whatsappgroups:['africa1','africa2']},
		'Northern Africa':{continent:'Africa',whatsappgroups:['africa1','africa2']},
		'Western Africa':{continent:'Africa',whatsappgroups:['africa1']},
		'Southern Africa':{continent:'Africa',whatsappgroups:['africa1','africa2']},

		'Eastern Europe':{continent:'Europe',whatsappgroups:['europe']},
		'Northern Europe':{continent:'Europe',whatsappgroups:['europe']},
		'Western Europe':{continent:'Europe',whatsappgroups:['europe']},
		'Southern Europe':{continent:'Europe',whatsappgroups:['europe']},
	}
}

const mutations = {
	addCountry(state, payload) {
		Vue.set(state.allCountryData, payload.countryKey, payload.countryDetails)
	},
	updateCountry(state, payload) {
		Object.assign(state.allCountryData[payload.countryKey], payload.countryDetails)
	},
	setSearch(state, value) {
		state.search = value
	},
	
}

const actions = {
	setSearch({ commit }, value) {
		commit('setSearch', value)
	},

	
	
	firebasegetCountries({ commit }) {
		firebase.db.ref('Country_data/').on('child_added', snapshot => {
			let countryDetails = snapshot.val()
			let countryKey = snapshot.key
			
			commit('addCountry', {countryKey,countryDetails})
		})
		firebase.db.ref('Country_data/').on('child_changed', snapshot => {
			let countryDetails = snapshot.val()
			let countryKey = snapshot.key
			commit('updateCountry', {
				countryKey,
				countryDetails
			})
		})
	},
}

const getters = {
	
	countriesFiltered: (state, getters) => {
		if (!state.search) return countryConstants

		const searchString=state.search.toLowerCase()

		return Object.fromEntries(
			Object.entries()
			.filter(([_, v]) => v.fullName.toLowerCase().includes(searchString))
		);		
	},
	countriesAll: (state, getters) => {
		
		let countriesFiltered = getters.countriesFiltered

		let countries = {}
		Object.keys(countriesFiltered).forEach(function(key) {
			let country = countriesFiltered[key]
			if (countries.name) {
				countries[key] = task
			}
			countries[key] = country
			
		})

		return countries
	},
	
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}