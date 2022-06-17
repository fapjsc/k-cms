import { useState, useEffect } from "react";

// Router
import { Link, useLocation } from "react-router-dom";

// Redux
import { useSelector } from "react-redux";

// Helpers
// import { _resetAllReducer } from '../lib/helper';

// Config
import { authorizedRoutes } from "../config/routerRole";

// Icon
// import { LogoutOutlined } from '@ant-design/icons';

// Style
import { Badge, Layout, Menu } from "antd";
const { Sider } = Layout;

const SideNav = () => {
  // Init State
  const [collapsed, setCollapsed] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  // Router
  // const history = useHistory();
  const location = useLocation();

  // Redux
  const { user } = useSelector((state) => state);
  const {
    loginInfo: { account },
  } = user;

  const toggle = () => {
    setCollapsed((preState) => !preState);
  };

  // const logoutHandler = () => {
  //   _resetAllReducer(true);
  //   history.replace('/login');
  // };

  useEffect(() => {
    const path = location.pathname.split("/")[1];
    setCurrentPath(path);
  }, [location.pathname]);

  const menuItem = authorizedRoutes
    .filter((menu) => menu.permissions.includes(account) && menu.isMenu)
    .map((menu) => (
      <Menu.Item key={menu.alias} icon={menu.icon}>
        <Link to={menu.path}>
          <Badge
            style={{
              display:
                menu.name === "會員對話" && location.pathname !== "/member-chat"
                  ? "inline-block"
                  : "none",
              right: "-15px",
            }}
            count={"1"}
          >
            <span>{menu.name}</span>
          </Badge>
        </Link>
      </Menu.Item>
    ));

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={toggle}>
      <div className="logo">
        <span>LOGO</span>
      </div>

      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["home"]}
        selectedKeys={[currentPath]}
      >
        {menuItem}

        {/* <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logoutHandler}>
          離開系統
        </Menu.Item> */}
      </Menu>
    </Sider>
  );
};

export default SideNav;
