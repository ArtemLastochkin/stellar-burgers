import {
  getFeedsApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrdersData, TUser } from '@utils-types';
import { getCookie, setCookie } from '../utils/cookie';

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
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(fetchRegisterUserApi.rejected, (state, action) => {
        state.errorMessage = String(action.error.message);
        state.isLoading = false;
        state.isUserLogined = false;
      })

      //
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
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(fetchLoginUserApi.rejected, (state, action) => {
        state.errorMessage = String(action.error.message);
        state.isUserLogined = false;
        state.isLoading = false;
      })
      //
      //
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
      //
      //
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
      //
      //
      .addCase(fetchlogoutApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchlogoutApi.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log(action.payload);
      })
      .addCase(fetchlogoutApi.rejected, (state) => {
        state.isLoading = false;
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

// export const { setConstructorItemsBun, setConstructorItemsIngredients } =
//   burgerConstructorSlice.actions;
export default userSlice.reducer;
