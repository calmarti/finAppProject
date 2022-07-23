import { Layout } from "antd";
const { Header, Footer, Content } = Layout;

export default function Structure({ content }) {
  return (
    <Layout>
      <Header>Header</Header>
      <Content>{content}</Content>
      <Footer>Footer</Footer>
    </Layout>
  );
}
