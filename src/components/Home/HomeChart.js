import { useEffect, useState } from "react";
import { getSelectOptions, getAssetSeries, getNews } from "../../api/client";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Col, Row, Statistic, Tabs } from "antd";
import SelectBox from "../SelectBox";
import Chart from "../Chart";
import News from "./News";
import utils from "../../utils";



//TODO: problema: hay que resetear el tab (ej. si está en 1M y se dispara otro handleGetSeries por defecto debe pasar a 1Y)
//para esto buscar en el API la prop apropiada de Tabs 


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

  const [series, setSeries] = useState([]);
  const [data, setData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [lastPriceStats, setLastPriceStats] = useState(null);
  const [chartType, setChartType] = useState("line");

  useEffect(() => {
    getSelectOptions()
      .then((res) => {
        // console.log(res);
        const data = res.data.map((obj) => ({
          label: obj.description,
          value: obj.symbol,
        }));
        setOptions(data);
      })
      .catch((err) => console.log(err));
  }, [keyword]);

  // const periods = useMemo(
  //   () => ({
  //     last5Days: series?.slice(series.length - 5),
  //     lastWeek: series?.slice(series.length - 7),
  //     lastMonth: series?.slice(series.length - 22),
  //     last3Months: series?.slice(series.length - 66),
  //     last6Months: series?.slice(series.length - 132),
  //   }),
  //   [series]
  // );

  useEffect(() => {
    getNews().then((result) => {
      setNewsData(result.data);
    });
  }, []);

  const { TabPane } = Tabs;

  console.log("series", series);
  console.log("data", data);

  const handleGetSeries = async (option) => {
    try {
      setSelected({ name: option.label, symbol: option.value });

      const { data: multiseries } = await getAssetSeries(
        option,
        utils.A_YEAR_AGO,
        utils.YESTERDAY
      );
      setSeries(fromMultiseriesToSeries(multiseries));
      console.log("series from handleGetSeries", series)
      setData(fromMultiseriesToSeries(multiseries));
      getAndSetLastPriceStats(fromMultiseriesToSeries(multiseries));  
    } catch (err) {
      console.log(err);
    }
  };

  const fromMultiseriesToSeries = (multiseries) => {
    const len = multiseries.t.length;
    const series = [...Array(len)];
    console.log('desde multi', series)
    // console.log("multiseries", multiseries);
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
  //otra solución (¿mejor?): método filter sobre data
  
  const last5Days = series?.slice(series.length - 5);
  const lastWeek = series?.slice(series.length - 7);
  const lastMonth = series?.slice(series.length - 22);
  const last3Months = series?.slice(series.length - 66);
  const last6Months = series?.slice(series.length - 132);

  const changePeriod = (key) => {
    switch (key) {
      case "1":
        // setData(series);
        setData(last5Days);
        break;
      case "2":
        // setData(series);
        setData(lastWeek);
        break;
      case "3":
        // setData(series);
        setData(lastMonth);
        break;
      case "4":
        // setData(series);
        setData(last3Months);
        break;
      case "5":
        // setData(series);
        setData(last6Months);
        break;
      case "6":
        setData(series);
        break;
      default:
        setData(series);
    }
  };

  // console.log(lastPriceStats);

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
