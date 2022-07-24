const axios = require("axios");

const baseURL = "https://finnhub.io/api/v1";

const client = axios.create({ baseURL });

const apiKey = "cb7qvqiad3i5ufvovoog";

export const getSelectOptions = () =>
  client.get(`${baseURL}/stock/symbol?exchange=US&token=${apiKey}`);

export const getAssetSeries = (option, startDate, endDate) =>
  client.get(
    `${baseURL}/stock/candle?symbol=${option.value}&resolution=D&from=${startDate}&to=${endDate}&token=${apiKey}`
  );

export const getAssetCurrentData = (selected) =>
  client.get(`${baseURL}/quote?symbol=${selected.symbol}&token=${apiKey}`);

//`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${apiKey}`
