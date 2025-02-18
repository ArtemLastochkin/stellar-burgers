import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  fetchFeeds,
  getStateIsLoadingFeeds,
  getStateOrders
} from '../../services/feedSlice';
import { useAppDispatch, useAppSelector } from '../../services/store';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useAppDispatch();
  const orders: TOrder[] = useAppSelector(getStateOrders);
  const isLoadingFeeds = useAppSelector(getStateIsLoadingFeeds);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, []);

  if (isLoadingFeeds) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(fetchFeeds());
      }}
    />
  );
};
