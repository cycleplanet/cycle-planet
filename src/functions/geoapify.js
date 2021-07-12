
import axios from 'axios';
import { geoapify } from '../boot/config.js'
 
class Geoapify {
    static async reverseGeocode(lat, lng) {
        try {
            const apiUrl1 = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${geoapify.apiKey}`
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

    static async reverseGeocodeToCountryCode (lat, lng) {
        const address = await this.reverseGeocode(lat, lng);
        return address ? address.country_code.toUpperCase() : null;
    }
}

export { Geoapify };