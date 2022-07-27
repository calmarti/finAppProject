import LineChart from "./LineChart";
import CandleStickChart from "./CandleStickChart";
import { BarChartOutlined, LineChartOutlined } from "@ant-design/icons";

export default function Chart({ type, data, setChartType }) {
  return (
    <>
      {type === "line" ? (
        <>
          <BarChartOutlined
            onClick={(ev) => setChartType("stock")}
            style={{ fontSize: "1.5rem" }}
          />
          <LineChart data={data} className="asset-graph" />
        </>
      ) : (
        <>
          <LineChartOutlined
            onClick={(ev) => setChartType("line")}
            style={{ fontSize: "1.5rem" }}
          />
          <CandleStickChart data={data} className="asset-graph" />
        </>
      )}
    </>
  );
}
