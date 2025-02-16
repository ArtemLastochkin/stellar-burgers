import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useAppDispatch } from '../../services/store';
import { fetchlogoutApi } from '../../services/userSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(fetchlogoutApi());
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
