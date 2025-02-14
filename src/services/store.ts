import { combineSlices, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  // useDispatch as dispatchHook,
  // useSelector as selectorHook
  useDispatch,
  useSelector
} from 'react-redux';
import { burgerConstructorSlice } from './burgerConstructorSlice';
import { feedSlice } from './feedSlice';
import { userSlice } from './userSlice';

const rootReducer = combineSlices(burgerConstructorSlice, feedSlice, userSlice); // Заменить на импорт настоящего редьюсера

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

// export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

// export const useDispatch: () => AppDispatch = () => dispatchHook();
// export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export default store;
