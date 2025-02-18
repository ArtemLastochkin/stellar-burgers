import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { fetchOrders, getStateUserOrders } from '../../services/feedSlice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useAppSelector(getStateUserOrders);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchOrders());
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};
