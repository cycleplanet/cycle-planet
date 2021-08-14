const axios = require("axios");
const http = require("http");
const https = require("https");

class Geoapify {
  constructor(apiKey) {
    this.apiKey = apiKey;
    const httpAgent = new http.Agent({ keepAlive: true });
    const httpsAgent = new https.Agent({ keepAlive: true });
    this.httpClient = axios.create({
      baseURL: `https://api.geoapify.com/v1/geocode`,
      httpAgent,
      httpsAgent,
    });
  }

  async reverseGeocode(lat, lng) {
    try {
      const apiUrl1 = `/reverse?lat=${lat}&lon=${lng}&apiKey=${this.apiKey}`;
      const result = await this.httpClient.get(apiUrl1);
      if (result.data) {
        return result.data.features[0].properties;
      } else {
        return null;
      }
    } catch (err) {
      console.error(`Error reverse geocoding (${lat}, ${lng}`, err);
    }
  }

  async reverseGeocodeToCountryCode(lat, lng) {
    const address = await this.reverseGeocode(lat, lng);
    return address ? address.country_code.toUpperCase() : null;
  }
}

module.exports.Geoapify = Geoapify;
