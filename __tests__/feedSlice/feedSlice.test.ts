import {
  configureStore,
  EnhancedStore,
  StoreEnhancer,
  ThunkDispatch,
  Tuple,
  UnknownAction
} from '@reduxjs/toolkit';
import feedsMock from './feeds.json';
import feedSlice, {
  fetchFeeds,
  fetchOrderBurger,
  fetchOrderByNumber,
  fetchOrders,
  getStateIsLoadingFeeds,
  getStateisLoadingOrder,
  getStateOrderByNumer,
  getStateOrderModalData,
  getStateOrders,
  getStateTotal,
  getStateTotalToday,
  getStateUserOrders,
  resetOrderisLoadingOrder,
  resetOrderModalData
} from '../../src/services/feedSlice';
import { TOrder, TOrdersData } from '../../src/utils/types';

describe('[feedSlice]', () => {
  const { initialStateMock, notInitialStateMock } = feedsMock.feedsDataMock;

  const createMockStore = (
    state: TOrdersData & {
      isLoadingOrder: boolean;
      userOrders: TOrder[];
      orderModalData: TOrder | null;
      orderByNumer: TOrder | null;
      isLoadingFeeds: boolean;
    }
  ) =>
    configureStore({
      reducer: feedSlice,
      preloadedState: state
    });

  let store: EnhancedStore<
    any,
    UnknownAction,
    Tuple<
      [
        StoreEnhancer<{
          dispatch: ThunkDispatch<any, undefined, UnknownAction>;
        }>,
        StoreEnhancer
      ]
    >
  >;
  beforeEach(() => {
    store = createMockStore(initialStateMock);
  });

  // ******************************************* Тесты редьюсеров в feedSlice *******************************************

  describe('[reducers]', () => {
    test('resetOrderModalData', () => {
      store = createMockStore({
        ...initialStateMock,
        orderModalData: feedsMock.feedsDataMock.OrderMock
      });
      expect(store.getState().orderModalData).not.toBeNull();

      const resetOrderModalDataMock = jest.fn(() => resetOrderModalData());

      const newState = feedSlice(store.getState(), resetOrderModalDataMock());

      expect(resetOrderModalDataMock).toHaveBeenCalled();
      expect(resetOrderModalDataMock).toHaveBeenCalledTimes(1);
      expect(newState.orderModalData).toBeNull();
    });

    test('resetOrderisLoadingOrder', () => {
      store = createMockStore({
        ...initialStateMock,
        isLoadingOrder: true
      });
      expect(store.getState().isLoadingOrder).toBe(true);

      const resetOrderisLoadingOrderMock = jest.fn(() =>
        resetOrderisLoadingOrder()
      );

      const newState = feedSlice(
        store.getState(),
        resetOrderisLoadingOrderMock()
      );

      expect(resetOrderisLoadingOrderMock).toHaveBeenCalled();
      expect(resetOrderisLoadingOrderMock).toHaveBeenCalledTimes(1);
      expect(newState.isLoadingOrder).toBe(false);
    });
  });

  // ******************************************* Тесты Async-редьюсеров в feedSlice *******************************************

  describe('[reducersAsync]', () => {
    describe('[reducersAsync.fetchFeeds]', () => {
      test('fetchFeeds.pending', async () => {
        expect(store.getState().isLoadingFeeds).toBe(false);
        const fetch = jest.fn(
          async () =>
            await store.dispatch(fetchFeeds.pending('fetchFeeds.pending'))
        );

        fetch();

        const { isLoadingFeeds } = store.getState();

        expect(fetch).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(isLoadingFeeds).toBe(true);
      });

      test('fetchFeeds.fulfilled', async () => {
        store = createMockStore({
          ...initialStateMock,
          isLoadingFeeds: true
        });
        expect(store.getState().orders).not.toBe(
          feedsMock.feedsDataMock.feedsResponseMock.orders
        );
        expect(store.getState().total).not.toBe(
          feedsMock.feedsDataMock.feedsResponseMock.total
        );
        expect(store.getState().totalToday).not.toBe(
          feedsMock.feedsDataMock.feedsResponseMock.totalToday
        );
        expect(store.getState().isLoadingFeeds).toBe(true);

        const fetch = jest.fn(
          async () =>
            await store.dispatch(
              fetchFeeds.fulfilled(
                feedsMock.feedsDataMock.feedsResponseMock,
                'fetchFeeds.fulfilled'
              )
            )
        );

        fetch();

        const { isLoadingFeeds, orders, total, totalToday } = store.getState();

        expect(fetch).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(orders).toBe(feedsMock.feedsDataMock.feedsResponseMock.orders);
        expect(total).toBe(feedsMock.feedsDataMock.feedsResponseMock.total);
        expect(totalToday).toBe(
          feedsMock.feedsDataMock.feedsResponseMock.totalToday
        );
        expect(isLoadingFeeds).toBe(false);
      });

      test('fetchFeeds.rejected', async () => {
        store = createMockStore({
          ...initialStateMock,
          isLoadingFeeds: true
        });
        expect(store.getState().isLoadingFeeds).toBe(true);

        const fetch = jest.fn(
          async () =>
            await store.dispatch(
              fetchFeeds.rejected(new Error(), 'fetchFeeds.rejected')
            )
        );

        fetch();

        expect(fetch).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(store.getState().isLoadingFeeds).toBe(false);
      });
    });

    describe('[reducersAsync.fetchOrderBurger]', () => {
      test('fetchOrderBurger.pending', async () => {
        expect(store.getState().isLoadingOrder).toBe(false);
        const fetch = jest.fn(
          async () =>
            await store.dispatch(
              fetchOrderBurger.pending(
                'fetchOrderBurger.pending',
                feedsMock.feedsDataMock.arrOrdersMock
              )
            )
        );

        fetch();

        expect(fetch).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(store.getState().isLoadingOrder).toBe(true);
      });

      test('fetchOrderBurger.fulfilled', async () => {
        store = createMockStore({
          ...initialStateMock,
          isLoadingOrder: true
        });
        expect(store.getState().orderModalData).not.toEqual(
          feedsMock.feedsDataMock.newOrderResponseMock.order
        );
        expect(store.getState().isLoadingOrder).toBe(true);
        const fetch = jest.fn(
          async () =>
            await store.dispatch(
              fetchOrderBurger.fulfilled(
                feedsMock.feedsDataMock.newOrderResponseMock,
                'fetchOrderBurger.fulfilled',
                feedsMock.feedsDataMock.arrOrdersMock
              )
            )
        );

        fetch();
        const { isLoadingOrder, orderModalData } = store.getState();

        expect(fetch).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(orderModalData).toEqual(
          feedsMock.feedsDataMock.newOrderResponseMock.order
        );
        expect(isLoadingOrder).toBe(false);
      });

      test('fetchOrderBurger.rejected', async () => {
        store = createMockStore({
          ...initialStateMock,
          isLoadingOrder: true
        });
        expect(store.getState().isLoadingOrder).toBe(true);
        const fetch = jest.fn(
          async () =>
            await store.dispatch(
              fetchOrderBurger.rejected(
                new Error(),
                'fetchOrderBurger.rejected',
                feedsMock.feedsDataMock.arrOrdersMock
              )
            )
        );

        fetch();

        expect(fetch).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(store.getState().isLoadingOrder).toBe(false);
      });
    });

    describe('[reducersAsync.fetchOrders]', () => {
      test('fetchOrders.pending', async () => {
        expect(store.getState().isLoadingOrder).toBe(false);
        const fetch = jest.fn(
          async () =>
            await store.dispatch(fetchOrders.pending('fetchOrders.pending'))
        );

        fetch();

        expect(fetch).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(store.getState().isLoadingOrder).toBe(true);
      });

      test('fetchOrders.fulfilled', async () => {
        store = createMockStore({
          ...initialStateMock,
          isLoadingOrder: true
        });
        expect(store.getState().userOrders).not.toEqual(
          feedsMock.feedsDataMock.feedsResponseMock.orders
        );
        expect(store.getState().isLoadingOrder).toBe(true);

        const fetch = jest.fn(
          async () =>
            await store.dispatch(
              fetchOrders.fulfilled(
                feedsMock.feedsDataMock.feedsResponseMock.orders,
                'fetchOrders.fulfilled'
              )
            )
        );

        fetch();
        const { isLoadingOrder, userOrders } = store.getState();

        expect(fetch).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(userOrders).toEqual(
          feedsMock.feedsDataMock.feedsResponseMock.orders
        );
        expect(isLoadingOrder).toBe(false);
      });

      test('fetchOrders.rejected', async () => {
        store = createMockStore({
          ...initialStateMock,
          isLoadingOrder: true
        });
        expect(store.getState().isLoadingOrder).toBe(true);

        const fetch = jest.fn(
          async () =>
            await store.dispatch(
              fetchOrders.rejected(new Error(), 'fetchOrders.rejected')
            )
        );

        fetch();

        expect(fetch).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(store.getState().isLoadingOrder).toBe(false);
      });
    });

    describe('[reducersAsync.fetchOrderByNumber]', () => {
      test('fetchOrderByNumber.pending', async () => {
        expect(store.getState().orderByNumer).not.toBeNull;

        const fetch = jest.fn(
          async () =>
            await store.dispatch(
              fetchOrderByNumber.pending('fetchOrderByNumber.pending', 1)
            )
        );

        fetch();

        expect(fetch).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(store.getState().orderByNumer).toBeNull;
      });

      test('fetchOrderByNumber.fulfilled', async () => {
        expect(store.getState().orderByNumer).not.toEqual(
          feedsMock.feedsDataMock.feedsResponseMock.orders[0]
        );
        const fetch = jest.fn(
          async () =>
            await store.dispatch(
              fetchOrderByNumber.fulfilled(
                {
                  orders: feedsMock.feedsDataMock.feedsResponseMock.orders,
                  success: feedsMock.feedsDataMock.feedsResponseMock.success
                },
                'fetchOrderByNumber.fulfilled',
                1
              )
            )
        );

        fetch();

        expect(fetch).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(store.getState().orderByNumer).toEqual(
          feedsMock.feedsDataMock.feedsResponseMock.orders[0]
        );
      });

      test('fetchOrderByNumber.rejected', async () => {
        expect(store.getState().orderByNumer).not.toBeNull;

        const fetch = jest.fn(
          async () =>
            await store.dispatch(
              fetchOrderByNumber.rejected(
                new Error(),
                'fetchOrderByNumber.rejected',
                1
              )
            )
        );

        fetch();

        expect(fetch).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(store.getState().orderByNumer).toBeNull;
      });
    });
  });
  // ******************************************* Тесты селекторов в feedSlice *******************************************
  describe('[selectors]', () => {
    beforeEach(() => {
      store = createMockStore(notInitialStateMock);
    });

    const getStateOrdersMock = jest.fn(() =>
      getStateOrders({ feedSlice: store.getState() })
    );

    const getStateTotalMock = jest.fn(() =>
      getStateTotal({ feedSlice: store.getState() })
    );

    const getStateTotalTodayMock = jest.fn(() =>
      getStateTotalToday({ feedSlice: store.getState() })
    );

    const getStateUserOrdersMock = jest.fn(() =>
      getStateUserOrders({ feedSlice: store.getState() })
    );

    const getStateisLoadingOrderMock = jest.fn(() =>
      getStateisLoadingOrder({ feedSlice: store.getState() })
    );

    const getStateOrderModalDataMock = jest.fn(() =>
      getStateOrderModalData({ feedSlice: store.getState() })
    );

    const getStateOrderByNumerMock = jest.fn(() =>
      getStateOrderByNumer({ feedSlice: store.getState() })
    );

    const getStateIsLoadingFeedsMock = jest.fn(() =>
      getStateIsLoadingFeeds({ feedSlice: store.getState() })
    );

    test('getStateOrders', () => {
      expect(store.getState().orders).toEqual(notInitialStateMock.orders);
      getStateOrdersMock();
      expect(getStateOrdersMock).toHaveBeenCalled();
      expect(getStateOrdersMock).toHaveBeenCalledTimes(1);
      expect(getStateOrdersMock()).toEqual(notInitialStateMock.orders);
    });

    test('getStateTotal', () => {
      expect(store.getState().total).toEqual(notInitialStateMock.total);
      getStateTotalMock();
      expect(getStateTotalMock).toHaveBeenCalled();
      expect(getStateTotalMock).toHaveBeenCalledTimes(1);
      expect(getStateTotalMock()).toEqual(notInitialStateMock.total);
    });

    test('getStateTotalToday', () => {
      expect(store.getState().totalToday).toEqual(
        notInitialStateMock.totalToday
      );
      getStateTotalTodayMock();
      expect(getStateTotalTodayMock).toHaveBeenCalled();
      expect(getStateTotalTodayMock).toHaveBeenCalledTimes(1);
      expect(getStateTotalTodayMock()).toEqual(notInitialStateMock.totalToday);
    });

    test('getStateUserOrders', () => {
      expect(store.getState().userOrders).toEqual(
        notInitialStateMock.userOrders
      );
      getStateUserOrdersMock();
      expect(getStateUserOrdersMock).toHaveBeenCalled();
      expect(getStateUserOrdersMock).toHaveBeenCalledTimes(1);
      expect(getStateUserOrdersMock()).toEqual(notInitialStateMock.userOrders);
    });

    test('getStateisLoadingOrder', () => {
      expect(store.getState().isLoadingOrder).toEqual(
        notInitialStateMock.isLoadingOrder
      );
      getStateisLoadingOrderMock();
      expect(getStateisLoadingOrderMock).toHaveBeenCalled();
      expect(getStateisLoadingOrderMock).toHaveBeenCalledTimes(1);
      expect(getStateisLoadingOrderMock()).toEqual(
        notInitialStateMock.isLoadingOrder
      );
    });

    test('getStateOrderModalData', () => {
      expect(store.getState().orderModalData).toEqual(
        notInitialStateMock.orderModalData
      );
      getStateOrderModalDataMock();
      expect(getStateOrderModalDataMock).toHaveBeenCalled();
      expect(getStateOrderModalDataMock).toHaveBeenCalledTimes(1);
      expect(getStateOrderModalDataMock()).toEqual(
        notInitialStateMock.orderModalData
      );
    });

    test('getStateOrderByNumer', () => {
      expect(store.getState().orderByNumer).toEqual(
        notInitialStateMock.orderByNumer
      );
      getStateOrderByNumerMock();
      expect(getStateOrderByNumerMock).toHaveBeenCalled();
      expect(getStateOrderByNumerMock).toHaveBeenCalledTimes(1);
      expect(getStateOrderByNumerMock()).toEqual(
        notInitialStateMock.orderByNumer
      );
    });

    test('getStateIsLoadingFeeds', () => {
      expect(store.getState().isLoadingFeeds).toEqual(
        notInitialStateMock.isLoadingFeeds
      );
      getStateIsLoadingFeedsMock();
      expect(getStateIsLoadingFeedsMock).toHaveBeenCalled();
      expect(getStateIsLoadingFeedsMock).toHaveBeenCalledTimes(1);
      expect(getStateIsLoadingFeedsMock()).toEqual(
        notInitialStateMock.isLoadingFeeds
      );
    });
  });
});
