import { useEffect, useState } from "react";
import {
  // getAssetCurrentData,
  getAssetSeries,
  getNews,
  getSelectOptions,
} from "../../api/client";
import SelectBox from "../SelectBox";
import AssetChart from "../AssetChart";
import { Col, Row } from "antd";
import News from "./News";

//TODO: submenú de principales índices y endpoints (y api(s)!) correspondiente(s)
//TODO: probar endpoint de alphavantage de exchange rates (meter symbols "a mano") y sino funciona buscar otra api
//TODO: Marquee-like component with main stock indexes, exchange rates, oil price, etc. (yahoo finance?)

//TODO: en AssetChart
//0. subtítulo: precio actual (quote) en orden de magnitud distinto al de la serie (de paso super lento); ¿cambiar por websockets?, ¿cambiar por últimas 2 entradas de series?
//1. posibilidad de cambiar a LineBar
//2. mini componente con datos del endpoint de Company Profile 2 (justo debajo del chart)

//TODO: segunda columna: news: endpoint market news => por defecto principales headlines del mercado y geopolíticas;
//al seleccionar 'asset' en SearchBox disparar en paralelo endpoint de company news y si hay news que las renderice
//en lugar de las headlines por defecto

//probar el Select de 'Antd' con opción 'remote' (¿better than async select)
//dato del cierre del índice S&P500 => yahoo finance api
//https://query2.finance.yahoo.com/v8/finance/chart/%5EGSPC
//where %5E is ^ ( ^GSPC )

export default function HomeMain() {
  const [keyword, setKeyword] = useState("");
  const [selected, setSelected] = useState({});
  const [options, setOptions] = useState([]);
  const [data, setData] = useState([]);
  const [newsData, setNewsData] = useState([]);

  // const [currentData, setCurrentData] = useState({
  //   price: null,
  //   change: null,
  //   percent_change: null,
  // });

  useEffect(() => {
    getSelectOptions()
      .then((res) => {
        console.log(res);
        const data = res.data.map((obj) => ({
          label: obj.description,
          value: obj.symbol,
        }));
        setOptions(data);
      })
      .catch((err) => console.log(err));
  }, [keyword]);

  useEffect(() => {
    getNews().then((result) => {
      setNewsData(result.data);
    });
  }, []);

  //Stock component stuff

  const yesterday = Math.floor(Date.now() / 1000) - Math.floor(1 * 24 * 3600); //must be seconds , not miliseconds
  const aYearAgo = Math.floor(Date.now() / 1000) - Math.floor(365 * 24 * 3600);

  const startDate = aYearAgo;
  const endDate = yesterday;

  console.log("data", data);
  console.log("selected", selected);
  console.log("news", newsData);

  const handleGetSeries = async (option) => {
    console.log("OPTION", option);
    try {
      setSelected({ name: option.label, symbol: option.value });
      const { data: multiseries } = await getAssetSeries(
        option,
        startDate,
        endDate
      );
      const len = multiseries.t.length;
      const data = [...Array(len)];
      console.log("multiseries", multiseries);
      for (let i in data) {
        const date = new Date(multiseries.t[i] * 1000).toISOString();
        data[i] = {
          close: multiseries.c[i],
          high: multiseries.h[i],
          low: multiseries.l[i],
          open: multiseries.o[i],
          date: date,
          volume: multiseries.v[i],
        };
      }
      setData(data);
      // const { data: quote } = await getAssetCurrentData(selected);
      // console.log("quote", quote);
      // setCurrentData({
      //   price: quote.c,
      //   change: quote.d,
      //   percent_change: quote.dp,
      // });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Row className="row">
      <Col span={12} className="asset-graph-section">
        <SelectBox
          options={options}
          selected={selected}
          setKeyword={setKeyword}
          handleGetSeries={handleGetSeries}
        />
        <div className="asset-title">
          <h2>{selected.name}</h2>
          {/*           <h2>{currentData.close}</h2>
          <h3>
            {currentData.change}
            <span style={{ fontSize: "1rem" }}>
              {currentData.percent_change &&
                ` (${currentData.percent_change}%)`}
            </span>
          </h3> */}
        </div>

        <AssetChart data={data} />
      </Col>

      <Col span={10} >
        <News newsData={newsData} />
      </Col>
    </Row>
  );
}
