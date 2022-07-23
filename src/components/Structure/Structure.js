import { Layout, Menu } from "antd";
const { Header, Footer } = Layout;

export default function Structure({ content }) {
  const menuItems = [
    { key: "1", label: "Indexes" },
    { key: "2", label: "Exchange rates" },
    { key: "3", label: "Bonds" },
  ];

  return (
    <Layout className="layout">
      <Header
        style={{
          position: "fixed",
          /*  zIndex: 1, */
          width: "100%",
        }}
      >
        <div className="logo" style={{ color: "#ffffff" }} />
        <Menu theme="dark" mode="horizontal" items={menuItems} />
      </Header>

      {content}

      <Footer className="footer">Footer
      </Footer>
    </Layout>
  );
}
