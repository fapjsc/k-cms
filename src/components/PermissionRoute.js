// @see https://github.com/AlanWei/react-acl-router
import AclRouter from "react-acl-router";

import { useSelector } from "react-redux";

import { unAuthorizedRoutes, authorizedRoutes } from "../config/routerRole";

import { _getUserRole } from "../lib/helper";

import AuthLayout from "../layout/AuthLayout";
import UnAuthLayout from "../layout/UnAuthLayout";

import NotFound from "../pages/NotFound";

const PermissionRoute = () => {
  const { loginInfo } = useSelector((state) => state.user);
  const { account } = loginInfo || {};
  let role;

  if (account) {
    role = account;
  } else {
    role = _getUserRole();
    // role = 'op';
  }

  return (
    <AclRouter
      authorities={role}
      authorizedRoutes={authorizedRoutes}
      authorizedLayout={AuthLayout}
      normalRoutes={unAuthorizedRoutes}
      normalLayout={UnAuthLayout}
      notFound={NotFound}
    />
  );
};

export default PermissionRoute;
