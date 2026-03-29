const axios = require('axios');

exports.getCountries = async () => {
    try {
        console.log("Fetching countries...");
        const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,currencies');
        
        // Use .filter to skip any country that doesn't have a name
        const countryList = response.data
            .filter(country => country && country.name && country.name.common)
            .map(country => {
                // Safely get currency code and name
                const currencies = country.currencies || {};
                const currencyCode = Object.keys(currencies)[0] || 'N/A';
                const currencyName = currencies[currencyCode]?.name || 'No Currency';

                return {
                    name: country.name.common,
                    currencyCode: currencyCode,
                    currencyName: currencyName
                };
            });

        return countryList.sort((a, b) => a.name.localeCompare(b.name));

    } catch (error) {
        console.error("❌ API Fetch Error:", error.message);
        return { error: "Failed to fetch countries", details: error.message };
    }
};