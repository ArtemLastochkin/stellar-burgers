import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { setCookie } from '../utils/cookie';

const initialState: TUser & {
  errorMessage: string;
  isUserLogined: boolean;
  isLoading: boolean;
} = {
  email: '',
  name: '',
  errorMessage: '',
  isUserLogined: false,
  isLoading: true
};

export const fetchRegisterUserApi = createAsyncThunk(
  'userSlice/fetchRegisterUserApi',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  }
);

export const fetchLoginUserApi = createAsyncThunk(
  'userSlice/fetchLoginUserApi',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    if (response.accessToken && response.refreshToken) {
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
    }
    return response;
  }
);

export const fetchCheckUserLogined = createAsyncThunk(
  'userSlice/fetchCheckUserLogined',
  async () => {
    const response = await getUserApi();
    return response;
  }
);

export const fetchUpdateUserApi = createAsyncThunk(
  'userSlice/fetchUpdateUserApi',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response;
  }
);

export const fetchlogoutApi = createAsyncThunk(
  'userSlice/fetchlogoutApi',
  async () => {
    const response = await logoutApi();
    if (response) {
      setCookie('accessToken', '');
      localStorage.removeItem('refreshToken');
    }
    return response;
  }
);

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {},
  selectors: {
    getStateErrorMessageRegister: (state) => state.errorMessage,
    getStateIsUserLogined: (state) => state.isUserLogined,
    getStateIsLoading: (state) => state.isLoading,
    getStateName: (state) => state.name,
    getStateEmail: (state) => state.email
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegisterUserApi.pending, (state) => {
        state.isLoading = true;
        state.isUserLogined = false;
      })
      .addCase(fetchRegisterUserApi.fulfilled, (state, action) => {
        state.errorMessage = '';
        state.isLoading = false;
        state.isUserLogined = action.payload.success;
        state.email = action.payload.user.email;
        state.name = action.payload.user.name;
      })
      .addCase(fetchRegisterUserApi.rejected, (state, action) => {
        state.errorMessage = String(action.error.message);
        state.isLoading = false;
        state.isUserLogined = false;
      })

      .addCase(fetchLoginUserApi.pending, (state) => {
        state.isLoading = true;
        state.isUserLogined = false;
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
        state.isUserLogined = false;
        state.isLoading = false;
      })

      .addCase(fetchCheckUserLogined.pending, (state) => {
        state.isLoading = true;
        state.isUserLogined = false;
      })
      .addCase(fetchCheckUserLogined.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isUserLogined = action.payload.success;
        state.email = action.payload.user.email;
        state.name = action.payload.user.name;
      })
      .addCase(fetchCheckUserLogined.rejected, (state) => {
        state.isLoading = false;
        state.isUserLogined = false;
      })

      .addCase(fetchUpdateUserApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUpdateUserApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.email = action.payload.user.email;
        state.name = action.payload.user.name;
      })
      .addCase(fetchUpdateUserApi.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(fetchlogoutApi.pending, (state) => {
        state.isLoading = true;
        state.isUserLogined = true;
      })
      .addCase(fetchlogoutApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isUserLogined = !action.payload.success;
        state.email = '';
        state.name = '';
      })
      .addCase(fetchlogoutApi.rejected, (state) => {
        state.isLoading = false;
        state.isUserLogined = true;
      });
  }
});

export const {
  getStateErrorMessageRegister,
  getStateIsUserLogined,
  getStateIsLoading,
  getStateName,
  getStateEmail
} = userSlice.selectors;

export default userSlice.reducer;
