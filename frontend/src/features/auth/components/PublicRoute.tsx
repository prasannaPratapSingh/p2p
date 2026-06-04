import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import GlobalLoader from '../../shared/components/GlobalLoader';

const PublicRoute = ({ children }: React.PropsWithChildren) => {
  const user = useSelector((state: any) => state.auth.user);
  const loading = useSelector((state: any) => state.auth.loading);

  if (loading) {
    return <GlobalLoader fullScreen />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
