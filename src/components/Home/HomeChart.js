import { useEffect, useState } from "react";
import { getSelectOptions, getAssetSeries, getNews } from "../../api/client";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Col, Row, Statistic, Tabs } from "antd";
import SelectBox from "../SelectBox";
import Chart from "../Chart";
import News from "./News";

//TODO: problema en 'changePeriod'

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
  const [chartType, setChartType] = useState("line");

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

  const { TabPane } = Tabs;

  const yesterday = Math.floor(Date.now() / 1000) - Math.floor(1 * 24 * 3600); //must be seconds , not miliseconds
  const aYearAgo = Math.floor(Date.now() / 1000) - Math.floor(365 * 24 * 3600);

  const startDate = aYearAgo;
  const endDate = yesterday;

  console.log("data", data);
  console.log("selected", selected);
  console.log("news", newsData);

  const handleGetSeries = async (option) => {
    try {
      setSelected({ name: option.label, symbol: option.value });
      const { data: multiseries } = await getAssetSeries(
        option,
        startDate,
        endDate
      );
      const series = fromMultiseriesToSeries(multiseries);
      setData(series);
      getAndSetLastPriceStats(series);
    } catch (err) {
      console.log(err);
    }
  };

  const fromMultiseriesToSeries = (multiseries) => {
    const len = multiseries.t.length;
    const series = [...Array(len)];
    console.log("multiseries", multiseries);
    for (let i in series) {
      const date = new Date(multiseries.t[i] * 1000).toISOString();
      series[i] = {
        close: multiseries.c[i],
        high: multiseries.h[i],
        low: multiseries.l[i],
        open: multiseries.o[i],
        date: date,
        volume: multiseries.v[i],
      };
    }
    return series;
  };

  const getAndSetLastPriceStats = (series) => {
    const lastPrice = series[series.length - 1].close;
    const lastButOnePrice = series[series.length - 2].close;

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
  };
  // const yearToDate = data.slice();

  // const { data: quote } = await getAssetCurrentData(selected);
  // console.log("quote", quote);
  // setCurrentData({
  //   price: quote.c,
  //   change: quote.d,
  //   percent_change: quote.dp,
  // });

  //datos para el selector de frecuencias
  //TODO: Transita perfecto de 1Y a 6M ... 5D.
  //Problema: al regresar a un período anterior el slice es sobre el nuevo data
  //solución posible (pero cara): crear un state solo para los tabs
  const last5Days = data?.slice(data.length - 5);
  const lastWeek = data?.slice(data.length - 7);
  const lastMonth = data?.slice(data.length - 22);
  const last3Months = data?.slice(data.length - 66);
  const last6Months = data?.slice(data.length - 132);
  //TODO: const YTD = undefined;

  const changePeriod = (key) => {
    switch (key) {
      case "1":
        setData(last5Days);
        break;
      case "2":
        setData(lastWeek);
        break;
      case "3":
        setData(lastMonth);
        break;
      case "4":
        setData(last3Months);
        break;
      case "5":
        setData(last6Months);
        break;
      //TODO: case: back to 1 year
    }
  };

  console.log(lastPriceStats);

  return (
    <Row className="row">
      <Col span={14} className="asset-graph-section">
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
              className="statistic-component"
            />
          )}
        </div>
        <Chart type={chartType} data={data} setChartType={setChartType} />

        <Tabs
          defaultActiveKey="6"
          // onTabClick={changePeriod}
          onChange={(key) => changePeriod(key)}
        >
          <TabPane tab="5D" key="1"></TabPane>
          <TabPane tab="W" key="2"></TabPane>
          <TabPane tab="M" key="3"></TabPane>
          <TabPane tab="3M" key="4"></TabPane>
          <TabPane tab="6M" key="5"></TabPane>
          <TabPane tab="1Y" key="6"></TabPane>
        </Tabs>
      </Col>

      <Col span={6}>
        <News newsData={newsData} />
      </Col>
    </Row>
  );
}
