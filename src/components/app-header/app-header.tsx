import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useAppSelector } from '../../services/store';
import { getStateName } from '../../services/userSlice';

export const AppHeader: FC = () => {
  const userName = useAppSelector(getStateName);
  return <AppHeaderUI userName={userName} />;
};
