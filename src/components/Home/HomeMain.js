import { useEffect, useState } from "react";
import { getAssetSeries, getSelectOptions } from "../../api/client";
import { Button } from "antd";
import SelectBox from "../SelectBox";
import AssetChart from "../AssetChart";

import { Col, Divider, Row } from "antd";

//const client = require("axios");

//TODO: probar el Select de 'Antd' con opción 'remote' (¿better than async select)

//dato del cierre del índice S&P500 => yahoo finance api
//https://query2.finance.yahoo.com/v8/finance/chart/%5EGSPC
//where %5E is ^ ( ^GSPC )
//de hecho, el api de yahoo podría ser mejor que finhub (en particular para obtener el symbol en el async select) - único tema es el limite diario de 100 requests!

//TODO: decisión: ¿sigo con finhub y monto el candle stick chart con Ant Design y el json "a mano" o me la juego con yahoo finance?

//TODO: cambios:
//1. crear un JSON con los ticker genéricos del S&P500 y reestructurar con él el funcionamiento de AsyncSelect
//2. luego eliminar llamada al API de /search (symbol lookup) (los simbolos más específicos dan 403 o "No data") - funcionalidad en standby hasta encontrar un endpoint equivalente en otra API

//TODO: el search debe funcionar siempre: leer docs (sobretodo parte de objeto Components)

export function HomeMain() {
  const [keyword, setKeyword] = useState("");
  const [selected, setSelected] = useState({});
  const [options, setOptions] = useState([]);
  const [data, setData] = useState([]);

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

  //Stock component stuff

  const yesterday = Math.floor(Date.now() / 1000) - Math.floor(1 * 24 * 3600); //must be seconds , not miliseconds
  const aYearAgo = Math.floor(Date.now() / 1000) - Math.floor(365 * 24 * 3600);

  const startDate = aYearAgo;
  const endDate = yesterday;

  console.log("data", data);
  console.log("selected", selected);

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
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <Row className="row">
      <Col span={16} className="asset-graph-section">
        <SelectBox
          options={options}
          selected={selected}
          setKeyword={setKeyword}
          handleGetSeries={handleGetSeries}
        />
        <div className="asset-title">
          <h2>{selected.name}</h2>
        </div>

        <AssetChart data={data} />
      </Col>

      <Col span={6}>Segunda columna: noticias</Col>
    </Row>
  );
}
