import React from 'react';
import { useAppSelector } from '../../services/store';
import {
  getStateEmail,
  getStateIsUserLogined,
  getStateName
} from '../../services/userSlice';
import { Navigate, useNavigate } from 'react-router-dom';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  children: React.ReactElement;
  changeProfile?: boolean;
};

export const ProtectedRoute = ({
  children,
  changeProfile
}: ProtectedRouteProps) => {
  const stateIsUserLogined = useAppSelector(getStateIsUserLogined);

  const navigate = useNavigate();
  // const stateName = useAppSelector(getStateName);
  // const stateEmail = useAppSelector(getStateEmail);

  // if (isLoadingUser) {
  //   return <Preloader/>
  // }
  if (changeProfile && stateIsUserLogined) {
    return children;
  }

  if (stateIsUserLogined) {
    return <Navigate to={'/'} />;
  } else {
    return children;
  }

  // if (stateName || stateEmail) {
  //   return <Navigate replace to='/' />;
  // }

  return <Preloader />;
};
