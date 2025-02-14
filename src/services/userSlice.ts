import {
  getFeedsApi,
  loginUserApi,
  registerUserApi,
  TLoginData,
  TRegisterData
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrdersData, TUser } from '@utils-types';

const initialState: TUser & {
  errorMessage: string;
  isUserLogined: boolean;
  isLoading: boolean;
} = {
  email: '',
  name: '',
  errorMessage: '',
  isUserLogined: false,
  isLoading: false
};

export const fetchRegisterUserApi = createAsyncThunk(
  'userSlice/fetchRegisterUserApi',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    return response;
  }
);

export const fetchLoginUserApi = createAsyncThunk(
  'userSlice/fetchLoginUserApi',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    return response;
  }
);

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    // setConstructorItemsBun: (state, action) => {}
  },
  selectors: {
    getStateErrorMessageRegister: (state) => state.errorMessage,
    getStateIsUserLogined: (state) => state.isUserLogined,
    getStateIsLoading: (state) => state.isLoading,
    getStateName: (state) => state.name

    // getStateTotal: (state) => state.total,
    // getStateTotalToday: (state) => state.totalToday
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegisterUserApi.pending, (state) => {})
      .addCase(fetchRegisterUserApi.fulfilled, (state, action) => {
        state.errorMessage = '';
      })
      .addCase(fetchRegisterUserApi.rejected, (state, action) => {
        state.errorMessage = String(action.error.message);
      })

      .addCase(fetchLoginUserApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLoginUserApi.fulfilled, (state, action) => {
        state.errorMessage = '';
        state.isUserLogined = action.payload.success;
        state.isLoading = false;
        state.email = action.payload.user.email;
        state.name = action.payload.user.name;
      })
      .addCase(fetchLoginUserApi.rejected, (state, action) => {
        state.errorMessage = String(action.error.message);
        state.isLoading = false;
      });
  }
});

export const {
  getStateErrorMessageRegister,
  getStateIsUserLogined,
  getStateIsLoading,
  getStateName
} = userSlice.selectors;

// export const { setConstructorItemsBun, setConstructorItemsIngredients } =
//   burgerConstructorSlice.actions;
export default userSlice.reducer;
