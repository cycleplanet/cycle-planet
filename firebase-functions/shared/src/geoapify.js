const axios = require('axios');
 
class Geoapify {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async reverseGeocode(lat, lng) {
        try {
            const apiUrl1 = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${this.apiKey}`
            const result = await axios.get(apiUrl1);
            if (result.data) {
                return result.data.features[0].properties;
            } else {
                return null;
            }
        } catch (err) {
            console.error(`Error reverse geocoding (${lat}, ${lng}`, err);
        }
    }

    async reverseGeocodeToCountryCode (lat, lng) {
        const address = await this.reverseGeocode(lat, lng);
        return address ? address.country_code.toUpperCase() : null;
    }
}

module.exports.Geoapify = Geoapify;