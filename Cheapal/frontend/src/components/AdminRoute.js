// client/src/components/AdminRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const AdminRoute = () => {
  const { user } = useAuth();

  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;