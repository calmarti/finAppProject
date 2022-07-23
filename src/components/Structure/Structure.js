import { Layout, Menu, Button } from "antd";
const { Header, Footer } = Layout;

export default function Structure({ content }) {
  const menuItems = [
    { key: "1", label: "Indexes" },
    { key: "2", label: "Exchange rates" },
    { key: "3", label: "Bonds" },
    /*   { key: "4", label: "Log in" },
    { key: "5", label: "Sign up" } */
  ];

  return (
    <Layout className="layout">
      <Header className="header">
        <div className="logo" style={{ color: "#ffffff" }} />
        <Menu theme="dark" mode="horizontal" items={menuItems} />
        <div className="header-buttons">
          <Button type="primary" size="default">
            Log In
          </Button>
          <Button type="default" size="default">
            Sign Up
          </Button>
        </div>
      </Header>

      {content}

      <Footer className="footer">Footer</Footer>
    </Layout>
  );
}
