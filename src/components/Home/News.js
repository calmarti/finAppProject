import { Card } from "antd";

export default function News({ newsData }) {
  const topNews = newsData.slice(0, 5);
  console.log("top", topNews);
  return (
    <ul>
      {topNews.map((newsDatum, index) => (
        <li key={index} style={{ listStyleType: "none" }}>
          <Card
            size="small"
            title={newsDatum.headline}
            extra={<a href="#">More</a>}
            style={{ width: 300 }}
            // cover={<img alt="" src="" />}
          >
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
          </Card>
        </li>
      ))}
    </ul>
  );
}
