import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  fetchLoginUserApi,
  getStateErrorMessageRegister,
  getStateIsLoading,
  getStateIsUserLogined
} from '../../services/userSlice';
import { Navigate } from 'react-router-dom';
import { Preloader } from '@ui';

export const Login: FC = () => {
  const dispatch = useAppDispatch();
  const errorMessage = useAppSelector(getStateErrorMessageRegister);
  const stateIsUserLogined = useAppSelector(getStateIsUserLogined);
  const isLoading = useAppSelector(getStateIsLoading);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      fetchLoginUserApi({
        email: email,
        password: password
      })
    );
  };

  return isLoading ? (
    <Preloader />
  ) : stateIsUserLogined ? (
    <Navigate to={'/'} replace />
  ) : (
    <LoginUI
      errorText={errorMessage}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
