import { Card, Col, Row } from "antd";

//TODO: cambiar formato del Card (docs de Ant Design), reemplazar el <p> por un subcompo interno del Card

export default function News({ newsData }) {
  const topNews = newsData.slice(0, 4);
  console.log("top", topNews);
  return (
    <ul className="cards-list">
      {topNews.map((newsDatum, index) => (
        <li key={index}>
          <Card
            type="inner"
            /* size="large" */
            title={newsDatum.headline}
            extra={<a href={newsDatum.url}>More</a>}
            style={{ width: 260, height:300 }}
            cover={<img alt={newsDatum.category} src={newsDatum.image} />}
          >
            <p>{newsDatum.summary}</p>
          </Card>
        </li>
      ))}
    </ul>
  );
}
