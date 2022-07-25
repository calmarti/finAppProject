import { Card, Col, Row } from "antd";

export default function News({ newsData }) {
  const topNews = newsData.slice(0, 6);
  console.log("top", topNews);
  return (
    <ul className="cards-list">
      {topNews.map((newsDatum, index) => (
        <li key={index}>
          <Card
            size="small"
            title={newsDatum.headline}
            extra={<a href="#">More</a>}
            style={{ width: 260, height: 300 }}
            // cover={<img alt="" src="" />}
          >
            <p>{newsDatum.summary}</p>
          </Card>
        </li>
      ))}
    </ul>
  );
}
