import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  fetchlogoutApi,
  getStateIsUserLogined
} from '../../services/userSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userLogined = useAppSelector(getStateIsUserLogined);

  const handleLogout = () => {
    dispatch(fetchlogoutApi());

    if (userLogined) {
      return navigate('/');
    }
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
