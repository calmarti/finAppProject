import AsyncSelect from "react-select/async";
import { useEffect, useState } from "react";
const client = require("axios");

const apiKey = "cb7qvqiad3i5ufvovoog";

//TODO: el search debe funcionar siempre: leer docs (sobretodo parte de objeto Components)
//TODO: find out: ¿está bien meter algo en el 'value' del option (e.g. symbol)?
//TODO: stockcharts.js => prueba primero con un area chart + candle stick endopint


function App() {
  const [keyword, setKeyword] = useState("");
  const [selected, setSelected] = useState("");
  const [options, setOptions] = useState([]);

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

  // console.log(obj)

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

{/* <SingleValue/> */}

  return (

    <div className="App">
      <AsyncSelect
        autoFocus={true}
        // cacheOptions={true}  //TODO: probar esto
        loadOptions={promiseOptions}
        value={selected}
        onChange={(option)=> setSelected(option.value)}
      />
    </div>
  );
}

export default App;
