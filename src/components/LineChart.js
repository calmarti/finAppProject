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
    yAxis: {
      grid: {
        line: {
          style: {
            stroke: "grey",
            lineWidth: 2,
            lineDash: [4, 5],
            strokeOpacity: 0.7,
            shadowColor: "black",
            shadowBlur: 10,
            shadowOffsetX: 5,
            shadowOffsetY: 5,
            cursor: "pointer",
          },
        },
      },
    },
    meta: {
      close: {
        //TODO: opcional: ajustar rango del y-Axis a rango de la serie
        // min: data[data.length-1].close,
        // max: data[data.length-1].close
        
      },
    }
  };

  return <Line {...config} width={800} />;
}
