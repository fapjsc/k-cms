// @see https://github.com/AlanWei/react-acl-router
import { DollarOutlined, HomeOutlined, ToolOutlined } from '@ant-design/icons';

//** Authorized Pages */
import DashboardScreen from '../pages/DashboardScreen';

//** unAuthorized Pages */
import Login from '../pages/Login';
import AccessDenied from '../pages/AccessDenied';

export const authorizedRoutes = [
  {
    path: '/dashboard',
    exact: true,
    permissions: ['admin', 'op'],
    redirect: '/access-denied',
    component: DashboardScreen,
    alias: 'dashboard',
    name: 'Dashboard',
    icon: <HomeOutlined />,
  },
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
    path: '/',
    exact: true,
    redirect: '/login',
  },
  {
    path: '/login',
    exact: true,
    component: Login,
  },
  {
    path: '/access-denied',
    exact: true,
    component: AccessDenied,
  },
];
