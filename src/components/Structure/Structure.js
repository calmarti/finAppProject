import { Layout, Menu, Button } from "antd";
const { Header, Footer } = Layout;

export default function Structure({ children }) {
  const menuItems = [
    { key: "1", label: "Indexes" },
    { key: "2", label: "Exchange rates" },
    { key: "3", label: "Bonds" },
    /*   { key: "4", label: "Log in" },
    { key: "5", label: "Sign up" } */
  ];

  return (
    <Layout className="layout">
      <Header className="header"  style={{ backgroundColor: "#FFFFFF" }}>
        <div className="logo"></div>
        <Menu className="menu" theme="dark" mode="horizontal" items={menuItems} />
        <div className="header-buttons">
          <Button type="primary" size="default">
            Log In
          </Button>
          <Button type="default" size="default" className="signup-button">
            Sign Up
          </Button>
        </div>
      </Header>

      {children}

      <Footer className="footer">Footer</Footer>
    </Layout>
  );
}
