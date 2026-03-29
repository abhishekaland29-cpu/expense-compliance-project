const express = require('express');
const router = express.Router();
const currencyService = require('../services/currencyService');

router.get('/countries', async (req, res) => {
    const countries = await currencyService.getCountries();
    res.json(countries);
});

module.exports = router;