import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';
import { stat } from 'fs';

const initialState: TOrdersData & {
  isLoadingOrder: boolean;
  userOrders: TOrder[];
  orderModalData: TOrder | null;
  orderByNumer: TOrder | null;
} = {
  orders: [],
  orderByNumer: null,
  orderModalData: null,
  userOrders: [],
  total: 0,
  totalToday: 0,
  isLoadingOrder: false
};

export const fetchFeeds = createAsyncThunk('feedSlice/fetchFeeds', async () => {
  const response = await getFeedsApi();
  return response;
});

export const fetchOrderBurger = createAsyncThunk(
  'feedSlice/fetchOrderBurger',
  async (data: string[]) => {
    const response = await orderBurgerApi(data);
    return response;
  }
);

export const fetchOrders = createAsyncThunk(
  'feedSlice/fetchOrders',
  async () => {
    const response = await getOrdersApi();
    return response;
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'feedSlice/fetchOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response;
  }
);

export const feedSlice = createSlice({
  name: 'feedSlice',
  initialState,
  reducers: {
    resetOrderModalData: (state) => {
      state.orderModalData = null;
    },
    resetOrderisLoadingOrder: (state) => {
      state.isLoadingOrder = false;
    }
  },
  selectors: {
    getStateOrders: (state) => state.orders,
    getStateTotal: (state) => state.total,
    getStateTotalToday: (state) => state.totalToday,
    getStateUserOrders: (state) => state.userOrders,
    getStateisLoadingOrder: (state) => state.isLoadingOrder,
    getStateOrderModalData: (state) => state.orderModalData,
    getStateOrderByNumer: (state) => state.orderByNumer
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        // state.isLoadingOrder = true;
        // state.errorMessage = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        // state.isLoadingOrder = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        // state.isLoadingOrder = false;
      })
      //
      //
      .addCase(fetchOrderBurger.pending, (state) => {
        state.isLoadingOrder = true;
      })
      .addCase(fetchOrderBurger.fulfilled, (state, action) => {
        state.isLoadingOrder = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(fetchOrderBurger.rejected, (state, action) => {
        state.isLoadingOrder = false;
      })
      //
      //
      .addCase(fetchOrders.pending, (state) => {
        // state.isLoadingOrder = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        // state.isLoadingOrder = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        // state.isLoadingOrder = false;
      })
      //
      //
      .addCase(fetchOrderByNumber.pending, (state) => {
        // state.isLoadingOrder = true;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.orderByNumer = action.payload.orders[0];
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        // state.isLoadingOrder = false;
      });
  }
});

export const {
  getStateOrders,
  getStateTotal,
  getStateTotalToday,
  getStateUserOrders,
  getStateisLoadingOrder,
  getStateOrderModalData,
  getStateOrderByNumer
} = feedSlice.selectors;

// // export const getIngredients: (state: RootState) => state.
// // export const selectCount = (state: RootState) => state.burgerSlice.data;

export const { resetOrderModalData, resetOrderisLoadingOrder } =
  feedSlice.actions;
export default feedSlice.reducer;
