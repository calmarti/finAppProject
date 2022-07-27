import { Stock } from "@ant-design/plots";


export default function AssetChart({ data }) {
    
  const config = {
    appendPadding: [0, 10, 0, 0],
    data: data,
    xField: "date",
    yField: ["close", "open", "high", "low"],
    slider: {},
    
  };

  return(
    
    <Stock {...config} /* autoFit={true}  */ width={800} /* className="asset-graph" */ />
  )
}
