

import AuthRoute from '../AuthRoute/AuthRoute';

function AdminRoute({ children }) {

}

const AdminRouteExport = ({ children }) => (
  <AuthRoute>
    <AdminRoute>{children}</AdminRoute>
  </AuthRoute>
);

export default AdminRouteExport;
