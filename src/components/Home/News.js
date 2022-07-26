import { Card } from "antd";

//TODO: cambiar formato del Card (docs de Ant Design), reemplazar el <p> por un subcompo interno del Card

export default function News({ newsData }) {
  // const { Meta } = Card;

  const topNews = newsData.slice(0, 5);
  console.log("top", topNews);

  return (
    <>
      <h2 className="top-news-title">Top News</h2>
      <ul className="cards-list">
        {topNews.map((newsDatum, index) => (
          <li key={index}>
            <Card
              className="card"
              type="inner"
              hoverable
              /* size="large" */
              /* title={newsDatum.headline} */
              // extra={<a href={newsDatum.url}>More</a>}
              // cover={<img alt={newsDatum.category} src={newsDatum.image} />}
            >
              <span>{new Date(newsDatum.datetime * 1000).toDateString()}</span>
              <h3>{newsDatum.headline}</h3>
              <a href={newsDatum.url}>
                <p className="card-summary">{newsDatum.summary}</p>
              </a>

              {/* <Meta  description={newsDatum.summary} 
            title={newsDatum.headline} 
            /> */}
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
