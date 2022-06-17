// Layout
// import TheFooter from './TheFooter';
import SideNav from "./SideNav";
import HeaderContent from "./HeaderContent";

// Antd
import { Layout } from "antd";
const { Header, Content } = Layout;

const TheLayout = ({ children }) => {
  return (
    <Layout style={{ height: "100%" }}>
      <SideNav />
      <Layout className="site-layout">
        <Header style={{ display: "flex", alignItems: "center" }}>
          <HeaderContent />
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <div
            className="site-layout-background"
            style={{ padding: 12, minHeight: 360 }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default TheLayout;
