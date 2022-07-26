import { Line } from "@ant-design/plots";

export default function LineChart({ data }) {

  const config = {
    data: data,
    padding: "auto",
    xField: "date",
    yField: "close",
    xAxis: {
      type: "timeCat",
      tickCount: 5,
    },
  };

  return <Line {...config} width={600} />;
}
