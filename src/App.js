import AsyncSelect from "react-select/async";
import { useEffect, useState } from "react";
import { Stock } from "@ant-design/plots";
import { Button } from "antd";

const client = require("axios");

const apiKey = "cb7qvqiad3i5ufvovoog";

//dato del cierre del índice S&P500 => yahoo finance api
//https://query2.finance.yahoo.com/v8/finance/chart/%5EGSPC
//where %5E is ^ ( ^GSPC )
//de hecho, el api de yahoo podría ser mejor que finhub (en particular para obtener el symbol en el async select) - único tema es el limite diario de 100 requests!

//TODO: decisión: ¿sigo con finhub y monto el candle stick chart con Ant Design y el json "a mano" o me la juego con yahoo finance?

//TODO: cambios:
//1. crear un JSON con los ticker genéricos del S&P500 y reestructurar con él el funcionamiento de AsyncSelect
//2. luego eliminar llamada al API de /search (symbol lookup) (los simbolos más específicos dan 403 o "No data") - funcionalidad en standby hasta encontrar un endpoint equivalente en otra API

//TODO: el search debe funcionar siempre: leer docs (sobretodo parte de objeto Components)
//TODO: find out: ¿está bien meter algo en el 'value' del option (e.g. symbol)?

//Chart: Stock de Ant Design
//Probar que handleGetSeries recibe el objeto del endpoint
//transformar el objeto recibido a objeto input de Chartsjs
//Mutar el estado de la serie transformada (useState)

function App() {
  const [keyword, setKeyword] = useState("");
  const [selected, setSelected] = useState("AAPL");
  const [options, setOptions] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    client
      .get(`https://finnhub.io/api/v1/search?q=${keyword}&token=${apiKey}`)
      //`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${apiKey}`

      .then((res) => {
        console.log(res);
        const data = res.data.result.map((obj) => ({
          label: obj.description,
          value: obj.symbol,
        }));
        setOptions(data);
      })
      .catch((err) => console.log(err));
  }, [keyword]);

  //console.log("keyword", keyword);

  console.log("options", options);
  console.log("selected", selected);

  const filterOptions = (inputValue) => {
    setKeyword(inputValue);
    const filtered = options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    console.log("filtered", filtered);
    return filtered;
  };

  const promiseOptions = (inputValue) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(filterOptions(inputValue));
        console.log("resolved!");
      }, 1500);
    });

  const handleChange = (option) => {
    setSelected(option.value);
  };

  const yesterday = Math.floor(Date.now() / 1000) - Math.floor(1 * 24 * 3600); //must be seconds , not miliseconds
  const aYearAgo = Math.floor(Date.now() / 1000) - Math.floor(365 * 24 * 3600);

  const startDate = aYearAgo;
  const endDate = yesterday;

  console.log(startDate);
  console.log(endDate);
  console.log("data", data);
  /*
*
Ant-Design object:
ts_code	"000001.SH"
trade_date	"2020-02-13"
close	2906.0735
open	2927.1443
high	2935.406
low	2901.2425
vol	274804844
amount	334526327.4
*/

  const handleGetSeries = async (ev) => {
    ev.preventDefault();
    try {
      const { data: multiseries } = await client.get(
        `https://finnhub.io/api/v1/stock/candle?symbol=${selected}&resolution=D&from=${startDate}&to=${endDate}&token=${apiKey}`
      );
      const len = multiseries.t.length;
      const data = [...Array(len)];
      console.log("multiseries", multiseries);
      for (let i in data) {

      //convert to right date format here (maybe using toISOString...)
      
        data[i] = {
          close: multiseries.c[i],
          high: multiseries.h[i],
          low: multiseries.l[i],
          open: multiseries.o[i],
          date: multiseries.t[i],  
          volume: multiseries.v[i],
        };
      }
      setData(data);
    } catch (err) {
      console.log(err);
    }
  };

  const config = {
    appendPadding: [0, 10, 0, 0],
    data,
    xField: "date",
    yField: ["open", "close", "high", "low"],
    slider: {},
  };

  return (
    <div className="App">
      <AsyncSelect
        autoFocus={true}
        // cacheOptions={true}  //TODO: probar esto
        loadOptions={promiseOptions}
        value={selected}
        onChange={(option) => setSelected(option.value)}
      />

      <Button
        style={{ margin: "10px 10px", width: "100px" }}
        type="primary"
        size="large"
        onClick={handleGetSeries}
      >
        Go
      </Button>
      <Stock {...config} />
    </div>
  );
}

export default App;
