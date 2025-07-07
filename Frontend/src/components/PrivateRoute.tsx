import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

interface Props {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return accessToken ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
