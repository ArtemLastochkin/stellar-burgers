import React from 'react';
import { useAppSelector } from '../../services/store';
import {
  getStateIsLoading,
  getStateIsUserLogined
} from '../../services/userSlice';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  children: React.ReactElement;
  onlyAuthUser?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyAuthUser
}: ProtectedRouteProps) => {
  const location = useLocation();
  const isLoadingUser = useAppSelector(getStateIsLoading);
  const stateIsUserLogined = useAppSelector(getStateIsUserLogined);
  const from = location.state?.from || '/';

  if (isLoadingUser) {
    return <Preloader />;
  }

  if (stateIsUserLogined && !onlyAuthUser) {
    return <Navigate replace to={from} />;
  }

  if (!stateIsUserLogined && onlyAuthUser) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  return children;
};
