import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';

const initialState: TOrdersData = {
  orders: [],
  total: 0,
  totalToday: 0
};

export const fetchFeeds = createAsyncThunk('feedSlice/fetchFeeds', async () => {
  const response = await getFeedsApi();
  return response;
});

export const feedSlice = createSlice({
  name: 'feedSlice',
  initialState,
  reducers: {
    // setConstructorItemsBun: (state, action) => {}
  },
  selectors: {
    getStateOrders: (state) => state.orders,
    getStateTotal: (state) => state.total,
    getStateTotalToday: (state) => state.totalToday
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        // state.isLoading = true; // Установите состояние загрузки
        // state.errorMessage = null; // Сбросьте ошибку
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        // state.isLoading = false; // Сбросьте состояние загрузки
        state.orders = action.payload.orders;
        // console.log(state.orders);
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        // state.isLoading = false; // Сбросьте состояние загрузки
        // state.errorMessage = 'Нет данных о заказах'; // Установите сообщение об ошибке
      });
  }
});

export const { getStateOrders, getStateTotal, getStateTotalToday } =
  feedSlice.selectors;

// // export const getIngredients: (state: RootState) => state.
// // export const selectCount = (state: RootState) => state.burgerSlice.data;

// export const { setConstructorItemsBun, setConstructorItemsIngredients } =
//   burgerConstructorSlice.actions;
export default feedSlice.reducer;
