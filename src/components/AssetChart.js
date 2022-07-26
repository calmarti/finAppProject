import { Stock } from "@ant-design/plots";


export default function AssetChart({ data }) {
    
  const config = {
    appendPadding: [0, 10, 0, 0],
    data: data,
    xField: "date",
    yField: ["open", "close", "high", "low"],
    slider: {},
  };

  return(
    
    <Stock {...config} className="asset-graph" />
  )
}
