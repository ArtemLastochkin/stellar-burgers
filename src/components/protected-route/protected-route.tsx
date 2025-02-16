import React from 'react';
import { useAppSelector } from '../../services/store';
import {
  getStateIsLoading,
  getStateIsUserLogined
} from '../../services/userSlice';
import { Navigate } from 'react-router-dom';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  children: React.ReactElement;
  onlyAuthUser?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyAuthUser
}: ProtectedRouteProps) => {
  const isLoadingUser = useAppSelector(getStateIsLoading);
  const stateIsUserLogined = useAppSelector(getStateIsUserLogined);

  if (isLoadingUser) {
    return <Preloader />;
  }

  if (stateIsUserLogined && !onlyAuthUser) {
    return <Navigate replace to={'/'} />;
  }

  if (!stateIsUserLogined && onlyAuthUser) {
    return <Navigate replace to={'/'} />;
  }

  return children;
};
