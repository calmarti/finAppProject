import { useEffect, useState } from "react";
import {
  // getAssetCurrentData,
  getAssetSeries,
  getNews,
  getSelectOptions,
} from "../../api/client";
import SelectBox from "../SelectBox";
import AssetChart from "../AssetChart";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Col, Row, Statistic } from "antd";
import News from "./News";

//TODO: submenú de principales índices y endpoints (y api(s)!) correspondiente(s)
//TODO: probar endpoint de alphavantage de exchange rates (meter symbols "a mano") y sino funciona buscar otra api
//TODO: Marquee-like component with main stock indexes, exchange rates, oil price, etc. (yahoo finance?)

//TODO: en AssetChart
//0. estilos y features nativos del compo Stock (read the docs!)
//1. opciones: 1D, 5D, W, M, 3M, 6M, 1Y, YTD.
//1.1 contenedor de frecuencias (compo de antd apropiado)
//1.2 una variable para cada segmento (a partir del state data, sin api calls)
//1.3 pasar variables como props al contenedor y lógica del handleClick
//2. posibilidad de cambiar a LineBar
//3. mini componente con datos del endpoint de Company Profile 2 (justo debajo del chart)

//probar el Select de 'Antd' con opción 'remote' (¿better than async select)
//dato del cierre del índice S&P500 => yahoo finance api
//https://query2.finance.yahoo.com/v8/finance/chart/%5EGSPC
//where %5E is ^ ( ^GSPC )

//TODO: probar si al inicializar los useState (donde tenga sentido) todo sigue igual

export default function HomeChart() {
  const [keyword, setKeyword] = useState("");
  const [selected, setSelected] = useState({});
  const [options, setOptions] = useState([]);
  const [data, setData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [lastPriceStats, setLastPriceStats] = useState(null);

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
      const lastPrice = data[data.length - 1].close;
      const lastButOnePrice = data[data.length - 2].close;
      const absoluteChange = Number.parseFloat(
        lastPrice - lastButOnePrice
      ).toFixed(2);
      const relativeChange = Number.parseFloat(
        (absoluteChange / lastButOnePrice) * 100
      ).toFixed(2);
      setLastPriceStats({
        lastPrice,
        absoluteChange,
        relativeChange,
      });

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

  console.log(lastPriceStats);

  return (
    <Row className="row">
      <Col span={12} className="asset-graph-section">
        <SelectBox
          options={options}
          selected={selected}
          setKeyword={setKeyword}
          handleGetSeries={handleGetSeries}
        />

        <div className="asset-stats">
          {selected.name && (
            <h2 style={{ fontSize: "1.6rem" }}>{selected.name}</h2>
          )}

          {lastPriceStats && (
            <span style={{ fontSize: "1.6rem" }}>
              {lastPriceStats && lastPriceStats.lastPrice}{" "}
              <span style={{ fontSize: "1rem" }}>USD</span>
            </span>
          )}

          {lastPriceStats && (
            <Statistic
              title={selected.symbol}
              value={lastPriceStats.relativeChange}
              precision={2}
              valueStyle={
                lastPriceStats.relativeChange > 0
                  ? { color: "#3f8600" }
                  : { color: "red" }
              }
              prefix={
                lastPriceStats.relativeChange > 0 ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )
              }
              suffix="%"
            />
          )}
        </div>

        {/* {lastPriceStats && (
            <h4
              className={lastPriceStats.absoluteChange < 0 ? "show-in-red" : "show-in-green"}
            >
              {lastPriceStats.absoluteChange +
                " " +
                `(${lastPriceStats.relativeChange}%)`}
            </h4>
          )} 
        </div> */}

        <AssetChart data={data} />
      </Col>

      <Col span={10}>
        <News newsData={newsData} />
      </Col>
    </Row>
  );
}
