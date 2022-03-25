// @see https://github.com/AlanWei/react-acl-router
import { HomeOutlined } from "@ant-design/icons";

//** Authorized Pages */
import OrderScreen from "../pages/OrderScreen";
import OrderInfo from "../components/order/OrderInfo";
import MemberScreen from "../pages/MemberScreen";
import MemberInfo from "../components/member/MemberInfo";
import ValidData from "../pages/ValidData";

//** unAuthorized Pages */
import Login from "../pages/Login";
import AccessDenied from "../pages/AccessDenied";

export const authorizedRoutes = [
  {
    path: "/order",
    exact: true,
    permissions: ["admin", "op"],
    redirect: "/access-denied",
    component: OrderScreen,
    alias: "order",
    name: "Orders",
    icon: <HomeOutlined />,
    isMenu: true,
  },
  {
    path: "/order/:token",
    exact: true,
    permissions: ["admin", "op"],
    redirect: "/access-denied",
    component: OrderInfo,
    alias: "order-info",
    name: "OrderInfo",
    isMenu: false,
  },

  {
    path: "/member",
    exact: true,
    permissions: ["admin", "op"],
    redirect: "/access-denied",
    component: MemberScreen,
    alias: "member",
    name: "Members",
    icon: <HomeOutlined />,
    isMenu: true,
  },
  {
    path: "/member/:token",
    exact: true,
    permissions: ["admin", "op"],
    redirect: "/access-denied",
    component: MemberInfo,
    alias: "member-info",
    name: "MemberInfo",
    isMenu: false,
  },

  {
    path: "/valid",
    exact: true,
    permissions: ["admin", "op"],
    redirect: "/access-denied",
    component: ValidData,
    alias: "valid",
    name: "驗證碼查詢",
    icon: <HomeOutlined />,
    isMenu: true,
  },

  // {
  //   path: '/chat',
  //   exact: true,
  //   permissions: ['admin', 'op'],
  //   redirect: '/access-denied',
  //   component: ChatScreen,
  //   alias: 'chat',
  //   name: 'Chat',
  //   icon: <HomeOutlined />,
  //   isMenu: true,
  // },

  // {
  //   path: '/operator',
  //   exact: true,
  //   permissions: ['admin', 'op'],
  //   redirect: '/access-denied',
  //   component: OperatorScreen,
  //   alias: 'operator',
  //   name: '櫃檯值班',
  //   icon: <DollarOutlined />,
  // },
  // {
  //   path: '/cashier',
  //   exact: true,
  //   permissions: ['admin', 'op'],
  //   redirect: '/access-denied',
  //   component: CashierScreen,
  //   alias: 'cashier',
  //   name: '櫃檯接班明細',
  //   icon: <DollarOutlined />,
  // },

  // {
  //   path: '/admin',
  //   exact: true,
  //   permissions: ['admin'],
  //   redirect: '/access-denied',
  //   component: AdminScreen,
  //   alias: 'admin',
  //   name: '管理介面',
  //   icon: <ToolOutlined />,
  // },
];

export const unAuthorizedRoutes = [
  {
    path: "/",
    exact: true,
    redirect: "/dashboard",
  },
  {
    path: "/login",
    exact: true,
    component: Login,
  },
  {
    path: "/access-denied",
    exact: true,
    component: AccessDenied,
  },
];
