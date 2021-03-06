// @see https://github.com/AlanWei/react-acl-router
import {
  DashboardOutlined,
  MessageOutlined,
  VerifiedOutlined,
  TeamOutlined,
  ScheduleOutlined
} from "@ant-design/icons";

//** Authorized Pages */
import OrderScreen from "../pages/OrderScreen";
import OrderInfo from "../components/order/OrderInfo";
import MemberScreen from "../pages/MemberScreen";
import MemberInfo from "../components/member/MemberInfo";
import ValidData from "../pages/ValidData";
import OrderHistoryScreen from "../pages/OrderHistoryScreen";
import MemberChat from "../pages/member-chat/MemberChat";

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
    name: "即時訂單",
    icon: <DashboardOutlined />,
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
    name: "會員查詢",
    icon: <TeamOutlined />,
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
    path: "/order-history",
    exact: true,
    permissions: ["admin", "op"],
    redirect: "/access-denied",
    component: OrderHistoryScreen,
    alias: "order-history",
    name: "訂單紀錄查詢",
    icon: <ScheduleOutlined />,
    isMenu: true,
  },
  {
    path: "/member-chat",
    exact: true,
    permissions: ["admin", "op"],
    redirect: "/access-denied",
    component: MemberChat,
    alias: "member-chat",
    name: "會員對話",
    icon: <MessageOutlined />,
    isMenu: true,
  },

  {
    path: "/valid",
    exact: true,
    permissions: ["admin", "op"],
    redirect: "/access-denied",
    component: ValidData,
    alias: "valid",
    name: "驗證碼查詢",
    icon: <VerifiedOutlined />,
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
    redirect: "/order",
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
