import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = ({ children }: { children?: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  if (!token || user?.role !== 'admin') {
    return <Navigate to="/Dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
export default AdminRoute;