import { getIngredientsApi } from '@api';
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  Selector
} from '@reduxjs/toolkit';
import { RootState } from './store';
import {
  TConstructorIngredient,
  TIngredient,
  TypeIngredient
} from '@utils-types';
// import { getCookie, setCookie } from '../utils/cookie';

export type TConstructorItems = {
  bun: {
    price: number;
    name: string;
    image: string;
    _id: string;
  };
  ingredients: TConstructorIngredient[];
};

export interface IburgerConstructorState {
  ingredients: TIngredient[];
  constructorItems: TConstructorItems;
  isLoading: boolean;
  errorMessage: string | null;
}

const initialState: IburgerConstructorState = {
  ingredients: [],
  constructorItems: {
    bun: {
      price: 0,
      name: '',
      image: '',
      _id: ''
    },
    ingredients: []
  },
  isLoading: false,
  errorMessage: ''
};

export const fetchIngredients = createAsyncThunk(
  'burgerSlice/fetchIngredients',
  async () => {
    const response = await getIngredientsApi();
    return response;
  }
);

export const createNewObjectConstructorItemsIngredients = (
  newIngredients: TConstructorIngredient[]
): { ingredients: TConstructorIngredient[] } => {
  const newInitialConstructorItemsIngredients: Pick<
    TConstructorItems,
    'ingredients'
  > = { ingredients: newIngredients };
  return newInitialConstructorItemsIngredients;
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerSlice',
  initialState,
  reducers: {
    setConstructorItemsBun: (
      state,
      action: PayloadAction<Pick<TConstructorItems, TypeIngredient.BUN>>
    ) => {
      state.constructorItems.bun = action.payload.bun!;
    },
    setConstructorItemsIngredients: (
      state,
      action: PayloadAction<Pick<TConstructorItems, 'ingredients'>>
    ) => {
      state.constructorItems.ingredients = action.payload.ingredients;
    }
  },
  selectors: {
    getIngredients: (state) => state.ingredients,
    getConstructorItems: (state) => state.constructorItems,
    getStateIsLoadingIngredients: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = null;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = 'Нет данных об ингридиетах';
      });
  }
});

export const {
  getIngredients,
  getConstructorItems,
  getStateIsLoadingIngredients
} = burgerConstructorSlice.selectors;

export const { setConstructorItemsBun, setConstructorItemsIngredients } =
  burgerConstructorSlice.actions;
export default burgerConstructorSlice.reducer;
