// src/components/CurrencyExchange.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CurrencyExchange.css';

const CurrencyExchange = () => {
  const [currencies, setCurrencies] = useState([]);
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_KEY = process.env.REACT_APP_API_KEY;
  const BASE_URL= process.env.API_BASE_URL;
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_CURRENCY_LIST_API_URL}?apikey=${API_KEY}`);
        setCurrencies(Object.keys(response.data.data));
      } catch (err) {
        console.error('Error fetching currencies:', err);
        setError('Failed to fetch currency list');
      }
    };

    fetchCurrencies();
  }, []);

  const handleCheckRate = async () => {
    if (!baseCurrency || !targetCurrency) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.freecurrencyapi.com/v1/latest?apikey=${process.env.REACT_APP_API_KEY}&currencies=${baseCurrency},${targetCurrency}`
      );

      const rate = response.data.data[targetCurrency];
      setExchangeRate(rate);
    } catch (err) {
      console.error('Error fetching exchange rate:', err);
      setError('Failed to fetch exchange rate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="currency-exchange-container">
      <h1 className="header">Currency Exchange</h1>

      {/* Error handling */}
      {error && <p className="error-message">{error}</p>}

      {/* Currency selection dropdowns */}
      <div className="currency-selectors">
        <div className="dropdown">
          <label htmlFor="base-currency">Base Currency:</label>
          <select
            id="base-currency"
            value={baseCurrency}
            onChange={(e) => setBaseCurrency(e.target.value)}
            disabled={loading}
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        <div className="dropdown">
          <label htmlFor="target-currency">Target Currency:</label>
          <select
            id="target-currency"
            value={targetCurrency}
            onChange={(e) => setTargetCurrency(e.target.value)}
            disabled={loading}
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Button to check exchange rate */}
      <div>
        <button onClick={handleCheckRate} disabled={loading}>
          {loading ? 'Checking...' : 'Check Rates'}
        </button>
      </div>

      {/* Exchange rate display */}
      {exchangeRate && (
        <div className="rate-result">
          <h3>Exchange Rate:</h3>
          <p>
            1 {baseCurrency} = {exchangeRate} {targetCurrency}
          </p>
        </div>
      )}
    </div>
  );
};

export default CurrencyExchange;
